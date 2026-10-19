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
  for (const name of ['Services', 'Work', 'Demo', 'Architecture', 'Hire', 'Writing', 'Notes']) {
    await expect(nav.getByRole('link', { name, exact: true })).toBeInViewport();
  }
  await nav.getByRole('link', { name: 'Work', exact: true }).click();
  const headerBottom = await page.locator('.site-nav').evaluate((element) => element.getBoundingClientRect().bottom);
  await expect.poll(() => page.locator('#projects').evaluate((element) => element.getBoundingClientRect().top)).toBeGreaterThanOrEqual(headerBottom);
  await expect(nav.getByRole('link', { name: 'Work', exact: true })).toHaveAttribute('aria-current', 'location');
  await nav.getByRole('link', { name: 'Hire', exact: true }).click();
  await expect(page).toHaveURL(/\/hire\/$/);
  await expect(page.getByRole('heading', { name: 'Small technical jobs with a visible finish line.' })).toBeVisible();
  await expect(page.getByText('From $29', { exact: true })).toBeVisible();
});

test('grid and list views retain filtering, ordering, image assets and accessible state', async ({ page }, testInfo) => {
  await page.goto('/#projects');
  const cards = page.locator('#project-results .project-card');
  await page.getByRole('button', { name: 'List view', exact: true }).click();
  await expect(page.getByRole('button', { name: 'List view', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(cards).toHaveCount(15);
  await expect(cards.first()).toContainText('JackGPT Market Desk');
  await expect(cards.last()).toHaveClass(/secondary-project/);
  await page.getByRole('combobox', { name: 'Project category' }).selectOption('ai');
  await expect(cards).toHaveCount(3);
  await expect(page.locator('.project-count')).toHaveText('3 of 15 projects');
  await expect(page.locator('.project-list')).toBeVisible();
  await expect(cards.first().locator('img')).toBeVisible();
  await expect.poll(() => cards.first().locator('img').evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
  await page.screenshot({ path: testInfo.outputPath('project-list.png') });
  await page.getByRole('button', { name: 'Grid view', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Grid view', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(cards).toHaveCount(3);
  await page.getByRole('button', { name: 'Clear project filters' }).click();
  await expect(cards).toHaveCount(15);
  await expect(page.getByRole('button', { name: 'Clear project filters' })).toBeDisabled();
});

test('requested viewports retain fit, working navigation, and a visible next section', async ({ page }) => {
  for (const [width, height] of [[390, 844], [768, 1024], [1365, 820]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    const proof = await page.locator('.proof-strip').boundingBox();
    expect(proof.y + 30).toBeLessThan(height);
    const preview = page.locator('.product-preview img').first();
    await expect.poll(() => preview.evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
    await expect(preview.locator('..')).toHaveAttribute('href', '#/project/market-desk');
    await expect(preview).toHaveCSS('object-fit', 'contain');
    await expect(page.locator('.portfolio-home')).toHaveCSS('background-color', 'rgb(10, 14, 20)');
    for (const target of ['.site-nav-inner', '.intro-copy', '.intro-actions']) {
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
    await expect(dialog.locator('a[href^="mailto:jvan8076@gmail.com?subject=Paid%20project%20inquiry"]')).toBeVisible();
    await expect(dialog.locator('a[href^="tel:"]')).toHaveCount(0);
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
  await expect(unknown).toHaveCSS('border-left-color', 'rgb(230, 188, 122)');
  await expect(unknown.locator('.status-pill')).toHaveCSS('border-top-color', 'rgb(104, 83, 54)');
  await expect(online.locator('.metric-box').first()).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.locator('.status-card a[href*="mesh.jackgpt.org"]')).toHaveCount(0);
});
