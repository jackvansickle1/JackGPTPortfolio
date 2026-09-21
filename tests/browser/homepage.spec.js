import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/status/summary", (route) => route.fulfill({ json: {
    services: [{ key: "openwebui", status: "online", checkedAt: new Date().toISOString(), latencyMs: 42, httpStatus: 200, description: "Workspace reachable." }],
  } }));
  await page.route("**/api/companion", (route) => route.fulfill({ json: {
    answer: "Market Desk is a public portfolio demo.", dependencies: { ollama: { status: "offline" } },
  } }));
});

test("project discovery and public services retain recruiter priorities", async ({ page }, testInfo) => {
  await page.goto("/");
  const cards = page.locator("#project-results .project-card");
  await expect(cards).toHaveCount(13);
  await expect(cards.first()).toContainText("JackGPT Market Desk");
  await expect(cards.last()).toContainText("JackGPT Casino");
  await page.getByRole("searchbox", { name: "Search projects" }).fill("ollama");
  await expect(cards.filter({ hasText: "JackGPT AI Workspace" })).toHaveCount(1);
  await page.getByRole("combobox", { name: "Project category" }).selectOption("games");
  await expect(page.getByText("No projects match these filters.")).toBeVisible();
  await page.getByRole("button", { name: "Clear project filters" }).click();
  await expect(cards).toHaveCount(13);
  const services = page.locator("#live-services .access-card");
  await expect(services.first()).toContainText("Market Desk");
  await expect(services.last()).toContainText("Casino");
  await expect(page.locator('#live-services a[href*="ops.jackgpt.org"], #live-services a[href*="files.jackgpt.org"], #live-services a[href*="mesh.jackgpt.org"]')).toHaveCount(0);
  await expect(page.locator('a[href="https://ops.jackgpt.org"], a[href="https://mesh.jackgpt.org"]')).toHaveCount(0);
  await expect(cards.filter({ hasText: "Ops Control Room" })).toHaveCount(1);
  await expect(page.locator("#live-services .access-grid")).toHaveCSS("transform", "none");
  await page.locator("#projects").scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("projects.png") });
});

test("case-study screenshot traps focus, closes with Escape, and restores scroll", async ({ page }, testInfo) => {
  await page.goto("/#/project/market-desk");
  const shot = page.locator(".gallery-button").first();
  await shot.scrollIntoViewIfNeeded();
  await shot.focus();
  const previousScroll = await page.evaluate(() => window.scrollY);
  await shot.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Project screenshot" });
  await expect(dialog).toBeVisible();
  const close = page.getByRole("button", { name: "Close screenshot" });
  await expect(close).toBeFocused();
  await close.press("Tab");
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  expect(await page.evaluate(() => document.body.style.position)).toBe("fixed");
  await expect.poll(() => dialog.locator("img").evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
  await page.screenshot({ path: testInfo.outputPath("screenshot-dialog.png") });
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(shot).toBeFocused();
  expect(Math.abs(await page.evaluate(() => window.scrollY) - previousScroll)).toBeLessThan(2);
  expect(await page.evaluate(() => document.body.style.position)).toBe("");
  await expect(shot.locator("img")).toHaveAttribute("loading", "lazy");
});

test("contact details and modal focus survive close", async ({ page }) => {
  await page.goto("/");
  const opener = page.getByRole("button", { name: "Open contact information" });
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "Contact Jack VanSickle" });
  await expect(dialog.locator('a[href="mailto:jackvansickle@mst.edu"]')).toBeVisible();
  await expect(dialog.locator('a[href="tel:+18164166618"]')).toBeVisible();
  await page.keyboard.press("Shift+Tab");
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
});

test("companion preserves full conversation and shows fallback/error status on small screens", async ({ page }, testInfo) => {
  await page.goto("/");
  const launcher = page.getByRole("button", { name: "Open JackGPT AI guide" });
  await launcher.click();
  const dialog = page.getByRole("dialog", { name: "JackGPT AI guide" });
  await expect(page.getByRole("button", { name: "Close JackGPT guide" })).toBeFocused();
  const input = page.getByRole("textbox", { name: "Ask the JackGPT guide a question" });
  await input.fill("Where should I start?");
  const request = page.waitForRequest("**/api/companion");
  await dialog.getByRole("button", { name: "Ask", exact: true }).click();
  expect((await request).postDataJSON().messages).toHaveLength(2);
  await expect(dialog.locator(".status-pill")).toHaveText("Fallback");
  await expect(dialog.locator(".companion-messages")).toContainText("Market Desk is a public portfolio demo.");
  await page.route("**/api/companion", (route) => route.fulfill({ status: 503, json: { detail: "Guide temporarily unavailable" } }));
  await input.fill("And after that?");
  const secondRequest = page.waitForRequest("**/api/companion");
  await dialog.getByRole("button", { name: "Ask", exact: true }).click();
  expect((await secondRequest).postDataJSON().messages).toHaveLength(4);
  await expect(dialog.locator(".status-pill")).toHaveText("Unavailable");
  await expect(dialog.locator(".companion-title p")).toContainText("Guide temporarily unavailable");
  const box = await dialog.getByRole("button", { name: "Ask", exact: true }).boundingBox();
  expect(box.y + box.height).toBeLessThanOrEqual(page.viewportSize().height);
  expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("companion.png") });
  await page.keyboard.press("Escape");
  await expect(launcher).toBeFocused();
});

test("companion controls remain reachable in a keyboard-sized viewport and preserve IME input", async ({ page }) => {
  let requests = 0;
  await page.route("**/api/companion", (route) => { requests += 1; return route.fulfill({ json: { answer: "Test response" } }); });
  await page.goto("/");
  await page.getByRole("button", { name: "Open JackGPT AI guide" }).click();
  await page.setViewportSize({ width: 390, height: 360 });
  const input = page.getByRole("textbox", { name: "Ask the JackGPT guide a question" });
  await input.fill("A composed question");
  await input.dispatchEvent("keydown", { key: "Enter", isComposing: true });
  expect(requests).toBe(0);
  await expect(input).toHaveValue("A composed question");
  const submit = page.getByRole("dialog").getByRole("button", { name: "Ask", exact: true });
  await expect.poll(async () => { const bounds = await submit.boundingBox(); return bounds.y + bounds.height; }).toBeLessThanOrEqual(360);
  await expect(page.getByRole("button", { name: "Close JackGPT guide" })).toBeInViewport();
  await submit.click();
  await expect.poll(() => requests).toBe(1);
  await page.setViewportSize({ width: 320, height: 568 });
  await page.evaluate(() => {
    Object.defineProperty(window.visualViewport, "height", { configurable: true, value: 280 });
    window.visualViewport.dispatchEvent(new Event("resize"));
  });
  await expect.poll(async () => { const bounds = await submit.boundingBox(); return bounds.y + bounds.height; }).toBeLessThanOrEqual(280);
  const conversation = page.getByRole("log", { name: "Guide conversation" });
  expect((await conversation.boundingBox()).height).toBeGreaterThanOrEqual(80);
});
