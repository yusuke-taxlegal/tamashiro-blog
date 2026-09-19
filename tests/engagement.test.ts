import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { onRequest as engagement } from '../functions/api/engagement.ts';
import { onRequest as admin } from '../functions/api/admin.ts';
import { onRequest as popular } from '../functions/api/popular.ts';
import { hmac } from '../lib/engagement/http.ts';
import { aggregate, normalizeArticle } from '../workers/engagement-sync/index.ts';

const cwd = process.cwd();
const origin = 'https://ysk.life';

class FakeStatement {
	values: unknown[] = [];
	db: FakeD1;
	sql: string;
	constructor(db: FakeD1, sql: string) { this.db = db; this.sql = sql; }
	bind(...values: unknown[]) { this.values = values; return this; }
	async run() {
		if (this.sql.includes('INSERT OR IGNORE INTO reactions')) {
			const [article, kind, hash] = this.values as [string, string, string];
			const key = `${article}:${kind}:${hash}`;
			if (this.db.reactions.has(key)) return { meta: { changes: 0 } };
			this.db.reactions.set(key, { article, kind, hash, createdAt: new Date().toISOString() });
			return { meta: { changes: 1 } };
		}
		return { meta: { changes: 1 } };
	}
	async first() {
		if (this.sql.includes('INSERT INTO rate_limits')) {
			const key = String(this.values[0]);
			const count = (this.db.rates.get(key) || 0) + 1;
			this.db.rates.set(key, count);
			return { count };
		}
		return null;
	}
	async all() {
		if (this.sql.includes('MAX(CASE WHEN visitor_hash=?')) {
			const [hash, article] = this.values as [string, string];
			return { results: ['helpful', 'try'].flatMap((kind) => {
				const records = [...this.db.reactions.values()].filter((row) => row.article === article && row.kind === kind);
				return records.length ? [{ kind, count: records.length, reacted: records.some((row) => row.hash === hash) ? 1 : 0 }] : [];
			}) };
		}
		if (this.sql.includes('SUM(views) AS views')) return { results: this.db.gaRows };
		if (this.sql.includes('COUNT(*) AS count FROM reactions')) {
			const groups = new Map<string, number>();
			for (const row of this.db.reactions.values()) groups.set(`${row.article}:${row.kind}`, (groups.get(`${row.article}:${row.kind}`) || 0) + 1);
			return { results: [...groups].map(([key, count]) => { const [article, kind] = key.split(':'); return { article, kind, count }; }) };
		}
		if (this.sql.includes('SELECT key,value FROM sync_state')) return { results: [...this.db.state].map(([key, value]) => ({ key, value })) };
		if (this.sql.includes('SUM(share_clicks+link_copies+native_shares)')) return { results: [] };
		return { results: [] };
	}
}

class FakeD1 {
	reactions = new Map<string, { article: string; kind: string; hash: string; createdAt: string }>();
	rates = new Map<string, number>();
	gaRows: Record<string, unknown>[] = [];
	state = new Map<string, string>();
	prepare(sql: string) { return new FakeStatement(this, sql); }
	async batch(statements: FakeStatement[]) { return Promise.all(statements.map((statement) => statement.all())); }
}

function env(db = new FakeD1()) {
	return { DB: db, COOKIE_SECRET: 'cookie-secret', ADMIN_TOKEN: 'admin-token', ANALYTICS_SYNC: { fetch: async () => Response.json({ ok: true }) } } as any;
}
function request(path: string, init: RequestInit = {}) {
	return new Request(`${origin}${path}`, { ...init, headers: { 'CF-Connecting-IP': '127.0.0.1', ...(init.headers || {}) } });
}
function setCookie(response: Response) { return response.headers.get('Set-Cookie')!.split(';')[0]; }
async function body(response: Response) { return response.json() as Promise<any>; }

test('local D1 accepts the engagement migration', () => {
	execFileSync('npx', ['wrangler', 'd1', 'execute', 'ysk-life-engagement', '--local', '--file=migrations/0001_engagement.sql'], { cwd, stdio: 'ignore' });
});

test('engagement rejects malformed, unknown, invalid-kind, and cross-origin writes', async () => {
	const runtime = env();
	assert.equal((await engagement({ request: request('/api/engagement?article=nope'), env: runtime } as any)).status, 404);
	assert.equal((await engagement({ request: request('/api/engagement', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: '{' }), env: runtime } as any)).status, 400);
	assert.equal((await engagement({ request: request('/api/engagement', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ article: 'chatgpt-business-nyumon', kind: 'nope' }) }), env: runtime } as any)).status, 400);
	assert.equal((await engagement({ request: request('/api/engagement', { method: 'POST', headers: { Origin: 'https://evil.example', 'Content-Type': 'application/json' }, body: JSON.stringify({ article: 'chatgpt-business-nyumon', kind: 'helpful' }) }), env: runtime } as any)).status, 403);
});

test('engagement is one vote per browser and kind; a tampered cookie is not reused', async () => {
	const runtime = env();
	const post = async (kind: string, cookie?: string) => engagement({ request: request('/api/engagement', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) }, body: JSON.stringify({ article: 'chatgpt-business-nyumon', kind }) }), env: runtime } as any);
	const first = await post('helpful');
	const cookie = setCookie(first);
	assert.equal((await body(first)).created, true);
	const duplicate = await post('helpful', cookie);
	assert.equal((await body(duplicate)).created, false);
	const otherKind = await post('try', cookie);
	const other = await body(otherKind);
	assert.equal(other.created, true);
	assert.deepEqual(other.counts, { helpful: 1, try: 1 });
	const tampered = await post('helpful', `${cookie}x`);
	assert.equal((await body(tampered)).created, true);
	const read = await engagement({ request: request('/api/engagement?article=chatgpt-business-nyumon', { headers: { Cookie: cookie } }), env: runtime } as any);
	assert.deepEqual((await body(read)).counts, { helpful: 2, try: 1 });
});

test('engagement rate limit blocks the thirteenth write from an IP', async () => {
	const runtime = env();
	for (let index = 0; index < 12; index += 1) {
		const response = await engagement({ request: request('/api/engagement', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ article: 'chatgpt-business-nyumon', kind: 'helpful' }) }), env: runtime } as any);
		assert.equal(response.status, 200);
	}
	const blocked = await engagement({ request: request('/api/engagement', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ article: 'chatgpt-business-nyumon', kind: 'helpful' }) }), env: runtime } as any);
	assert.equal(blocked.status, 429);
});

test('admin requires a signed login and returns a no-store report after login', async () => {
	const runtime = env();
	assert.equal((await admin({ request: request('/api/admin'), env: runtime } as any)).status, 401);
	assert.equal((await admin({ request: request('/api/admin', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ token: 'wrong' }) }), env: runtime } as any)).status, 401);
	const login = await admin({ request: request('/api/admin', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ token: 'admin-token' }) }), env: runtime } as any);
	assert.equal(login.status, 200);
	const report = await admin({ request: request('/api/admin', { headers: { Cookie: setCookie(login) } }), env: runtime } as any);
	assert.equal(report.status, 200);
	assert.equal(report.headers.get('Cache-Control'), 'no-store');
});

test('public ranking hides stale and empty data, then applies its view and helpful thresholds', async () => {
	const db = new FakeD1();
	db.state.set('last_success', new Date(Date.now() - 73 * 3600000).toISOString());
	let response = await popular({ request: request('/api/popular'), env: env(db) } as any);
	assert.deepEqual((await body(response)).popular, []);
	db.state.set('last_success', new Date().toISOString());
	db.gaRows = [
		{ article: 'chatgpt-business-nyumon', views: 5, qualifiedReads: 0, shareClicks: 0, linkCopies: 0, nativeShares: 0, helpfulEvents: 0, tryEvents: 0 },
		{ article: 'google-workspace-nyumon', views: 20, qualifiedReads: 0, shareClicks: 0, linkCopies: 0, nativeShares: 0, helpfulEvents: 0, tryEvents: 0 },
	];
	for (let index = 0; index < 3; index += 1) db.reactions.set(`google-workspace-nyumon:helpful:${index}`, { article: 'google-workspace-nyumon', kind: 'helpful', hash: String(index), createdAt: new Date().toISOString() });
	response = await popular({ request: request('/api/popular'), env: env(db) } as any);
	const payload = await body(response);
	assert.deepEqual(payload.popular, [{ article: 'google-workspace-nyumon', views: 20 }, { article: 'chatgpt-business-nyumon', views: 5 }]);
	assert.deepEqual(payload.helpful, [{ article: 'google-workspace-nyumon', count: 3 }]);
});

test('GA paths are normalized and aggregate sums trailing-slash variants', () => {
	assert.equal(normalizeArticle('/blog/chatgpt-business-nyumon/'), 'chatgpt-business-nyumon');
	assert.equal(normalizeArticle('/blog/chatgpt-business-nyumon?x=1'), null);
	assert.equal(normalizeArticle('/blog/unknown/'), null);
	const rows = aggregate(
		{ rows: [{ dimensionValues: [{ value: '20260918' }, { value: '/blog/chatgpt-business-nyumon' }], metricValues: [{ value: '2' }] }, { dimensionValues: [{ value: '20260918' }, { value: '/blog/chatgpt-business-nyumon/' }], metricValues: [{ value: '3' }] }] },
		{ rows: [{ dimensionValues: [{ value: '20260918' }, { value: '/blog/chatgpt-business-nyumon/' }, { value: 'article_helpful' }], metricValues: [{ value: '4' }] }] },
	);
	assert.deepEqual(rows[0].values, [5, 0, 0, 0, 0, 4, 0]);
});

test('GA starts only after consent; resetting consent disables measurement immediately', async () => {
 const {readFileSync}=await import('node:fs'); const {runInNewContext}=await import('node:vm');
 const source=readFileSync('src/components/BaseHead.astro','utf8').match(/<script is:inline>([\s\S]*?)<\/script>/)![1];
 const appended:unknown[]=[];const listeners:Record<string,()=>void>={};const storage=new Map<string,string>();
 const window:any={location:{hostname:'ysk.life',origin:'https://ysk.life',pathname:'/blog/upsider-staff-card/'},localStorage:{getItem:(k:string)=>storage.get(k),setItem:(k:string,v:string)=>storage.set(k,v),removeItem:(k:string)=>storage.delete(k)}};
 const document:any={readyState:'complete',head:{appendChild:(node:unknown)=>appended.push(node)},body:{appendChild:()=>{}},
 querySelector:(selector:string)=>selector==='[data-analytics-consent-reset]'?{addEventListener:(_event:string,fn:()=>void)=>{listeners.reset=fn;}}:null,
 createElement:()=>({dataset:{},setAttribute:()=>{},querySelector:(selector:string)=>({addEventListener:(_event:string,fn:()=>void)=>{listeners[selector]=fn;}})})};
 runInNewContext(source,{window,document,Date}); assert.equal(appended.length,0);
 listeners['[data-analytics-decline]'](); assert.equal(appended.length,0);
 listeners['[data-analytics-accept]'](); assert.equal(appended.length,1);assert.equal(window['ga-disable-G-752CVHZQNC'],false);
 listeners.reset(); assert.equal(window['ga-disable-G-752CVHZQNC'],true);assert.equal(storage.has('ysk-analytics-consent-v1'),false);
 listeners['[data-analytics-accept]'](); assert.equal(appended.length,1);assert.equal(window['ga-disable-G-752CVHZQNC'],false);
});
