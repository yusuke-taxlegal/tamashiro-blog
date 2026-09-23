-- 道具箱お願い箱：紹介リクエストの受付台帳。
-- 公開の一覧APIは作らない。閲覧は ADMIN_TOKEN を持つダッシュボードのみ。
CREATE TABLE IF NOT EXISTS requests (
  -- クライアントが生成する UUIDv4。再送しても二重登録しないための冪等キー。
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'published', 'declined')),
  -- 依頼者が入力した原文。あとから何を貼られたか追えるように残す。
  submitted_url TEXT NOT NULL,
  -- 正規化後のURL。他人のアソシエイトタグや ref= は除去済み。
  product_url TEXT NOT NULL,
  -- 取り出せたときだけ入る。短縮URLでは NULL。
  asin TEXT,
  product_note TEXT NOT NULL DEFAULT '',
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  intake_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (intake_status IN ('pending', 'sent', 'failed', 'local_test')),
  intake_email_id TEXT,
  -- 掲載した公開ページのURL。アフィリエイトリンクそのものは保存しない。
  article_url TEXT,
  reply_message TEXT NOT NULL DEFAULT '',
  reply_status TEXT
    CHECK (reply_status IS NULL OR reply_status IN ('pending', 'sent', 'failed', 'local_test')),
  reply_email_id TEXT,
  replied_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS requests_created ON requests(created_at);
CREATE INDEX IF NOT EXISTS requests_status ON requests(status, created_at);
CREATE INDEX IF NOT EXISTS requests_requester ON requests(requester_email);

CREATE TABLE IF NOT EXISTS rate_limits (
  bucket TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
