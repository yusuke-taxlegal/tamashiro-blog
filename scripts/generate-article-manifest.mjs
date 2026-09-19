import { readdir, writeFile } from 'node:fs/promises';
const files = await readdir(new URL('../src/content/blog/', import.meta.url));
const ids = files.filter(f => /\.mdx?$/.test(f)).map(f => f.replace(/\.mdx?$/, '')).sort();
await writeFile(new URL('../lib/engagement/articles.json', import.meta.url), JSON.stringify(ids, null, 2) + '\n');
console.log(`Generated ${ids.length} allowed article IDs`);
