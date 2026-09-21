import assert from "node:assert/strict";
import test from "node:test";
import { filterProjects, publicServices } from "../src/project-discovery.js";

const projects = [
  { id: "jackgpt", name: "JackGPT", subtitle: "AI workspace", summary: "Self-hosted models", tags: ["Docker"], tech: ["Ollama"] },
  { id: "market-desk", name: "Market Desk", subtitle: "Research", summary: "Public demo", tags: ["Finance"], tech: ["React"] },
  { id: "casino", name: "Casino", subtitle: "Secondary game demo", summary: "Games", tags: [], tech: [] },
];

test("search matches multiple terms across name, tags, and technology without reordering", () => {
  assert.deepEqual(filterProjects(projects, "  DOCKER   ollama ", "all"), [projects[0]]);
  assert.deepEqual(filterProjects(projects, "", "all"), projects);
  assert.deepEqual(filterProjects(projects, "missing", "all"), []);
});

test("category and text filters intersect, including secondary games", () => {
  assert.deepEqual(filterProjects(projects, "", "finance"), [projects[1]]);
  assert.deepEqual(filterProjects(projects, "JackGPT", "finance"), []);
  assert.deepEqual(filterProjects(projects, "", "games"), [projects[2]]);
});

test("service promotion excludes private endpoints, preserves input and puts casino last", () => {
  const links = [
    { href: "https://casino.jackgpt.org", accessTone: "public" },
    { href: "https://ops.jackgpt.org", accessTone: "private" },
    { href: "https://files.jackgpt.org", accessTone: "private" },
    { href: "https://app.jackgpt.org", accessTone: "signup" },
    { href: "https://market.jackgpt.org", accessTone: "featured" },
  ];
  assert.deepEqual(publicServices(links).map((link) => link.href), [links[4].href, links[3].href, links[0].href]);
  assert.equal(links[0].href, "https://casino.jackgpt.org");
});
