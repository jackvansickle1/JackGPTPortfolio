Cloudflare Pages live-status wiring

Drop these files into your Pages project root.

Files included:
- src/App.jsx
- src/index.css
- functions/api/status/summary.js

What it does:
- Adds a same-origin Pages Function at /api/status/summary
- Polls that endpoint every 60 seconds from the React homepage
- Shows live status, latency, HTTP code, endpoint, and last-checked time

After extracting:
1. Commit the new files
2. Push to GitHub
3. Wait for Cloudflare Pages to redeploy

Notes:
- This version checks public URLs, not private container internals.
- It gives live availability and latency.
- Historical uptime percentages are not included because those require storing check history somewhere.
