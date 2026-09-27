import { test, expect } from '@playwright/test';

test('hire hub is crawlable, scoped, and usable across buyer viewports', async ({ page }) => {
  for (const [width, height] of [[390, 844], [768, 1024], [1365, 820]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/hire/');
    await expect(page).toHaveTitle('Hire Jack VanSickle | Fixed-scope technical work');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://jackgpt.org/hire/');
    await expect(page.getByRole('heading', { name: 'Small technical jobs with a visible finish line.' })).toBeVisible();
    await expect(page.getByText('From $29', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'See packages and proof →' })).toHaveAttribute('href', '/hire/spreadsheet-rescue/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('spreadsheet offer exposes only sanctioned proof and a safe intake', async ({ page }) => {
  await page.goto('/hire/spreadsheet-rescue/');
  await expect(page).toHaveTitle('Spreadsheet Rescue | Auditable CSV cleanup');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://jackgpt.org/hire/spreadsheet-rescue/');
  await expect(page.getByText('$29', { exact: true })).toBeVisible();
  for (const href of [
    '/spreadsheet-rescue/work-sample.pdf',
    '/spreadsheet-rescue/demo-source.csv',
    '/spreadsheet-rescue/demo-cleaned.csv',
    '/spreadsheet-rescue/demo-change-report.md',
    '/spreadsheet-rescue/demo-audit.json',
  ]) {
    await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
  }
  await expect(page.locator('a[href*="mailto:jvan8076@gmail.com"]').first()).toBeVisible();
  expect(await page.locator('body').innerText()).not.toContain('github.com/jackvansickle1/spreadsheet-rescue');
});

test('writing hub and articles have canonical metadata and paid-work exits', async ({ page }) => {
  await page.goto('/writing-samples/');
  await expect(page).toHaveTitle('Writing samples | Jack VanSickle');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://jackgpt.org/writing-samples/');
  await expect(page.getByRole('link', { name: 'Read the tutorial →' })).toBeVisible();

  for (const path of [
    '/writing-samples/reliable-fastapi-dependency-testing',
    '/writing-samples/rent-to-own-cost-checklist',
    '/writing-samples/technical-documentation-portfolio',
  ]) {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://jackgpt.org${path}`);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://jackgpt.org${path}`);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('a[href*="mailto:jvan8076@gmail.com"]').first()).toBeVisible();
    await expect(page.locator('a[href="/writing-samples/"]').first()).toBeVisible();
  }
});

test('writing headline fits narrow phones without clipping', async ({ page }) => {
  for (const width of [320, 340, 360, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/writing-samples/');
    const fit = await page.locator('h1').evaluate((heading) => {
      const documentElement = document.documentElement;
      const bounds = heading.getBoundingClientRect();
      return {
        documentFits: documentElement.scrollWidth === documentElement.clientWidth,
        headingFits: heading.scrollWidth <= heading.clientWidth,
        boxFits: bounds.left >= 0 && bounds.right <= innerWidth,
      };
    });
    expect(fit.documentFits, `${width}px document overflow`).toBe(true);
    expect(fit.headingFits, `${width}px headline overflow`).toBe(true);
    expect(fit.boxFits, `${width}px headline box overflow`).toBe(true);
  }
});

test('crawler control files are real text and XML resources', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  expect(robots.headers()['content-type']).toContain('text/plain');
  expect(await robots.text()).toContain('Sitemap: https://jackgpt.org/sitemap.xml');

  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  expect(sitemap.headers()['content-type']).toMatch(/xml/);
  const body = await sitemap.text();
  expect(body).toContain('<loc>https://jackgpt.org/hire/</loc>');
  expect(body).toContain('<loc>https://jackgpt.org/writing-samples/</loc>');
  const locations = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  expect(locations.some((location) => location.endsWith('.html'))).toBe(false);
  for (const location of locations) {
    const { pathname } = new URL(location);
    const response = await request.get(pathname, { maxRedirects: 0 });
    expect(response.status(), `${pathname} should be a direct response`).toBe(200);
  }
});
