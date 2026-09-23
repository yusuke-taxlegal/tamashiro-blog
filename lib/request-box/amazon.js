// Amazon商品URLの正規化とASIN抽出。
//
// 依頼者は「アプリの共有ボタンで出てきたURL」をそのまま貼る。そこには
// 他人のアソシエイトタグ（tag=）や追跡パラメータが混ざっていることがある。
// 受け取った時点で落としきり、保存も表示も正規化後のURLだけを使う。

// 完全一致で許可するホスト。
const EXACT_HOSTS = new Set([
  "amazon.co.jp",
  "www.amazon.co.jp",
  "m.amazon.co.jp",
  "smile.amazon.co.jp",
  // Amazonアプリの共有で出る短縮URL
  "amzn.asia",
  // アソシエイトが作る短縮URL（他人のタグが載っている可能性がある）
  "amzn.to",
]);

// amzn.to は誰かのアソシエイトリンクなので、そのまま流用しない。
const SHORTENERS = new Set(["amzn.asia", "amzn.to"]);
const ASSOCIATE_SHORTENERS = new Set(["amzn.to"]);

// /dp/B0XXXXXXXX のようにASINが載っているパス。
const ASIN_IN_PATH =
  /\/(?:dp|gp\/product|gp\/aw\/d|gp\/offer-listing|product|exec\/obidos\/asin)\/([A-Z0-9]{10})(?=[/?#]|$)/i;

const isAmazonHost = (host) =>
  EXACT_HOSTS.has(host) || host.endsWith(".amazon.co.jp");

/**
 * @returns {{ok: true, value: {productUrl: string, asin: string|null, shortened: boolean, carriedForeignTag: boolean}}
 *          | {ok: false, reason: string}}
 */
export function normalizeAmazonUrl(input) {
  if (typeof input !== "string") return { ok: false, reason: "empty" };
  // 全角で貼られることがあるので先に半角へ寄せる。制御文字は弾く。
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

  if (url.protocol !== "https:" && url.protocol !== "http:")
    return { ok: false, reason: "scheme" };
  // user:pass@host やポート指定は正規の商品URLでは出てこない。
  if (url.username || url.password || url.port)
    return { ok: false, reason: "malformed" };

  const host = url.hostname.toLowerCase();
  if (!isAmazonHost(host)) return { ok: false, reason: "not_amazon" };

  const carriedForeignTag =
    url.searchParams.has("tag") || ASSOCIATE_SHORTENERS.has(host);

  if (SHORTENERS.has(host)) {
    // 短縮URLは展開しないと商品が分からない。パスだけ残してクエリは捨てる。
    const path = url.pathname.replace(/\/+$/, "");
    if (!path || path === "/") return { ok: false, reason: "malformed" };
    return {
      ok: true,
      value: {
        productUrl: `https://${host}${path}`,
        asin: null,
        shortened: true,
        carriedForeignTag,
      },
    };
  }

  const matched = ASIN_IN_PATH.exec(url.pathname);
  const asin = matched ? matched[1].toUpperCase() : null;
  if (!asin) return { ok: false, reason: "no_asin" };

  // 商品名やref=を落とし、正規形に揃える。クエリとフラグメントは全部捨てる。
  return {
    ok: true,
    value: {
      productUrl: `https://www.amazon.co.jp/dp/${asin}`,
      asin,
      shortened: false,
      carriedForeignTag,
    },
  };
}

export const URL_ERRORS = {
  empty: "Amazonの商品URLを入力してください。",
  too_long: "URLが長すぎます。商品ページのURLをそのまま貼ってください。",
  malformed: "URLとして読み取れませんでした。もう一度貼り直してください。",
  scheme: "http または https のURLを貼ってください。",
  not_amazon:
    "Amazon.co.jp の商品URLだけ受け付けています（amzn.asia の共有リンクも使えます）。",
  no_asin:
    "商品ページのURLか判断できませんでした。検索結果やカートではなく、商品ページを開いて共有したURLを貼ってください。",
};
