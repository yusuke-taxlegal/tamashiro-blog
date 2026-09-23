import { json, smallJSON, sameOrigin, rateLimit, hmac } from '../../../lib/engagement/http';
import { NEWSLETTER, PATHS } from '../../../lib/newsletter/config';
import { confirmMail, sendMail } from '../../../lib/newsletter/email';

const EMAIL = /^[^\s@,;:<>"'()[\]\\]{1,64}@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
 try {
  if (!env.DB || !env.COOKIE_SECRET || !env.RESEND_API_KEY) return json({error:'unavailable'},503);
  if (request.method !== 'POST') return json({error:'method_not_allowed'},405,{'Allow':'POST'});
  if (!sameOrigin(request)) return json({error:'forbidden'},403);
  const body = await smallJSON(request);
  // 自動登録対策の隠しフィールド。埋まっていたら受け付けたふりをして何もしない。
  if (typeof body.company === 'string' && body.company.length > 0) return json({ok:true});
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (email.length > 254 || !EMAIL.test(email)) return json({error:'invalid_email'},400);
  if (!await rateLimit(env.DB,env.COOKIE_SECRET,request,'subscribe',5)) return json({error:'too_many_requests'},429,{'Retry-After':'60'});
  // 登録済みの人には確認メールを送らない。応答は登録状態を明かさないため常に同じ。
  const current = await env.DB.prepare('SELECT status FROM subscribers WHERE email=?').bind(email).first<{status:string}>();
  if (current?.status === 'active') return json({ok:true});
  const token = crypto.randomUUID();
  const expires = Date.now() + NEWSLETTER.confirmHours * 3600000;
  const source = typeof body.source === 'string' ? body.source.slice(0,120) : '';
  const ipHash = await hmac(env.COOKIE_SECRET,`subscriber:${request.headers.get('CF-Connecting-IP') || 'local'}`);
  await env.DB.prepare(`INSERT INTO subscribers(email,status,confirm_token,confirm_expires_at,source,consent_ip_hash) VALUES(?,'pending',?,?,?,?)
   ON CONFLICT(email) DO UPDATE SET status='pending',confirm_token=excluded.confirm_token,confirm_expires_at=excluded.confirm_expires_at,
   source=excluded.source,consent_ip_hash=excluded.consent_ip_hash,requested_at=strftime('%Y-%m-%dT%H:%M:%SZ','now'),unsubscribed_at=NULL`)
   .bind(email,token,expires,source,ipHash).run();
  const origin = new URL(request.url).origin;
  await sendMail(env.RESEND_API_KEY,confirmMail(email,`${origin}${PATHS.confirmApi}?token=${token}`));
  return json({ok:true});
 } catch (error) {
  if (error instanceof SyntaxError || (error instanceof Error && error.message === 'invalid_body')) return json({error:'invalid_body'},400);
  if (error instanceof Error && error.message.startsWith('resend_')) { console.error(JSON.stringify({event:'newsletter_mail_error',reason:error.message})); return json({error:'mail_failed'},502); }
  console.error(JSON.stringify({event:'newsletter_subscribe_error'})); return json({error:'unavailable'},503);
 }
};
