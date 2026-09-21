import assert from "node:assert/strict";
import test from "node:test";
import {
  STATUS_MAX_AGE_MS,
  createStatusState,
  nextStatusExpiry,
  statusStateReducer,
} from "../src/status-state.js";

const NOW = Date.parse("2026-09-21T12:00:00.000Z");
const defaults = [
  { key: "app", name: "AI Workspace", endpoint: "https://example.com/health", publicUrl: "https://example.com", status: "checking" },
  { key: "search", name: "Search", endpoint: "https://search.example.com/health", publicUrl: "https://search.example.com", status: "checking" },
  { key: "paused", name: "Paused", endpoint: "https://example.com/paused", publicUrl: "", showEndpoint: false, status: "maintenance", description: "Intentionally paused.", checkedAt: null, latencyMs: null, httpStatus: "-" },
];
const check = (key = "app", changes = {}) => ({
  key,
  status: "online",
  latencyMs: 42,
  httpStatus: 200,
  checkedAt: new Date(NOW).toISOString(),
  ...changes,
});
const receive = (state, services, now = NOW) => statusStateReducer(state, {
  type: "success", payload: { services }, now,
});
const completeState = () => receive(createStatusState(defaults), [check(), check("search")]);
const fail = (state, error) => statusStateReducer(state, { type: "unavailable", error });

test("initial states are unknown, except intentionally paused services", () => {
  const state = createStatusState(defaults);
  assert.deepEqual(state.liveStatuses.map((item) => item.status), ["unknown", "unknown", "maintenance"]);
  assert.deepEqual(state.statusMeta, { loading: true, error: "" });
  assert.match(state.liveStatuses[0].description, /No verified check/);
  assert.equal(state.liveStatuses[0].checkedAt, null);
});

test("successful refresh accepts only allowlisted identities and measured fields", () => {
  const state = receive(createStatusState(defaults), [
    check("app", { name: "Untrusted name", endpoint: "https://other.example", publicUrl: "javascript:alert(1)", showEndpoint: false, description: "Untrusted description", arbitrary: true }),
    check("search", { status: "degraded" }),
    check("extra"),
  ]);
  assert.equal(state.liveStatuses.length, defaults.length);
  assert.deepEqual(state.liveStatuses.map((item) => item.key), defaults.map((item) => item.key));
  const app = state.liveStatuses[0];
  for (const field of ["name", "endpoint", "publicUrl", "showEndpoint"]) assert.equal(app[field], defaults[0][field]);
  assert.equal(app.arbitrary, undefined);
  assert.equal(app.latencyMs, 42);
  assert.equal(app.httpStatus, 200);
  assert.equal(app.status, "online");
  assert.equal(state.liveStatuses[1].status, "degraded");
  assert.notEqual(app.description, "Untrusted description");
  assert.deepEqual(state.statusMeta, { loading: false, error: "" });
});

test("failed refresh removes cached online states and preserves historical metrics", () => {
  const previous = completeState();
  const failed = fail(previous);
  for (let index = 0; index < 2; index += 1) {
    assert.equal(failed.liveStatuses[index].status, "stale");
    for (const field of ["latencyMs", "httpStatus", "checkedAt"]) {
      assert.equal(failed.liveStatuses[index][field], previous.liveStatuses[index][field]);
    }
    assert.match(failed.liveStatuses[index].description, /not current/);
  }
  assert.equal(failed.liveStatuses[2].status, "maintenance");
  assert.equal(failed.statusMeta.loading, false);
  assert.ok(failed.statusMeta.error);
  assert.equal(previous.liveStatuses[0].status, "online");
});

test("a failed first check is unknown, not offline or checking", () => {
  const state = fail(createStatusState(defaults));
  assert.equal(state.liveStatuses[0].status, "unknown");
  assert.match(state.liveStatuses[0].description, /No verified check/);
});

for (const payload of [null, [], "", {}, { services: null }, { services: {} }, { services: [] }, { services: [null] }, { services: [[]] }, { services: [{}] }, { services: [check("other")] }]) {
  test(`rejects an invalid or empty summary: ${JSON.stringify(payload)}`, () => {
    const state = statusStateReducer(completeState(), { type: "success", payload, now: NOW });
    assert.equal(state.liveStatuses[0].status, "stale");
    assert.equal(state.liveStatuses[0].latencyMs, 42);
    assert.ok(state.statusMeta.error);
    assert.equal(state.statusMeta.loading, false);
  });
}

for (const status of [undefined, null, "", "checking", "ONLINE", "ready", "toString", {}, ["online"]]) {
  test(`rejects invalid service state ${JSON.stringify(status)}`, () => {
    const state = receive(completeState(), [check("app", { status }), check("search")]);
    assert.equal(state.liveStatuses[0].status, "stale");
    assert.equal(state.liveStatuses[1].status, "online");
    assert.ok(state.statusMeta.error);
  });
}

test("missing services are unknown but retain previous metrics", () => {
  const state = receive(completeState(), [check("search")]);
  assert.equal(state.liveStatuses[0].status, "unknown");
  assert.equal(state.liveStatuses[0].latencyMs, 42);
  assert.equal(state.liveStatuses[0].checkedAt, new Date(NOW).toISOString());
  assert.match(state.liveStatuses[0].description, /missing/);
  assert.ok(state.statusMeta.error);
});

test("duplicate service keys are rejected, including three copies", () => {
  const state = receive(completeState(), [check(), check("app", { status: "offline" }), check(), check("search")]);
  assert.equal(state.liveStatuses[0].status, "stale");
  assert.ok(state.statusMeta.error);
});

for (const checkedAt of [undefined, null, "", "invalid", "1", NOW, "2026-09-21", new Date(NOW + 1).toISOString()]) {
  test(`rejects invalid or future check time ${JSON.stringify(checkedAt)}`, () => {
    const initial = receive(createStatusState(defaults), [check("app", { checkedAt })]);
    assert.equal(initial.liveStatuses[0].status, "unknown");
    assert.equal(initial.liveStatuses[0].checkedAt, null);
    const previous = receive(completeState(), [check("app", { checkedAt })]);
    assert.equal(previous.liveStatuses[0].status, "stale");
    assert.equal(previous.liveStatuses[0].checkedAt, new Date(NOW).toISOString());
  });
}

for (const changes of [{ latencyMs: -1 }, { latencyMs: Infinity }, { latencyMs: "42" }, { latencyMs: NaN }, { httpStatus: "200" }, { httpStatus: 99 }, { httpStatus: 600 }, { httpStatus: 200.5 }, { httpStatus: {} }]) {
  test(`rejects invalid metrics ${JSON.stringify(changes)}`, () => {
    const state = receive(completeState(), [check("app", changes)]);
    assert.equal(state.liveStatuses[0].status, "stale");
    assert.equal(state.liveStatuses[0].httpStatus, 200);
    assert.equal(state.liveStatuses[0].latencyMs, 42);
    assert.ok(state.statusMeta.error);
  });
}

test("reported service outage is distinct from an unavailable browser check", () => {
  const state = receive(createStatusState(defaults), [check("app", { status: "offline", httpStatus: "ERR", latencyMs: null })]);
  assert.equal(state.liveStatuses[0].status, "offline");
  assert.equal(state.liveStatuses[0].httpStatus, "ERR");
  assert.equal(state.liveStatuses[0].latencyMs, null);
  const offlineBrowser = fail(state, "Your browser is offline. Service availability is unknown.");
  assert.equal(offlineBrowser.liveStatuses[0].status, "stale");
  assert.match(offlineBrowser.statusMeta.error, /browser is offline/);
  assert.equal(offlineBrowser.liveStatuses[1].status, "unknown");
});

test("checks expire exactly at two minutes and preserve last-check values", () => {
  const state = completeState();
  assert.equal(statusStateReducer(state, { type: "expire", now: NOW + STATUS_MAX_AGE_MS - 1 }), state);
  const expired = statusStateReducer(state, { type: "expire", now: NOW + STATUS_MAX_AGE_MS });
  assert.equal(expired.liveStatuses[0].status, "stale");
  assert.equal(expired.liveStatuses[0].checkedAt, state.liveStatuses[0].checkedAt);
  assert.equal(expired.liveStatuses[0].latencyMs, 42);
  assert.equal(expired.liveStatuses[2].status, "maintenance");
  assert.ok(expired.statusMeta.error);
  assert.equal(nextStatusExpiry(expired.liveStatuses, NOW), null);
});

test("already stale API results cannot become current by being fetched again", () => {
  const checkedAt = new Date(NOW - STATUS_MAX_AGE_MS).toISOString();
  const state = receive(createStatusState(defaults), [check("app", { checkedAt })]);
  assert.equal(state.liveStatuses[0].status, "stale");
  assert.equal(state.liveStatuses[0].checkedAt, checkedAt);
  assert.ok(state.statusMeta.error);
});

test("older responses never replace newer historical metrics", () => {
  const state = receive(completeState(), [check("app", { checkedAt: new Date(NOW - 1000).toISOString(), latencyMs: 900 })]);
  assert.equal(state.liveStatuses[0].status, "stale");
  assert.equal(state.liveStatuses[0].latencyMs, 42);
  assert.equal(state.liveStatuses[0].checkedAt, new Date(NOW).toISOString());
});

test("freshness scheduling chooses the earliest deadline without considering maintenance", () => {
  const state = receive(createStatusState(defaults), [check(), check("search", { checkedAt: new Date(NOW - 90_000).toISOString() })]);
  assert.equal(nextStatusExpiry(state.liveStatuses, NOW), 30_000);
  assert.equal(nextStatusExpiry(state.liveStatuses, NOW + 30_000), 0);
  assert.equal(nextStatusExpiry(createStatusState(defaults).liveStatuses, NOW), null);
});

test("clock rollback does not leave future-dated checks current", () => {
  const state = completeState();
  assert.equal(nextStatusExpiry(state.liveStatuses, NOW - 1000), 0);
  const expired = statusStateReducer(state, { type: "expire", now: NOW - 1000 });
  assert.equal(expired.liveStatuses[0].status, "stale");
});

test("maintenance fallback cannot be overridden or resumed by a remote state", () => {
  const state = receive(createStatusState(defaults), [check(), check("search"), check("paused", { name: "Override", status: "offline", publicUrl: "https://other.example" })]);
  assert.equal(state.liveStatuses[2].status, "maintenance");
  assert.equal(state.liveStatuses[2].description, defaults[2].description);
  assert.equal(state.liveStatuses[2].publicUrl, "");
  assert.equal(state.liveStatuses[2].showEndpoint, false);
  assert.equal(fail(state).liveStatuses[2].status, "maintenance");
});

test("validated API maintenance survives refresh failure", () => {
  const state = receive(createStatusState(defaults), [check("app", { status: "maintenance" }), check("search")]);
  assert.equal(fail(state).liveStatuses[0].status, "maintenance");
});

test("loading and recovery do not turn historical data back online before success", () => {
  const failed = fail(completeState());
  const loading = statusStateReducer(failed, { type: "loading" });
  assert.equal(loading.statusMeta.loading, true);
  assert.equal(loading.liveStatuses[0].status, "stale");
  const recovered = receive(loading, [check(), check("search")]);
  assert.equal(recovered.liveStatuses[0].status, "online");
  assert.deepEqual(recovered.statusMeta, { loading: false, error: "" });
});

test("state transitions do not mutate inputs or the fallback allowlist", () => {
  const frozen = Object.freeze(defaults.map((service) => Object.freeze({ ...service })));
  const state = createStatusState(frozen);
  Object.freeze(state.liveStatuses);
  state.liveStatuses.forEach(Object.freeze);
  Object.freeze(state);
  assert.doesNotThrow(() => receive(state, [Object.freeze(check())]));
  assert.doesNotThrow(() => fail(state));
  assert.equal(defaults[0].status, "checking");
});
