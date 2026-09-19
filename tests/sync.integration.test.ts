import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { generateKeyPairSync } from 'node:crypto';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { sync } from '../workers/engagement-sync/index.ts';

const cwd = process.cwd();
const migration = 'migrations/0001_engagement.sql';
const localState = '/tmp/ysk-engagement-sync-d1-state';

class Statement {
	values: unknown[] = [];
	constructor(db: DatabaseSync, sql: string) { this.statement = db.prepare(sql); }
	statement: ReturnType<DatabaseSync['prepare']>;
	bind(...values: unknown[]) { this.values = values; return this; }
	async run() { const result = this.statement.run(...this.values); return { meta: { changes: Number(result.changes) } }; }
	async all() { return { results: this.statement.all(...this.values) }; }
	async first() { return this.statement.get(...this.values) ?? null; }
}

class LocalD1 {
	constructor(readonly sqlite: DatabaseSync) {}
	prepare(sql: string) { return new Statement(this.sqlite, sql); }
	async batch(statements: Statement[]) {
		this.sqlite.exec('BEGIN');
		try {
			const results = [];
			for (const statement of statements) results.push(await statement.run());
			this.sqlite.exec('COMMIT');
			return results;
		} catch (error) {
			this.sqlite.exec('ROLLBACK');
			throw error;
		}
	}
}

function createDatabase() {
	const sqlite = new DatabaseSync(':memory:');
	sqlite.exec(execFileSync('sed', ['-n', '1,999p', migration], { cwd, encoding: 'utf8' }));
	return { sqlite, db: new LocalD1(sqlite) };
}

function serviceAccount() {
	const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048, privateKeyEncoding: { type: 'pkcs8', format: 'pem' }, publicKeyEncoding: { type: 'spki', format: 'pem' } });
	return JSON.stringify({ client_email: 'sync-test@project.iam.gserviceaccount.com', private_key: privateKey });
}

const metadata = { timeZone: 'Asia/Tokyo' };
const views = { metadata, rowCount: 2, rows: [
	{ dimensionValues: [{ value: '20260918' }, { value: '/blog/chatgpt-business-nyumon/' }], metricValues: [{ value: '7' }] },
	{ dimensionValues: [{ value: '20260918' }, { value: '/blog/google-workspace-nyumon' }], metricValues: [{ value: '5' }] },
] };
const events = { metadata, rowCount: 2, rows: [
	{ dimensionValues: [{ value: '20260918' }, { value: '/blog/chatgpt-business-nyumon' }, { value: 'article_helpful' }], metricValues: [{ value: '3' }] },
	{ dimensionValues: [{ value: '20260918' }, { value: '/blog/google-workspace-nyumon/' }, { value: 'article_try' }], metricValues: [{ value: '2' }] },
] };

function stubFetch(mode: 'data' | 'empty' | 'failure') {
	const original = globalThis.fetch;
	globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
		const url = String(input);
		if (url === 'https://oauth2.googleapis.com/token') return Response.json({ access_token: 'local-test-token' });
		if (!url.startsWith('https://analyticsdata.googleapis.com/')) throw new Error(`unexpected network request: ${url}`);
		if (mode === 'failure') return new Response('unavailable', { status: 500 });
		const body = JSON.parse(String(init?.body));
		const isEvents = body.dimensions.some((dimension: { name: string }) => dimension.name === 'eventName');
		return Response.json(mode === 'empty' ? { metadata, rowCount: 0, rows: [] } : isEvents ? events : views);
	}) as typeof fetch;
	return () => { globalThis.fetch = original; };
}

test('actual local D1 accepts populated and empty json_each inserts', () => {
	execFileSync('npx', ['wrangler', 'd1', 'execute', 'ysk-life-engagement', '--local', '--persist-to', localState, '--file', migration], { cwd, stdio: 'ignore' });
	const insert = "INSERT INTO ga_daily(date,article,views,qualified_reads,share_clicks,link_copies,native_shares,helpful_events,try_events) SELECT json_extract(value,'$[0]'),json_extract(value,'$[1]'),json_extract(value,'$[2]'),json_extract(value,'$[3]'),json_extract(value,'$[4]'),json_extract(value,'$[5]'),json_extract(value,'$[6]'),json_extract(value,'$[7]'),json_extract(value,'$[8]') FROM json_each('[[\"2026-09-18\",\"chatgpt-business-nyumon\",7,0,0,0,0,3,0]]')";
	const output = execFileSync('npx', ['wrangler', 'd1', 'execute', 'ysk-life-engagement', '--local', '--persist-to', localState, '--command', `DELETE FROM ga_daily; ${insert}; SELECT views,helpful_events FROM ga_daily WHERE article='chatgpt-business-nyumon'; SELECT count(*) AS empty_rows FROM json_each('[]');`], { cwd, encoding: 'utf8' });
	assert.match(output, /"views": 7/);
	assert.match(output, /"helpful_events": 3/);
	assert.match(output, /"empty_rows": 0/);
});

test('sync imports GA data atomically, accepts an empty snapshot, and preserves data on failure', async () => {
	const { sqlite, db } = createDatabase();
	const runtime = { DB: db, GA4_PROPERTY_ID: '550976520', GA4_SERVICE_ACCOUNT_JSON: serviceAccount() } as any;
	sqlite.prepare("INSERT INTO ga_daily(date,article,views) VALUES('2026-08-18','chatgpt-business-nyumon',9)").run();
	let restore = stubFetch('data');
	try {
		const result = await sync(runtime);
		assert.deepEqual(result, { ok: true, rows: 2 });
	} finally { restore(); }
	assert.deepEqual(Array.from(sqlite.prepare("SELECT article,views,helpful_events,try_events FROM ga_daily WHERE date='2026-09-18' ORDER BY article").all(), (row) => ({ ...row })), [
		{ article: 'chatgpt-business-nyumon', views: 7, helpful_events: 3, try_events: 0 },
		{ article: 'google-workspace-nyumon', views: 5, helpful_events: 0, try_events: 2 },
	]);
	assert.equal(sqlite.prepare("SELECT views FROM ga_daily WHERE date='2026-08-18'").get().views, 9);
	restore = stubFetch('empty');
	try { assert.deepEqual(await sync(runtime), { ok: true, rows: 0 }); } finally { restore(); }
	assert.equal(sqlite.prepare("SELECT count(*) AS count FROM ga_daily WHERE date='2026-09-18'").get().count, 0);
	const emptySuccess = sqlite.prepare("SELECT value FROM sync_state WHERE key='last_success'").get().value;
	sqlite.prepare("INSERT INTO ga_daily(date,article,views) VALUES('2026-09-18','chatgpt-business-nyumon',11)").run();
	restore = stubFetch('failure');
	try { assert.deepEqual(await sync(runtime), { ok: false, status: 'ga4_http_500' }); } finally { restore(); }
	assert.equal(sqlite.prepare("SELECT views FROM ga_daily WHERE date='2026-09-18'").get().views, 11);
	assert.equal(sqlite.prepare("SELECT value FROM sync_state WHERE key='last_success'").get().value, emptySuccess);
	assert.equal(sqlite.prepare("SELECT value FROM sync_state WHERE key='status'").get().value, 'ga4_http_500');
	sqlite.close();
});
