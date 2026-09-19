import {cookie,hmac,verifyHmac,json,smallJSON,sameOrigin,rateLimit} from '../../lib/engagement/http';
import {report} from '../../lib/engagement/reports';
const NAME='__Host-ysk-admin';
async function authorized(request: Request,secret: string) {
 const [expires,signature]=cookie(request,NAME).split('.');
 return Boolean(expires && /^\d+$/.test(expires) && Number(expires)>Date.now() && Number(expires)<Date.now()+9*3600000 && signature && await verifyHmac(secret,`admin:${expires}`,signature));
}
export const onRequest: PagesFunction<Env> = async ({request,env}) => {
 try {
  if (!env.ADMIN_TOKEN || !env.COOKIE_SECRET) return json({error:'unavailable'},503);
  if (!['GET','POST','DELETE'].includes(request.method)) return json({error:'method_not_allowed'},405);
  if (request.method!=='GET' && !sameOrigin(request)) return json({error:'forbidden'},403);
  if (request.method==='DELETE') return json({ok:true},200,{'Set-Cookie':`${NAME}=; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=0`});
  if (request.method==='POST') {
   if (!await rateLimit(env.DB,env.COOKIE_SECRET,request,'admin',5)) return json({error:'too_many_requests'},429);
   const body=await smallJSON(request);
   if (body.action==='sync') {
    if (!await authorized(request,env.COOKIE_SECRET)) return json({error:'unauthorized'},401);
    const res=await env.ANALYTICS_SYNC.fetch('https://internal/sync',{method:'POST'});
    return json(await res.json(),res.status);
   }
   if (typeof body.token!=='string' || body.token.length>256 || !await verifyHmac(env.ADMIN_TOKEN,'login',await hmac(body.token,'login'))) return json({error:'unauthorized'},401);
   const expires=String(Date.now()+8*3600000);
   return json({ok:true},200,{'Set-Cookie':`${NAME}=${expires}.${await hmac(env.COOKIE_SECRET,`admin:${expires}`)}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=28800`});
  }
  if (!await authorized(request,env.COOKIE_SECRET)) return json({error:'unauthorized'},401);
  const data=await report(env.DB);
  const trend=await env.DB.prepare("SELECT date,SUM(views) AS views,SUM(qualified_reads) AS qualifiedReads,SUM(share_clicks+link_copies+native_shares) AS shareActions FROM ga_daily WHERE date>=date('now','+9 hours','-30 days') GROUP BY date ORDER BY date").all();
  return json({...data,trend:trend.results});
 } catch(error) {
  if (error instanceof SyntaxError || (error instanceof Error && error.message==='invalid_body')) return json({error:'invalid_body'},400);
  console.error(JSON.stringify({event:'admin_error'})); return json({error:'unavailable'},503);
 }
};
