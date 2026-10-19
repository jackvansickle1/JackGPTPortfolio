import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { serviceAccessLinks, serviceProjects, serviceStatuses } from "../src/homepage-services.js";
import { filterProjects, publicServices } from "../src/project-discovery.js";
import { createStatusState, statusStateReducer, STATUS_MAX_AGE_MS } from "../src/status-state.js";

const now = Date.parse("2026-10-18T18:00:00.000Z");
const checked = (key, changes = {}) => ({ key, status: "online", checkedAt: new Date(now).toISOString(), latencyMs: 42, httpStatus: 200, ...changes });
const update = (state, services) => statusStateReducer(state, { type: "success", payload: { services }, now });

test("new projects have complete overview content and unique identity across registries", () => {
  for (const project of serviceProjects) {
    assert.ok(project.description && project.summary && project.subtitle);
    assert.ok(project.howItWorks.length && project.developed.length && project.tech.length);
    assert.ok(project.icon);
    assert.equal(serviceAccessLinks.filter(({ href }) => href === project.links[0].href).length, 1);
    assert.equal(serviceStatuses.filter(({ key }) => key === project.id).length, 1);
  }
  assert.deepEqual(serviceStatuses.map(({ key }) => key), ["sports", "trade"]);
});

test("Rally is public account-based demo discovery, while Trade and File Drop stay excluded", () => {
  const links = [
    { href: "https://casino.jackgpt.org", accessTone: "public" },
    ...serviceAccessLinks,
    { href: "https://file.jackgpt.org", accessTone: "private" },
    { href: "https://market.jackgpt.org", accessTone: "featured" },
  ];
  assert.deepEqual(publicServices(links).map(({ href }) => href), [
    "https://market.jackgpt.org", "https://sports.jackgpt.org", "https://casino.jackgpt.org",
  ]);
  assert.equal(serviceAccessLinks.find(({ href }) => href.includes("trade.")).accessTone, "private");
  assert.match(serviceAccessLinks[0].note, /no real money, cash value, or prizes/);
});

test("Rally and Trade are discoverable by domain and access terms in the right categories", () => {
  assert.deepEqual(filterProjects(serviceProjects, "sports demo", "games").map(({ id }) => id), ["sports"]);
  assert.deepEqual(filterProjects(serviceProjects, "owner", "finance").map(({ id }) => id), ["trade"]);
  assert.deepEqual(filterProjects(serviceProjects, "trade.jackgpt.org", "all").map(({ id }) => id), ["trade"]);
  assert.deepEqual(filterProjects(serviceProjects, "trade", "all").map(({ id }) => id), ["trade"]);
  assert.deepEqual(filterProjects(serviceProjects, "sports.jackgpt.org", "all").map(({ id }) => id), ["sports"]);
  assert.deepEqual(filterProjects(serviceProjects, "", "ai"), []);
});

test("Trade overview has no screenshots and its only external action is explicit owner sign-in", () => {
  const trade = serviceProjects.find(({ id }) => id === "trade");
  assert.equal(trade.screenshotPolicy, "private");
  assert.deepEqual(trade.screenshots, []);
  assert.deepEqual(trade.links, [{ label: "Owner sign-in only", href: "https://trade.jackgpt.org" }]);
  assert.match(trade.description, /not a recruiter demo or a public financial dashboard/i);
  assert.doesNotMatch(JSON.stringify(trade), /\$\d|account[_-]?id|project-images|owner-decisions/);
});

test("new status rows start unknown with no fabricated health or metrics", () => {
  const state = createStatusState(serviceStatuses);
  for (const status of state.liveStatuses) {
    assert.equal(status.status, "unknown");
    assert.equal(status.latencyMs, null);
    assert.equal(status.httpStatus, "-");
    assert.equal(status.checkedAt, null);
  }
});

test("missing backend probes remain unknown and retain owner-only gate scope", () => {
  const state = update(createStatusState(serviceStatuses), [checked("openwebui")]);
  const trade = state.liveStatuses.find(({ key }) => key === "trade");
  assert.equal(trade.status, "unknown");
  assert.equal(trade.showEndpoint, false);
  assert.equal(trade.accessMode, "Private");
  assert.match(trade.name, /sign-in gate/);
  assert.match(trade.accessNote, /private backend health is not assessed/);
});

test("verified status accepts only safe metrics and cannot relabel Trade public or expose data", () => {
  const state = update(createStatusState(serviceStatuses), [checked("sports"), checked("trade", {
    name: "Public trading dashboard", accessMode: "Public", accessNote: "Everyone can enter",
    publicUrl: "https://untrusted.example", description: "Private portfolio details", accountId: "DO_NOT_RENDER",
  })]);
  const trade = state.liveStatuses.find(({ key }) => key === "trade");
  assert.equal(trade.status, "online");
  assert.equal(trade.latencyMs, 42);
  assert.equal(trade.accessMode, "Private");
  assert.equal(trade.publicUrl, "https://trade.jackgpt.org");
  assert.equal(trade.showEndpoint, false);
  assert.match(trade.accessNote, /Gate reachability only/);
  assert.match(trade.name, /sign-in gate/);
  assert.doesNotMatch(JSON.stringify(trade), /DO_NOT_RENDER|Everyone can enter|Private portfolio details/);
});

test("a missing, stale or duplicate Trade check cannot retain a healthy appearance", () => {
  const initial = createStatusState(serviceStatuses);
  const good = update(initial, [checked("sports"), checked("trade")]);
  for (const [services, expected] of [
    [[checked("sports")], "unknown"],
    [[checked("sports"), checked("trade"), checked("trade")], "unknown"],
    [[checked("sports"), checked("trade", { checkedAt: new Date(now - STATUS_MAX_AGE_MS).toISOString() })], "stale"],
  ]) {
    const state = update(expected === "stale" ? initial : good, services);
    const trade = state.liveStatuses.find(({ key }) => key === "trade");
    assert.equal(trade.status, expected === "unknown" && services.length === 3 ? "stale" : expected);
    assert.equal(trade.accessMode, "Private");
    assert.match(trade.accessNote, /private backend health is not assessed/);
  }
});

test("homepage only exposes the private overview in its public service section", () => {
  const source = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
  const directory = source.slice(source.indexOf('<section id="live-services"'), source.indexOf('<section id="projects"'));
  assert.match(directory, /promotedServices\.map/);
  assert.match(directory, /href="#\/project\/trade"/);
  assert.doesNotMatch(directory, /href="https:\/\/trade\.|file\.jackgpt\.org|File Drop/);
  assert.match(source, /project\.screenshotPolicy === "private"/);
});
