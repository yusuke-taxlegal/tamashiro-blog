import { json, rateLimit } from '../../../lib/engagement/http';
import { PATHS } from '../../../lib/newsletter/config';

const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const seeOther = (origin: string, path: string) => new Response(null,{status:303,headers:{'Location':`${origin}${path}`,'Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
 const { origin, searchParams } = new URL(request.url);
 try {
  if (!env.DB || !env.COOKIE_SECRET) return json({error:'unavailable'},503);
  if (request.method !== 'GET') return json({error:'method_not_allowed'},405,{'Allow':'GET'});
  const token = searchParams.get('token') || '';
  if (!UUID.test(token)) return seeOther(origin,PATHS.expired);
  if (!await rateLimit(env.DB,env.COOKIE_SECRET,request,'newsletter-confirm',30)) return json({error:'too_many_requests'},429,{'Retry-After':'60'});
  const row = await env.DB.prepare(`UPDATE subscribers SET status='active',confirmed_at=strftime('%Y-%m-%dT%H:%M:%SZ','now'),
   confirm_token=NULL,confirm_expires_at=NULL,unsubscribe_token=COALESCE(unsubscribe_token,?)
   WHERE confirm_token=? AND confirm_expires_at>? RETURNING email`).bind(crypto.randomUUID(),token,Date.now()).first<{email:string}>();
  return seeOther(origin,row ? PATHS.confirmed : PATHS.expired);
 } catch {
  console.error(JSON.stringify({event:'newsletter_confirm_error'})); return seeOther(origin,PATHS.expired);
 }
};
