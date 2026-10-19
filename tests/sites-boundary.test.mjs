import assert from "node:assert/strict";
import { after, test } from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function installedMiniflare() {
  try { return require("miniflare"); } catch { /* Reuse an installed npm-cache runtime without downloading. */ }
  for (const cache of [path.join(homedir(), "AppData/Local/npm-cache/_npx"), path.join(homedir(), ".npm/_npx")]) {
    const entries = await readdir(cache, { withFileTypes: true }).catch(() => []);
    for (const entry of entries.filter((item) => item.isDirectory())) {
      try { return require(path.join(cache, entry.name, "node_modules/miniflare")); } catch { /* Continue through installed caches. */ }
    }
  }
  throw new Error("sites-boundary tests require installed Miniflare (project or existing npm cache); no downloads are performed.");
}

const { Miniflare } = await installedMiniflare();
let outboundCalls = 0;
const runtime = new Miniflare({
  compatibilityDate: "2025-01-01",
  modulesRoot: root,
  modules: await Promise.all(["tests/sites-boundary-worker.mjs", "lib/sites-boundary.js", "functions/api/status/summary.js"].map(async (file) => ({
    type: "ESModule", path: path.join(root, file), contents: await readFile(path.join(root, file), "utf8"),
  }))),
  outboundService: () => { outboundCalls += 1; throw new Error("Real network is forbidden in sites-boundary tests."); },
});
after(async () => { await runtime.dispose(); assert.equal(outboundCalls, 0); });

const SPORTS = '<!doctype html><html data-rally-authenticated="false"><head><title>Rally &mdash; Your game. Your call.</title></head><body><section id="auth-gate" aria-label="Rally account access"><noscript><p>Enable JavaScript to sign in to Rally.</p></noscript></section><div id="sports-app" hidden inert></div></body></html>';
const TRADE = '<!doctype html><html><head><title>Sign in required</title></head><body><h1>Log in to access</h1><a href="/signin-with-chatgpt?return_to=%2F">Continue with ChatGPT</a></body></html>';
const fixtures = { sports: SPORTS, trade: TRADE };
const urls = { sports: "https://sports.jackgpt.org/", trade: "https://trade.jackgpt.org/" };

async function run(fixture) {
  const response = await runtime.dispatchFetch("http://sites-boundary.test/", { method: "POST", body: JSON.stringify(fixture) });
  assert.equal(response.status, 200);
  return response.json();
}

async function probe(key, overrides = {}) {
  const result = await run({ key, body: fixtures[key], ...overrides });
  assert.ok(result.row, JSON.stringify(result));
  const { row, calls } = result;
  assert.equal(row.key, key);
  assert.equal(row.scope, "access boundary");
  assert.equal(row.applicationHealth, "unverified");
  assert.equal(row.autoRepair, false);
  assert.equal(row.repairable, false);
  assert.match(row.description, /application health unverified/);
  if (key === "trade") { assert.match(row.description, /^Private Trade/); assert.equal(row.accessMode, "Private"); }
  assert.doesNotMatch(JSON.stringify(row), /PRIVATE_SENTINEL/);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, urls[key]);
  assert.equal(calls[0].options.method, "GET");
  assert.equal(calls[0].options.redirect, "manual");
  assert.equal(calls[0].options.credentials, "omit");
  assert.equal(calls[0].options.hasSignal, true);
  assert.equal("cache" in calls[0].options, false);
  assert.equal(Object.keys(calls[0].options.headers).some((name) => /authorization|cookie/i.test(name)), false);
  assert.deepEqual(calls[0].options.cf, { cacheTtlByStatus: { "100-599": -1 }, cacheEverything: false });
  return result;
}

test("sites-boundary: exact Ops markers are parsed by the real Cloudflare HTMLRewriter", async () => {
  for (const [key, body] of Object.entries(fixtures)) {
    assert.deepEqual(await run({ op: "match", key, body }), { matches: true });
    const { row } = await probe(key);
    assert.equal(row.status, "online");
    assert.equal(row.httpStatus, key === "sports" ? 200 : 401);
    assert.match(row.description, /public endpoint reachable/);
  }
});

test("sites-boundary: required markers, locked shell, and exact status cannot be substituted", async () => {
  const markers = {
    sports: ["Rally &mdash; Your game. Your call.", 'data-rally-authenticated="false"', 'id="auth-gate"', 'aria-label="Rally account access"', " hidden", " inert", "Enable JavaScript to sign in to Rally."],
    trade: ["Sign in required", "Log in to access", "Continue with ChatGPT", "return_to=%2F"],
  };
  for (const key of Object.keys(fixtures)) {
    for (const marker of markers[key]) {
      assert.equal((await probe(key, { body: fixtures[key].replace(marker, "PRIVATE_SENTINEL") })).row.status, "degraded", `${key}: ${marker}`);
    }
    for (const status of [200, 201, 204, 401, 403, 404, 429, 500, 503, 530]) {
      if (status === (key === "sports" ? 200 : 401)) continue;
      const result = await probe(key, { status });
      assert.equal(result.row.status, "degraded");
      assert.equal(result.reads, 0);
      assert.equal(result.cancels, 1);
    }
  }
});

test("sites-boundary: comments, script/style text, and redirects cannot spoof gate markers", async () => {
  for (const key of Object.keys(fixtures)) {
    for (const body of [`<!-- ${fixtures[key]} -->`, `<script>${fixtures[key]}</script>`, `<style>${fixtures[key]}</style>`, "PRIVATE_SENTINEL"]) {
      assert.equal((await probe(key, { body })).row.status, "degraded");
    }
    for (const markup of ['<base href="https://evil.example/">', '<meta http-equiv="refresh" content="0;url=/data/portfolio.json">']) {
      assert.equal((await probe(key, { body: fixtures[key].replace("<head>", `<head>${markup}`) })).row.status, "degraded");
    }
    for (const status of [301, 302, 303, 307, 308]) {
      const result = await probe(key, { status, headers: { location: "/data/portfolio.json" } });
      assert.equal(result.row.status, "degraded");
      assert.equal(result.reads, 0);
    }
    for (const url of ["", "https://evil.example/", `${urls[key]}api/health`, `${urls[key]}?token=PRIVATE_SENTINEL`]) {
      const result = await probe(key, { url });
      assert.equal(result.row.status, "degraded");
      assert.equal(result.reads, 0);
    }
    assert.equal((await probe(key, { redirected: true })).row.status, "degraded");
  }
});

test("sites-boundary: Trade link is inspected but never traversed and can only return to its root", async () => {
  const original = "/signin-with-chatgpt?return_to=%2F";
  for (const href of [
    "https://evil.example/signin-with-chatgpt?return_to=%2F", "//evil.example/signin-with-chatgpt?return_to=%2F",
    "http://trade.jackgpt.org/signin-with-chatgpt?return_to=%2F", "https://trade.jackgpt.org.evil.example/signin-with-chatgpt?return_to=%2F",
    "https://PRIVATE_SENTINEL@trade.jackgpt.org/signin-with-chatgpt?return_to=%2F", "https://trade.jackgpt.org:444/signin-with-chatgpt?return_to=%2F",
    "/signin-with-chatgpt?return_to=%2Fdata%2Fportfolio.json", "/signin-with-chatgpt?return_to=https%3A%2F%2Fevil.example",
    "/signin-with-chatgpt?return_to=%2F&return_to=%2F", "/signin-with-chatgpt?return_to=%2F&token=PRIVATE_SENTINEL",
    "/signin-with-chatgpt?return_to=%2F#PRIVATE_SENTINEL", "/signin-with-chatgpt", "/api/snapshot?return_to=%2F",
  ]) assert.equal((await probe("trade", { body: TRADE.replace(original, href) })).row.status, "degraded", href);
  assert.equal((await probe("trade", { body: TRADE.replace(original, `https://trade.jackgpt.org${original}`) })).row.status, "online");
});

test("sites-boundary: content type, UTF-8, and decoded 64KiB cap fail closed", async () => {
  for (const key of Object.keys(fixtures)) {
    for (const type of ["application/json", "text/plain", "application/xhtml+xml", ""]) {
      const result = await probe(key, { type });
      assert.equal(result.row.status, "degraded");
      assert.equal(result.reads, 0);
    }
    const result = await probe(key, { chunks: [fixtures[key], "x".repeat(65536), "PRIVATE_SENTINEL"] });
    assert.equal(result.row.status, "degraded");
    assert.match(result.row.description, /size limit/);
    assert.equal(result.reads, 2);
    assert.equal(result.cancels, 1);
    const atLimit = fixtures[key] + " ".repeat(65536 - new TextEncoder().encode(fixtures[key]).byteLength);
    assert.equal((await probe(key, { body: atLimit })).row.status, "online");
    assert.equal((await probe(key, { chunks: [[255, 254]] })).row.status, "degraded");
  }
  const bytes = [...new TextEncoder().encode(SPORTS.replace("&mdash;", "\u2014"))];
  const split = bytes.indexOf(226) + 1;
  assert.equal((await probe("sports", { chunks: [bytes.slice(0, split), bytes.slice(split)] })).row.status, "online");
});

test("sites-boundary: full deadline aborts fetch, body, and validation hangs without leaks", async () => {
  for (const key of Object.keys(fixtures)) {
    for (const hang of ["hangFetch", "hangBody", "hangParse"]) {
      const result = await probe(key, { [hang]: true, deadlineMs: 20 });
      assert.equal(result.row.status, "offline");
      assert.match(result.row.description, /timed out/);
      assert.equal(result.aborted, true);
      if (hang === "hangBody") assert.equal(result.cancels, 1);
    }
    assert.equal((await probe(key, { throw: true })).row.status, "offline");
    const result = await probe(key, { elapsed: 6501 });
    assert.equal(result.row.status, "degraded");
    assert.match(result.row.description, /slowly/);
    assert.equal((await probe(key, { elapsed: 6500 })).row.status, "online");
    const completed = await probe(key, { deadlineMs: 20, waitAfter: 30 });
    assert.equal(completed.row.status, "online");
    assert.equal(completed.aborted, false);
  }
});

test("sites-boundary: arbitrary target keys cannot issue requests", async () => {
  const result = await run({ key: "https://trade.jackgpt.org/data/portfolio.json" });
  assert.equal(result.error, "REJECTED");
  assert.deepEqual(result.calls, []);
});

test("sites-boundary: summary adds only two keys and preserves every legacy probe", async () => {
  const { row, calls } = await run({ op: "summary", sites: { sports: { body: SPORTS }, trade: { body: TRADE } } });
  assert.equal(row.services.length, 16);
  assert.deepEqual(row.services.map(({ key }) => key), ["sports", "trade", "openwebui", "office", "images", "meshcentral", "jackgpt-search", "market-desk", "casino", "kalshi-temperature-bot", "pearl-desk", "moomoo-paper-trader", "salad-compute-node", "minecraft", "website", "external-watchdog"]);
  for (const key of Object.keys(fixtures)) {
    const service = row.services.find((item) => item.key === key);
    assert.equal(service.status, "online");
    assert.equal(service.scope, "access boundary");
    assert.equal(service.applicationHealth, "unverified");
    const request = calls.find(({ url }) => url === urls[key]);
    assert.equal(request.options.method, "GET");
    assert.equal(request.options.redirect, "manual");
  }
  assert.equal(row.services.find(({ key }) => key === "minecraft").status, "maintenance");
  assert.equal(row.services.find(({ key }) => key === "office").status, "online");
  assert.equal(calls.length, 15);
  const expected = [
    ["https://app.jackgpt.org/api/version", "HEAD"], ["https://images.jackgpt.org", "GET"],
    ["https://mesh.jackgpt.org", "HEAD"], ["https://search.jackgpt.org/search?q=openai&categories=general&format=json", "GET"],
    ["https://market.jackgpt.org/health", "HEAD"], ["https://casino.jackgpt.org/health", "HEAD"],
    ["https://kalshi.jackgpt.org/health", "GET"], ["https://pearl.jackgpt.org/health", "GET"],
    ["https://moomoo.jackgpt.org/health", "GET"], ["https://salad.jackgpt.org/health", "GET"],
    ["https://jackgpt.org", "HEAD"], ["https://status.jackgpt.org/health", "GET"],
  ];
  for (const [url, method] of expected) {
    const request = calls.find((call) => call.url === url);
    assert.equal(request.options.method, method);
    assert.equal(request.options.redirect, "follow");
    assert.deepEqual(request.options.cf, { cacheTtl: 20, cacheEverything: true });
  }
});
