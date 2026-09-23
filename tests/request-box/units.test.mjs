import { test } from "node:test";
import assert from "node:assert/strict";

import { normalizeAmazonUrl } from "../../lib/request-box/amazon.js";
import {
  DEFAULT_TTL_MS,
  createActionToken,
  safeEqual,
  verifyActionToken,
  verifyDashboardToken,
} from "../../lib/request-box/sign.js";
import {
  buildDeclineEmail,
  buildIntakeEmail,
  buildReplyEmail,
  findAffiliateLink,
  validateArticleUrl,
} from "../../lib/request-box/mail.js";
import { summarize } from "../../lib/request-box/requests.js";

const ID = "11111111-2222-4333-8444-555555555555";

// ------------------------------------------------------------ Amazon URL

test("商品URLは /dp/{ASIN} の正規形へ揃う", () => {
  for (const input of [
    "https://www.amazon.co.jp/dp/B09LCRNQT4",
    "https://www.amazon.co.jp/gp/product/B09LCRNQT4?th=1",
    "https://www.amazon.co.jp/gp/aw/d/B09LCRNQT4/",
    "https://www.amazon.co.jp/-/en/dp/B09LCRNQT4",
    "https://amazon.co.jp/exec/obidos/ASIN/B09LCRNQT4",
    "  https://www.amazon.co.jp/dp/b09lcrnqt4  ",
  ]) {
    const result = normalizeAmazonUrl(input);
    assert.equal(result.ok, true, input);
    assert.equal(result.value.productUrl, "https://www.amazon.co.jp/dp/B09LCRNQT4");
    assert.equal(result.value.asin, "B09LCRNQT4");
  }
});

test("他人のアソシエイトタグと追跡パラメータは落とし、印を残す", () => {
  const result = normalizeAmazonUrl(
    "https://www.amazon.co.jp/%E5%95%86%E5%93%81/dp/B09LCRNQT4/ref=sr_1_3?tag=someoneelse-22&keywords=x",
  );
  assert.equal(result.ok, true);
  assert.equal(result.value.productUrl, "https://www.amazon.co.jp/dp/B09LCRNQT4");
  assert.equal(result.value.carriedForeignTag, true);
  assert.ok(!result.value.productUrl.includes("tag="));
  assert.ok(!result.value.productUrl.includes("ref="));
});

test("共有短縮URLは展開せず、amzn.to は他人のリンクとして印を付ける", () => {
  const share = normalizeAmazonUrl("https://amzn.asia/d/abc1234?x=1");
  assert.deepEqual(share.value, {
    productUrl: "https://amzn.asia/d/abc1234",
    asin: null,
    shortened: true,
    carriedForeignTag: false,
  });
  const associate = normalizeAmazonUrl("https://amzn.to/4hszTQF");
  assert.equal(associate.value.carriedForeignTag, true);
  assert.equal(associate.value.asin, null);
});

test("Amazon以外・偽装ホスト・商品ページでないURLは受け付けない", () => {
  const rejected = {
    "https://amazon.co.jp.evil.example/dp/B09LCRNQT4": "not_amazon",
    "https://evil-amazon.co.jp/dp/B09LCRNQT4": "not_amazon",
    "https://rakuten.co.jp/item/1": "not_amazon",
    "https://www.amazon.co.jp/s?k=keyboard": "no_asin",
    "https://www.amazon.co.jp/gp/cart/view.html": "no_asin",
    "javascript:alert(1)": "scheme",
    "https://user:pass@www.amazon.co.jp/dp/B09LCRNQT4": "malformed",
    "https://www.amazon.co.jp:8443/dp/B09LCRNQT4": "malformed",
    "": "empty",
  };
  for (const [input, reason] of Object.entries(rejected)) {
    const result = normalizeAmazonUrl(input);
    assert.equal(result.ok, false, input);
    assert.equal(result.reason, reason, input);
  }
  assert.equal(normalizeAmazonUrl("https://www.amazon.co.jp/dp/" + "B".repeat(3000)).ok, false);
});

// ------------------------------------------------------------ 署名

test("対応リンクの署名は、その1件・その鍵・期限内だけ通る", async () => {
  const secret = "secret-value-for-test-1234567890";
  const token = await createActionToken(secret, ID, Date.now() + DEFAULT_TTL_MS);

  assert.equal(await verifyActionToken(secret, ID, token), true);
  assert.equal(await verifyActionToken(secret, "22222222-2222-4333-8444-555555555555", token), false);
  assert.equal(await verifyActionToken("another-secret-1234567890", ID, token), false);
  assert.equal(await verifyActionToken(secret, ID, token.slice(0, -1) + "A"), false);
  assert.equal(await verifyActionToken(secret, ID, "not-a-token"), false);
  assert.equal(await verifyActionToken(secret, ID, ""), false);
  assert.equal(
    await verifyActionToken(secret, ID, await createActionToken(secret, ID, Date.now() - 1000)),
    false,
  );
});

test("閲覧トークンは長さも中身も一致したときだけ通る", () => {
  const env = { REQUEST_ADMIN_TOKEN: "dashboard-token-value-0123456789" };
  assert.equal(verifyDashboardToken(env, "dashboard-token-value-0123456789"), true);
  assert.equal(verifyDashboardToken(env, "dashboard-token-value-012345678"), false);
  assert.equal(verifyDashboardToken(env, "dashboard-token-value-01234567890"), false);
  assert.equal(verifyDashboardToken(env, ""), false);
  assert.equal(verifyDashboardToken({ REQUEST_ADMIN_TOKEN: "short" }, "short"), false);
  assert.equal(verifyDashboardToken({}, ""), false);
  assert.equal(safeEqual("abc", "abc"), true);
  assert.equal(safeEqual("abc", "abd"), false);
  assert.equal(safeEqual("abc", "abcd"), false);
});

// ------------------------------------------------------------ メール

test("Amazonへのリンクは素のホスト名でも見つける", () => {
  for (const text of [
    "https://amzn.to/4hszTQF",
    "リンクは amzn.to/abc です",
    "https://www.amazon.co.jp/dp/B0X",
    "https://a.co/d/xyz",
    "https://example.com/?tag=tamashirotool-22",
    "https://www.amazon.com/dp/B0X",
  ])
    assert.ok(findAffiliateLink(text), text);

  for (const text of [
    "https://note.com/tama_taxlegal/n/abc",
    "https://ysk.life/toolbox/#g003",
    "amazonの話をしただけで、リンクはありません",
    "",
  ])
    assert.equal(findAffiliateLink(text), null, text);
});

test("掲載ページURLはhttpsの公開URLだけ。Amazonは既定で弾く", () => {
  assert.equal(
    validateArticleUrl("https://ysk.life/toolbox/#g003").value,
    "https://ysk.life/toolbox/#g003",
  );
  const rejected = {
    "https://amzn.to/abc": "amazon",
    "https://www.amazon.co.jp/dp/B0X": "amazon",
    "http://example.com/x": "scheme",
    "https://localhost/x": "local",
    "https://192.168.0.1/x": "local",
    "https://intranet/x": "local",
    "ただの文字列": "malformed",
    "": "empty",
  };
  for (const [input, reason] of Object.entries(rejected))
    assert.equal(validateArticleUrl(input).reason, reason, input);

  // 設定で明示的に許した場合だけ通る
  assert.equal(validateArticleUrl("https://amzn.to/abc", { allowAffiliate: true }).ok, true);
});

test("依頼者へ送るメールにはAmazonへのリンクが入らない", () => {
  const record = {
    id: ID,
    requesterName: "新垣",
    // 依頼者のメモにAmazonのURLが入っていても、返信本文には出さない
    productNote: "これの色違いです https://amzn.to/xyz",
  };
  const reply = buildReplyEmail({
    record,
    articleUrl: "https://ysk.life/toolbox/#g010",
    message: "同じ型を1年使っています。",
  });
  assert.equal(findAffiliateLink(reply.text), null);
  assert.ok(reply.text.includes("https://ysk.life/toolbox/#g010"));
  assert.ok(reply.text.includes("Amazonのアソシエイトとして"));
  assert.ok(reply.text.includes("新垣さん"));

  const decline = buildDeclineEmail({ record, message: "まだ使っていないためです。" });
  assert.equal(findAffiliateLink(decline.text), null);
  assert.ok(decline.text.includes("まだ使っていないためです。"));
});

test("本人あての通知には、商品・依頼者・対応リンクと注意が並ぶ", () => {
  const mail = buildIntakeEmail({
    record: {
      id: ID,
      productUrl: "https://www.amazon.co.jp/dp/B09LCRNQT4",
      asin: null,
      productNote: "",
      requesterName: "比嘉",
      requesterEmail: "higa@example.test",
      carriedForeignTag: true,
      createdAt: Date.parse("2026-09-22T01:30:00Z"),
    },
    actionUrl: "https://box.example.test/admin.html#id=x&t=y",
  });
  assert.ok(mail.subject.includes("比嘉"));
  assert.ok(mail.text.includes("https://box.example.test/admin.html#id=x&t=y"));
  assert.ok(mail.text.includes("他の人のアソシエイトタグ"));
  assert.ok(mail.text.includes("短縮URLのため商品を特定できていません"));
  assert.ok(mail.text.includes("ひとこと: 記載なし"));
  // JSTで表示する（01:30Z = 10:30 JST）
  assert.ok(mail.text.includes("10:30"), mail.text);
});

// ------------------------------------------------------------ 集計

test("集計は状態・人・月でまとまり、メールの大文字小文字は同じ人として扱う", () => {
  const base = Date.parse("2026-09-20T01:00:00Z");
  const summary = summarize([
    { status: "published", requester_email: "A@x.jp", requester_name: "あ", created_at: base, replied_at: base + 7200000 },
    { status: "open", requester_email: "a@x.jp", requester_name: "あ", created_at: base + 86400000, replied_at: null },
    { status: "declined", requester_email: "b@x.jp", requester_name: "い", created_at: Date.parse("2026-08-02T01:00:00Z"), replied_at: null },
    { status: "published", requester_email: "b@x.jp", requester_name: "い", created_at: base, replied_at: base + 3600000 },
  ]);
  assert.equal(summary.total, 4);
  assert.equal(summary.open, 1);
  assert.equal(summary.published, 2);
  assert.equal(summary.declined, 1);
  assert.equal(summary.byRequester.length, 2);
  assert.deepEqual(
    summary.byRequester.map((p) => [p.name, p.total, p.published]),
    [["あ", 2, 1], ["い", 2, 1]],
  );
  assert.deepEqual(summary.byMonth, [
    { month: "2026-08", total: 1, published: 0 },
    { month: "2026-09", total: 3, published: 2 },
  ]);
  // 1時間と2時間 → 中央値は小さい側を採る
  assert.equal(summary.medianLeadTimeHours, 1);
  assert.equal(summarize([]).medianLeadTimeHours, null);
});
