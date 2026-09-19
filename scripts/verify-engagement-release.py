from pathlib import Path
import re,json,hashlib,subprocess,concurrent.futures,sys
base=sys.argv[1].rstrip('/');root=Path('/tmp/ysk-engagement-release/dist')
def normalize(s):
 s=re.sub(r'<script\b[^>]*src="https://static.cloudflareinsights.com/[^>]*>\s*</script>','',s)
 s=re.sub(r'<script\b[^>]*src="/cdn-cgi/scripts/[^\"]+/cloudflare-static/email-decode.min.js"[^>]*>\s*</script>','',s)
 def decode(m):
  b=bytes.fromhex(m.group(1));return ''.join(chr(v^b[0]) for v in b[1:])
 s=re.sub(r'<span class="__cf_email__" data-cfemail="([a-f0-9]+)">.*?</span>',decode,s)
 s=re.sub(r'href="/cdn-cgi/l/email-protection#([a-f0-9]+)"',lambda m:'href="mailto:'+decode(m)+'"',s)
 return s
files=[p for p in root.rglob('*') if p.is_file() and p.name not in ['_headers','_routes.json']]
def check(p):
 path='/'+str(p.relative_to(root));path=path[:-10] if path.endswith('index.html') else path
 raw=subprocess.run(['curl','-sSL','--max-time','30','-w','\n%{http_code}',base+path],capture_output=True)
 a=p.read_bytes();b,_,status=raw.stdout.rpartition(b'\n'); valid_status=status==b'200' or (path=='/404.html' and status==b'404')
 equal=(normalize(a.decode())==normalize(b.decode())) if p.suffix=='.html' and raw.returncode==0 else a==b
 return {'path':path,'ok':raw.returncode==0 and valid_status and equal,'bytes':len(b)}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:results=list(pool.map(check,files))
failed=[r for r in results if not r['ok']]
report={'origin':base,'files':len(results),'passed':len(results)-len(failed),'failed':failed}
name='production-readback.json' if base=='https://ysk.life' else 'candidate-readback.json'
Path('logs/engagement-2026-09-19',name).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False));sys.exit(bool(failed))
