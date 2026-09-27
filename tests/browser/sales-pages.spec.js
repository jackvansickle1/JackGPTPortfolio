import { test, expect } from '@playwright/test';

test('hire hub is crawlable, scoped, and usable across buyer viewports', async ({ page }) => {
  for (const [width, height] of [[390, 844], [768, 1024], [1365, 820]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/hire/index.html');
    await expect(page).toHaveTitle('Hire Jack VanSickle | Fixed-scope technical work');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://jackgpt.org/hire/');
    await expect(page.getByRole('heading', { name: 'Small technical jobs with a visible finish line.' })).toBeVisible();
    await expect(page.getByText('From $29', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'See packages and proof →' })).toHaveAttribute('href', '/hire/spreadsheet-rescue/index.html');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('spreadsheet offer exposes only sanctioned proof and a safe intake', async ({ page }) => {
  await page.goto('/hire/spreadsheet-rescue/index.html');
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
  await page.goto('/writing-samples/index.html');
  await expect(page).toHaveTitle('Writing samples | Jack VanSickle');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://jackgpt.org/writing-samples/');
  await expect(page.getByRole('link', { name: 'Read the tutorial →' })).toBeVisible();

  for (const path of [
    '/writing-samples/reliable-fastapi-dependency-testing.html',
    '/writing-samples/rent-to-own-cost-checklist.html',
    '/writing-samples/technical-documentation-portfolio.html',
  ]) {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('a[href*="mailto:jvan8076@gmail.com"]').first()).toBeVisible();
    await expect(page.locator('a[href="/writing-samples/index.html"]').first()).toBeVisible();
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
});
