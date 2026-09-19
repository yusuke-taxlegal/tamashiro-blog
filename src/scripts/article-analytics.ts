declare global {
 interface Window { gtag?: (...args: unknown[]) => void; }
}
function allowed() {
 try { return ['ysk.life','www.ysk.life'].includes(location.hostname) && localStorage.getItem('ysk-analytics-consent-v1') === 'granted' && Boolean(window.gtag); }
 catch { return false; }
}
const article = location.pathname.match(/^\/blog\/([^/]+)\/?$/)?.[1];
function track(name:string, data:Record<string,unknown>={}) {
 if (!article || !allowed()) return false;
 window.gtag?.('event',name,{article_id:article,...data});return true;
}
window.addEventListener('ysk:reaction',(event:Event)=> {
 const detail=(event as CustomEvent).detail;
 if(detail?.article===article && ['helpful','try'].includes(detail.kind)) track(`article_${detail.kind}`);
});
window.addEventListener('ysk:share',(event:Event)=> {
 const detail=(event as CustomEvent).detail;
 if (detail?.kind==='copy') track('article_link_copy');
 if (detail?.kind==='native') track('article_native_share');
});
document.addEventListener('click',(event)=> {
 const element=event.target instanceof Element?event.target:null;
 const link=element?.closest<HTMLAnchorElement>('a[data-share-network]');
 if(link) track('article_share_click',{method:link.dataset.shareNetwork});
});
// A proxy for reading, not proof: 60 seconds visibly reading the article body and 80% depth.
let activeSeconds=0, maxDepth=0, reported=false;
if(article) {
 const timer=window.setInterval(()=> {
  if(reported) {clearInterval(timer);return;}
  if(!allowed() || document.visibilityState!=='visible' || !document.hasFocus()) return;
  const body=document.querySelector('.prose');if(!body) return;
  const rect=body.getBoundingClientRect();
  if(rect.top<innerHeight && rect.bottom>0) activeSeconds+=1;
  maxDepth=Math.max(maxDepth,Math.min(1,Math.max(0,(innerHeight-rect.top)/rect.height)));
  if(activeSeconds>=60 && maxDepth>=0.8) reported=track('article_qualified_read');
 },1000);
}
export {};
