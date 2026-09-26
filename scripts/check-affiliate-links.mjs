/**
 * アフィリエイトリンクの貼り間違いを見つけるチェックスクリプト。
 *
 *   npm run check:affiliate
 *
 * 見ているのは次の3つ。
 *  1. 楽天・Amazonのリンクが「紹介料の出る形」になっているか
 *     （楽天は hb.afl.rakuten.co.jp か a.r10.to、Amazonは amzn.to / link.amazon か tag= 付きURL）
 *  2. そのリンクの <a> タグに rel="sponsored" が付いているか
 *  3. 楽天の商品画像を楽天のサーバーから直接読み込んでいないか
 *     （楽天は画像をダウンロードして自サイトに置く運用にしている）
 *
 * 設定の正本は src/lib/affiliate.ts。この中身を esbuild で読み込んで使う。
 */

import { readFile } from 'node:fs/promises';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';

const root = path.resolve(import.meta.dirname, '..');

/** src/lib/affiliate.ts をその場でJSに変換して読み込む */
async function loadAffiliateConfig() {
	const result = await build({
		entryPoints: [path.join(root, 'src/lib/affiliate.ts')],
		bundle: true,
		format: 'esm',
		platform: 'node',
		write: false,
	});
	const code = Buffer.from(result.outputFiles[0].text).toString('base64');
	return import(`data:text/javascript;base64,${code}`);
}

/** チェック対象のファイルを集める */
function targetFiles() {
	const files = [path.join(root, 'src/components/ToolboxPage.astro')];
	const blogDir = path.join(root, 'src/content/blog');
	for (const name of readdirSync(blogDir)) {
		if (name.endsWith('.md') || name.endsWith('.mdx')) files.push(path.join(blogDir, name));
	}
	return files;
}

/** 販売店に関係するURLかどうか（アフィリエイト形式でないものも拾う） */
const STORE_HOST_PATTERN = /(^|\.)(amazon\.co\.jp|amzn\.to|amzn\.asia|link\.amazon|rakuten\.co\.jp|r10\.to)$/;

/** 買い物ページではないホスト（規約ページ・管理画面など）。出典として貼ってよい */
const NON_SHOPPING_HOSTS = /^(affiliate|associates|developers|webservice)\./;

function isStoreShoppingUrl(url) {
	const host = hostOf(url);
	if (!host) return false;
	return STORE_HOST_PATTERN.test(host) && !NON_SHOPPING_HOSTS.test(host);
}

function hostOf(url) {
	try {
		return new URL(url).hostname.toLowerCase();
	} catch {
		return null;
	}
}

const errors = [];
const warnings = [];

function report(list, file, line, message, url) {
	list.push(`${path.relative(root, file)}:${line}  ${message}\n    ${url}`);
}

function lineOf(text, index) {
	return text.slice(0, index).split('\n').length;
}

const { isTrackedAffiliateLink, stores } = await loadAffiliateConfig();

for (const file of targetFiles()) {
	const text = await readFile(file, 'utf8');
	const reported = new Set();

	// 1 + 2. <a> タグを見る
	for (const match of text.matchAll(/<a\s[^>]*href=["']([^"']+)["'][^>]*>/gi)) {
		const [tag, href] = match;
		if (!isStoreShoppingUrl(href)) continue;
		const line = lineOf(text, match.index);
		const rel = /rel=["']([^"']*)["']/i.exec(tag)?.[1] ?? '';
		const isBuyLink = rel.split(/\s+/).includes('sponsored');

		reported.add(`${line}:${href}`);

		if (!isTrackedAffiliateLink(href)) {
			report(
				isBuyLink ? errors : warnings,
				file,
				line,
				isBuyLink
					? '購入リンクですが紹介料が出ない形です。管理画面で作ったアフィリエイトリンクに差し替えてください。'
					: '販売ページへのリンクですが紹介料は出ません（出典として貼っているなら問題ありません）。',
				href,
			);
		}
		if (!isBuyLink && isTrackedAffiliateLink(href)) {
			report(errors, file, line, 'アフィリエイトリンクに rel="sponsored noopener noreferrer" が付いていません。', href);
		}
	}

	// 1. データとして書かれたURL（道具箱の url: など）
	for (const match of text.matchAll(/https?:\/\/[^\s"'<>)]+/g)) {
		const href = match[0];
		if (!isStoreShoppingUrl(href)) continue;
		// 画像URLは次のチェックで扱う
		if (/\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(href)) continue;
		if (isTrackedAffiliateLink(href)) continue;
		const line = lineOf(text, match.index);
		if (reported.has(`${line}:${href}`)) continue;
		// 道具箱の url: は購入導線なのでエラー。記事本文の素のURLは出典の可能性があるので注意どまり
		const isToolboxData = file.endsWith('.astro');
		report(
			isToolboxData ? errors : warnings,
			file,
			line,
			isToolboxData
				? '購入導線のURLですが紹介料が出ない形です。管理画面で作ったアフィリエイトリンクに差し替えてください。'
				: '販売ページへのリンクですが紹介料は出ません（出典として貼っているなら問題ありません）。',
			href,
		);
	}

	// 3. 楽天の画像を直接読み込んでいないか
	if (stores.rakuten.imagePolicy === 'download') {
		for (const match of text.matchAll(/https?:\/\/[^\s"'<>)]*image\.rakuten\.co\.jp[^\s"'<>)]*/g)) {
			report(
				warnings,
				file,
				lineOf(text, match.index),
				'楽天の画像を楽天のサーバーから直接読み込んでいます。画像はダウンロードして自サイトに置いてください。',
				match[0],
			);
		}
	}
}

for (const warning of warnings) console.warn(`[warn] ${warning}`);
for (const error of errors) console.error(`[error] ${error}`);

if (errors.length > 0) {
	console.error(`\nアフィリエイトリンクの問題が ${errors.length} 件あります。`);
	process.exit(1);
}

console.log(
	`アフィリエイトリンクのチェックは問題なしです。${warnings.length > 0 ? `（注意 ${warnings.length} 件）` : ''}`,
);
