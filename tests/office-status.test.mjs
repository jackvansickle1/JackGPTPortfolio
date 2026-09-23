import assert from "node:assert/strict";
import test from "node:test";
import { onRequestGet } from "../functions/api/status/summary.js";
import { createStatusState, statusStateReducer, STATUS_MAX_AGE_MS } from "../src/status-state.js";

const NOW = Date.parse("2026-09-23T12:00:00.000Z");
const RELAY = "https://moomoo.jackgpt.org/office/health";
const PUBLIC_URL = "https://office.jackgpt.org";
const payload = (changes = {}) => ({
  service: "office",
  status: "online",
  checkedAt: new Date(NOW - 30_000).toISOString(),
  description: "Office is available.",
  ...changes,
});
const jsonResponse = (data, status = 200, contentType = "application/json") => new Response(JSON.stringify(data), {
  status,
  headers: { "content-type": contentType },
});

async function probe(t, response, now = NOW) {
  const calls = [];
  t.mock.method(Date, "now", () => now);
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push({ url, options });
    if (url === RELAY) {
      if (response instanceof Error) throw response;
      return response;
    }
    return jsonResponse({ status: "online", results: [{}] });
  });
  const summaryResponse = await onRequestGet();
  assert.equal(summaryResponse.status, 200);
  const summary = await summaryResponse.json();
  const office = summary.services.filter((service) => service.key === "office");
  assert.equal(office.length, 1);
  assert.equal(office[0].name, "JackGPT Office");
  assert.equal(office[0].publicUrl, PUBLIC_URL);
  assert.equal(office[0].endpoint, RELAY);
  assert.equal(calls.filter(({ url }) => url === RELAY).length, 1);
  assert.equal(calls.some(({ url }) => url.startsWith(PUBLIC_URL)), false);
  return { office: office[0], calls, summary };
}

test("Office checks only the uncached read-only relay without following login redirects", async (t) => {
  const data = payload();
  const { office, calls, summary } = await probe(t, jsonResponse(data));
  assert.equal(office.status, "online");
  assert.equal(office.httpStatus, 200);
  assert.equal(office.checkedAt, data.checkedAt);
  assert.equal(typeof office.latencyMs, "number");
  assert.match(office.description, /Private.*owner sign-in required/);
  const { options } = calls.find(({ url }) => url === RELAY);
  assert.equal(options.method, "GET");
  assert.equal(options.redirect, "error");
  assert.equal(options.cache, "no-store");
  assert.deepEqual(options.cf, { cacheTtl: 0, cacheEverything: false });
  assert.equal(options.headers.accept, "application/json");
  assert.ok(options.signal instanceof AbortSignal);
  assert.equal(Object.keys(options.headers).some((name) => /authorization|cookie/i.test(name)), false);
  const existing = calls.find(({ url }) => url === "https://app.jackgpt.org/api/version");
  assert.equal(existing.options.method, "HEAD");
  assert.equal(existing.options.redirect, "follow");
  assert.equal(summary.services.find(({ key }) => key === "minecraft").status, "maintenance");
});

for (const status of ["degraded", "offline"]) {
  test(`Office preserves a verified ${status} report with HTTP 503`, async (t) => {
    const data = payload({ status });
    const { office } = await probe(t, jsonResponse(data, 503));
    assert.equal(office.status, status);
    assert.equal(office.httpStatus, 503);
    assert.equal(office.checkedAt, data.checkedAt);
  });
}

for (const [label, data] of [
  ["null", null], ["boolean", true], ["number", 1], ["string", "online"], ["array", [payload()]],
  ["missing identity", payload({ service: undefined })],
  ["wrong identity", payload({ service: "moomoo" })],
  ["wrong identity case", payload({ service: "Office" })],
  ["missing state", payload({ status: undefined })],
  ["unknown state", payload({ status: "healthy" })],
  ["wrong state case", payload({ status: "ONLINE" })],
  ["object state", payload({ status: { online: true } })],
  ["missing timestamp", payload({ checkedAt: undefined })],
  ["numeric timestamp", payload({ checkedAt: NOW })],
  ["date-only timestamp", payload({ checkedAt: "2026-09-23" })],
  ["non-ISO timestamp", payload({ checkedAt: "September 23, 2026 12:00:00 GMT" })],
  ["malformed timestamp", payload({ checkedAt: "not-a-date" })],
  ["impossible timestamp", payload({ checkedAt: "2026-09-23T25:00:00Z" })],
  ["future timestamp", payload({ checkedAt: new Date(NOW + 1).toISOString() })],
  ["stale timestamp", payload({ checkedAt: new Date(NOW - 180_001).toISOString() })],
  ["missing description", payload({ description: undefined })],
  ["object description", payload({ description: {} })],
  ["empty description", payload({ description: "   " })],
]) {
  test(`Office fails closed for ${label}`, async (t) => {
    const { office } = await probe(t, jsonResponse(data));
    assert.equal(office.status, "offline");
    assert.match(office.description, /could not be verified/);
  });
}

for (const [label, body, type] of [
  ["HTML login", "<!doctype html><title>Sign in</title>", "text/html"],
  ["HTML posing as JSON", "<!doctype html><title>Sign in</title>", "application/json"],
  ["malformed JSON", '{"service":"office",', "application/json"],
  ["JSON with HTML content type", JSON.stringify(payload()), "text/html"],
]) {
  test(`Office fails closed for ${label}`, async (t) => {
    const { office } = await probe(t, new Response(body, { headers: { "content-type": type } }));
    assert.equal(office.status, "offline");
  });
}

for (const [status, httpStatus] of [["online", 503], ["online", 500], ["online", 201], ["online", 302], ["degraded", 200], ["offline", 200]]) {
  test(`Office rejects mismatched ${status} with HTTP ${httpStatus}`, async (t) => {
    const { office } = await probe(t, jsonResponse(payload({ status }), httpStatus));
    assert.equal(office.status, "offline");
    assert.match(office.description, /could not be verified/);
  });
}

test("Office rejects a redirected response even when the final body looks healthy", async (t) => {
  const response = jsonResponse(payload());
  Object.defineProperty(response, "redirected", { value: true });
  const { office } = await probe(t, response);
  assert.equal(office.status, "offline");
});

test("Office rejects a login redirect without probing the human URL", async (t) => {
  const { office, calls } = await probe(t, new Response(null, {
    status: 302, headers: { location: "https://login.example.invalid/" },
  }));
  assert.equal(office.status, "offline");
  assert.equal(calls.some(({ url }) => url.includes("login.example.invalid")), false);
});

for (const message of ["network failure INTERNAL_TEST_MARKER", "timeout INTERNAL_TEST_MARKER", "redirect disallowed INTERNAL_TEST_MARKER"]) {
  test(`Office fails closed on ${message.split(" ")[0]} errors without forwarding details`, async (t) => {
    const { office } = await probe(t, new Error(message));
    assert.equal(office.status, "offline");
    assert.equal(office.httpStatus, "ERR");
    assert.equal(office.latencyMs, null);
    assert.doesNotMatch(JSON.stringify(office), /INTERNAL_TEST_MARKER/);
  });
}

test("Office accepts at most 180 seconds of age without refreshing its timestamp", async (t) => {
  const checkedAt = new Date(NOW - 180_000).toISOString();
  const { office } = await probe(t, jsonResponse(payload({ checkedAt }), 200, "application/json; charset=utf-8"));
  assert.equal(office.status, "online");
  assert.equal(office.checkedAt, checkedAt);
});

test("Office accepts timezone-qualified ISO timestamps", async (t) => {
  const checkedAt = "2026-09-23T07:00:00-05:00";
  const { office } = await probe(t, jsonResponse(payload({ checkedAt })));
  assert.equal(office.status, "online");
  assert.equal(office.checkedAt, checkedAt);
});

test("Office rejects impossible calendar dates that Date.parse would normalize", async (t) => {
  const { office } = await probe(t, jsonResponse(payload({ checkedAt: "2026-02-30T12:00:00.000Z" })), Date.parse("2026-03-02T12:00:00.000Z"));
  assert.equal(office.status, "offline");
});

test("Office never exposes relay descriptions, links, or extra fields", async (t) => {
  const { office } = await probe(t, jsonResponse(payload({
    description: "INTERNAL_TEST_MARKER", message: "INTERNAL_TEST_MARKER", scanner: "INTERNAL_TEST_MARKER",
    host: "INTERNAL_TEST_MARKER", data: { documents: ["INTERNAL_TEST_MARKER"] },
    publicUrl: "https://private.example.invalid", endpoint: "https://private.example.invalid",
  })));
  assert.equal(office.status, "online");
  assert.doesNotMatch(JSON.stringify(office), /INTERNAL_TEST_MARKER|private\.example/);
});

test("Office source timestamps continue to expire under the existing browser freshness policy", async (t) => {
  const { office } = await probe(t, jsonResponse(payload()));
  const state = statusStateReducer(createStatusState([{ ...office, status: "checking" }]), {
    type: "success", payload: { services: [office] }, now: NOW,
  });
  assert.equal(state.liveStatuses[0].status, "online");
  const expired = statusStateReducer(state, {
    type: "expire", now: Date.parse(office.checkedAt) + STATUS_MAX_AGE_MS,
  });
  assert.equal(expired.liveStatuses[0].status, "stale");
  assert.equal(expired.liveStatuses[0].checkedAt, office.checkedAt);
});
