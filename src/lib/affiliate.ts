/**
 * アフィリエイト（紹介リンク）の設定をここに集約する。
 *
 * 販売先を増やすときは `stores` に1件足して `enabled` を true にするだけで、
 * 広告表記（ディスクロージャー）の文章とリンク検査の対象がサイト全体に反映される。
 *
 * 用語メモ:
 * - アソシエイトタグ / アフィリエイトID … 「誰の紹介か」を示す文字列。これが無いと成果にならない。
 * - ディスクロージャー … 「これは広告です」と読者に伝える表示。景品表示法のステマ規制で必須。
 */

export type StoreId = 'amazon' | 'rakuten';

export interface StoreConfig {
	/** 画面に出す正式名 */
	name: string;
	/** 短い呼び方。カードのラベルなどで使う */
	shortName: string;
	/** 購入ボタンの既定文言 */
	buttonLabel: string;
	/** 商品枠の下に置く注意書き */
	note: string;
	/** そのストアの正しいアフィリエイトリンクのホスト（この一覧で検査する） */
	linkHosts: string[];
	/**
	 * 商品画像の扱い方。
	 * - 'remote-only' … 提供元のURLを直接参照し、自サイトへ再アップロードしない（Amazon）
	 * - 'download'    … 公式が許可する画像をダウンロードして自サイトに置く（楽天）
	 */
	imagePolicy: 'remote-only' | 'download';
	/** 広告表記に足す一文 */
	disclosureSentence: string;
	/** 契約が済んで実際に使える状態か。未契約のうちは false */
	enabled: boolean;
}

/** Amazonアソシエイトのタグ。リンク末尾の `tag=` がこの値になっているか確認する */
export const AMAZON_ASSOCIATE_TAG = 'tamashirotool-22';

/**
 * 楽天アフィリエイトID。
 * 楽天アフィリエイトの管理画面で ysk.life をサイト登録すると発行される。
 * 記入したら `stores.rakuten.enabled` を true にする。
 * （リンク自体は管理画面からコピーして貼るため、この値は表示と照合のためだけに使う）
 */
export const RAKUTEN_AFFILIATE_ID = '';

export const stores: Record<StoreId, StoreConfig> = {
	amazon: {
		name: 'Amazon.co.jp',
		shortName: 'Amazon',
		buttonLabel: 'Amazon.co.jpで商品を見る',
		note: '広告・アフィリエイトリンクです。価格、在庫、カラー、付属品はAmazonの商品ページでご確認ください。',
		linkHosts: ['amzn.to', 'amazon.co.jp', 'www.amazon.co.jp'],
		imagePolicy: 'remote-only',
		disclosureSentence: 'Amazonのアソシエイトとして、玉城祐輔は適格販売により収入を得ています。',
		enabled: true,
	},
	rakuten: {
		name: '楽天市場',
		shortName: '楽天',
		buttonLabel: '楽天市場で商品を見る',
		note: '広告・アフィリエイトリンクです。価格、在庫、送料、ポイント倍率は楽天市場の商品ページでご確認ください。',
		linkHosts: ['hb.afl.rakuten.co.jp', 'a.r10.to'],
		imagePolicy: 'download',
		disclosureSentence: '楽天アフィリエイトのパートナーとして、玉城祐輔は楽天市場へのリンク経由の売上により紹介料を受け取ることがあります。',
		// 楽天アフィリエイトのサイト登録が完了し、RAKUTEN_AFFILIATE_ID を記入したら true にする
		enabled: false,
	},
};

export const storeIds = Object.keys(stores) as StoreId[];

/** いま実際に使っている販売先だけを返す */
export const enabledStores: StoreConfig[] = storeIds
	.map((id) => stores[id])
	.filter((store) => store.enabled);

/** 道具箱ページ下部などに出す短い広告表記 */
export const disclosureNotice = [
	'このページにはアフィリエイトリンクが含まれます。',
	...enabledStores.map((store) => store.disclosureSentence),
].join('');

/** 「広告・紹介について」ページ用。使っている販売先を並べた一文 */
export const disclosureStoreList = enabledStores.map((store) => store.name).join('、');

/** アフィリエイトリンクとして許可しているホストの一覧 */
export const affiliateHosts = storeIds.flatMap((id) => stores[id].linkHosts);

/** URLからどの販売先のリンクかを判定する。該当しなければ null */
export function affiliateStoreOf(href: string): StoreId | null {
	let host: string;
	try {
		host = new URL(href).hostname.toLowerCase();
	} catch {
		return null;
	}
	return storeIds.find((id) => stores[id].linkHosts.includes(host)) ?? null;
}

/**
 * 紹介料が発生する形のリンクになっているかを確認する。
 * - Amazon: 短縮URL（amzn.to）か、`tag=` にアソシエイトタグが入っている商品URL
 * - 楽天  : 管理画面が発行する hb.afl.rakuten.co.jp か短縮URL（a.r10.to）
 */
export function isTrackedAffiliateLink(href: string): boolean {
	const store = affiliateStoreOf(href);
	if (!store) return false;
	if (store === 'amazon') {
		const url = new URL(href);
		if (url.hostname.toLowerCase() === 'amzn.to') return true;
		return url.searchParams.get('tag') === AMAZON_ASSOCIATE_TAG;
	}
	return true;
}
