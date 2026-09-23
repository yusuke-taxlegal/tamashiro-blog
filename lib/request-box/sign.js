// 対応リンクの署名。
//
// 通知メールに載せるリンクへ、この1件だけを操作できる署名を付ける。
// ログインを作らずに「メールを開く→貼る→送る」で完結させるための仕組み。
// トークンはURLのフラグメント（#）に置く。サーバーのアクセスログにも
// Referer にも残らず、メールのリンク先読みで誤って発火することもない。

const encoder = new TextEncoder();

const toBase64Url = (bytes) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

async function hmac(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message),
  );
  return toBase64Url(new Uint8Array(signature));
}

/** 長さの違いも含めて、比較にかかる時間から中身を推測されないようにする。 */
export function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  // 長さが違っても同じ回数だけ回す。長さの一致も結果へ畳み込む。
  let diff = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i += 1) diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  return diff === 0;
}

export const DEFAULT_TTL_MS = 180 * 24 * 60 * 60 * 1000;

/** `{有効期限}.{署名}` を返す。 */
export async function createActionToken(secret, id, expiresAt) {
  const exp = Math.floor(expiresAt / 1000).toString(36);
  return `${exp}.${await hmac(secret, `v1:${id}:${exp}`)}`;
}

export async function verifyActionToken(secret, id, token, now = Date.now()) {
  if (!secret || typeof token !== "string" || token.length > 256) return false;
  const separator = token.indexOf(".");
  if (separator <= 0) return false;
  const exp = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  if (!/^[0-9a-z]{1,12}$/.test(exp)) return false;
  const expiresAt = parseInt(exp, 36) * 1000;
  if (!Number.isFinite(expiresAt) || expiresAt <= now) return false;
  return safeEqual(await hmac(secret, `v1:${id}:${exp}`), signature);
}

/** ダッシュボード用。固定トークンをそのまま突き合わせる。 */
export function verifyDashboardToken(env, provided) {
  const expected = env.REQUEST_ADMIN_TOKEN;
  if (!expected || expected.length < 16) return false;
  return safeEqual(expected, provided ?? "");
}

export const bearerOf = (request) => {
  const header = request.headers.get("Authorization") || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
};
