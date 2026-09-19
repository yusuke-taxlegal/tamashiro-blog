from pathlib import Path
from html.parser import HTMLParser
import json
class Main(HTMLParser):
 def __init__(self): super().__init__();self.on=False;self.text=[];self.links=[]
 def handle_starttag(self,t,a):
  if t=='main':self.on=True
  if self.on and t=='a':self.links.append(dict(a).get('href'))
 def handle_endtag(self,t):
  if t=='main':self.on=False
 def handle_data(self,d):
  if self.on and d.strip():self.text.append(d.strip())
old=Path(Path('logs/design-2026-09-16/release-path.txt').read_text().strip())/'dist'
new=Path(Path('logs/subpages-2026-09-16/release-path.txt').read_text().strip())/'dist'
targets={'blog/index.html','about/index.html','toolbox/index.html','toolbox/work/index.html','toolbox/home/index.html'}
res=[]
for p in old.rglob('*.html'):
 rel=str(p.relative_to(old));q=new/rel
 if rel in targets:
  a=Main();a.feed(p.read_text());b=Main();b.feed(q.read_text()); row=dict(path=rel,text=a.text==b.text,links=a.links==b.links);assert row['text'] and row['links'],row
 else:
  row=dict(path=rel,unchanged=p.read_bytes()==q.read_bytes());assert row['unchanged'],row
 res.append(row)
assert not (new/'blog/ai-driven-school-completion/index.html').exists()
Path('logs/subpages-2026-09-16/content-preservation.json').write_text(json.dumps(res,indent=2));print('PASS',len(res),'routes; existing page contents and links preserved; unrelated pages byte-identical')
