import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

import {
  handleAdminList,
  handleAdminRequest,
  handleConfig,
  handleIntake,
} from "../../lib/request-box/requests.js";
import { DEFAULT_TTL_MS, createActionToken } from "../../lib/request-box/sign.js";
import { findAffiliateLink } from "../../lib/request-box/mail.js";

const ORIGIN = "https://box.example.test";
const ADMIN_SECRET = "admin-secret-for-tests-0123456789";
const ADMIN_TOKEN = "dashboard-token-for-tests-0123456789";

/** 本物のSQLiteの上に、D1が見せるのと同じ形の薄い層をかぶせる。 */
function database() {
  const sql = new DatabaseSync(":memory:");
  sql.exec(readFileSync(new URL("../../migrations-request-box/0001_init.sql", import.meta.url), "utf8"));
  const run = (query, args) => {
    const statement = sql.prepare(query);
    return /returning/i.test(query)
      ? (statement.get(...args) ?? null)
      : statement.run(...args);
  };
  const prepare = (query) => ({
    bind: (...args) => ({
      first: async () => (/returning/i.test(query) ? run(query, args) : (sql.prepare(query).get(...args) ?? null)),
      run: async () => run(query, args),
      all: async () => ({ results: sql.prepare(query).all(...args) }),
    }),
    first: async () => sql.prepare(query).get() ?? null,
    run: async () => run(query, []),
    all: async () => ({ results: sql.prepare(query).all() }),
  });
  return { sql, prepare };
}

function setup(overrides = {}) {
  const db = database();
  const env = {
    REQUESTS_DB: db,
    SITE_MODE: "production",
    ALLOWED_ORIGINS: ORIGIN,
    TOOLBOX_URL: "https://ysk.life/toolbox/",
    TURNSTILE_SITEKEY: "production-sitekey",
    TURNSTILE_SECRET_KEY: "production-secret",
    RESEND_API_KEY: "test-fixture",
    NOTIFY_FROM: "道具箱 <box@example.test>",
    NOTIFY_TO: "tamashiro@example.test",
    REQUEST_ADMIN_SECRET: ADMIN_SECRET,
    REQUEST_ADMIN_TOKEN: ADMIN_TOKEN,
    ALLOW_AFFILIATE_LINK_IN_EMAIL: "false",
    ...overrides,
  };
  const sent = [];
  let turnstileOk = true;
  let resendOk = true;
  const fetcher = async (url, options) => {
    if (String(url).includes("siteverify"))
      return Response.json({ success: turnstileOk, hostname: "box.example.test" });
    sent.push({ ...JSON.parse(options.body), idempotencyKey: options.headers["Idempotency-Key"] });
    return resendOk
      ? Response.json({ id: `email-${sent.length}` })
      : new Response("nope", { status: 500 });
  };
  return {
    db, env, sent, fetcher,
    failTurnstile: () => { turnstileOk = false; },
    failResend: () => { resendOk = false; },
  };
}

const payload = (overrides = {}) => ({
  requestId: crypto.randomUUID(),
  productUrl: "https://www.amazon.co.jp/dp/B09LCRNQT4",
  requesterName: "比嘉",
  requesterEmail: "higa@example.test",
  productNote: "在宅の作業机で使いたいです。",
  website: "",
  consent: true,
  turnstileToken: "token",
  ...overrides,
});

const intakeRequest = (data, options = {}) =>
  new Request(`${ORIGIN}/api/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: ORIGIN,
      "CF-Connecting-IP": "192.0.2.1",
      ...options.headers,
    },
    body: JSON.stringify(data),
  });

const adminRequest = (id, token, body, method = body ? "POST" : "GET") =>
  new Request(`${ORIGIN}/api/admin/request?id=${id}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "CF-Connecting-IP": "192.0.2.9",
      ...(body ? { "Content-Type": "application/json", Origin: ORIGIN } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

async function intake(harness, data, options) {
  const response = await handleIntake(
    { request: intakeRequest(data, options), env: harness.env },
    harness.fetcher,
  );
  return { status: response.status, body: await response.json() };
}

async function admin(harness, id, token, body, method) {
  const response = await handleAdminRequest(
    { request: adminRequest(id, token, body, method), env: harness.env },
    harness.fetcher,
  );
  return { status: response.status, body: await response.json() };
}

const rowOf = (harness, id) =>
  harness.db.sql.prepare("SELECT * FROM requests WHERE id=?").get(id);

// ------------------------------------------------------------ 受付

test("受付：保存して本人へ通知し、受付番号を返す", async () => {
  const harness = setup();
  const data = payload();
  const result = await intake(harness, data);

  assert.equal(result.status, 200);
  assert.equal(result.body.ok, true);
  assert.equal(result.body.reference, data.requestId);

  const row = rowOf(harness, data.requestId);
  assert.equal(row.status, "open");
  assert.equal(row.intake_status, "sent");
  assert.equal(row.product_url, "https://www.amazon.co.jp/dp/B09LCRNQT4");
  assert.equal(row.asin, "B09LCRNQT4");
  assert.equal(row.requester_email, "higa@example.test");

  assert.equal(harness.sent.length, 1);
  const mail = harness.sent[0];
  assert.deepEqual(mail.to, ["tamashiro@example.test"]);
  assert.equal(mail.reply_to, "higa@example.test");
  assert.ok(mail.text.includes(`${ORIGIN}/toolbox/request/admin#id=${data.requestId}&t=`));
});

test("受付：他人のタグは保存前に落とす", async () => {
  const harness = setup();
  const data = payload({
    productUrl: "https://www.amazon.co.jp/dp/B09LCRNQT4/ref=x?tag=someoneelse-22",
  });
  assert.equal((await intake(harness, data)).status, 200);

  const row = rowOf(harness, data.requestId);
  assert.equal(row.product_url, "https://www.amazon.co.jp/dp/B09LCRNQT4");
  assert.ok(row.submitted_url.includes("tag=someoneelse-22"), "原文は監査用に残す");
  assert.ok(harness.sent[0].text.includes("他の人のアソシエイトタグ"));
});

test("受付：同じ受付番号の再送は1件・1通のまま", async () => {
  const harness = setup();
  const data = payload();
  assert.equal((await intake(harness, data)).status, 200);
  const second = await intake(harness, data);

  assert.equal(second.status, 200);
  assert.equal(second.body.reference, data.requestId);
  assert.equal(harness.sent.length, 1);
  assert.equal(harness.db.sql.prepare("SELECT COUNT(*) c FROM requests").get().c, 1);
});

test("受付：同じ受付番号で中身が違えば受け付けない", async () => {
  const harness = setup();
  const data = payload();
  await intake(harness, data);
  const changed = await intake(harness, { ...data, requesterName: "別人" });
  assert.equal(changed.status, 409);
  assert.equal(harness.sent.length, 1);
});

test("受付：入力の不備はそれぞれ理由を返す", async () => {
  const harness = setup();
  const cases = [
    payload({ productUrl: "https://rakuten.co.jp/item/1" }),
    payload({ productUrl: "https://www.amazon.co.jp/s?k=x" }),
    payload({ requesterName: "" }),
    payload({ requesterName: "あ".repeat(61) }),
    payload({ requesterEmail: "not-an-email" }),
    payload({ requesterEmail: "a@b.jp\r\nBcc: x@y.jp" }),
    payload({ productNote: "あ".repeat(501) }),
    payload({ consent: false }),
    payload({ requestId: "not-a-uuid" }),
  ];
  for (const data of cases) {
    const result = await intake(harness, data);
    assert.equal(result.status, 400, JSON.stringify(data).slice(0, 80));
    assert.ok(result.body.error);
  }
  assert.equal(harness.sent.length, 0);
  assert.equal(harness.db.sql.prepare("SELECT COUNT(*) c FROM requests").get().c, 0);
});

test("受付：ハニーポット・送信元違い・未設定は通さない", async () => {
  const harness = setup();
  assert.equal((await intake(harness, payload({ website: "bot" }))).status, 400);

  const wrongOrigin = await intake(harness, payload(), {
    headers: { Origin: "https://elsewhere.example" },
  });
  assert.equal(wrongOrigin.status, 403);

  const unset = setup({ RESEND_API_KEY: "" });
  assert.equal((await intake(unset, payload())).status, 503);

  const testKey = setup({ TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA" });
  assert.equal((await intake(testKey, payload())).status, 503);

  assert.equal(harness.sent.length, 0);
});

test("受付：人間確認に通らなければ受け付けない", async () => {
  const harness = setup();
  harness.failTurnstile();
  const result = await intake(harness, payload());
  assert.equal(result.status, 400);
  assert.equal(result.body.resetChallenge, true);
  assert.equal(harness.db.sql.prepare("SELECT COUNT(*) c FROM requests").get().c, 0);
});

test("受付：短時間に送りすぎると止まる", async () => {
  const harness = setup();
  for (let i = 0; i < 8; i += 1)
    assert.equal((await intake(harness, payload())).status, 200, `${i}通目`);
  const blocked = await intake(harness, payload());
  assert.equal(blocked.status, 429);
  assert.equal(harness.sent.length, 8);
});

test("受付：通知に失敗したら失敗を記録し、同じ受付番号で送り直せる", async () => {
  const harness = setup();
  harness.failResend();
  const data = payload();
  const first = await intake(harness, data);
  assert.equal(first.status, 503);
  assert.equal(rowOf(harness, data.requestId).intake_status, "failed");

  // 同じ内容の再送はTurnstileを再検証せず、通知だけやり直す
  const retry = setup();
  retry.db = harness.db;
  retry.env.REQUESTS_DB = harness.db;
  const second = await handleIntake(
    { request: intakeRequest(data), env: retry.env },
    retry.fetcher,
  );
  assert.equal(second.status, 200);
  assert.equal(rowOf(harness, data.requestId).intake_status, "sent");
  assert.equal(retry.sent.length, 1);
});

// ------------------------------------------------------------ 対応

/** 受付を1件通して、対応リンクの署名を返す。 */
async function seed(harness, overrides) {
  const data = payload(overrides);
  const result = await intake(harness, data);
  assert.equal(result.status, 200, JSON.stringify(result.body));
  harness.sent.length = 0;
  return {
    id: data.requestId,
    token: await createActionToken(ADMIN_SECRET, data.requestId, Date.now() + DEFAULT_TTL_MS),
  };
}

test("対応：署名付きリンクでその1件だけ読める", async () => {
  const harness = setup();
  const one = await seed(harness);
  const other = await seed(harness, { requesterName: "金城" });

  const ok = await admin(harness, one.id, one.token);
  assert.equal(ok.status, 200);
  assert.equal(ok.body.record.requesterName, "比嘉");
  assert.equal(ok.body.record.status, "open");

  // 別件のトークンでは開けない
  assert.equal((await admin(harness, other.id, one.token)).status, 401);
  assert.equal((await admin(harness, one.id, "")).status, 401);
  assert.equal((await admin(harness, one.id, "wrong-token")).status, 401);
  // 閲覧トークンならどの件でも開ける
  assert.equal((await admin(harness, other.id, ADMIN_TOKEN)).status, 200);
});

test("対応：掲載したと知らせると、状態が変わり依頼者へ届く", async () => {
  const harness = setup();
  const { id, token } = await seed(harness);

  const result = await admin(harness, id, token, {
    action: "publish",
    articleUrl: "https://ysk.life/toolbox/#g010",
    message: "同じ型を1年使っています。",
  });
  assert.equal(result.status, 200);
  assert.equal(result.body.status, "published");

  const row = rowOf(harness, id);
  assert.equal(row.status, "published");
  assert.equal(row.reply_status, "sent");
  assert.equal(row.article_url, "https://ysk.life/toolbox/#g010");
  assert.ok(row.replied_at > 0);

  assert.equal(harness.sent.length, 1);
  const mail = harness.sent[0];
  assert.deepEqual(mail.to, ["higa@example.test"]);
  assert.ok(mail.text.includes("https://ysk.life/toolbox/#g010"));
  assert.equal(findAffiliateLink(mail.text), null, "アフィリエイトリンクを含めない");
});

test("対応：メールへアフィリエイトリンクを入れようとすると送信前に止まる", async () => {
  const harness = setup();
  const { id, token } = await seed(harness);

  const asArticle = await admin(harness, id, token, {
    action: "publish",
    articleUrl: "https://amzn.to/4hszTQF",
  });
  assert.equal(asArticle.status, 400);
  assert.ok(asArticle.body.error.includes("アソシエイト運営規約"));

  const inMessage = await admin(harness, id, token, {
    action: "publish",
    articleUrl: "https://ysk.life/toolbox/#g010",
    message: "リンクはこちら https://www.amazon.co.jp/dp/B09LCRNQT4?tag=tamashirotool-22",
  });
  assert.equal(inMessage.status, 400);

  assert.equal(harness.sent.length, 0);
  assert.equal(rowOf(harness, id).status, "open", "止まったときは状態を変えない");
});

test("対応：設定で明示的に許可したときだけAmazonリンクを通す", async () => {
  const harness = setup({ ALLOW_AFFILIATE_LINK_IN_EMAIL: "true" });
  const { id, token } = await seed(harness);
  const result = await admin(harness, id, token, {
    action: "publish",
    articleUrl: "https://amzn.to/4hszTQF",
  });
  assert.equal(result.status, 200);
  assert.equal(harness.sent.length, 1);
});

test("対応：送る前に本文を確認でき、そのときは送信も記録もしない", async () => {
  const harness = setup();
  const { id, token } = await seed(harness);

  const preview = await admin(harness, id, token, {
    action: "publish",
    preview: true,
    articleUrl: "https://ysk.life/toolbox/#g010",
    message: "参考まで。",
  });
  assert.equal(preview.status, 200);
  assert.ok(preview.body.preview.subject.includes("掲載しました"));
  assert.ok(preview.body.preview.text.includes("参考まで。"));
  assert.equal(harness.sent.length, 0);
  assert.equal(rowOf(harness, id).status, "open");

  // 不備があれば下書き確認の時点で分かる
  const bad = await admin(harness, id, token, {
    action: "publish", preview: true, articleUrl: "https://amzn.to/x",
  });
  assert.equal(bad.status, 400);
});

test("対応：見送りは理由を添えて送れる", async () => {
  const harness = setup();
  const { id, token } = await seed(harness);
  const result = await admin(harness, id, token, {
    action: "decline",
    message: "まだ自分で使っていないため、書けることがありません。",
  });
  assert.equal(result.status, 200);
  assert.equal(rowOf(harness, id).status, "declined");
  assert.equal(rowOf(harness, id).article_url, null);
  assert.ok(harness.sent[0].text.includes("まだ自分で使っていないため"));
  assert.equal(findAffiliateLink(harness.sent[0].text), null);
});

test("対応：二度押しは同じ鍵、内容を直して送り直すと別の鍵になる", async () => {
  const harness = setup();
  const { id, token } = await seed(harness);
  const body = {
    action: "publish",
    articleUrl: "https://ysk.life/toolbox/#g010",
    message: "",
  };
  await admin(harness, id, token, body);
  await admin(harness, id, token, body);
  assert.equal(harness.sent[0].idempotencyKey, harness.sent[1].idempotencyKey);

  await admin(harness, id, token, { ...body, articleUrl: "https://note.com/tama_taxlegal/n/x" });
  assert.notEqual(harness.sent[0].idempotencyKey, harness.sent[2].idempotencyKey);
  assert.equal(rowOf(harness, id).article_url, "https://note.com/tama_taxlegal/n/x");
});

test("対応：不正な操作・受付番号・送信元は通さない", async () => {
  const harness = setup();
  const { id, token } = await seed(harness);

  assert.equal((await admin(harness, id, token, { action: "delete" })).status, 400);
  assert.equal(
    (await admin(harness, id, token, { action: "publish", articleUrl: "https://x.jp/", message: "あ".repeat(1001) })).status,
    400,
  );
  assert.equal((await admin(harness, "not-a-uuid", token)).status, 400);
  assert.equal((await admin(harness, crypto.randomUUID(), ADMIN_TOKEN)).status, 404);

  const crossSite = new Request(`${ORIGIN}/api/admin/request?id=${id}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Origin: "https://evil.example" },
    body: JSON.stringify({ action: "decline" }),
  });
  const response = await handleAdminRequest({ request: crossSite, env: harness.env }, harness.fetcher);
  assert.equal(response.status, 403);
  assert.equal(harness.sent.length, 0);
});

test("対応：送信に失敗したら状態を変えず、失敗として残す", async () => {
  const harness = setup();
  const { id, token } = await seed(harness);
  harness.failResend();
  const result = await admin(harness, id, token, {
    action: "publish",
    articleUrl: "https://ysk.life/toolbox/#g010",
  });
  assert.equal(result.status, 503);
  const row = rowOf(harness, id);
  assert.equal(row.status, "open");
  assert.equal(row.reply_status, "failed");
});

// ------------------------------------------------------------ 見える化

test("一覧：閲覧トークンだけが通り、対応リンクでは開けない", async () => {
  const harness = setup();
  const { id, token } = await seed(harness);
  await seed(harness, { requesterName: "金城", requesterEmail: "kinjo@example.test" });
  await admin(harness, id, token, {
    action: "publish",
    articleUrl: "https://ysk.life/toolbox/#g010",
  });

  const list = async (bearer) => {
    const response = await handleAdminList({
      request: new Request(`${ORIGIN}/api/admin/list`, {
        headers: { Authorization: `Bearer ${bearer}`, "CF-Connecting-IP": "192.0.2.9" },
      }),
      env: harness.env,
    });
    return { status: response.status, body: await response.json() };
  };

  assert.equal((await list("")).status, 401);
  assert.equal((await list("wrong")).status, 401);
  // 件単位の対応リンクでは全件を見られない
  assert.equal((await list(token)).status, 401);

  const ok = await list(ADMIN_TOKEN);
  assert.equal(ok.status, 200);
  assert.equal(ok.body.summary.total, 2);
  assert.equal(ok.body.summary.published, 1);
  assert.equal(ok.body.summary.open, 1);
  assert.equal(ok.body.records.length, 2);
  assert.equal(ok.body.summary.byRequester.length, 2);
});

test("公開設定：準備できていない間は受付を開かない", async () => {
  const request = new Request(`${ORIGIN}/api/config`);
  const good = await (await handleConfig({ request, env: setup().env })).json();
  assert.equal(good.ready, true);
  assert.equal(good.turnstileSitekey, "production-sitekey");
  assert.equal(good.toolboxUrl, "https://ysk.life/toolbox/");

  const bad = await (await handleConfig({ request, env: setup({ REQUEST_ADMIN_SECRET: "short" }).env })).json();
  assert.equal(bad.ready, false);
});
