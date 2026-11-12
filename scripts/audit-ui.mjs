import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');
const base = 'http://127.0.0.1:4173/JashPortfolio/';
const sitemap = await readFile(new URL('../sitemap.xml', import.meta.url), 'utf8');
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url).pathname.replace('/JashPortfolio/', ''));
paths.push('404.html');
const profiles = [
  { name: 'desktop', viewport: { width: 1440, height: 900 } },
  { name: 'tablet', viewport: { width: 768, height: 1024 } },
  { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
];
const server = spawn(process.execPath, ['scripts/serve.mjs', '--port', '4173'], { stdio: 'ignore' });
let browser;
const failures = [];
let checked = 0;

try {
  let ready = false;
  for (let i = 0; i < 70; i++) {
    try { const response = await fetch(base); if (response.ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  if (!ready) throw new Error('Local portfolio server did not start');
  browser = await chromium.launch({ headless: true });
  for (const profile of profiles) {
    const context = await browser.newContext({ viewport: profile.viewport, isMobile: Boolean(profile.isMobile), hasTouch: Boolean(profile.hasTouch) });
    for (const path of paths) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('response', response => { if (response.status() >= 400) errors.push('HTTP ' + response.status() + ': ' + response.url()); });
      const url = new URL(path, base).toString();
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
      if (!response?.ok()) errors.push('Page returned ' + response?.status());
      const layout = await page.evaluate(() => {
        const style = document.querySelector('link[rel="stylesheet"]');
        const element = document.querySelector('.taskono-feature');
        return {
          cssVersioned: Boolean(style?.href.includes('site.css?v=')),
          cssApplied: getComputedStyle(document.body).fontFamily.includes('Manrope'),
          overflow: Math.round(document.documentElement.scrollWidth - window.innerWidth),
          taskonoGrid: element ? getComputedStyle(element).display === 'grid' : true,
          diagrams: [...document.querySelectorAll('.search-diagram')].map(node => ({
            label: node.className,
            color: getComputedStyle(node).color,
            background: getComputedStyle(node).backgroundColor,
          })),
        };
      });
      if (!layout.cssVersioned || !layout.cssApplied) errors.push('Versioned stylesheet missing or failed to load');
      if (!layout.taskonoGrid) errors.push('TASKONO layout CSS did not apply');
      if (layout.overflow > 2) errors.push('Horizontal page overflow by ' + layout.overflow + 'px');
      await page.addScriptTag({ path: axePath });
      const violations = await page.evaluate(async () => {
        const output = await window.axe.run(document, { runOnly: { type: 'rule', values: ['color-contrast'] } });
        return output.violations.flatMap(item => item.nodes.map(node => ({
          target: node.target.join(', '),
          message: node.failureSummary,
          html: node.html.slice(0, 200),
        })));
      });
      if (violations.length) errors.push(...violations.slice(0, 30).map(v => 'Contrast: ' + v.target + ': ' + v.message + ' [' + v.html + ']'));
      if (errors.length) {
        failures.push({ profile: profile.name, page: path || '/', errors, diagrams: layout.diagrams });
        console.log('FAIL ' + profile.name + ' ' + (path || '/') + ': ' + errors.length + ' issue(s)');
      } else {
        console.log('PASS ' + profile.name + ' ' + (path || '/') + (layout.diagrams.length ? ' [' + layout.diagrams.map(d => d.label + ' ' + d.background).join(', ') + ']' : ''));
      }
      checked += 1;
      await page.close();
    }
    await context.close();
  }
  console.log('Audited ' + checked + ' rendered pages across desktop, tablet, and mobile.');
  if (failures.length) {
    console.error('UI AUDIT FAILURES:\n' + JSON.stringify(failures, null, 2));
    process.exitCode = 1;
  } else {
    console.log('All checked pages passed: readable color contrast, CSS loading, console errors, and horizontal overflow.');
  }
} finally {
  await browser?.close();
  server.kill();
}
