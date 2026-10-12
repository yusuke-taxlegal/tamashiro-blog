import { loadDefaultJapaneseParser } from 'budoux';

const parser = loadDefaultJapaneseParser();

// これより長い文節は、大きな見出しの1行に入りきらないことがある。
const LONG_PHRASE_LENGTH = 9;

// 日本語の文を、改行してよい切れ目ごとのかたまりに分ける。
// 大きな見出しが「しな／い」のように言葉の途中で改行されないよう、かたまりの間でだけ折り返させるために使う。
// 空白は ' ' のかたまりとして返す（呼び出し側でそのまま文字として出す）。
export function splitPhrases(text: string): string[] {
	const phrases = parser.parse(text);

	// BudouX は「組織としての」を「組織と｜しての」と分けることがあるので、「と」＋「して」はつなぎ直す。
	const merged: string[] = [];
	for (const phrase of phrases) {
		const previous = merged.at(-1);
		if (previous?.endsWith('と') && phrase.startsWith('して')) {
			merged[merged.length - 1] = previous + phrase;
		} else {
			merged.push(phrase);
		}
	}

	return merged.flatMap((phrase) =>
		phrase
			// 製品名の空白（「CIO NovaPort SLIM」）でも折り返せるようにする。
			.split(/( +)/)
			.filter(Boolean)
			.map((part) => (part.trim() === '' ? ' ' : part))
			.flatMap(splitLongPhrase),
	);
}

const wordSegmenter = new Intl.Segmenter('ja', { granularity: 'word' });

// 英字と日本語の境目。かっこや句読点の内側では分けない。
const SCRIPT_BOUNDARY =
	/(?<=[A-Za-z0-9])(?=[^A-Za-z0-9 \-.、。」』）!?！？])|(?<=[^A-Za-z0-9 \-.「『（])(?=[A-Za-z0-9])/g;

// 1行に入らない長い文節を、さらに折り返せる切れ目で分ける。
// 1文字だけが行に残る分け方（「なぜSeminarFlow｜を」）はしない。
function splitLongPhrase(phrase: string): string[] {
	if (phrase.length <= LONG_PHRASE_LENGTH) return [phrase];

	// 英字と日本語の境目（「ChatGPT｜デスクトップ版の」「なぜ｜SeminarFlowを」）
	const boundary = [...phrase.matchAll(SCRIPT_BOUNDARY)]
		.map((match) => match.index)
		.find((index) => index >= 2 && phrase.length - index >= 2);
	if (boundary !== undefined) {
		return [phrase.slice(0, boundary), ...splitLongPhrase(phrase.slice(boundary))];
	}

	// 長いカタカナ語（「フラット｜スパイラル｜ケーブル」）。どれも3文字以上に分かれるときだけ使う
	const words = [...wordSegmenter.segment(phrase)].map((segment) => segment.segment);
	if (words.length > 1 && words.every((word) => word.length >= 3)) return words;

	return [phrase];
}
