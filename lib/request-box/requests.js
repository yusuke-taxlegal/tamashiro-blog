// 受付・対応・集計の本体。Pages Functions からはここを呼ぶだけにして、
// ロジックは素のNodeでもテストできるようにしている。

import { normalizeAmazonUrl, URL_ERRORS } from "./amazon.js";
import {
  ARTICLE_URL_ERRORS,
  buildDeclineEmail,
  buildIntakeEmail,
  buildReplyEmail,
  findAffiliateLink,
  validateArticleUrl,
} from "./mail.js";
import {
  DEFAULT_TTL_MS,
  bearerOf,
  createActionToken,
  verifyActionToken,
  verifyDashboardToken,
} from "./sign.js";

const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TURNSTILE_TEST_KEY = /^[123]x000/;
const MAX_BODY = 16000;
/**
 * 通知メールに載せる対応画面のパス。
 * 実体は public/toolbox/request/admin.html だが、Cloudflare Pages は拡張子を外した
 * URLで配信し、.html 付きは308で寄せる。メールのリンクは寄せ先を直接指す。
 */
const ADMIN_PATH = "/toolbox/request/admin";

export const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });

export const isLocal = (request, env) =>
  env.SITE_MODE === "local" &&
  ["localhost", "127.0.0.1", "[::1]"].includes(new URL(request.url).hostname);

/** 設定が揃っていないうちは受付を開けない。 */
export function ready(request, env) {
  if (!env.REQUESTS_DB || !env.REQUEST_ADMIN_SECRET || env.REQUEST_ADMIN_SECRET.length < 16) return false;
  if (!env.TURNSTILE_SITEKEY || !env.TURNSTILE_SECRET_KEY) return false;
  if (isLocal(request, env)) return true;
  return (
    env.SITE_MODE === "production" &&
    !TURNSTILE_TEST_KEY.test(env.TURNSTILE_SITEKEY) &&
    !TURNSTILE_TEST_KEY.test(env.TURNSTILE_SECRET_KEY) &&
    !!env.RESEND_API_KEY &&
    !!env.NOTIFY_FROM &&
    !!env.NOTIFY_TO &&
    (env.ALLOWED_ORIGINS || "")
      .split(",")
      .includes(new URL(request.url).origin)
  );
}

const hash = async (value) =>
  Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
    ),
    (b) => b.toString(16).padStart(2, "0"),
  ).join("");

const allowAffiliateInEmail = (env) =>
  String(env.ALLOW_AFFILIATE_LINK_IN_EMAIL) === "true";

async function readBody(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("empty");
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY) {
      await reader.cancel();
      throw new Error("large");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

const clean = (value) => (typeof value === "string" ? value.trim() : "");
const hasControlChars = (value) =>
  /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value);

/** 依頼フォームの入力検証。通れば保存する形に整えて返す。 */
export function validateIntake(data) {
  if (!data || typeof data !== "object")
    return { ok: false, error: "入力内容を確認してください。" };
  if (!UUID_V4.test(data.requestId || ""))
    return { ok: false, error: "送信をやり直してください。" };
  if (data.consent !== true)
    return { ok: false, error: "取り扱いへの同意にチェックを入れてください。" };

  const name = clean(data.requesterName);
  const email = clean(data.requesterEmail);
  const note = clean(data.productNote);

  if (!name || name.length > 60 || /[\r\n]/.test(name) || hasControlChars(name))
    return { ok: false, error: "お名前を60文字以内で入力してください。" };
  if (
    !email ||
    email.length > 254 ||
    /[\r\n]/.test(email) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  )
    return { ok: false, error: "受け取れるメールアドレスを入力してください。" };
  if (note.length > 500 || hasControlChars(note))
    return { ok: false, error: "ひとことは500文字以内で入力してください。" };

  const parsed = normalizeAmazonUrl(data.productUrl);
  if (!parsed.ok)
    return { ok: false, error: URL_ERRORS[parsed.reason] || URL_ERRORS.malformed };

  return {
    ok: true,
    value: {
      submittedUrl: clean(data.productUrl).slice(0, 2048),
      productUrl: parsed.value.productUrl,
      asin: parsed.value.asin,
      carriedForeignTag: parsed.value.carriedForeignTag,
      shortened: parsed.value.shortened,
      requesterName: name,
      requesterEmail: email,
      productNote: note,
    },
  };
}

async function sendEmail(env, fetcher, { to, replyTo, subject, text, idempotencyKey }) {
  const response = await fetcher("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + env.RESEND_API_KEY,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      from: env.NOTIFY_FROM,
      to: [to],
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      text,
    }),
    signal: AbortSignal.timeout(10000),
  });
  const result = await response.json().catch(() => ({}));
  return response.ok && result.id ? { ok: true, id: result.id } : { ok: false };
}

async function bumpRateLimit(env, request, now, key, limit) {
  const bucket = await hash(
    `${key}:${request.headers.get("CF-Connecting-IP") || "local"}:${Math.floor(
      now / 3600000,
    )}:${env.REQUEST_ADMIN_SECRET}`,
  );
  const row = await env.REQUESTS_DB.prepare(
    "INSERT INTO rate_limits (bucket,count,expires_at) VALUES (?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1 RETURNING count",
  )
    .bind(bucket, now + 7200000)
    .first();
  await env.REQUESTS_DB.prepare("DELETE FROM rate_limits WHERE expires_at<?")
    .bind(now)
    .run();
  return row.count <= limit;
}

// ---------------------------------------------------------------- 受付

export async function handleIntake({ request, env }, fetcher = fetch) {
  if (request.method !== "POST")
    return json(405, { error: "POSTで送信してください。" });
  const url = new URL(request.url);
  if (request.headers.get("Origin") !== url.origin)
    return json(403, { error: "送信元を確認できません。ページを開き直してください。" });
  if (!ready(request, env))
    return json(503, { error: "いまは受付を準備中です。時間をおいてお試しください。" });
  if (!request.headers.get("Content-Type")?.includes("application/json"))
    return json(415, { error: "送信形式を確認できません。" });
  if (Number(request.headers.get("Content-Length") || 0) > MAX_BODY)
    return json(413, { error: "入力内容が長すぎます。" });

  let data;
  try {
    data = await readBody(request);
  } catch (error) {
    return json(error.message === "large" ? 413 : 400, {
      error: "入力内容または文字数を確認してください。",
    });
  }
  if (data?.website) return json(400, { error: "送信を確認できません。" });

  const checked = validateIntake(data);
  if (!checked.ok) return json(400, { error: checked.error });

  const id = data.requestId;
  const payload = JSON.stringify(checked.value);
  const payloadHash = await hash(payload);
  const now = Date.now();

  try {
    const existing = await env.REQUESTS_DB.prepare(
      "SELECT payload_hash, intake_status FROM requests WHERE id=?",
    )
      .bind(id)
      .first();
    if (existing && existing.payload_hash !== payloadHash)
      return json(409, {
        error: "この受付番号は別の内容で登録されています。ページを開き直してください。",
        reference: id,
      });
    if (existing && ["sent", "local_test"].includes(existing.intake_status))
      return json(200, { ok: true, reference: id });

    if (!existing) {
      if (
        typeof data.turnstileToken !== "string" ||
        !data.turnstileToken ||
        data.turnstileToken.length > 2048
      )
        return json(400, { error: "送信確認をやり直してください。", resetChallenge: true });

      const verification = await fetcher(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: env.TURNSTILE_SECRET_KEY,
            response: data.turnstileToken,
            remoteip: request.headers.get("CF-Connecting-IP") || undefined,
          }),
          signal: AbortSignal.timeout(8000),
        },
      );
      const check = await verification.json().catch(() => ({}));
      if (
        !verification.ok ||
        !check.success ||
        (!isLocal(request, env) && check.hostname !== url.hostname)
      )
        return json(400, {
          error: "送信確認の有効期限が切れました。もう一度お試しください。",
          resetChallenge: true,
        });

      if (!(await bumpRateLimit(env, request, now, "intake", 8)))
        return json(429, {
          error: "短い時間に送信が続いています。時間をおいてお試しください。",
          resetChallenge: true,
        });

      await env.REQUESTS_DB.prepare(
        `INSERT OR IGNORE INTO requests
           (id, status, submitted_url, product_url, asin, product_note,
            requester_name, requester_email, payload_hash, intake_status,
            created_at, updated_at)
         VALUES (?, 'open', ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
      )
        .bind(
          id,
          checked.value.submittedUrl,
          checked.value.productUrl,
          checked.value.asin,
          checked.value.productNote,
          checked.value.requesterName,
          checked.value.requesterEmail,
          payloadHash,
          now,
          now,
        )
        .run();
    }

    const saved = await env.REQUESTS_DB.prepare(
      "SELECT payload_hash, intake_status, created_at FROM requests WHERE id=?",
    )
      .bind(id)
      .first();
    if (!saved || saved.payload_hash !== payloadHash)
      return json(409, {
        error: "受付内容を確認できませんでした。受付番号を控えてご連絡ください。",
        reference: id,
      });
    if (["sent", "local_test"].includes(saved.intake_status))
      return json(200, { ok: true, reference: id });

    if (isLocal(request, env)) {
      await env.REQUESTS_DB.prepare(
        "UPDATE requests SET intake_status='local_test', updated_at=? WHERE id=?",
      )
        .bind(now, id)
        .run();
      return json(200, { ok: true, reference: id, local: true });
    }

    const actionUrl = `${url.origin}${ADMIN_PATH}#id=${id}&t=${await createActionToken(
      env.REQUEST_ADMIN_SECRET,
      id,
      now + DEFAULT_TTL_MS,
    )}`;
    const mail = buildIntakeEmail({
      record: { ...checked.value, id, createdAt: saved.created_at },
      actionUrl,
    });
    const sent = await sendEmail(env, fetcher, {
      to: env.NOTIFY_TO,
      replyTo: checked.value.requesterEmail,
      subject: mail.subject,
      text: mail.text,
      idempotencyKey: `request-box-intake-${id}`,
    });
    if (!sent.ok) {
      await env.REQUESTS_DB.prepare(
        "UPDATE requests SET intake_status='failed', updated_at=? WHERE id=? AND intake_status!='sent'",
      )
        .bind(now, id)
        .run();
      return json(503, {
        error:
          "内容は保存しましたが、玉城への通知を送れませんでした。同じ画面からもう一度お試しください。",
        reference: id,
      });
    }
    await env.REQUESTS_DB.prepare(
      "UPDATE requests SET intake_status='sent', intake_email_id=?, updated_at=? WHERE id=?",
    )
      .bind(sent.id, now, id)
      .run();
    return json(200, { ok: true, reference: id });
  } catch {
    return json(503, {
      error: "処理を完了できませんでした。入力を変えずにもう一度お試しください。",
      reference: id,
    });
  }
}

// ---------------------------------------------------------------- 対応

const publicRecord = (row) => ({
  id: row.id,
  status: row.status,
  productUrl: row.product_url,
  asin: row.asin,
  productNote: row.product_note,
  requesterName: row.requester_name,
  requesterEmail: row.requester_email,
  articleUrl: row.article_url,
  replyMessage: row.reply_message,
  replyStatus: row.reply_status,
  repliedAt: row.replied_at,
  createdAt: row.created_at,
});

/**
 * 通知メールの署名付きリンク（この1件のみ）か、ダッシュボードのトークン
 * （全件）のどちらかで通す。件単位のトークンで別の件を触らせない。
 */
async function authorize(env, id, token) {
  if (verifyDashboardToken(env, token)) return "dashboard";
  if (id && (await verifyActionToken(env.REQUEST_ADMIN_SECRET, id, token)))
    return "action";
  return null;
}

async function guardAdmin({ request, env }, id) {
  if (!env.REQUESTS_DB || !env.REQUEST_ADMIN_SECRET || env.REQUEST_ADMIN_SECRET.length < 16)
    return { error: json(503, { error: "設定が未完了です。" }) };
  const token = bearerOf(request);
  const now = Date.now();
  const scope = await authorize(env, id, token);
  if (!scope) {
    // 総当たりを抑える。失敗したときだけ数える。
    await bumpRateLimit(env, request, now, "admin-auth", 20);
    return { error: json(401, { error: "このリンクは使えません。" }) };
  }
  return { scope, now };
}

export async function handleAdminRequest(context, fetcher = fetch) {
  try {
    return await adminRequest(context, fetcher);
  } catch {
    return json(503, { error: "処理を完了できませんでした。もう一度お試しください。" });
  }
}

async function adminRequest(context, fetcher) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || "";
  if (!UUID_V4.test(id)) return json(400, { error: "受付番号を確認できません。" });
  if (request.method === "POST" && request.headers.get("Origin") !== url.origin)
    return json(403, { error: "送信元を確認できません。" });

  const guard = await guardAdmin(context, id);
  if (guard.error) return guard.error;
  const { now } = guard;

  const row = await env.REQUESTS_DB.prepare("SELECT * FROM requests WHERE id=?")
    .bind(id)
    .first();
  if (!row) return json(404, { error: "この受付番号は見つかりませんでした。" });

  if (request.method === "GET")
    return json(200, {
      ok: true,
      record: publicRecord(row),
      toolboxUrl: env.TOOLBOX_URL || "",
    });
  if (request.method !== "POST")
    return json(405, { error: "POSTで送信してください。" });
  if (!request.headers.get("Content-Type")?.includes("application/json"))
    return json(415, { error: "送信形式を確認できません。" });

  let data;
  try {
    data = await readBody(request);
  } catch (error) {
    return json(error.message === "large" ? 413 : 400, {
      error: "入力内容を確認してください。",
    });
  }

  const action = data?.action;
  if (!["publish", "decline"].includes(action))
    return json(400, { error: "操作を確認できません。" });

  const message = clean(data.message);
  if (message.length > 1000 || hasControlChars(message))
    return json(400, { error: "メッセージは1000文字以内で入力してください。" });

  let articleUrl = null;
  if (action === "publish") {
    const checked = validateArticleUrl(data.articleUrl, {
      allowAffiliate: allowAffiliateInEmail(env),
    });
    if (!checked.ok)
      return json(400, {
        error: ARTICLE_URL_ERRORS[checked.reason] || ARTICLE_URL_ERRORS.malformed,
      });
    articleUrl = checked.value;
  }

  const record = publicRecord(row);
  const mail =
    action === "publish"
      ? buildReplyEmail({ record, articleUrl, message })
      : buildDeclineEmail({ record, message });

  // 自由記述にAmazonリンクを貼られても、送る前に止める。
  if (!allowAffiliateInEmail(env)) {
    const risk = findAffiliateLink(mail.text);
    if (risk)
      return json(400, {
        error:
          "メール本文にAmazonのリンクが含まれています。アソシエイトリンクはメールへ載せられないため、公開ページのURLだけにしてください。",
        risk,
      });
  }

  // 送る前に本文を確認できるようにする。保存も送信もしない。
  if (data.preview === true)
    return json(200, { ok: true, preview: mail, action });

  // 同じ内容の二度押しはResend側で1通に畳まれる。URLを直して送り直すと別扱いになる。
  const fingerprint = (await hash(`${action}|${articleUrl ?? ""}|${message}`)).slice(0, 32);
  const nextStatus = action === "publish" ? "published" : "declined";

  if (isLocal(context.request, env)) {
    await env.REQUESTS_DB.prepare(
      `UPDATE requests SET status=?, article_url=?, reply_message=?,
         reply_status='local_test', replied_at=?, updated_at=? WHERE id=?`,
    )
      .bind(nextStatus, articleUrl, message, now, now, id)
      .run();
    return json(200, { ok: true, local: true, status: nextStatus, preview: mail });
  }

  if (!env.RESEND_API_KEY || !env.NOTIFY_FROM)
    return json(503, { error: "メール送信の設定が未完了です。" });

  const sent = await sendEmail(env, fetcher, {
    to: record.requesterEmail,
    replyTo: env.NOTIFY_TO,
    subject: mail.subject,
    text: mail.text,
    idempotencyKey: `request-box-reply-${id}-${fingerprint}`,
  });
  if (!sent.ok) {
    await env.REQUESTS_DB.prepare(
      `UPDATE requests SET article_url=?, reply_message=?, reply_status='failed', updated_at=? WHERE id=?`,
    )
      .bind(articleUrl, message, now, id)
      .run();
    return json(503, {
      error: "送信できませんでした。内容はそのままです。もう一度お試しください。",
    });
  }

  await env.REQUESTS_DB.prepare(
    `UPDATE requests SET status=?, article_url=?, reply_message=?,
       reply_status='sent', reply_email_id=?, replied_at=?, updated_at=? WHERE id=?`,
  )
    .bind(nextStatus, articleUrl, message, sent.id, now, now, id)
    .run();
  return json(200, { ok: true, status: nextStatus });
}

// ---------------------------------------------------------------- 見える化

const monthKey = (timestamp) =>
  new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
  })
    .format(new Date(timestamp))
    .replace("/", "-")
    .replace(/\//g, "");

/** 集計はここに集約する。件数が小さいので取得後にJSで畳む。 */
export function summarize(rows) {
  const byRequester = new Map();
  const byMonth = new Map();
  const leadTimes = [];
  let open = 0;
  let published = 0;
  let declined = 0;

  for (const row of rows) {
    if (row.status === "published") published += 1;
    else if (row.status === "declined") declined += 1;
    else open += 1;

    const key = row.requester_email.toLowerCase();
    const person = byRequester.get(key) || {
      name: row.requester_name,
      email: row.requester_email,
      total: 0,
      published: 0,
      lastAt: 0,
    };
    person.total += 1;
    if (row.status === "published") person.published += 1;
    if (row.created_at > person.lastAt) {
      person.lastAt = row.created_at;
      person.name = row.requester_name;
    }
    byRequester.set(key, person);

    const month = monthKey(row.created_at);
    const bucket = byMonth.get(month) || { month, total: 0, published: 0 };
    bucket.total += 1;
    if (row.status === "published") bucket.published += 1;
    byMonth.set(month, bucket);

    if (row.status === "published" && row.replied_at)
      leadTimes.push(row.replied_at - row.created_at);
  }

  leadTimes.sort((a, b) => a - b);
  const medianLeadTimeHours = leadTimes.length
    ? Math.round(
        (leadTimes[Math.floor((leadTimes.length - 1) / 2)] / 3600000) * 10,
      ) / 10
    : null;

  return {
    total: rows.length,
    open,
    published,
    declined,
    medianLeadTimeHours,
    byRequester: [...byRequester.values()].sort(
      (a, b) => b.total - a.total || b.lastAt - a.lastAt,
    ),
    byMonth: [...byMonth.values()].sort((a, b) => a.month.localeCompare(b.month)),
  };
}

export async function handleAdminList(context) {
  try {
    return await adminList(context);
  } catch {
    return json(503, { error: "読み込めませんでした。もう一度お試しください。" });
  }
}

async function adminList(context) {
  const { request, env } = context;
  if (request.method !== "GET") return json(405, { error: "GETで取得します。" });
  if (!env.REQUESTS_DB || !env.REQUEST_ADMIN_SECRET)
    return json(503, { error: "設定が未完了です。" });
  // 一覧は全件を見せるため、件単位の対応リンクでは開けない。
  if (!verifyDashboardToken(env, bearerOf(request))) {
    await bumpRateLimit(env, request, Date.now(), "admin-auth", 20);
    return json(401, { error: "トークンを確認できません。" });
  }

  const result = await env.REQUESTS_DB.prepare(
    "SELECT * FROM requests ORDER BY created_at DESC LIMIT 1000",
  ).all();
  const rows = result.results || [];
  return json(200, {
    ok: true,
    summary: summarize(rows),
    records: rows.map(publicRecord),
  });
}

// ---------------------------------------------------------------- 公開設定

export function handleConfig({ request, env }) {
  return json(200, {
    ready: ready(request, env),
    local: isLocal(request, env),
    turnstileSitekey: env.TURNSTILE_SITEKEY || "",
    toolboxUrl: env.TOOLBOX_URL || "",
  });
}
