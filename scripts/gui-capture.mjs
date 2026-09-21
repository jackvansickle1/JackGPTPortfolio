import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const phase = process.argv[2] || 'after';
if (!['before', 'after'].includes(phase)) throw new Error('Expected before or after');
const output = new URL(`../gui-evidence/${phase}/`, import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = [];
try {
  for (const [name, width, height] of [['mobile', 390, 844], ['tablet', 768, 1024], ['desktop', 1365, 820]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('**/api/status/summary', (route) => route.fulfill({ json: { services: [
      { key: 'openwebui', status: 'online', checkedAt: new Date().toISOString(), latencyMs: 42, httpStatus: 200, description: 'Workspace reachable.' },
    ] } }));
    await page.route('**/api/companion', (route) => route.fulfill({ json: {
      answer: 'Market Desk is a public portfolio demo.', dependencies: { ollama: { status: 'offline' } },
    } }));
    const capture = async (label) => page.screenshot({ path: fileURLToPath(new URL(`${name}-${label}.png`, output)), animations: 'disabled' });
    await page.goto('http://127.0.0.1:5196/');
    await page.evaluate(() => Promise.all([...document.images].filter((image) => image.loading !== 'lazy').map((image) => image.decode().catch(() => {}))));
    await capture('home');
    for (const section of ['projects', 'live-services', 'status']) {
      await page.locator(`#${section}`).evaluate((element) => window.scrollTo({ top: element.offsetTop - 120, behavior: 'instant' }));
      await page.waitForTimeout(800);
      await capture(section);
      if (phase === 'after' && section === 'projects') {
        await page.getByRole('button', { name: 'List view', exact: true }).click();
        await page.waitForTimeout(400);
        await capture('project-list');
        await page.getByRole('button', { name: 'Grid view', exact: true }).click();
      }
    }
    await page.getByRole('button', { name: 'Open contact information' }).click();
    await capture('contact');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Open JackGPT recruiter guide' }).click();
    await capture('guide');
    await page.keyboard.press('Escape');
    await page.goto('http://127.0.0.1:5196/#/hire/spreadsheet-rescue');
    await page.getByRole('heading', { name: 'Clean the CSV. Keep the evidence.' }).waitFor();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await capture('service');
    report.push({ name, width, height, errors, overflow: await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth) });
    await page.close();
  }
} finally {
  await browser.close();
}
await writeFile(new URL('report.json', output), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report));
