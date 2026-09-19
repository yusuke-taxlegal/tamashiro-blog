from pathlib import Path
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor
import subprocess,hashlib,json,sys
base=sys.argv[1].rstrip('/');label=sys.argv[2];root=Path(Path('logs/subpages-2026-09-16/release-path.txt').read_text().strip())/'dist'
paths=['/','/blog/','/toolbox/','/toolbox/work/','/toolbox/home/','/about/']
class Assets(HTMLParser):
 def handle_starttag(self,t,a):
  d=dict(a)
  if t in ('img','script','link'):
   v=d.get('src') if t!='link' else d.get('href') if d.get('rel')=='stylesheet' else None
   if v and v.startswith('/') and (root/v.lstrip('/')).is_file(): paths.append(v)
for p in list(paths): Assets().feed((root/(p.lstrip('/')+'index.html')).read_text())
paths=list(dict.fromkeys(paths))
def check(p):
 local=root/(p.lstrip('/')+'index.html' if p.endswith('/') else p.lstrip('/'))
 data=subprocess.check_output(['curl','-fLsS',base+p]);good=hashlib.sha256(data).digest()==hashlib.sha256(local.read_bytes()).digest();assert good,p
 return {'path':p,'bytes':len(data),'matches':good}
with ThreadPoolExecutor(max_workers=8) as ex: result=list(ex.map(check,paths))
Path('logs/subpages-2026-09-16/'+label+'-readback.json').write_text(json.dumps(result,indent=2));print(label, len(result),'HTML/assets match')
