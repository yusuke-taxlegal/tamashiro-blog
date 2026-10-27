// 使い方: node shot.cjs <名前（.html抜き）> [出力先]
// Chromium で2倍の解像度で撮る（.stage の大きさに合わせる）
const { chromium } = require('playwright');
const path = require('node:path');
(async () => {
  const name = process.argv[2];
  const out = process.argv[3] || `/tmp/claude-desktop-cowork-setup-fig/${name}.png`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 760, height: 800 } });
  await page.goto('file://' + path.resolve(`${name}.html`));
  await page.locator('.stage').screenshot({ path: out });
  await browser.close();
  console.log(out);
})();
