import { test, expect } from "@playwright/test";

test("the legacy paid-service hash hands bookmarks to the canonical page", async ({ page }) => {
  await page.goto("/#/hire/spreadsheet-rescue");
  await expect(page).toHaveURL(/\/hire\/spreadsheet-rescue\/$/);
  await expect(page).toHaveTitle("Spreadsheet Rescue | Auditable CSV cleanup");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://jackgpt.org/hire/spreadsheet-rescue/",
  );
  await expect(page.getByRole("heading", { name: "Clean the CSV. Keep the evidence." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Request a paid slot" })).toHaveAttribute("href", /^mailto:jvan8076@gmail.com/);
  await expect(page.locator('a[href^="https://venmo.com/"]')).toHaveCount(0);
  await expect(page.locator('a[href^="https://www.paypal.com/"]')).toHaveCount(0);
});

test("all three newer standalone portfolio pages still serve their actual content", async ({ request }) => {
  const pages = [
    ["/writing-samples/rent-to-own-cost-checklist", "The Rent-to-Own Math That Matters"],
    ["/writing-samples/technical-documentation-portfolio", "Technical Documentation Portfolio"],
    ["/design-samples/b2b-content-design.html", "Visual Content Systems"],
  ];
  for (const [path, title] of pages) {
    const response = await request.get(path);
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain(title);
  }
});

test("the production navigation guide restores focus to its own trigger", async ({ page }) => {
  await page.route("**/api/status/summary", (route) => route.fulfill({ json: { services: [] } }));
  await page.goto("/");
  const opener = page.getByRole("button", { name: "Open JackGPT recruiter guide" });
  await opener.click();
  await expect(page.getByRole("dialog", { name: "JackGPT AI guide" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
});
