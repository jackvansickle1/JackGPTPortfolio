import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/api/status/summary', (route) => route.fulfill({ json: { services: [
    { key: 'openwebui', status: 'online', checkedAt: new Date().toISOString(), latencyMs: 42, httpStatus: 200 },
  ] } }));
  await page.route('**/api/companion', (route) => route.fulfill({ status: 503, json: { detail: 'Guide temporarily unavailable' } }));
});

test('all primary routes remain reachable and project navigation clears the sticky header', async ({ page }) => {
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

test('evidence cells stay centered, readable and separate from compact phones to ultrawide', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1365, 1920, 2560]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const geometry = await page.locator('.proof-strip').evaluate((strip) => {
      const box = strip.getBoundingClientRect();
      const intro = document.querySelector('.portfolio-intro').getBoundingClientRect();
      return {
        left: box.left, right: box.right, introLeft: intro.left, introRight: intro.right,
        padding: getComputedStyle(strip).paddingInlineStart,
        cells: [...strip.children].map((cell) => ({
          rect: cell.getBoundingClientRect().toJSON(), client: cell.clientWidth, scroll: cell.scrollWidth,
        })),
      };
    });
    expect(Math.abs(geometry.left - geometry.introLeft)).toBeLessThan(1);
    expect(Math.abs(geometry.right - geometry.introRight)).toBeLessThan(1);
    expect(geometry.padding).toBe('0px');
    for (const cell of geometry.cells) {
      expect(cell.rect.width).toBeGreaterThan(120);
      expect(cell.scroll).toBeLessThanOrEqual(cell.client + 1);
    }
    for (let i = 0; i < geometry.cells.length; i++) {
      for (let j = i + 1; j < geometry.cells.length; j++) {
        const a = geometry.cells[i].rect, b = geometry.cells[j].rect;
        const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        expect(overlapX > 1 && overlapY > 1).toBe(false);
      }
    }
  }
});

test('all seven navigation links fit and remain available after an anchor scroll', async ({ page }) => {
  for (const width of [320, 360, 375, 390, 480, 768, 1100, 1101, 1365]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    const nav = page.locator('.site-nav');
    const links = page.getByRole('navigation', { name: 'Portfolio navigation' }).getByRole('link');
    await expect(links).toHaveCount(7);
    for (const link of await links.all()) {
      const box = await link.boundingBox();
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(clientWidth + 1);
    }
    await page.getByRole('navigation', { name: 'Portfolio navigation' }).getByRole('link', { name: 'Work', exact: true }).click();
    await expect.poll(() => nav.evaluate((el) => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(1);
    const headerBottom = await nav.evaluate((el) => el.getBoundingClientRect().bottom);
    await expect.poll(() => page.locator('#projects').evaluate((el) => el.getBoundingClientRect().top)).toBeGreaterThanOrEqual(headerBottom);
  }
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
    await expect(dialog.locator('.companion-form')).toHaveCSS('flex-direction', 'row');
    const inputBox = await input.boundingBox();
    const sendBox = await dialog.getByRole('button', { name: 'Ask', exact: true }).boundingBox();
    expect(Math.abs(inputBox.y - sendBox.y)).toBeLessThan(2);
    expect(sendBox.x).toBeGreaterThanOrEqual(inputBox.x + inputBox.width - 1);
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
