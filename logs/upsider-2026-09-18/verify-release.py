from pathlib import Path
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor
import subprocess, hashlib, json, sys
base, label = sys.argv[1:3]
root = Path(Path('logs/upsider-2026-09-18/release-path.txt').read_text().strip()) / 'dist'
paths = ['/blog/upsider-staff-card/', '/', '/blog/', '/about/', '/toolbox/', '/rss.xml', '/sitemap-0.xml']
class Assets(HTMLParser):
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        v = d.get('src') if tag in ('img', 'script') else d.get('href') if tag == 'link' and d.get('rel') == 'stylesheet' else None
        if tag == 'meta' and d.get('property') == 'og:image':
            v = d['content'].replace('https://ysk.life', '')
        if v and v.startswith('/') and (root / v.lstrip('/')).is_file(): paths.append(v)
for p in list(paths):
    if p.endswith('/'): Assets().feed((root / (p.lstrip('/') + 'index.html')).read_text())
def check(p):
    local = root / (p.lstrip('/') + 'index.html' if p.endswith('/') else p.lstrip('/'))
    data = subprocess.check_output(['curl', '-fLsS', '--max-time', '30', base.rstrip('/') + p])
    ok = hashlib.sha256(data).digest() == hashlib.sha256(local.read_bytes()).digest()
    assert ok, p
    return {'path': p, 'bytes': len(data), 'matches': ok}
with ThreadPoolExecutor(max_workers=8) as ex:
    result = list(ex.map(check, list(dict.fromkeys(paths))))
Path('logs/upsider-2026-09-18/' + label + '-readback.json').write_text(json.dumps(result, indent=2))
print(label, len(result), 'HTML/assets match')
