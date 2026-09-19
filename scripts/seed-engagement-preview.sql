-- Synthetic QA fixture. Apply only to the preview D1 database, never production.
INSERT OR REPLACE INTO ga_daily(date,article,views,qualified_reads,share_clicks,link_copies,native_shares,helpful_events,try_events) VALUES(date('now','+9 hours','-1 day'),'upsider-staff-card',30,8,2,3,1,2,1);
INSERT OR REPLACE INTO sync_state(key,value) VALUES('last_success',strftime('%Y-%m-%dT%H:%M:%SZ','now')),('status','preview_fixture');
INSERT OR IGNORE INTO reactions(article,kind,visitor_hash,created_at) VALUES
('upsider-staff-card','helpful','preview-fixture-1',strftime('%Y-%m-%dT%H:%M:%SZ','now','-1 day')),
('upsider-staff-card','helpful','preview-fixture-2',strftime('%Y-%m-%dT%H:%M:%SZ','now','-1 day')),
('upsider-staff-card','helpful','preview-fixture-3',strftime('%Y-%m-%dT%H:%M:%SZ','now','-1 day'));
