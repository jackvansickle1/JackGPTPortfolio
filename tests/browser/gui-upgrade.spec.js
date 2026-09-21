import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/api/status/summary', (route) => route.fulfill({ json: { services: [
    { key: 'openwebui', status: 'online', checkedAt: new Date().toISOString(), latencyMs: 42, httpStatus: 200 },
  ] } }));
  await page.route('**/api/companion', (route) => route.fulfill({ status: 503, json: { detail: 'Guide temporarily unavailable' } }));
});

test('all primary routes remain reachable and project navigation clears the fixed header', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Portfolio navigation' });
  for (const name of ['Work', 'Demo', 'Architecture', 'Hire', 'Notes']) {
    await expect(nav.getByRole('link', { name, exact: true })).toBeInViewport();
  }
  await nav.getByRole('link', { name: 'Work', exact: true }).click();
  const headerBottom = await page.locator('.site-nav').evaluate((element) => element.getBoundingClientRect().bottom);
  await expect.poll(() => page.locator('#projects').evaluate((element) => element.getBoundingClientRect().top)).toBeGreaterThanOrEqual(headerBottom);
  await expect(nav.getByRole('link', { name: 'Work', exact: true })).toHaveAttribute('aria-current', 'location');
  await nav.getByRole('link', { name: 'Hire', exact: true }).click();
  await expect(page).toHaveURL(/#\/hire\/spreadsheet-rescue$/);
  await expect(page.getByText('$29', { exact: true })).toBeVisible();
});

test('grid and list views retain filtering, ordering, image assets and accessible state', async ({ page }, testInfo) => {
  await page.goto('/#projects');
  const cards = page.locator('#project-results .project-card');
  await page.getByRole('button', { name: 'List view', exact: true }).click();
  await expect(page.getByRole('button', { name: 'List view', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(cards).toHaveCount(13);
  await expect(cards.first()).toContainText('JackGPT Market Desk');
  await expect(cards.last()).toHaveClass(/secondary-project/);
  await page.getByRole('combobox', { name: 'Project category' }).selectOption('ai');
  await expect(cards).toHaveCount(3);
  await expect(page.locator('.project-count')).toHaveText('3 of 13 projects');
  await expect(page.locator('.project-list')).toBeVisible();
  await expect(cards.first().locator('img')).toBeVisible();
  await expect.poll(() => cards.first().locator('img').evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
  await page.screenshot({ path: testInfo.outputPath('project-list.png') });
  await page.getByRole('button', { name: 'Grid view', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Grid view', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(cards).toHaveCount(3);
  await page.getByRole('button', { name: 'Clear project filters' }).click();
  await expect(cards).toHaveCount(13);
  await expect(page.getByRole('button', { name: 'Clear project filters' })).toBeDisabled();
});

test('requested viewports retain fit, working navigation, and a visible next section', async ({ page }) => {
  for (const [width, height] of [[390, 844], [768, 1024], [1365, 820]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    const proof = await page.locator('.proof-strip').boundingBox();
    expect(proof.y + 30).toBeLessThan(height);
    const backdrop = page.locator('.hero .hero-preview-main img');
    await expect.poll(() => backdrop.evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
    await expect(backdrop.locator('..')).toHaveAttribute('href', '#/project/market-desk');
    const scrim = await page.locator('.hero').evaluate((element) => getComputedStyle(element, '::before').backgroundColor);
    expect(scrim).toBe(width <= 1100 ? 'rgba(16, 17, 18, 0.99)' : 'rgba(16, 17, 18, 0.78)');
    for (const target of ['.site-nav-inner', '.hero-copy', '.hero-actions']) {
      const bounds = await page.locator(target).boundingBox();
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    }
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'List view', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('button', { name: 'Open contact information' }).click();
    const dialog = page.getByRole('dialog', { name: 'Contact Jack VanSickle' });
    expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await expect(dialog.locator('a[href="tel:+18164166618"]')).toBeVisible();
    await page.keyboard.press('Escape');
  }
});

test('guide feedback survives intermediate breakpoints and its icon sends full context', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open JackGPT recruiter guide' }).click();
  const dialog = page.getByRole('dialog', { name: 'JackGPT AI guide' });
  const input = dialog.getByRole('textbox', { name: 'Ask the JackGPT guide a question' });
  await input.fill('Where should I start?');
  const request = page.waitForRequest('**/api/companion');
  await dialog.getByRole('button', { name: 'Ask', exact: true }).click();
  expect((await request).postDataJSON().messages).toHaveLength(2);
  for (const width of [700, 701, 760, 761]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(dialog.locator('.status-pill')).toHaveText('Unavailable');
    await expect(dialog.locator('.status-pill')).toBeVisible();
    await expect(dialog.locator('.companion-title p')).toBeVisible();
    await expect(dialog.locator('.companion-title p')).toHaveText('Guide temporarily unavailable');
    expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await expect(dialog.getByRole('button', { name: 'Close JackGPT guide' })).toBeInViewport();
  }
});

test('status rows retain measurements and amber unknown states without nested metric boxes', async ({ page }) => {
  await page.goto('/');
  const online = page.locator('.status-card').filter({ has: page.getByRole('heading', { name: 'JackGPT AI Workspace', exact: true }) });
  const unknown = page.locator('.status-card').filter({ has: page.getByRole('heading', { name: 'JackGPT Image Gen', exact: true }) });
  await expect(online).toContainText('42 ms');
  await expect(online).toHaveAttribute('data-status', 'online');
  await expect(unknown.locator('.status-pill')).toHaveText('Unknown');
  await expect(unknown).toHaveCSS('border-left-color', 'rgb(242, 184, 75)');
  await expect(unknown.locator('.status-pill')).toHaveCSS('border-top-color', 'rgba(242, 184, 75, 0.38)');
  await expect(online.locator('.metric-box').first()).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.locator('.status-card a[href*="mesh.jackgpt.org"]')).toHaveCount(0);
});
