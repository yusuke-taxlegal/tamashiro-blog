from pathlib import Path
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor
import subprocess, json, sys, re

base, label = sys.argv[1:3]
log = Path(__file__).parent
root = Path((log / 'release-path.txt').read_text().strip()) / 'dist'
paths = ['/' + str(p.relative_to(root)).removesuffix('index.html') for p in root.rglob('*.html')]
paths += ['/rss.xml', '/sitemap-0.xml']

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
    exact = data == local.read_bytes()
    if not exact and p == '/privacy/':
        def decode(value):
            raw = bytes.fromhex(value)
            return bytes(v ^ raw[0] for v in raw[1:]).decode()
        html = data.decode()
        html = re.sub(r'/cdn-cgi/l/email-protection#([a-f0-9]+)', lambda m: 'mailto:' + decode(m[1]), html)
        html = re.sub(r'<span class="__cf_email__" data-cfemail="([a-f0-9]+)">.*?</span>', lambda m: decode(m[1]), html)
        html = re.sub(r'<script data-cfasync="false" src="/cdn-cgi/scripts/[^\"]+/cloudflare-static/email-decode.min.js"></script>', '', html)
        assert html.encode() == local.read_bytes(), p
    else:
        assert exact, p
    return {'path': p, 'bytes': len(data), 'matches': True, 'exact': exact, 'normalization': None if exact else 'Cloudflare email protection decoded'}

with ThreadPoolExecutor(max_workers=8) as ex:
    result = list(ex.map(check, list(dict.fromkeys(paths))))
(log / (label + '-readback.json')).write_text(json.dumps(result, indent=2))
print(label, len(result), 'HTML/assets match')
