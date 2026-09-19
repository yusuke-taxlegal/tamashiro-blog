import articles from '../../lib/engagement/articles.json';
import { cookie, hmac, verifyHmac, json, smallJSON, sameOrigin, rateLimit } from '../../lib/engagement/http';
const COOKIE = '__Host-ysk-reaction';
async function visitor(request: Request, secret: string) {
 const [id, signature] = cookie(request,COOKIE).split('.');
 if (id && /^[a-f0-9-]{36}$/.test(id) && signature && await verifyHmac(secret,id,signature)) return id;
 return null;
}
async function counts(db: D1Database, article: string, hash: string | null) {
 const result = await db.prepare('SELECT kind,COUNT(*) AS count,MAX(CASE WHEN visitor_hash=? THEN 1 ELSE 0 END) AS reacted FROM reactions WHERE article=? GROUP BY kind').bind(hash || '',article).all<{kind:'helpful'|'try';count:number;reacted:number}>();
 const payload = {counts:{helpful:0,try:0},reacted:{helpful:false,try:false}};
 for (const row of result.results) { payload.counts[row.kind]=row.count; payload.reacted[row.kind]=Boolean(row.reacted); }
 return payload;
}
export const onRequest: PagesFunction<Env> = async ({request,env}) => {
 try {
  if (!env.DB || !env.COOKIE_SECRET) return json({error:'unavailable'},503);
  if (!['GET','POST'].includes(request.method)) return json({error:'method_not_allowed'},405,{'Allow':'GET, POST'});
  if (request.method === 'POST' && !sameOrigin(request)) return json({error:'forbidden'},403);
  const body = request.method === 'POST' ? await smallJSON(request) : null;
  const article = body ? body.article : new URL(request.url).searchParams.get('article');
  if (typeof article !== 'string' || !articles.includes(article)) return json({error:'unknown_article'},404);
  let id = await visitor(request,env.COOKIE_SECRET);
  if (request.method === 'GET') return json(await counts(env.DB,article,id ? await hmac(env.COOKIE_SECRET,`visitor:${id}`) : null));
  const kind = body?.kind;
  if (kind !== 'helpful' && kind !== 'try') return json({error:'invalid_kind'},400);
  if (!await rateLimit(env.DB,env.COOKIE_SECRET,request,'reaction',12)) return json({error:'too_many_requests'},429,{'Retry-After':'60'});
  let setCookie: Record<string,string> = {};
  if (!id) {
   id=crypto.randomUUID();
   setCookie={'Set-Cookie':`${COOKIE}=${id}.${await hmac(env.COOKIE_SECRET,id)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=31536000`};
  }
  const hash = await hmac(env.COOKIE_SECRET,`visitor:${id}`);
  const inserted = await env.DB.prepare('INSERT OR IGNORE INTO reactions(article,kind,visitor_hash) VALUES(?,?,?)').bind(article,kind,hash).run();
  return json({...await counts(env.DB,article,hash),created:inserted.meta.changes === 1},200,setCookie);
 } catch (error) {
  if (error instanceof SyntaxError || (error instanceof Error && error.message==='invalid_body')) return json({error:'invalid_body'},400);
  console.error(JSON.stringify({event:'engagement_error'})); return json({error:'unavailable'},503);
 }
};
