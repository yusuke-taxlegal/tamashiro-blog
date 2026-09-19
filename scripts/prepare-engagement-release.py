"""Overlay the engagement feature onto an audited production snapshot.
Preserves all unrelated deployed HTML/assets and unpublished local work.
Run after npm run build, with /tmp/ysk-engagement-baseline available.
"""
from pathlib import Path
import re,json,shutil,hashlib
ROOT=Path(__file__).resolve().parent.parent
BASE=Path('/tmp/ysk-engagement-baseline')
OUT=Path('/tmp/ysk-engagement-release')
DIST=OUT/'dist'
if not BASE.joinpath('index.html').exists(): raise SystemExit('Missing verified baseline')
OUT.mkdir(exist_ok=True)
shutil.copytree(BASE,DIST,dirs_exist_ok=True)

def section(s,marker):
 start=s.index('<section',s.rfind('<section',0,s.index(marker))+0)
 depth=0
 for m in re.finditer(r'<section\b|</section>',s[start:]):
  depth+= -1 if m.group()=='</section>' else 1
  if depth==0:return s[start:start+m.end()],start,start+m.end()
 raise ValueError('Unclosed section')
def scripts(s):return re.findall(r'<script\b[^>]*>.*?</script>',s,re.S)
def pick(s,marker):
 matches=[v for v in scripts(s) if marker in v]
 if not matches:raise ValueError(marker)
 return matches[0]
article=ROOT.joinpath('dist/blog/upsider-staff-card/index.html').read_text()
analytics=pick(article,"const measurementId =")
events=pick(article,'article_qualified_read')
shares=pick(article,'__yskShareButtonsInitialized')
reactionScript=pick(article,'querySelector(`[data-article-engagement]`)')
home=ROOT.joinpath('dist/index.html').read_text()
popularScript=pick(home,'querySelector(`[data-popular-articles]`)')
popular,_,_=section(home,'data-popular-articles')
# Drop unpublished metadata even from hidden component attributes.
public_ids=sorted(p.parent.name for p in DIST.glob('blog/*/index.html'))
import html
m=re.search(r'data-articles="([^"]*)"',popular)
meta=json.loads(html.unescape(m.group(1)))
meta={k:v for k,v in meta.items() if k in public_ids}
popular=popular[:m.start(1)]+html.escape(json.dumps(meta,ensure_ascii=False),quote=True)+popular[m.end(1):]
css='\n'.join(re.search(r'<style>(.*?)</style>',ROOT.joinpath('src/components/'+name+'.astro').read_text(),re.S).group(1) for name in ['ArticleEngagement','PopularArticles'])
cssName='/_astro/engagement-ui.'+hashlib.sha256(css.encode()).hexdigest()[:12]+'.css'
DIST.joinpath(cssName.lstrip('/')).write_text(css)
changed=[]
for file in DIST.rglob('*.html'):
 old=file.read_text();s=old
 # Remove edge-injected beacon from saved HTML; Pages injects its current version.
 s=re.sub(r'<script\b[^>]*src="https://static.cloudflareinsights.com/[^>]*>\s*</script>','',s)
 for script in scripts(s):
  if 'const measurementId =' in script:s=s.replace(script,analytics)
  elif '__yskShareButtonsInitialized' in script:s=s.replace(script,shares)
 s=s.replace('</head>',events+'</head>',1)
 s=s.replace('data-tooltip="LINEで送る"','data-tooltip="LINEで送る" data-share-network="line"').replace('data-tooltip="Facebookで共有"','data-tooltip="Facebookで共有" data-share-network="facebook"')
 if file.parent.parent.name=='blog':
  built=ROOT.joinpath('dist',file.relative_to(DIST)).read_text()
  reaction,_,_=section(built,'data-article-engagement')
  marker='<div class="article-share article-share-bottom"'
  if marker not in s:raise ValueError('Missing article insertion point '+str(file))
  s=s.replace(marker,reaction+reactionScript+marker,1)
  s=s.replace('</head>',f'<link rel="stylesheet" href="{cssName}"></head>',1)
 if file==DIST/'index.html':
  _,_,end=section(s,'aria-labelledby="recent-heading"')
  s=s[:end]+popular+popularScript+s[end:]
  s=s.replace('</head>',f'<link rel="stylesheet" href="{cssName}"></head>',1)
 if file==DIST/'privacy/index.html':
  text=ROOT.joinpath('dist/privacy/index.html').read_text()
  new=re.search(r'<h2 id="reactions">.*?(?=<h2 id="external-links">)',text,re.S).group()
  s=s.replace('<h2 id="external-links">',new+'<h2 id="external-links">',1).replace('改定 2026年8月21日','改定 2026年9月19日')
 if s!=old:changed.append(str(file.relative_to(DIST)))
 file.write_text(s)
# New admin shell contains no private data. API requires signed login.
admin=ROOT/'dist/admin/engagement/index.html'
DIST.joinpath('admin/engagement').mkdir(parents=True,exist_ok=True)
shutil.copy2(admin,DIST/'admin/engagement/index.html')
for ref in re.findall(r'(?:src|href)="(/_astro/[^"]+)"',admin.read_text()):
 shutil.copy2(ROOT/'dist'/ref.lstrip('/'),DIST/ref.lstrip('/'))
for name in ['_headers','_routes.json']:shutil.copy2(ROOT/'public'/name,DIST/name)
for name in ['functions','lib/engagement','migrations']:shutil.copytree(ROOT/name,OUT/name,dirs_exist_ok=True)
OUT.joinpath('lib/engagement/articles.json').write_text(json.dumps(public_ids,indent=2)+'\n')
config=json.loads(ROOT.joinpath('wrangler.jsonc').read_text());config['$schema']=str(ROOT/'node_modules/wrangler/config-schema.json');OUT.joinpath('wrangler.jsonc').write_text(json.dumps(config,indent=2)+'\n')
# Assert every existing article body is byte-identical (new panel is outside prose).
for file in DIST.glob('blog/*/index.html'):
 before=BASE.joinpath(file.relative_to(DIST)).read_text();after=file.read_text()
 pattern=r'<div class="prose"[^>]*>(.*?)</div>\s*</div>'
 a=re.search(pattern,before,re.S);b=re.search(pattern,after,re.S)
 if not a or not b or a.group(1)!=b.group(1):raise ValueError('Article body changed '+str(file))
report={'baseline':'04d54dfa','public_articles':public_ids,'changed_html':changed,'article_bodies_unchanged':True,'unpublished_excluded':not DIST.joinpath('blog/ai-driven-school-completion/index.html').exists()}
ROOT.joinpath('logs/engagement-2026-09-19/release.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False))
