// Скриншоты страниц nml через установленный Chrome (Playwright browser download не нужен).
// Использование: node scripts/shots.mjs <mountDir> [baseUrl]
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const [, , mountDir, baseUrl = 'http://127.0.0.1:8899/nml/'] = process.argv;
const out = '/tmp/nml-shots';
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const pages = process.argv.includes('--all')
  ? ['', 'ingredienty/', 'mify/', 'issledovaniya/', 'protokoly/', 'chego-zhdat/']
  : ['', 'ingredienty/', 'protokoly/'];

const browser = await chromium.launch({ channel: 'chrome' });
const errors = [];

for (const [theme, scheme] of [['light', 'light'], ['dark', 'dark']]) {
  const ctx = await browser.newContext({
    viewport: { width: 1360, height: 1000 },
    deviceScaleFactor: 2,
    colorScheme: scheme,
  });
  for (const p of pages) {
    const page = await ctx.newPage();
    page.on('console', (m) => m.type() === 'error' && errors.push(`${p} console: ${m.text()}`));
    page.on('pageerror', (e) => errors.push(`${p} pageerror: ${e.message}`));
    await page.goto(baseUrl + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    const name = p === '' ? 'home' : p.replace(/\/$/, '');
    await page.screenshot({
      path: path.join(out, `${name}-${theme}.png`),
      fullPage: true,
    });
    // мобильный вариант
    if (p === '') {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(out, `home-mobile-${theme}.png`), fullPage: true });
    }
    await page.close();
  }
  await ctx.close();
}

await browser.close();
console.log('shots ->', out);
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'no console errors');