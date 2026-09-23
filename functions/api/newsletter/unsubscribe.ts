import { json, rateLimit } from '../../../lib/engagement/http';
import { PATHS } from '../../../lib/newsletter/config';

const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
 const { origin, searchParams } = new URL(request.url);
 const redirect = (path: string) => new Response(null,{status:303,headers:{'Location':`${origin}${path}`,'Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});
 try {
  if (!env.DB || !env.COOKIE_SECRET) return json({error:'unavailable'},503);
  // GETはメール内のリンク、POSTはメールソフトのワンクリック配信停止（RFC 8058）。どちらもトークンで本人確認する。
  if (!['GET','POST'].includes(request.method)) return json({error:'method_not_allowed'},405,{'Allow':'GET, POST'});
  const token = searchParams.get('token') || '';
  if (!UUID.test(token)) return request.method === 'POST' ? json({error:'invalid_token'},400) : redirect(PATHS.expired);
  if (!await rateLimit(env.DB,env.COOKIE_SECRET,request,'newsletter-stop',30)) return json({error:'too_many_requests'},429,{'Retry-After':'60'});
  const row = await env.DB.prepare(`UPDATE subscribers SET status='unsubscribed',
   unsubscribed_at=COALESCE(unsubscribed_at,strftime('%Y-%m-%dT%H:%M:%SZ','now')),confirm_token=NULL,confirm_expires_at=NULL
   WHERE unsubscribe_token=? RETURNING email`).bind(token).first<{email:string}>();
  if (request.method === 'POST') return json({ok:Boolean(row)},row ? 200 : 404);
  return redirect(row ? PATHS.unsubscribed : PATHS.expired);
 } catch {
  console.error(JSON.stringify({event:'newsletter_unsubscribe_error'}));
  return request.method === 'POST' ? json({error:'unavailable'},503) : redirect(PATHS.expired);
 }
};
