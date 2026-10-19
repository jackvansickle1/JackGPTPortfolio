import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parse } from "@babel/parser";

const baseline = "f6e550d849b5fc57e1aeb4b3600145d7a131923d";
const oldSource = execFileSync("git", ["show", `${baseline}:src/App.jsx`], { encoding: "utf8" }).replaceAll("\r\n", "\n");
const newSource = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8").replaceAll("\r\n", "\n");
const sources = [oldSource, newSource];
const trees = sources.map((source) => parse(source, { sourceType: "module", plugins: ["jsx"] }));
const declarations = trees.map((tree) => new Map(tree.program.body.flatMap((node) => {
  if (node.type === "FunctionDeclaration") return [[node.id.name, node]];
  if (node.type === "VariableDeclaration") return node.declarations.map((item) => [item.id.name, item]);
  return [];
})));
const sourceFor = (node, index) => sources[index].slice(node.start, node.end)
  .replaceAll("market-desk-terminal-20261019.jpg", "market-desk-terminal.png")
  .replaceAll("jackgpt-images-studio-20261019.jpg", "jackgpt-images-dashboard.png");
const changed = new Set(["SiteNav", "HomePage", "ProjectDetail", "projects", "homepageProjectOrder", "fallbackStatuses", "accessLinks"]);
const preserved = [];
for (const [name, node] of declarations[0]) {
  if (changed.has(name)) continue;
  assert.equal(sourceFor(declarations[1].get(name), 1), sourceFor(node, 0), `${name} changed`);
  preserved.push(name);
}
for (const name of ["projects", "fallbackStatuses", "accessLinks"]) {
  const values = declarations.map((map, index) => map.get(name).init.elements
    .filter((node) => node.type === "ObjectExpression").map((node) => sourceFor(node, index)));
  assert.deepEqual(values[1], values[0], `Existing ${name} data changed`);
}
const order = declarations.map((map) => map.get("homepageProjectOrder").init.elements.map(({ value }) => value));
assert.deepEqual(order[1].filter((id) => !["sports", "trade"].includes(id)), order[0]);
const hooks = declarations.map((map, index) => {
  const body = map.get("HomePage").body.body;
  const boundary = body.findIndex((node) => node.type === "ReturnStatement");
  return body.slice(0, boundary).map((node) => sourceFor(node, index));
});
assert.deepEqual(hooks[1], hooks[0], "Homepage state, guide request handling or effects changed");
const protectedPaths = ["src/Modal.jsx", "src/index.css", "src/main.jsx", "src/status-state.js", "src/useLiveStatuses.js", "package.json", "package-lock.json", "index.html", "vite.config.js", "functions/api/companion.js"];
assert.equal(execFileSync("git", ["diff", "--name-only", baseline, "--", ...protectedPaths], { encoding: "utf8" }).trim(), "", "Protected backend, data, runtime or dependency files changed");
const allowedPublic = new Set([
  "public/project-images/automatic1111/jackgpt-images-studio-20261019.jpg",
  "public/project-images/market-desk/market-desk-terminal-20261019.jpg",
]);
const changedPublic = execFileSync("git", ["diff", "--name-only", baseline, "--", "public"], { encoding: "utf8" }).trim().split(/\r?\n/).filter(Boolean);
assert.deepEqual(changedPublic.filter((path) => !allowedPublic.has(path)), [], "Existing public assets or paid-work pages changed");
console.log(JSON.stringify({ baseline, preservedDeclarations: preserved, existingRegistriesUnchanged: true, homepageBehaviorUnchanged: true, protectedPathsUnchanged: true }, null, 2));
