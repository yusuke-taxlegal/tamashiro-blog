export function json(data: unknown, status = 200, extra: HeadersInit = {}) {
 return new Response(JSON.stringify(data), { status, headers: {
  'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', ...extra,
 }});
}
export async function smallJSON(request: Request): Promise<Record<string, unknown>> {
 if (!request.headers.get('Content-Type')?.startsWith('application/json')) throw new Error('invalid_body');
 const reader = request.body?.getReader();
 if (!reader) throw new Error('invalid_body');
 let size = 0; const chunks: Uint8Array[] = [];
 while (true) { const {value, done} = await reader.read(); if (done) break;
  size += value.byteLength; if (size > 2048) { await reader.cancel(); throw new Error('invalid_body'); } chunks.push(value);
 }
 const bytes = new Uint8Array(size); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
 const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
 if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('invalid_body');
 return parsed as Record<string, unknown>;
}
export function sameOrigin(request: Request) {
 return request.headers.get('Origin') === new URL(request.url).origin && request.headers.get('Sec-Fetch-Site') !== 'cross-site';
}
const encoder = new TextEncoder();
export async function hmac(secret: string, value: string) {
 const key = await crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,encoder.encode(value))),b=>b.toString(16).padStart(2,'0')).join('');
}
export async function verifyHmac(secret: string, value: string, signature: string) {
 if (!/^[a-f0-9]{64}$/.test(signature)) return false;
 const key = await crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['verify']);
 return crypto.subtle.verify('HMAC',key,Uint8Array.from(signature.match(/../g)!,x=>parseInt(x,16)),encoder.encode(value));
}
export function cookie(request: Request, name: string) {
 return request.headers.get('Cookie')?.split(';').map(v=>v.trim()).find(v=>v.startsWith(name+'='))?.slice(name.length+1) || '';
}
export async function rateLimit(db: D1Database, secret: string, request: Request, purpose: string, limit: number) {
 const minute = Math.floor(Date.now()/60000);
 const key = await hmac(secret, `${purpose}:${minute}:${request.headers.get('CF-Connecting-IP') || 'local'}`);
 const row = await db.prepare('INSERT INTO rate_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key,(minute+2)*60).first<{count:number}>();
 return (row?.count || 0) <= limit;
}
