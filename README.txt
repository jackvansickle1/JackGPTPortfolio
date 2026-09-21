JackGPT Portfolio Site

Development:
npm install
npm run dev

Production check:
npm run build

Regression checks:
npm test
npm run lint
npm run test:browser

Browser checks use installed Google Chrome and a disposable localhost Vite server
on port 5190. API responses are mocked; no live companion or service probes run.
Screenshots and failure traces are written to ignored test-results/.
Vite alone does not run the Cloudflare Pages Functions in functions/.
