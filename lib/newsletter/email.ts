import { NEWSLETTER, PATHS } from './config';

export type Mail = { to: string; subject: string; html: string; text: string; headers?: Record<string, string> };
export type Article = { title: string; description: string; url: string; category?: string };

export function escapeHtml(value: string) {
 return value.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
}

// 法定表示（送信者の氏名・住所・受信拒否の方法）。広告を含む配信では必ず本文末尾に置く。
function legalText(unsubscribeUrl?: string) {
 const lines = [`送信者：${NEWSLETTER.sender}`,`住所：${NEWSLETTER.address}`,`連絡先：${NEWSLETTER.replyTo}`];
 if (unsubscribeUrl) lines.push(`配信停止：${unsubscribeUrl}`,'このメールへの返信でも停止を受け付けます。');
 lines.push(`情報の取り扱い：${NEWSLETTER.site}/privacy/#newsletter`);
 return lines.join('\n');
}

function legalHtml(unsubscribeUrl?: string) {
 return legalText(unsubscribeUrl).split('\n')
  .map((line) => escapeHtml(line).replace(/(https?:\/\/[^\s]+)/, (url) => `<a href="${url}" style="color:#62655b">${url}</a>`))
  .join('<br />');
}

function shell(body: string, unsubscribeUrl?: string) {
 return `<!doctype html><html lang="ja"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:24px 12px;background:#f4f0e7;color:#171915;font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif;font-size:15px;line-height:1.8">
<div style="max-width:560px;margin:0 auto;padding:28px 24px;background:#fffdf8;border:1px solid rgba(23,25,21,0.16);border-radius:14px">
${body}
</div>
<div style="max-width:560px;margin:16px auto 0;padding:0 8px;color:#62655b;font-size:11px;line-height:1.9">${legalHtml(unsubscribeUrl)}</div>
</body></html>`;
}

export function confirmMail(to: string, confirmUrl: string): Mail {
 const text = [
  `${NEWSLETTER.title}への登録を受け付けました。`,
  '',
  `まだ登録は完了していません。下のリンクを開くと完了します（${NEWSLETTER.confirmHours}時間有効）。`,
  confirmUrl,
  '',
  `届くのは「${NEWSLETTER.promise}」です。記事の紹介には広告・アフィリエイトリンクを含みます。`,
  'いつでも配信停止できます。心当たりがない場合は、このメールを削除してください。登録は完了しません。',
  '',
  legalText(),
 ].join('\n');
 const html = shell(`<p style="margin:0 0 18px;font-size:17px;font-weight:700">登録を完了してください</p>
<p style="margin:0 0 20px">${escapeHtml(NEWSLETTER.title)}への登録を受け付けました。まだ完了していません。下のボタンを押すと完了します（${NEWSLETTER.confirmHours}時間有効）。</p>
<p style="margin:0 0 22px"><a href="${escapeHtml(confirmUrl)}" style="display:inline-block;padding:13px 22px;background:#171915;color:#fffdf8;border-radius:999px;text-decoration:none;font-weight:700">登録を完了する</a></p>
<p style="margin:0 0 8px;color:#62655b;font-size:13px">ボタンが押せない場合は、次のURLをブラウザに貼ってください。<br /><a href="${escapeHtml(confirmUrl)}" style="color:#62655b;word-break:break-all">${escapeHtml(confirmUrl)}</a></p>
<hr style="margin:22px 0;border:0;border-top:1px solid rgba(23,25,21,0.16)" />
<p style="margin:0 0 6px;font-size:13px">届くのは「${escapeHtml(NEWSLETTER.promise)}」です。記事の紹介には広告・アフィリエイトリンクを含みます。</p>
<p style="margin:0;color:#62655b;font-size:13px">心当たりがない場合は、このメールを削除してください。登録は完了しません。</p>`);
 return { to, subject: `【ysk.life】メール登録の確認（${NEWSLETTER.confirmHours}時間以内にお手続きください）`, html, text };
}

export function articleMail(to: string, article: Article, unsubscribeUrl: string, note?: string): Mail {
 const text = [
  `${article.title}`,
  '',
  article.description,
  '',
  `続きはこちら：${article.url}`,
  ...(note ? ['', note] : []),
  '',
  `——`,
  `${NEWSLETTER.title}（${NEWSLETTER.promise}）`,
  '記事には広告・アフィリエイトリンクを含みます。',
  '',
  legalText(unsubscribeUrl),
 ].join('\n');
 const html = shell(`<p style="margin:0 0 6px;color:#62655b;font-size:12px;letter-spacing:0.08em">${escapeHtml(article.category || NEWSLETTER.title)}</p>
<p style="margin:0 0 16px;font-size:19px;font-weight:700;line-height:1.55">${escapeHtml(article.title)}</p>
<p style="margin:0 0 22px">${escapeHtml(article.description)}</p>
${note ? `<p style="margin:0 0 22px">${escapeHtml(note)}</p>` : ''}
<p style="margin:0 0 22px"><a href="${escapeHtml(article.url)}" style="display:inline-block;padding:13px 22px;background:#171915;color:#fffdf8;border-radius:999px;text-decoration:none;font-weight:700">記事を読む</a></p>
<hr style="margin:22px 0;border:0;border-top:1px solid rgba(23,25,21,0.16)" />
<p style="margin:0;color:#62655b;font-size:12px">${escapeHtml(NEWSLETTER.title)}（${escapeHtml(NEWSLETTER.promise)}）。記事には広告・アフィリエイトリンクを含みます。</p>`, unsubscribeUrl);
 return {
  to, subject: `【ysk.life】${article.title}`, html, text,
  headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
 };
}

export function unsubscribeUrl(token: string, site = NEWSLETTER.site) {
 return `${site}${PATHS.unsubscribeApi}?token=${token}`;
}

async function post(apiKey: string, path: string, payload: unknown) {
 const response = await fetch(`https://api.resend.com${path}`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
 });
 if (!response.ok) throw new Error(`resend_${response.status}`);
 return response.json() as Promise<Record<string, unknown>>;
}

function payload(mail: Mail) {
 return { from: NEWSLETTER.from, to: [mail.to], reply_to: NEWSLETTER.replyTo, subject: mail.subject, html: mail.html, text: mail.text, ...(mail.headers ? { headers: mail.headers } : {}) };
}

export function sendMail(apiKey: string, mail: Mail) {
 return post(apiKey, '/emails', payload(mail));
}

// Resendの一括送信は1回100件まで。呼び出し側で分割する。
export function sendBatch(apiKey: string, mails: Mail[]) {
 return post(apiKey, '/emails/batch', mails.map(payload));
}
