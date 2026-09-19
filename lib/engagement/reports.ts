import articles from './articles.json';
export async function report(db: D1Database) {
 const results = await db.batch<Record<string,string | number>>([
  db.prepare("SELECT article,SUM(views) AS views,SUM(qualified_reads) AS qualifiedReads,SUM(share_clicks) AS shareClicks,SUM(link_copies) AS linkCopies,SUM(native_shares) AS nativeShares,SUM(helpful_events) AS helpfulEvents,SUM(try_events) AS tryEvents FROM ga_daily WHERE date >= date('now','+9 hours','-30 days') AND date < date('now','+9 hours') GROUP BY article"),
  db.prepare("SELECT article,kind,COUNT(*) AS count FROM reactions WHERE created_at >= strftime('%Y-%m-%dT%H:%M:%SZ','now','+9 hours','start of day','-30 days','-9 hours') AND created_at < strftime('%Y-%m-%dT%H:%M:%SZ','now','+9 hours','start of day','-9 hours') GROUP BY article,kind"),
  db.prepare('SELECT key,value FROM sync_state'),
 ]);
 const rows = articles.map(article=>({article,views:0,qualifiedReads:0,shareClicks:0,linkCopies:0,nativeShares:0,helpfulEvents:0,tryEvents:0,helpful:0,try:0}));
 for (const result of results[0].results) { const row = rows.find(r=>r.article===result.article); if(row) Object.assign(row,result); }
 for (const result of results[1].results) { const row=rows.find(r=>r.article===result.article); if(row && (result.kind==='helpful'||result.kind==='try')) row[result.kind]=Number(result.count); }
 const state=Object.fromEntries(results[2].results.map(r=>[String(r.key),String(r.value)]));
 const fresh=Boolean(state.last_success && Date.now()-Date.parse(state.last_success)<72*3600000);
 return {rows,state,fresh};
}
export async function publicReport(db: D1Database) {
 const {rows,state,fresh}=await report(db);
 return {updatedAt:state.last_success || null,period:'last_30_complete_days',timezone:'Asia/Tokyo',
  popular:fresh ? rows.filter(r=>r.views>=5).sort((a,b)=>b.views-a.views || a.article.localeCompare(b.article)).slice(0,3).map(r=>({article:r.article,views:r.views})) : [],
  helpful:fresh ? rows.filter(r=>r.helpful>=3 && r.views>=20).sort((a,b)=>b.helpful-a.helpful || b.views-a.views || a.article.localeCompare(b.article)).slice(0,3).map(r=>({article:r.article,count:r.helpful})) : [],
 };
}
