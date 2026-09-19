import articles from '../../lib/engagement/articles.json';
type GARow={dimensionValues:{value:string}[];metricValues:{value:string}[]};
type GAReport={rows?:GARow[];rowCount?:number;metadata?:{timeZone?:string;subjectToThresholding?:boolean;dataLossFromOtherRow?:boolean}};
function base64url(input: Uint8Array | string) {
 return btoa(typeof input==='string'?input:String.fromCharCode(...input)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
}
async function accessToken(raw: string) {
 const account=JSON.parse(raw) as {client_email:string;private_key:string;token_uri?:string};
 if (!account.client_email?.endsWith('.iam.gserviceaccount.com') || !account.private_key?.includes('PRIVATE KEY')) throw new Error('invalid_service_account');
 const now=Math.floor(Date.now()/1000);
 const unsigned=base64url(JSON.stringify({alg:'RS256',typ:'JWT'}))+'.'+base64url(JSON.stringify({iss:account.client_email,scope:'https://www.googleapis.com/auth/analytics.readonly',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600}));
 const der=Uint8Array.from(atob(account.private_key.replace(/-----[^-]+-----/g,'').replace(/\s/g,'')),c=>c.charCodeAt(0));
 const key=await crypto.subtle.importKey('pkcs8',der,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['sign']);
 const signature=await crypto.subtle.sign('RSASSA-PKCS1-v1_5',key,new TextEncoder().encode(unsigned));
 const response=await fetch('https://oauth2.googleapis.com/token',{method:'POST',body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:unsigned+'.'+base64url(new Uint8Array(signature))}),signal:AbortSignal.timeout(15000)});
 if(!response.ok) throw new Error(`token_http_${response.status}`);
 const data=await response.json<{access_token:string}>(); if(!data.access_token) throw new Error('missing_access_token'); return data.access_token;
}
async function fetchReport(token:string,property:string,events:boolean):Promise<GAReport> {
 const body={dateRanges:[{startDate:'30daysAgo',endDate:'yesterday'}],
 dimensions:[{name:'date'},{name:'pagePath'},...(events?[{name:'eventName'}]:[])],
 metrics:[{name:events?'eventCount':'screenPageViews'}],
 dimensionFilter:{andGroup:{expressions:[{filter:{fieldName:'hostName',inListFilter:{values:['ysk.life','www.ysk.life']}}},{filter:{fieldName:'pagePath',stringFilter:{matchType:'BEGINS_WITH',value:'/blog/'}}},...(events?[{filter:{fieldName:'eventName',inListFilter:{values:['article_qualified_read','article_share_click','article_link_copy','article_native_share','article_helpful','article_try']}}}]:[])]}},limit:100000};
 const res=await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${property}:runReport`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(25000)});
 if(!res.ok) throw new Error(`ga4_http_${res.status}`);
 const data=await res.json<GAReport>();
 if ((data.rowCount||0)>(data.rows?.length||0) || data.metadata?.subjectToThresholding || data.metadata?.dataLossFromOtherRow) throw new Error('incomplete_ga4_report');
 if(data.metadata?.timeZone!=='Asia/Tokyo') throw new Error('ga4_timezone_must_be_Asia_Tokyo');
 return data;
}
export function normalizeArticle(path:string) {
 const match=path.match(/^\/blog\/([^/?#]+)\/?$/);return match && articles.includes(match[1]) ? match[1] : null;
}
export function aggregate(views:GAReport,events:GAReport) {
 const rows=new Map<string,{date:string;article:string;values:number[]}>();
 const eventIndex:Record<string,number>={article_qualified_read:1,article_share_click:2,article_link_copy:3,article_native_share:4,article_helpful:5,article_try:6};
 for (const [report,isEvents] of [[views,false],[events,true]] as const) for(const row of report.rows||[]) {
  const date=row.dimensionValues[0]?.value, article=normalizeArticle(row.dimensionValues[1]?.value || '');
  if(!article || !/^\d{8}$/.test(date||'')) continue;
  const index=isEvents?eventIndex[row.dimensionValues[2]?.value]:0;
  if(index===undefined) continue;
  const count=Number(row.metricValues[0]?.value); if(!Number.isSafeInteger(count)||count<0) throw new Error('invalid_metric');
  const key=date+article;const entry=rows.get(key)||{date:`${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6,8)}`,article,values:[0,0,0,0,0,0,0]};
  entry.values[index]+=count;rows.set(key,entry);
 }
 return [...rows.values()];
}
export async function sync(env:SyncEnv) {
 if(!env.GA4_SERVICE_ACCOUNT_JSON) {
  await env.DB.prepare("INSERT INTO sync_state(key,value) VALUES('status','awaiting_ga4_connection') ON CONFLICT(key) DO UPDATE SET value=excluded.value").run();
  return {ok:false,status:'awaiting_ga4_connection'};
 }
 try {
  const token=await accessToken(env.GA4_SERVICE_ACCOUNT_JSON);
  const [views,events]=await Promise.all([fetchReport(token,env.GA4_PROPERTY_ID,false),fetchReport(token,env.GA4_PROPERTY_ID,true)]);
  const rows=aggregate(views,events);
  const payload=JSON.stringify(rows.map(r=>[r.date,r.article,...r.values]));
  if(new TextEncoder().encode(payload).byteLength>1900000) throw new Error('ga4_snapshot_too_large');
  // json_each uses one bound value and one insert regardless of article count.
  const insert=env.DB.prepare("INSERT INTO ga_daily(date,article,views,qualified_reads,share_clicks,link_copies,native_shares,helpful_events,try_events) SELECT json_extract(value,'$[0]'),json_extract(value,'$[1]'),json_extract(value,'$[2]'),json_extract(value,'$[3]'),json_extract(value,'$[4]'),json_extract(value,'$[5]'),json_extract(value,'$[6]'),json_extract(value,'$[7]'),json_extract(value,'$[8]') FROM json_each(?)").bind(payload);
  // One atomic batch: failed imports never replace the last good snapshot.
  await env.DB.batch([
   env.DB.prepare("DELETE FROM ga_daily WHERE date>=date('now','+9 hours','-30 days') OR date<date('now','+9 hours','-365 days')"),
   insert,
   env.DB.prepare("INSERT INTO sync_state(key,value) VALUES('last_success',?),('status','ok') ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(new Date().toISOString()),
   env.DB.prepare('DELETE FROM rate_limits WHERE expires_at < ?').bind(Math.floor(Date.now()/1000)),
  ]);
  console.log(JSON.stringify({event:'ga4_sync',rows:rows.length})); return {ok:true,rows:rows.length};
 } catch(error) {
  const reason=error instanceof Error?error.message:'sync_failed';
  await env.DB.prepare("INSERT INTO sync_state(key,value) VALUES('status',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(reason).run();
  console.error(JSON.stringify({event:'ga4_sync_failed',reason})); return {ok:false,status:reason};
 }
}
export default {
 async scheduled(_controller,env,ctx) {
  ctx.waitUntil((async()=>{await env.DB.prepare('DELETE FROM rate_limits WHERE expires_at < ?').bind(Math.floor(Date.now()/1000)).run();await sync(env);})());
 },
 async fetch(request,env) {
  if(request.method!=='POST'||new URL(request.url).pathname!=='/sync') return new Response('Not found',{status:404});
  const result=await sync(env);return Response.json(result,{status:result.ok?200:503});
 },
} satisfies ExportedHandler<SyncEnv>;
