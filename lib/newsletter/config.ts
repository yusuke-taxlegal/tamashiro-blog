// メール登録・配信の設定の正本。表示文言をページやメール本文に直接書かず、ここだけを直す。
export const NEWSLETTER = {
 // 読者への約束。登録フォームと確認メールで同じ言葉を使う。
 title: '玉城祐輔のメールだより',
 promise: '実際に試して残ったものだけ、月1〜2回',
 // 特定電子メール法で表示が必要な送信者情報。
 sender: '玉城祐輔',
 address: '沖縄県中頭郡北谷町字桑江618番地7',
 // 差出人。ysk.life は受信を有効にしていないため、返信先は連絡用のアドレスにする。
 from: '玉城祐輔（ysk.life） <news@ysk.life>',
 replyTo: 'tamashiro@taxlegal.jp',
 site: 'https://ysk.life',
 // 確認メールのリンクの有効時間。
 confirmHours: 72,
} as const;

export const PATHS = {
 signup: '/newsletter/',
 confirmed: '/newsletter/confirmed/',
 unsubscribed: '/newsletter/unsubscribed/',
 expired: '/newsletter/link-expired/',
 confirmApi: '/api/newsletter/confirm',
 unsubscribeApi: '/api/newsletter/unsubscribe',
 subscribeApi: '/api/newsletter/subscribe',
} as const;
