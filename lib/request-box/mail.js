// 通知メールの本文と、メールへアフィリエイトリンクを載せないための検査。
//
// Amazonアソシエイト運営規約は、アソシエイトリンクをメールやオフライン媒体へ
// 掲載することを認めていない（掲載できるのは登録済みの公開媒体だけ）。
// そのため掲載通知メールには「公開ページのURL」だけを書き、Amazonへのリンクは
// 一切載せない。載せようとしたら送信前に止める。

// 素のホスト名で書かれても拾えるようにしている。
const AFFILIATE_HOST =
  /(?:^|[^\w.-])(?:(?:[\w-]+\.)*amazon\.(?:co\.jp|com|co\.uk|de|fr|it|es|ca|com\.au|in|cn|sg)|amzn\.(?:to|asia|eu)|a\.co)(?:$|[^\w-])/i;
// アソシエイトタグ（tamashirotool-22 のような形）。
const ASSOCIATE_TAG = /\btag=[\w.-]+-\d{2}\b/i;

/** メール本文に入れてはいけないものが含まれていれば、その理由を返す。 */
export function findAffiliateLink(text) {
  const value = String(text ?? "");
  if (ASSOCIATE_TAG.test(value)) return "associate_tag";
  if (AFFILIATE_HOST.test(value)) return "amazon_link";
  return null;
}

export const ARTICLE_URL_ERRORS = {
  empty: "掲載したページのURLを入力してください。",
  too_long: "URLが長すぎます。",
  malformed: "URLとして読み取れませんでした。",
  scheme: "https のURLを入力してください。",
  local: "外部から開けるURLを入力してください。",
  amazon:
    "ここにはAmazonのリンクではなく、商品を紹介した公開ページのURLを入力してください。メールにアソシエイトリンクを載せることはアソシエイト運営規約で認められていません。",
};

/**
 * 掲載ページのURL。Amazonそのものは既定で受け付けない。
 * @returns {{ok: true, value: string} | {ok: false, reason: keyof ARTICLE_URL_ERRORS}}
 */
export function validateArticleUrl(input, { allowAffiliate = false } = {}) {
  if (typeof input !== "string") return { ok: false, reason: "empty" };
  const raw = input.normalize("NFKC").trim();
  if (!raw) return { ok: false, reason: "empty" };
  if (raw.length > 2048) return { ok: false, reason: "too_long" };
  if (/[\u0000-\u001f\u007f\s]/.test(raw)) return { ok: false, reason: "malformed" };

  let url;
  try {
    url = new URL(raw);
  } catch {
    return { ok: false, reason: "malformed" };
  }
  if (url.protocol !== "https:") return { ok: false, reason: "scheme" };
  if (url.username || url.password) return { ok: false, reason: "malformed" };

  const host = url.hostname.toLowerCase();
  // 手元でしか開けないURLを配ってしまわないように。
  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    !host.includes(".") ||
    /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host) ||
    host.includes(":")
  )
    return { ok: false, reason: "local" };

  if (!allowAffiliate && findAffiliateLink(url.href))
    return { ok: false, reason: "amazon" };

  return { ok: true, value: url.href };
}

const jst = (timestamp) =>
  new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(timestamp));

const block = (lines) => lines.filter((line) => line !== null).join("\n");

/** 玉城本人あて。この1件に対応するための署名付きリンクを含む。 */
export function buildIntakeEmail({ record, actionUrl }) {
  const warnings = [];
  if (record.carriedForeignTag)
    warnings.push(
      "・貼られたURLに他の人のアソシエイトタグが入っていました。除去して保存しています。リンクは必ず自分で作り直してください。",
    );
  if (!record.asin)
    warnings.push(
      "・短縮URLのため商品を特定できていません。開いて確認してください。",
    );

  return {
    subject: `【道具箱】${record.requesterName}さんから紹介リクエストが届きました`,
    text: block([
      `${record.requesterName}さんから、道具箱への掲載リクエストが届きました。`,
      "",
      "■ リクエストされた商品",
      `URL: ${record.productUrl}`,
      record.asin ? `ASIN: ${record.asin}` : null,
      record.productNote
        ? `ひとこと: ${record.productNote}`
        : "ひとこと: 記載なし",
      "",
      "■ 依頼した人",
      `お名前: ${record.requesterName}`,
      `メール: ${record.requesterEmail}`,
      "",
      "■ 受付",
      `受付番号: ${record.id}`,
      `受付日時: ${jst(record.createdAt)}（JST）`,
      warnings.length ? "" : null,
      warnings.length ? "■ 注意" : null,
      warnings.length ? warnings.join("\n") : null,
      "",
      "■ 対応する（掲載した／今回は見送る）",
      actionUrl,
      "",
      "このリンクはこの1件だけを操作できます。転送しないでください。",
    ]),
  };
}

/**
 * 依頼者あて（掲載できたとき）。Amazonへのリンクは載せない。
 *
 * 依頼者が書いた productNote はここへ入れない。メモにAmazonのURLが混じって
 * いることがあり、そのまま本文へ入れると送信前チェックに引っかかって
 * 「相手のメモのせいで返事が出せない」状態になるため。何の件かは受付番号と
 * 掲載ページで足りる。
 */
export function buildReplyEmail({ record, articleUrl, message }) {
  return {
    subject: "【道具箱】リクエストいただいた商品を掲載しました",
    text: block([
      `${record.requesterName}さん`,
      "",
      "リクエストいただいた商品について、紹介ページを用意しました。",
      "",
      "■ 掲載ページ",
      articleUrl,
      "",
      message ? "■ 玉城から" : null,
      message ? message : null,
      message ? "" : null,
      "■ ご参考",
      `受付番号: ${record.id}`,
      "",
      "――――――",
      "掲載ページには広告（アフィリエイトリンク）が含まれます。",
      "Amazonのアソシエイトとして、玉城祐輔は適格販売により収入を得ています。",
      "購入をお願いするものではありません。必要なときに、必要なものだけどうぞ。",
      "",
      "玉城祐輔の道具箱",
    ]),
  };
}

/** 依頼者あて（今回は載せないとき）。 */
export function buildDeclineEmail({ record, message }) {
  return {
    subject: "【道具箱】リクエストいただいた商品について",
    text: block([
      `${record.requesterName}さん`,
      "",
      "リクエストありがとうございました。",
      "今回は掲載を見送らせてください。",
      "",
      message ? "■ 理由" : null,
      message ? message : null,
      message ? "" : null,
      "道具箱には、自分が実際に使って、良い点も合わない点も書けるものだけを載せています。",
      "使ってみて書けるようになったら、あらためて載せます。",
      "",
      "■ ご参考",
      `受付番号: ${record.id}`,
      "",
      "玉城祐輔の道具箱",
    ]),
  };
}
