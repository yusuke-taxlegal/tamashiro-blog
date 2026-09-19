"""Exercise real Cloudflare preview SQL/API. Never writes to production."""
from pathlib import Path
import subprocess,tempfile,json,sys,urllib.parse
base=sys.argv[1].rstrip('/') if len(sys.argv)>1 else 'https://engagement-preview.tamashiro-blog.pages.dev'
if urllib.parse.urlparse(base).hostname not in ['localhost','engagement-preview.tamashiro-blog.pages.dev']: raise SystemExit('Only explicit preview/local URLs allowed')
secrets=dict(v.split('=',1) for v in Path('.dev.vars.preview' if 'pages.dev' in base else '.dev.vars').read_text().splitlines() if v)
results=[]
with tempfile.TemporaryDirectory(prefix='ysk-preview-test-') as tmp:
 jar=Path(tmp)/'cookie';jar.touch(mode=0o600)
 def request(path,method='GET',body=None,origin=None,cookies=True):
  cmd=['curl','--silent','--show-error','--max-time','30','-w','\n%{http_code}','-X',method,base+path]
  if cookies:cmd+=['-b',str(jar),'-c',str(jar)]
  if method!='GET':cmd+=['-H','Origin: '+(origin or base),'-H','Content-Type: application/json']
  if body is not None:cmd+=['--data-binary','@-']
  r=subprocess.run(cmd,input=json.dumps(body) if body is not None else None,capture_output=True,text=True,check=True)
  text,status=r.stdout.rsplit('\n',1)
  try:parsed=json.loads(text)
  except:parsed={'unexpected_body':text[:80]}
  return int(status),parsed
 def check(name,condition):
  results.append({'test':name,'passed':bool(condition)})
  if not condition: raise AssertionError(name)
 status,data=request('/api/engagement?article=chatgpt-business-nyumon');check('GET counts',status==200 and 'counts' in data)
 before=data['counts']['helpful']
 status,data=request('/api/engagement','POST',{'article':'chatgpt-business-nyumon','kind':'helpful'});check('first vote committed',status==200 and data.get('created') is True and data['counts']['helpful']==before+1)
 status,data=request('/api/engagement','POST',{'article':'chatgpt-business-nyumon','kind':'helpful'});check('retry idempotent',status==200 and data.get('created') is False and data['counts']['helpful']==before+1)
 status,data=request('/api/engagement?article=chatgpt-business-nyumon');check('readback cookie',status==200 and data['reacted']['helpful'])
 status,data=request('/api/engagement','POST',{'article':'chatgpt-business-nyumon','kind':'try'},origin='https://evil.example');check('CSRF rejected',status==403)
 status,data=request('/api/engagement','POST',{'article':'ai-driven-school-completion','kind':'try'});check('unpublished rejected',status==404)
 status,data=request('/api/admin',cookies=False);check('private report protected',status==401)
 status,data=request('/api/admin','POST',{'token':'wrong'});check('wrong key rejected',status==401)
 status,data=request('/api/admin','POST',{'token':secrets['ADMIN_TOKEN']});check('admin login',status==200)
 status,data=request('/api/admin');check('private report readback',status==200 and len(data.get('rows',[]))==14)
 status,data=request('/api/admin','POST',{'action':'sync'});check('unconnected GA explicit status',status==503 and data.get('status')=='awaiting_ga4_connection')
 status,data=request('/api/popular');check('no fabricated ranking',status==200 and data['popular']==[] and data['helpful']==[])
 status,data=request('/api/admin','DELETE');check('logout',status==200)
 status,data=request('/api/admin');check('session removed',status==401)
print(json.dumps(results,ensure_ascii=False,indent=2))
Path('logs/engagement-2026-09-19/preview-api.json').write_text(json.dumps(results,indent=2)+'\n')
