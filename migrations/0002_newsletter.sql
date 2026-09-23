-- メール登録（ダブルオプトイン）。同意の記録として requested_at・confirmed_at・source・consent_ip_hash を残す。
CREATE TABLE IF NOT EXISTS subscribers (
 email TEXT PRIMARY KEY,
 status TEXT NOT NULL CHECK(status IN ('pending','active','unsubscribed')),
 confirm_token TEXT UNIQUE,
 confirm_expires_at INTEGER,
 unsubscribe_token TEXT UNIQUE,
 source TEXT NOT NULL DEFAULT '',
 consent_ip_hash TEXT NOT NULL DEFAULT '',
 requested_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
 confirmed_at TEXT,
 unsubscribed_at TEXT
);
CREATE INDEX IF NOT EXISTS subscribers_status ON subscribers(status,requested_at);
-- 配信履歴。いつ・どの記事を・何件送ったかを残す。
CREATE TABLE IF NOT EXISTS newsletter_sends (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 article TEXT NOT NULL,
 subject TEXT NOT NULL,
 recipients INTEGER NOT NULL DEFAULT 0,
 failed INTEGER NOT NULL DEFAULT 0,
 sent_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
