import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { parse } from '@babel/parser';

const baseline = execFileSync('git', ['show', 'a858aac:src/App.jsx'], { encoding: 'utf8' }).replaceAll('\r\n', '\n');
const candidate = (await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8')).replaceAll('\r\n', '\n');
const trees = [baseline, candidate].map((source) => parse(source, { sourceType: 'module', plugins: ['jsx'] }));
const declarations = (tree, source) => new Map(tree.program.body.flatMap((node) => {
  if (node.type === 'FunctionDeclaration') return [[node.id.name, source.slice(node.start, node.end)]];
  if (node.type === 'VariableDeclaration') return node.declarations.map((declaration) => [declaration.id.name, source.slice(declaration.start, declaration.end)]);
  return [];
}));
const [oldDeclarations, newDeclarations] = trees.map((tree, index) => declarations(tree, [baseline, candidate][index]));
const preserved = [];
for (const [name, source] of oldDeclarations) {
  if (['SiteNav', 'HomePage'].includes(name)) continue;
  assert.equal(newDeclarations.get(name), source, `${name} changed`);
  preserved.push(name);
}
function collect(tree, source) {
  const result = { hrefs: [], text: [], companion: null };
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'JSXAttribute' && node.name.name === 'href' && node.value.type === 'StringLiteral') result.hrefs.push(node.value.value);
    if (node.type === 'JSXText') {
      const text = node.value.replace(/\s+/g, ' ').trim();
      if (text && text !== 'Ask') result.text.push(text);
    }
    if (node.type === 'VariableDeclarator' && node.id.name === 'askCompanion') result.companion = source.slice(node.start, node.end);
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === 'object') visit(value);
    }
  };
  visit(tree);
  return result;
}
const [oldContent, newContent] = trees.map((tree, index) => collect(tree, [baseline, candidate][index]));
assert.deepEqual(newContent.hrefs, oldContent.hrefs, 'Public link destinations changed');
assert.deepEqual(newContent.text, oldContent.text, 'Public copy changed');
assert.equal(newContent.companion, oldContent.companion, 'Guide context or request handling changed');
execFileSync('git', ['diff', '--exit-code', 'a858aac', '--', 'functions', 'public', 'src/Modal.jsx', 'src/index.css', 'src/status-state.js', 'src/useLiveStatuses.js', 'src/project-discovery.js', 'package.json', 'package-lock.json']);
const report = { baseline: 'a858aac', preservedDeclarations: preserved, unchangedHrefCount: oldContent.hrefs.length, unchangedCopyNodes: oldContent.text.length, guideRequestUnchanged: true, protectedFilesUnchanged: true, exception: 'Visible Ask button text became an accessible icon button with aria-label Ask.' };
await mkdir(new URL('../gui-evidence/', import.meta.url), { recursive: true });
await writeFile(new URL('../gui-evidence/source-preservation.json', import.meta.url), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report));
