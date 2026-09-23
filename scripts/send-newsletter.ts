// 記事1本を購読者へ配信する。既定は下書き確認のみで、送信には --yes が必要。
//   npm run newsletter -- <記事のslug>                 内容と宛先数を確認する（送信しない）
//   npm run newsletter -- <記事のslug> --test me@x.com  自分だけに試し送りする
//   npm run newsletter -- <記事のslug> --yes            購読者全員へ送る
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { NEWSLETTER } from '../lib/newsletter/config';
import { articleMail, sendBatch, sendMail, unsubscribeUrl, type Mail } from '../lib/newsletter/email';

const BATCH = 100;
const DB = 'ysk-life-engagement';
const args = process.argv.slice(2);
const slug = args.find((arg) => !arg.startsWith('--')) || '';
const flag = (name: string) => args.includes(`--${name}`);
const value = (name: string) => { const index = args.indexOf(`--${name}`); return index >= 0 ? args[index + 1] : undefined; };

function die(message: string): never { console.error(`\n  ${message}\n`); process.exit(1); }

function frontmatter(path: string) {
 const file = readFileSync(path, 'utf8');
 const block = file.match(/^---\r?\n([\s\S]*?)\r?\n---/);
 if (!block) die(`${path} のフロントマターを読めませんでした。`);
 const data: Record<string, string> = {};
 for (const line of block[1].split(/\r?\n/)) {
  const pair = line.match(/^([a-zA-Z]+):\s*(.*)$/);
  if (pair) data[pair[1]] = pair[2].trim().replace(/^['"]|['"]$/g, '');
 }
 return data;
}

function d1(sql: string) {
 const out = execFileSync('npx', ['wrangler', 'd1', 'execute', DB, '--remote', '--json', '--command', sql], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
 const parsed: unknown = JSON.parse(out.slice(out.indexOf('[')));
 const first = Array.isArray(parsed) ? parsed[0] as { results?: unknown[] } : null;
 return (first?.results || []) as Record<string, string>[];
}

if (!slug) die('記事のslugを指定してください。例: npm run newsletter -- switchbot-lock-pro');
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) die('環境変数 RESEND_API_KEY が設定されていません。');

const post = frontmatter(`src/content/blog/${slug}.md`);
if (!post.title || !post.description) die(`${slug} に title と description が必要です。`);
const article = { title: post.title, description: post.description, category: post.category, url: `${NEWSLETTER.site}/blog/${slug}/` };
const note = value('note');
const testTo = value('test');

const preview = articleMail(testTo || 'preview@example.com', article, unsubscribeUrl('00000000-0000-4000-8000-000000000000'), note);
console.log(`\n件名: ${preview.subject}\n記事: ${article.url}\n\n--- 本文（テキスト版） ---\n${preview.text}\n-------------------------\n`);

if (testTo) {
 await sendMail(apiKey, articleMail(testTo, article, unsubscribeUrl('00000000-0000-4000-8000-000000000000'), note));
 console.log(`試し送りしました: ${testTo}\n`);
 process.exit(0);
}

const rows = d1("SELECT email,unsubscribe_token FROM subscribers WHERE status='active' AND unsubscribe_token IS NOT NULL ORDER BY confirmed_at");
console.log(`配信対象: ${rows.length}件`);
if (rows.length === 0) die('配信対象がいません。');
if (!flag('yes')) die('確認のみで終了しました。実際に送る場合は --yes を付けてください。');

const mails: Mail[] = rows.map((row) => articleMail(row.email, article, unsubscribeUrl(row.unsubscribe_token), note));
let sent = 0; let failed = 0;
for (let index = 0; index < mails.length; index += BATCH) {
 const chunk = mails.slice(index, index + BATCH);
 try { await sendBatch(apiKey, chunk); sent += chunk.length; console.log(`送信: ${sent}/${mails.length}`); }
 catch (error) { failed += chunk.length; console.error(`失敗（${index + 1}件目から${chunk.length}件）: ${error instanceof Error ? error.message : 'unknown'}`); }
}
const escaped = preview.subject.replace(/'/g, "''");
d1(`INSERT INTO newsletter_sends(article,subject,recipients,failed) VALUES('${slug}','${escaped}',${sent},${failed})`);
console.log(`\n完了: 成功 ${sent}件 / 失敗 ${failed}件\n`);
