import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const cleanUrlTargets = new Map([
  ['/hire/', '/hire/index.html'],
  ['/hire/spreadsheet-rescue/', '/hire/spreadsheet-rescue/index.html'],
  ['/writing-samples/', '/writing-samples/index.html'],
  ['/writing-samples/reliable-fastapi-dependency-testing', '/writing-samples/reliable-fastapi-dependency-testing.html'],
  ['/writing-samples/technical-documentation-portfolio', '/writing-samples/technical-documentation-portfolio.html'],
  ['/writing-samples/rent-to-own-cost-checklist', '/writing-samples/rent-to-own-cost-checklist.html'],
])

const installCleanUrlMiddleware = (server) => {
  server.middlewares.use((request, _response, next) => {
    const [pathname, query] = (request.url || '/').split('?', 2)
    const target = cleanUrlTargets.get(pathname)
    if (target) request.url = query ? `${target}?${query}` : target
    next()
  })
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'clean-url-development-parity',
      configureServer: installCleanUrlMiddleware,
      configurePreviewServer: installCleanUrlMiddleware,
    },
  ],
})
