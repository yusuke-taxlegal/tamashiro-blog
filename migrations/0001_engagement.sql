CREATE TABLE IF NOT EXISTS reactions (
 article TEXT NOT NULL,
 kind TEXT NOT NULL CHECK(kind IN ('helpful','try')),
 visitor_hash TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
 PRIMARY KEY(article,kind,visitor_hash)
);
CREATE INDEX IF NOT EXISTS reactions_recent ON reactions(created_at,article,kind);
CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS ga_daily (
 date TEXT NOT NULL, article TEXT NOT NULL,
 views INTEGER NOT NULL DEFAULT 0,
 qualified_reads INTEGER NOT NULL DEFAULT 0,
 share_clicks INTEGER NOT NULL DEFAULT 0,
 link_copies INTEGER NOT NULL DEFAULT 0,
 native_shares INTEGER NOT NULL DEFAULT 0,
 helpful_events INTEGER NOT NULL DEFAULT 0,
 try_events INTEGER NOT NULL DEFAULT 0,
 PRIMARY KEY(date,article)
);
CREATE TABLE IF NOT EXISTS sync_state (key TEXT PRIMARY KEY, value TEXT NOT NULL);
