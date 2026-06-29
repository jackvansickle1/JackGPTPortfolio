# JackGPT Ops Control Room

JackGPT Ops Control Room is the private reliability layer behind the JackGPT portfolio. It is designed to make live recruiter demos less fragile by monitoring the ecosystem, alerting on repeated failures, and repairing predictable degraded states without exposing private infrastructure controls.

The live control room is private at `ops.jackgpt.org` behind Cloudflare Access. This public note explains the architecture at a recruiter-safe level only.

## What It Monitors

- Public endpoints such as the homepage, AI workspace, Image Gen, Search, Market Desk, Kalshi Climate Desk, Casino, Pearl Desk, Moomoo, Salad, Mesh, and Minecraft status.
- Internal health endpoints on Docker services.
- Docker container state and healthcheck results.
- Browser-render checks for blank pages, broken UI, framework overlays, and console errors.
- Ollama/model-host availability, image-generation backend health, Search result health, Cloudflare tunnel health, and selected host-agent signals.

## How It Works

```mermaid
flowchart LR
  Public["Public services"] --> Ops["Ops monitor"]
  Internal["Internal health endpoints"] --> Ops
  Docker["Docker socket / container health"] --> Ops
  Browser["Browser render checks"] --> Ops
  Host["Private host-agent"] --> Ops
  Ops --> Alerts["ntfy alerts"]
  Ops --> Repairs["Allowlisted repair actions"]
  Repairs --> Services["Restart / repair selected services"]
```

The monitor runs inside Docker as a FastAPI service. It keeps a readiness score, current service table, browser screenshot history, alert history, and repair history. A separate private host-agent exposes narrowly scoped repair actions for things that live outside Docker, such as Windows-hosted bot processes or compute services.

## Repair Model

Repairs are intentionally conservative:

- Only allowlisted targets can be repaired.
- Offline and degraded states require configured thresholds before automatic repair runs.
- Cooldowns prevent restart loops and alert spam.
- Public-facing repair messages are scrubbed of secrets, paths, logs, and strategy details.
- Some repairs call a host-agent path, while others restart Docker containers directly.

Examples of predictable repairs:

- Search: enforce stable SearXNG defaults and restart/validate the service.
- AI Workspace: restart OpenWebUI and Ollama.
- Image Gen: restart the lightweight frontend, backend, and tunnel.
- Market Desk, Casino, Pearl Desk, Temp, and File Drop: restart the relevant container.
- Tunnels: restart Cloudflare tunnel containers when public routing fails.

## Security Boundaries

The private Ops UI is not intended as a public demo. It can trigger service restarts and host-side repair actions, so the live route is gated by Cloudflare Access. Public materials should only show sanitized screenshots and architecture notes.

Not public:

- Secrets, tokens, SMTP credentials, tunnel credentials, or ntfy topic.
- Private host paths, local logs, order IDs, account identifiers, API keys, or private strategy internals.
- Full host-agent source with live operational commands.

Public-safe:

- High-level architecture.
- Screenshots that show readiness, health, and repair concepts without credentials.
- Design and implementation notes explaining monitoring, alerts, throttled repair, and demo-readiness thinking.

## Screenshots

![Ops readiness overview](../project-images/ops-control-room/ops-readiness-overview.png)

![Ops repair matrix](../project-images/ops-control-room/ops-repair-matrix.png)

![Ops service health](../project-images/ops-control-room/ops-service-health.png)

## Recruiter Takeaway

Ops Control Room shows that JackGPT is not just a set of demos. It is an operated ecosystem with monitoring, alerting, visual QA, dependency checks, health endpoints, private administrative controls, and recovery paths for predictable failures.
