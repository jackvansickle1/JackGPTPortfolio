import { test, expect } from "@playwright/test";

test("Office appears only in status with its human link and unknown fallback", async ({ page }, testInfo) => {
  await page.route("**/api/status/summary", (route) => route.fulfill({ json: {
    services: [{ key: "openwebui", status: "online", checkedAt: new Date().toISOString() }],
  } }));
  await page.goto("/");
  const card = page.locator("#status .status-card").filter({ has: page.getByRole("heading", { name: "JackGPT Office", exact: true }) });
  await expect(card).toHaveCount(1);
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveCSS("opacity", "1");
  await card.screenshot({ path: testInfo.outputPath("office-status.png") });
  await expect(page.locator("#status").getByRole("heading", { name: "Real-time service status", exact: true })).toBeVisible();
  await expect(page.getByText("JackGPT Office", { exact: true })).toHaveCount(1);
  await expect(page.locator("#projects")).not.toContainText("JackGPT Office");
  await expect(page.locator("#live-services")).not.toContainText("JackGPT Office");
  await expect(page.locator('a[href="https://office.jackgpt.org"]')).toHaveCount(1);
  const link = card.getByRole("link", { name: "office.jackgpt.org", exact: true });
  await expect(link).toHaveAttribute("href", "https://office.jackgpt.org");
  await expect(link).toBeVisible();
  await expect(card.getByText("Access requirements not yet verified.", { exact: true })).toBeVisible();
  await expect(card.locator(".status-pill")).toHaveText("Unknown");
  await expect(card.locator(".status-description")).toContainText("This service was missing from the latest update.");
  await expect(card.locator(".metric-value")).toHaveText(["-", "-", "Waiting for first check"]);
  await expect(card.locator('a[href="https://moomoo.jackgpt.org/office/health"]')).toHaveCount(0);
});

test("Office keeps its private notice and human link through status changes and recovery", async ({ page }) => {
  let status = "online";
  let requests = 0;
  await page.clock.install();
  await page.route("**/api/status/summary", async (route) => {
    requests += 1;
    const checkedAt = await page.evaluate(() => new Date().toISOString());
    return route.fulfill(status === "stale" ? { status: 503, body: "Unavailable" } : { json: {
      services: [{ key: "office", status, checkedAt, latencyMs: 42, httpStatus: status === "online" ? 200 : 503 }],
    } });
  });
  await page.goto("/");
  const card = page.locator("#status .status-card").filter({ has: page.getByRole("heading", { name: "JackGPT Office", exact: true }) });
  await card.scrollIntoViewIfNeeded();
  for (const [index, label] of ["Online", "Degraded", "Offline", "Stale", "Online"].entries()) {
    status = label.toLowerCase();
    if (index > 0) await page.clock.fastForward(61000);
    await expect(card.locator(".status-pill")).toHaveText(label);
    await expect(card).toHaveAttribute("data-status", status);
    await expect(card.getByText("Private; owner sign-in required.", { exact: true })).toBeVisible();
    await expect(card.getByRole("link", { name: "office.jackgpt.org", exact: true })).toHaveAttribute("href", "https://office.jackgpt.org");
    await expect(card.locator(".metric-value").first()).toHaveText("42 ms");
    expect(requests).toBe(index + 1);
    if (status === "stale") {
      await expect(card.locator(".status-description")).toContainText("Previous metrics are not current.");
      await expect(card.locator(".metric-value").nth(1)).toHaveText("503");
    }
  }
});

test("Office ignores malicious endpoint, description, and access metadata from the API", async ({ page }) => {
  const description = '<a href="https://attacker.invalid/office">Public access; no sign-in needed.</a>';
  await page.route("**/api/status/summary", (route) => route.fulfill({ json: {
    services: [{
      key: "office", status: "online", checkedAt: new Date().toISOString(), latencyMs: 42, httpStatus: 200,
      name: "Untrusted Office", endpoint: "https://attacker.invalid/health", publicUrl: "javascript:alert('office')",
      showEndpoint: false, description, accessNote: "Public access; no sign-in needed.",
    }],
  } }));
  await page.goto("/");
  const card = page.locator("#status .status-card").filter({ has: page.getByRole("heading", { name: "JackGPT Office", exact: true }) });
  await card.scrollIntoViewIfNeeded();
  await expect(card.locator(".status-pill")).toHaveText("Online");
  await expect(card.locator(".status-description")).toContainText("The latest check reached this service.");
  await expect(card.getByText("Private; owner sign-in required.", { exact: true })).toBeVisible();
  const link = card.getByRole("link", { name: "office.jackgpt.org", exact: true });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", "https://office.jackgpt.org");
  await expect(card.getByRole("link")).toHaveCount(1);
  await expect(card).not.toContainText("Public access");
  await expect(card).not.toContainText("attacker.invalid");
  await expect(page.getByText("Untrusted Office", { exact: true })).toHaveCount(0);
  await expect(page.locator('a[href^="javascript:"], a[href*="attacker.invalid"]')).toHaveCount(0);
});

test("Office uses a fixed public label only for a verified public mode", async ({ page }) => {
  await page.route("**/api/status/summary", route => route.fulfill({ json: {
    services: [{ key: "office", status: "online", accessMode: "Public", checkedAt: new Date().toISOString(), latencyMs: 42, httpStatus: 200 }],
  } }));
  await page.goto("/");
  const card = page.locator("#status .status-card").filter({ hasText: "JackGPT Office" });
  await expect(card.locator(".status-pill")).toHaveText("Online");
  await expect(card).toContainText("Public; no sign-in required.");
  await expect(card).not.toContainText("owner sign-in required");
  await expect(card.getByRole("link", { name: "office.jackgpt.org", exact: true })).toHaveAttribute("href", "https://office.jackgpt.org");
});

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
