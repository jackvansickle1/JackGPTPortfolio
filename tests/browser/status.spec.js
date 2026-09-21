import { test, expect } from "@playwright/test";

test("failed refreshes mark cached checks stale and recover", async ({ page }) => {
  let requests = 0;
  let fail = false;
  await page.clock.install();
  await page.route("**/api/status/summary", async (route) => {
    requests += 1;
    const checkedAt = await page.evaluate(() => new Date().toISOString());
    return route.fulfill(fail ? { status: 503, body: "Unavailable" } : { json: {
      services: [{ key: "openwebui", status: "online", checkedAt, latencyMs: 42, httpStatus: 200, description: "Workspace reachable." }],
    } });
  });
  await page.goto("/");
  const card = page.locator(".status-card").filter({ has: page.getByRole("heading", { name: "JackGPT AI Workspace", exact: true }) });
  await expect(card.locator(".status-pill")).toHaveText("Online");
  fail = true;
  await page.clock.fastForward(61000);
  await expect(card.locator(".status-pill")).toHaveText("Stale");
  await expect(card).toContainText("42 ms");
  await expect(page.locator(".status-footnote")).toContainText("503");
  expect(requests).toBe(2);
  fail = false;
  await page.clock.fastForward(61000);
  await expect(card.locator(".status-pill")).toHaveText("Online");
});

test("hidden and offline pages pause status traffic and refresh on return", async ({ page, context }) => {
  let requests = 0;
  await page.clock.install();
  await page.route("**/api/status/summary", async (route) => {
    requests += 1;
    const checkedAt = await page.evaluate(() => new Date().toISOString());
    return route.fulfill({ json: { services: [{ key: "openwebui", status: "online", checkedAt }] } });
  });
  await page.goto("/");
  await expect.poll(() => requests).toBe(1);
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.fastForward(180000);
  expect(requests).toBe(1);
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect.poll(() => requests).toBe(2);
  await context.setOffline(true);
  await expect(page.locator(".status-footnote")).toContainText(/offline/i);
  await page.clock.fastForward(180000);
  expect(requests).toBe(2);
  await context.setOffline(false);
  await expect.poll(() => requests).toBe(3);
});

test("invalid status JSON is unavailable rather than endless checking or online", async ({ page }) => {
  await page.route("**/api/status/summary", (route) => route.fulfill({ json: { services: [] } }));
  await page.goto("/");
  const card = page.locator(".status-card").filter({ has: page.getByRole("heading", { name: "JackGPT AI Workspace", exact: true }) });
  await expect(card.locator(".status-pill")).toHaveText("Unknown");
  await expect(page.locator(".status-card").filter({ hasText: "Minecraft Server" }).locator(".status-pill")).toHaveText("Paused");
});

test("slow checks time out without overlapping and stop after leaving the homepage", async ({ page }) => {
  let requests = 0;
  await page.clock.install();
  await page.route("**/api/status/summary", () => { requests += 1; });
  await page.goto("/");
  await expect.poll(() => requests).toBe(1);
  await page.clock.fastForward(11000);
  await expect(page.locator(".status-footnote")).toContainText("timed out");
  expect(requests).toBe(1);
  await page.clock.fastForward(61000);
  await expect.poll(() => requests).toBe(2);
  await page.goto("/#/project/jackgpt");
  await page.clock.fastForward(180000);
  expect(requests).toBe(2);
});
