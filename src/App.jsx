import { useEffect, useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Cpu,
  Dices,
  ExternalLink,
  FolderGit,
  Globe,
  Image as ImageIcon,
  LineChart,
  Mail,
  MonitorSmartphone,
  PhoneCall,
  Search,
  Send,
  Server,
  Shield,
  Sparkles,
  TrendingUp,
  Cloud,
  Compass,
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  MessageCircle,
  UserRound,
  Trophy,
  X,
} from "lucide-react";
import "./index.css";

const projects = [
  {
    id: "jackgpt",
    name: "JackGPT AI Workspace",
    subtitle: "Self-hosted AI assistant with local models, web search, and image generation",
    icon: Bot,
    accent: "cyan",
    tags: ["OpenWebUI", "Ollama", "Local LLMs", "Web search", "Image generation", "Docker"],
    summary:
      "A branded, self-hosted AI workspace that brings local model serving, web search, and image generation into one recruiter-visible product surface.",
    description:
      "JackGPT AI Workspace is the public-facing assistant at app.jackgpt.org. It combines OpenWebUI, Ollama-backed local inference, branded JackGPT 3.1 identity, web search, image generation, persistent conversations, and Cloudflare routing into a usable AI product rather than a generic model playground.",
    howItWorks: [
      "OpenWebUI provides the browser-based chat interface, account flow, conversation history, and model routing.",
      "Ollama serves the local JackGPT 3.1 model, while the workspace can call the branded search service for live context and the image-generation service for visual requests.",
      "Docker Compose and Cloudflare Tunnel keep the service remotely reachable without exposing local infrastructure directly.",
    ],
    developed: [
      "Stabilized a self-hosted OpenWebUI/Ollama deployment and made it accessible through app.jackgpt.org.",
      "Rebranded the interface around JackGPT, set JackGPT 3.1 as the default assistant, and gave it current ecosystem context for recruiter walkthroughs.",
      "Integrated web search and image-generation workflows so the assistant demonstrates tool use, not just plain chat.",
      "Hardened the stack with Docker health checks, Cloudflare routing, and a public-safe boundary around backend implementation details.",
    ],
    tech: ["OpenWebUI", "Ollama", "Docker Compose", "Cloudflare Tunnel", "Self-hosted inference", "Tool use"],
    links: [
      { label: "app.jackgpt.org", href: "https://app.jackgpt.org" },
      { label: "GitHub: stack template", href: "https://github.com/jackvansickle1/jackgpt-selfhosted-stack-template" },
      { label: "GitHub: brand kit", href: "https://github.com/jackvansickle1/jackgpt-openwebui-brand-kit" },
    ],
    screenshots: [
      {
        src: "/project-images/jackgpt/jackgpt-chat-home.png",
        caption: "Branded JackGPT 3.1 workspace with the default model ready for a new chat",
      },
      {
        src: "/project-images/jackgpt/jackgpt-chat-answer.png",
        caption: "JackGPT 3.1 responding inside the live public AI workspace",
      },
    ],
  },
  {
    id: "automatic1111",
    name: "JackGPT Image Gen",
    subtitle: "Local GPU image and video generation",
    icon: ImageIcon,
    accent: "violet",
    tags: ["Generative AI", "Video Diffusion", "Docker", "NVIDIA GPU", "GPU Scheduling"],
    summary:
      "A branded, Dockerized creative platform for text-to-image, text-to-video, and image-to-video generation on a shared local RTX GPU.",
    description:
      "JackGPT Image Gen combines a lean public product surface with private still-image and video-diffusion backends. A bounded queue coordinates long video renders with the JackGPT AI Workspace, still-image generation, and idle-only mining; uploads are decoded, metadata-stripped, and re-encoded before use. The result is a public creative tool rather than an exposed upstream admin UI.",
    howItWorks: [
      "A FastAPI orchestration layer routes still images to the private image backend and text-to-video or image-to-video jobs to a private ComfyUI/Wan runtime.",
      "A single bounded GPU queue safely unloads and restores competing models, pauses idle mining, and prevents Ollama inference from colliding with an active video render.",
      "Source images are type-checked, decoded, orientation-corrected, stripped of metadata, and re-encoded before entering the video workflow; opaque output links expire after 24 hours.",
      "Cloudflare Tunnel publishes only the branded proxy at images.jackgpt.org while backend ports remain local or container-internal.",
    ],
    developed: [
      "Built the Dockerized image and video inference stack with NVIDIA acceleration, pinned runtime dependencies, health checks, and persistent model/output mounts.",
      "Implemented queue state, progress polling, input guards, rate limits, output retention, model handoff, and recovery-aware dependency health.",
      "Designed a responsive JackGPT-native studio for stills, text-to-video, and image-to-video without exposing raw upstream interfaces.",
      "Integrated the service with Ops auto-repair, the AI Workspace GPU gate, the mining idle guard, Cloudflare routing, and recruiter-facing status surfaces.",
    ],
    tech: ["FastAPI", "Docker", "NVIDIA CUDA", "Stable Diffusion XL", "Wan 2.2", "ComfyUI", "Cloudflare Tunnel"],
    links: [{ label: "images.jackgpt.org", href: "https://images.jackgpt.org" }],
    screenshots: [
      {
        src: "/project-images/automatic1111/jackgpt-images-dashboard.png",
        caption: "JackGPT Image Gen studio with dedicated still-image and video creation modes",
      },
      {
        src: "/project-images/automatic1111/jackgpt-images-result-board.png",
        caption: "Text-to-video and image-to-video controls on the live shared-GPU creative stack",
      },
    ],
  },
  {
    id: "meshcentral",
    name: "JackGPT Mesh",
    subtitle: "Remote device management and support",
    icon: MonitorSmartphone,
    accent: "amber",
    tags: ["Remote management", "Cloudflare Tunnel", "Docker"],
    summary:
      "A branded, self-hosted remote-management system that demonstrates secure infrastructure operations, device enrollment, and restricted admin access.",
    description:
      "JackGPT Mesh is deployed in Docker and exposed through Cloudflare Tunnel at mesh.jackgpt.org. It allows remote device enrollment, browser-based management, and remote desktop functionality while keeping account creation and device access restricted to the administrator.",
    howItWorks: [
      "MeshCentral runs in a Docker container and maintains device records, groups, and management policies.",
      "Agents installed on enrolled devices connect to the server over secure WebSocket connections.",
      "Cloudflare Tunnel publishes the interface securely, allowing remote management without direct port forwarding.",
    ],
    developed: [
      "Containerized MeshCentral and set up persistent data storage.",
      "Configured hostname routing, certificate handling, and device re-enrollment.",
      "Tested remote access and connectivity through the tunnel to verify stability.",
    ],
    tech: ["MeshCentral", "Docker", "Cloudflare Tunnel", "Remote access"],
    links: [{ label: "mesh.jackgpt.org", href: "https://mesh.jackgpt.org" }],
    screenshots: [
      {
        src: "/project-images/meshcentral/jackgpt-mesh-login.png",
        caption: "Branded JackGPT Mesh login portal for secure remote operations",
      },
      {
        src: "/project-images/meshcentral/jackgpt-mesh-dashboard.png",
        caption: "Sanitized device dashboard showing enrolled endpoints and online status",
      },
      {
        src: "/project-images/meshcentral/jackgpt-mesh-device-detail.png",
        caption: "Sanitized device detail view with agent health, security, and management tabs",
      },
    ],
  },
  {
    id: "jackgpt-search",
    name: "JackGPT Search",
    subtitle: "Branded web-search endpoint for the JackGPT ecosystem",
    icon: Search,
    accent: "cyan",
    tags: ["Private search", "Docker", "Cloudflare Tunnel", "Custom theme"],
    summary:
      "A branded JackGPT Search deployment exposed at search.jackgpt.org for fast, browser-based search.",
    description:
      "JackGPT Search runs in Docker with persistent configuration, a custom JackGPT visual identity, and public routing through Cloudflare Tunnel at search.jackgpt.org. It gives the JackGPT stack a dedicated search surface alongside chat, image generation, and remote-management services.",
    howItWorks: [
      "JackGPT Search aggregates web results while keeping the public interface under the JackGPT domain.",
      "A Docker container serves the search app with mounted configuration and branded template overrides.",
      "Cloudflare Tunnel routes search.jackgpt.org to the container without exposing the host directly.",
    ],
    developed: [
      "Deployed JackGPT Search in Docker with persistent settings and supporting service storage.",
      "Added a branded splash screen, favicon set, PWA colors, and custom theme assets.",
      "Connected the service to the public JackGPT homepage and live status checks.",
    ],
    tech: ["Private search", "Docker Compose", "Cloudflare Tunnel", "Custom theme"],
    links: [{ label: "search.jackgpt.org", href: "https://search.jackgpt.org" }],
    screenshots: [
      {
        src: "/project-images/jackgpt-search/jackgpt-search-home.png",
        caption: "JackGPT Search landing page with the custom public search branding",
      },
      {
        src: "/project-images/jackgpt-search/jackgpt-search-results.png",
        caption: "Branded result view demonstrating an instant calculator-style answer",
      },
    ],
  },
  {
    id: "market-desk",
    name: "JackGPT Market Desk",
    subtitle: "AI-powered equity research and market intelligence terminal",
    icon: LineChart,
    accent: "emerald",
    tags: ["Finance", "AI", "Docker", "React", "FastAPI", "Portfolio"],
    summary:
      "A Dockerized finance intelligence terminal combining public market data, local AI summaries, risk flags, and recruiter-facing product design.",
    description:
      "JackGPT Market Desk is a public portfolio demo at market.jackgpt.org. It combines a polished React terminal interface with a FastAPI backend, free public market data, local Ollama-powered research summaries when available, deterministic fallback briefs, and transparent dependency status.",
    howItWorks: [
      "The React frontend gives visitors a responsive market terminal with ticker search, stat cards, charting, and system-status badges.",
      "A FastAPI backend sanitizes ticker input, fetches public delayed quote data, and enriches snapshots when public sources are available.",
      "Ollama can generate analyst-style research briefs locally, while deterministic fallback logic keeps the demo useful if AI or data enrichment is unavailable.",
    ],
    developed: [
      "Built a Dockerized React/Vite and FastAPI service with a public health endpoint.",
      "Added Cloudflare Tunnel routing for market.jackgpt.org without disrupting existing JackGPT services.",
      "Designed the UI to match the JackGPT command-center theme with accessible contrast, responsive cards, and honest degraded states.",
    ],
    tech: ["React", "Vite", "FastAPI", "Docker Compose", "Ollama", "Cloudflare Tunnel"],
    links: [
      { label: "market.jackgpt.org", href: "https://market.jackgpt.org" },
      { label: "GitHub", href: "https://github.com/jackvansickle1/jackgpt-market-desk" },
    ],
    screenshots: [
      {
        src: "/project-images/market-desk/market-desk-terminal.png",
        caption: "Market Desk terminal with a live NVIDIA snapshot, valuation fields, and dependency status",
      },
      {
        src: "/project-images/market-desk/market-desk-research-brief.png",
        caption: "Analyst-style research brief with grounded bull and bear cases",
      },
      {
        src: "/project-images/market-desk/market-desk-stock-chat.png",
        caption: "Stock-aware AI chat answering questions with the current ticker context",
      },
    ],
  },
  {
    id: "casino",
    name: "JackGPT Casino",
    subtitle: "Secondary interactive browser-game demo",
    icon: Trophy,
    accent: "amber",
    tags: ["React", "Docker", "Game UI", "Animation", "Cloudflare Tunnel", "Portfolio"],
    summary:
      "A polished secondary game demo with standard craps, bubble craps, crapless craps, blackjack, animated horse racing, a shared persisted bankroll, sound, and responsive game controls.",
    description:
      "JackGPT Casino is a Dockerized browser game at casino.jackgpt.org. It combines casino-style craps layouts, blackjack, and a live animated horse racing track with shared bankroll state, all styled to match the JackGPT command-center visual system. It is intentionally positioned as a lighter interactive demo behind the more substantial AI, finance, infrastructure, and automation projects.",
    howItWorks: [
      "The React frontend runs game state instantly in the browser, including chip placement, point state, dice rolls, blackjack hand flow, payout resolution, horse movement, odds, shared bankroll, and history.",
      "A small FastAPI backend serves the compiled app and exposes a public health endpoint for status monitoring.",
      "Cloudflare Tunnel routes casino.jackgpt.org to the local Docker container without exposing the host directly.",
    ],
    developed: [
      "Implemented standard, bubble, and crapless craps with table-specific visual treatments and rule differences.",
      "Built blackjack with deal, hit, stand, double, natural 3:2 payouts, and dealer stand-on-soft-17 behavior.",
      "Built an animated horse racing game with selectable runners, odds, wager sizing, live lane movement, repeatable race reset, and finish-line resolution.",
      "Integrated the service into the JackGPT Docker stack, tunnel routing, homepage cards, screenshots, and live status checks.",
    ],
    tech: ["React", "Vite", "FastAPI", "Docker Compose", "Cloudflare Tunnel"],
    links: [{ label: "casino.jackgpt.org", href: "https://casino.jackgpt.org" }],
    screenshots: [
      {
        src: "/project-images/casino/casino-standard.png",
        caption: "Standard craps table with active chips, dice, line bets, number boxes, and center action",
      },
      {
        src: "/project-images/casino/casino-crapless.png",
        caption: "Crapless craps layout with expanded point numbers and no don't-side betting boxes",
      },
      {
        src: "/project-images/casino/casino-bubble.png",
        caption: "Bubble craps machine-style table with dice dome, touch-panel betting zones, and auto-roll controls",
      },
      {
        src: "/project-images/casino/casino-racing.png",
        caption: "Animated horse racing game with live track positions, runner odds, and a betting slip",
      },
    ],
  },
  {
    id: "pearl-desk",
    name: "JackGPT Pearl Desk",
    subtitle: "PRL mining telemetry with GPU-idle coordination",
    icon: Cpu,
    accent: "cyan",
    tags: ["Mining telemetry", "GPU scheduling", "FastAPI", "Docker", "Monitoring", "Charts"],
    summary:
      "A public mining dashboard that tracks PRL wallet performance, hashrate timelines, revenue estimates, USD conversion, and the JackGPT GPU idle guard.",
    description:
      "JackGPT Pearl Desk is the public dashboard at pearl.jackgpt.org for PRL mining telemetry. It tracks two wallet groups, worker health, active and rolling hashrate, pending and on-chain balances, hourly revenue estimates, USD conversion, and the GPU idle guard that pauses mining when heavier JackGPT AI or image-generation workloads need the GPU.",
    howItWorks: [
      "A FastAPI backend queries public pool, explorer, and price endpoints, then caches the results for fast dashboard refreshes.",
      "The UI renders wallet cards, aggregate totals, hoverable hashrate timelines, hourly revenue estimates, and source-health badges.",
      "A private host-agent exposes only sanitized GPU-idle state so the public dashboard can show when mining is paused for JackGPT workloads without exposing host internals.",
    ],
    developed: [
      "Built a Dockerized PRL dashboard with fast refresh behavior, chart hover inspection, wallet-balance reporting, and USD conversion.",
      "Added active hashrate and rolling hashrate side by side so visitors can distinguish live performance from longer-window pool averages.",
      "Integrated the Pearl miner with the JackGPT GPU idle guard so mining yields to image generation and other GPU-intensive demos, then resumes after an idle cooldown.",
    ],
    tech: ["FastAPI", "Vanilla JS", "Docker Compose", "Public pool APIs", "GPU idle guard", "Cloudflare Tunnel"],
    links: [{ label: "pearl.jackgpt.org", href: "https://pearl.jackgpt.org" }],
    screenshots: [
      {
        src: "/project-images/pearl-desk/pearl-desk-overview.png",
        caption: "Pearl Desk overview with live PRL price, pending payout, active hashrate, projected PRL/day, and GPU idle-guard status",
      },
      {
        src: "/project-images/pearl-desk/pearl-desk-hashrate-timeline.png",
        caption: "Hashrate timeline and one-hour revenue panels for the tracked mining wallets, with wallet labels redacted in the portfolio screenshot",
      },
    ],
  },
  {
    id: "ops-control-room",
    name: "JackGPT Ops Control Room",
    subtitle: "Private demo-readiness, incident memory, alerts, and safe repair controls",
    icon: Activity,
    accent: "blue",
    tags: ["Monitoring", "Runbooks", "Auto-repair", "Docker", "Cloudflare Access", "Browser QA"],
    summary:
      "A private operations dashboard that monitors the JackGPT ecosystem, warms demo paths, maps dependencies, remembers recurring incidents, sends alerts, and repairs predictable service failures before a recruiter demo goes sideways.",
    description:
      "JackGPT Ops Control Room is the private reliability layer behind the public portfolio. It watches public URLs, internal health endpoints, Docker containers, Cloudflare tunnels, host-side bot agents, search/image/AI dependencies, and browser-render screenshots. It also runs a demo-prep warmup, maintains a service dependency map, and keeps incident memory for recurring failure classes. The live surface is gated behind Cloudflare Access and shown publicly only as a case study, because it can restart services and coordinate host-side repair actions.",
    howItWorks: [
      "A Dockerized FastAPI dashboard polls public endpoints, internal container health, Docker state, selected host-agent signals, and browser-render checks on a recurring schedule.",
      "A private demo runbook warms critical routes, refreshes visual sentinels, checks Search/Ollama/Image Gen/Market/Kalshi/Pearl/Casino readiness, and returns suggested repairs before a live walkthrough.",
      "A dependency map rolls up service health across Cloudflare tunnels, OpenWebUI, Ollama, Search, Image Gen, Market Desk, Kalshi, Pearl, host agents, and alert channels.",
      "A private host-agent exposes narrowly scoped repair actions for predictable failures, such as restarting Search, OpenWebUI/Ollama, image generation, Market Desk, tunnels, Kalshi scanner, Moomoo, Salad, Pearl, and other allowlisted services.",
      "Ops sends compact ntfy alerts for repeated failures, degraded dependencies, blank visual checks, and recoveries while keeping alert payloads free of secrets, logs, paths, screenshots, and strategy data.",
      "Cloudflare Access keeps ops.jackgpt.org private, while this homepage case study and GitHub note explain the architecture without exposing credentials or live administrative controls.",
    ],
    developed: [
      "Built a private control room that gives one-click checks, demo warmups, quick fixes, container status, host-agent health, browser-render screenshots, and demo readiness scoring.",
      "Added automatic repair policy with cooldowns, thresholds, allowlisted targets, and public-safe remediation logs so failures can be fixed without creating restart loops.",
      "Added incident memory for recurring failures like Search degradation, image-generation GPU contention, WSL/Docker interruptions, Market data fallback, Kalshi heartbeat issues, and Ollama model slowness.",
      "Integrated Search-specific repair logic after repeated upstream-engine degradation, including stable SearXNG defaults and validation that prevents the old broken config from returning.",
      "Separated public status from private operations: recruiters can see live public health on jackgpt.org, while Ops retains the deeper restart, tunnel, and host-control tooling behind Access.",
    ],
    tech: ["FastAPI", "Docker Compose", "Cloudflare Access", "Docker SDK", "Playwright", "ntfy", "Host-agent bridge"],
    links: [
      { label: "ops.jackgpt.org (private)", href: "https://ops.jackgpt.org" },
      {
        label: "GitHub: architecture note",
        href: "https://github.com/jackvansickle1/JackGPTPortfolio/blob/main/public/code-notes/jackgpt-ops-control-room.md",
      },
    ],
    screenshots: [
      {
        src: "/project-images/ops-control-room/ops-readiness-overview.png",
        caption: "Private Ops dashboard showing demo readiness, the guarded Access boundary, and the controls used before recruiter walkthroughs",
      },
      {
        src: "/project-images/ops-control-room/ops-demo-runbook.png",
        caption: "Demo runbook and warmup checklist for touching critical AI, search, finance, image, and operations paths before a live demo",
      },
      {
        src: "/project-images/ops-control-room/ops-dependency-map.png",
        caption: "Dependency map and incident memory that connect symptoms to likely failing layers and known recovery protocols",
      },
      {
        src: "/project-images/ops-control-room/ops-repair-matrix.png",
        caption: "Allowlisted quick-fix matrix with cooldown-aware repair actions for predictable service failures",
      },
      {
        src: "/project-images/ops-control-room/ops-service-health.png",
        caption: "Core service and Docker container health view used before recruiter demos",
      },
    ],
  },
  {
    id: "kalshi-temperature-bot",
    name: "Kalshi Climate Desk",
    subtitle: "Live weather-market scanner and operations dashboard",
    icon: Cloud,
    accent: "blue",
    tags: ["Python", "Kalshi API", "Automation", "Operations Dashboard", "Docker", "Cloudflare Tunnel"],
    summary:
      "An automated Kalshi weather-market scanner with startup supervision, daily maintenance, and a live public-safe operations dashboard.",
    description:
      "Kalshi Climate Desk monitors and presents the operational side of a private weather-market automation system. The public dashboard at kalshi.jackgpt.org now feels like a full operations desk again: scanner health, heartbeat, bankroll trend, sanitized active exposure, city exposure, settled performance, timeline events, and deterministic exit lifecycle health as a supporting subsystem. Tickers, order IDs, prices, brackets, edges, keys, logs, model weights, and strategy logic stay private.",
    howItWorks: [
      "A private Python scanner retrieves market and weather inputs, then evaluates opportunities using non-public strategy logic.",
      "A Windows startup supervisor keeps scanner.py running, and each morning it stops the scanner, runs resolve.py and auto_optimize.py, then restarts scanner.py.",
      "A Dockerized FastAPI dashboard reads the bot database through a read-only mount and publishes public-safe aggregate telemetry plus a fast heartbeat health endpoint.",
      "The deterministic exit system separates open, exit_pending, exited, and settled lifecycle states so early exits are counted from confirmed fills without leaking private trade details.",
    ],
    developed: [
      "Installed an all-day scanner supervisor that starts on Windows login and recovers the bot if the process exits.",
      "Added morning maintenance automation for trade resolution, model optimization, and scanner restart.",
      "Built and deployed a Cloudflare Tunnel-ready Kalshi Climate Desk with scanner health, bankroll/performance views, sanitized exposure summaries, deterministic-exit accounting, public-safe status cards, and mobile-responsive JackGPT styling.",
    ],
    tech: ["Python", "SQLite", "FastAPI", "Docker Compose", "Cloudflare Tunnel", "Windows startup automation"],
    links: [{ label: "kalshi.jackgpt.org", href: "https://kalshi.jackgpt.org" }],
    screenshots: [
      {
        src: "https://raw.githubusercontent.com/jackvansickle1/JackGPTPortfolio/main/public/project-images/kalshi-temperature-bot/kalshi-climate-desk-overview.png",
        caption: "Kalshi Climate Desk showing scanner health, bankroll curve, active exposure, performance, and public-safe operations telemetry",
      },
      {
        src: "https://raw.githubusercontent.com/jackvansickle1/JackGPTPortfolio/main/public/project-images/kalshi-temperature-bot/kalshi-climate-desk-trades.png",
        caption: "Operations dashboard with sanitized active positions, city exposure, and deterministic-exit health without exposing tickers, order IDs, prices, brackets, or private strategy details",
      },
    ],
  },
  {
    id: "moomoo-paper-trader",
    name: "Moomoo Trading Bot",
    subtitle: "Paper-trading automation monitor with gateway and scheduler health",
    icon: TrendingUp,
    accent: "emerald",
    tags: ["Python", "Moomoo OpenD", "Paper trading", "Risk controls", "Windows automation", "Monitoring"],
    summary:
      "A public-safe status view for a private Moomoo paper-trading bot, showing automation health, sanitized paper positions, and P/L without exposing accounts, orders, signals, or strategy internals.",
    description:
      "Moomoo Trading Bot Status tracks the operational health of a paper-first Moomoo portfolio trader. The public JackGPT status layer reports whether the paper runner, Moomoo OpenD gateway, and Windows scheduler are online, plus sanitized paper portfolio/P&L summaries, while keeping account IDs, order details, signals, and private strategy logic out of the public UI.",
    howItWorks: [
      "A Windows scheduled task launches a tray supervisor for the paper-trading runner at login.",
      "The runner connects to local Moomoo OpenD in paper mode and applies risk gates before any paper order submission.",
      "A private host-agent exposes sanitized health to the JackGPT stack, and moomoo.jackgpt.org publishes only public-safe service status.",
    ],
    developed: [
      "Built a paper-first Moomoo automation project with explicit risk controls and a local simulator fallback.",
      "Installed Windows startup supervision so the runner and OpenD gateway can stay available across sessions.",
      "Integrated a sanitized health bridge into JackGPT Ops, the public homepage status section, and a dedicated moomoo.jackgpt.org dashboard without leaking account identifiers, raw order rows, signals, or strategy details.",
    ],
    tech: ["Python", "Moomoo OpenD", "Scheduled Tasks", "Host-agent bridge", "Paper trading", "Risk controls"],
    links: [{ label: "moomoo.jackgpt.org", href: "https://moomoo.jackgpt.org" }],
    screenshots: [
      {
        src: "/project-images/moomoo-paper-trader/moomoo-paper-trader-dashboard.png",
        caption: "Moomoo paper-trading status dashboard with runner health, gateway latency, paper equity, open positions, and P/L summary",
      },
      {
        src: "/project-images/moomoo-paper-trader/moomoo-paper-trader-positions.png",
        caption: "Sanitized paper portfolio table showing current paper holdings, market value, and unrealized P/L without account identifiers or order IDs",
      },
    ],
  },
  {
    id: "salad-compute-node",
    name: "Salad Compute Node",
    subtitle: "Host compute workload status and service monitor",
    icon: Cpu,
    accent: "cyan",
    tags: ["Compute", "Windows service", "GPU workloads", "Monitoring", "Ops"],
    summary:
      "A public-safe status monitor for the local Salad compute node, showing workload service health as part of the broader JackGPT operations layer.",
    description:
      "Salad Compute Node tracks the host-side compute service, workload process, and desktop controller while distinguishing faults from owner-requested downtime. The workload is currently intentionally paused, so JackGPT reports a healthy idle state instead of manufacturing an outage.",
    howItWorks: [
      "The private host-agent checks the Salad Bowl Windows service and related workload/controller processes.",
      "salad.jackgpt.org exposes a sanitized health dashboard that reports generic component status, intentional-pause state, and timestamps.",
      "The homepage consumes that endpoint in the same live monitoring section as the rest of the JackGPT ecosystem.",
    ],
    developed: [
      "Added host-service checks for Salad without exposing local paths, logs, account state, or workload internals.",
      "Integrated Salad into JackGPT Ops, public live status, and salad.jackgpt.org with explicit healthy-idle semantics so auto-repair does not fight an intentional shutdown.",
      "Kept it positioned as infrastructure visibility rather than a flagship recruiter project.",
    ],
    tech: ["Windows service monitoring", "Host-agent bridge", "Ops", "GPU/compute workloads"],
    links: [{ label: "salad.jackgpt.org", href: "https://salad.jackgpt.org" }],
    screenshots: [
      {
        src: "/project-images/salad-compute-node/salad-compute-node-dashboard.png",
        caption: "Salad compute workload view with job readiness, active workload state, GPU telemetry, shares, and service-health timeline",
      },
    ],
  },
  {
    id: "kalshi-btc-bot",
    name: "Kalshi BTC Market-Making Bot",
    subtitle: "Algorithmic market-making strategy",
    icon: TrendingUp,
    accent: "orange",
    tags: ["Python", "Market making", "APIs", "Automation"],
    summary:
      "An experimental market-making bot for cryptocurrency-related prediction markets.",
    description:
      "This bot is designed to place and manage orders in Kalshi BTC-related markets with the goal of capturing spread and liquidity opportunities. It monitors market conditions and updates order placement according to configurable rules.",
    howItWorks: [
      "The bot pulls market data, evaluates bid-ask spreads, and determines where to place orders.",
      "It manages risk using position limits and order-update logic.",
      "The strategy can be tuned based on volatility, expected value, and inventory constraints.",
    ],
    developed: [
      "Researched exchange behavior and trading constraints.",
      "Implemented order-management logic and tested execution flow.",
      "Designed the system for iterative tuning and monitoring.",
    ],
    tech: ["Python", "Kalshi API", "Trading logic", "Risk controls"],
    links: [{ label: "GitHub demo", href: "https://github.com/jackvansickle1/kalshi-market-maker-simulator" }],
    screenshots: [
      {
        src: "/project-images/ops-control-room/kalshi-market-maker-repo.png?v=20260716",
        caption:
          "Public-safe market-making simulator with typed order-book models, inventory-aware quoting, deterministic risk checks, and a documented boundary around private production strategy",
      },
    ],
  },

  {
    id: "ninjatrader-bot",
    name: "NinjaTrader Bot",
    subtitle: "Algorithmic futures trading and execution",
    icon: LineChart,
    accent: "orange",
    tags: ["NinjaTrader", "Futures", "Automation", "Risk controls"],
    summary:
      "A rules-based trading bot built to automate futures trade execution and risk management.",
    description:
      "This project centers on a NinjaTrader-based trading bot designed to automate entries, exits, and risk-management rules in futures markets. It is intended to reduce manual execution error, apply consistent decision rules, and support repeatable evaluation of strategy performance.",
    howItWorks: [
      "The strategy evaluates market conditions and generates entries according to predefined rules.",
      "Once in a position, the bot manages stop-losses, targets, and other trade constraints automatically.",
      "Trade data can be reviewed for performance analysis and iterative strategy improvement.",
    ],
    developed: [
      "Implemented strategy logic and order-management rules within NinjaTrader.",
      "Added risk controls such as stop-loss and profit-target behavior.",
      "Tested execution behavior through simulation and strategy review.",
    ],
    tech: ["NinjaTrader", "C# / NinjaScript", "Futures", "Risk controls"],
    links: [{ label: "GitHub demo", href: "https://github.com/jackvansickle1/ninjatrader-risk-controls-demo" }],
    screenshots: [
      {
        src: "/project-images/ops-control-room/ninjatrader-risk-controls-repo.png?v=20260716",
        caption:
          "Recruiter-safe NinjaTrader risk-control sample covering daily loss gates, consecutive-loss lockouts, ATR sizing, and strategy lifecycle boundaries without exposing entry signals",
      },
    ],
  },
];

const homepageProjectOrder = [
  "market-desk",
  "jackgpt",
  "automatic1111",
  "jackgpt-search",
  "kalshi-temperature-bot",
  "pearl-desk",
  "ops-control-room",
  "moomoo-paper-trader",
  "meshcentral",
  "salad-compute-node",
  "kalshi-btc-bot",
  "ninjatrader-bot",
  "casino",
];

const homepageProjects = [...projects].sort((left, right) => {
  const leftIndex = homepageProjectOrder.indexOf(left.id);
  const rightIndex = homepageProjectOrder.indexOf(right.id);
  return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex);
});


const fallbackStatuses = [
  {
    key: "openwebui",
    name: "JackGPT AI Workspace",
    description: "Checking the public AI workspace and model routing.",
    endpoint: "https://app.jackgpt.org/api/version",
    publicUrl: "https://app.jackgpt.org",
    latencyMs: null,
    httpStatus: "-",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "images",
    name: "JackGPT Image Gen",
    description: "Checking the public GPU-backed image and video generation endpoint.",
    endpoint: "https://images.jackgpt.org/health",
    publicUrl: "https://images.jackgpt.org",
    latencyMs: null,
    httpStatus: "-",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "meshcentral",
    name: "JackGPT Mesh",
    description: "Checking the remote-management portal.",
    endpoint: "https://mesh.jackgpt.org",
    publicUrl: "https://mesh.jackgpt.org",
    latencyMs: null,
    httpStatus: "-",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "jackgpt-search",
    name: "JackGPT Search",
    description: "Checking the branded JackGPT Search endpoint.",
    endpoint: "https://search.jackgpt.org",
    publicUrl: "https://search.jackgpt.org",
    latencyMs: null,
    httpStatus: "-",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "market-desk",
    name: "JackGPT Market Desk",
    description: "Checking the AI-powered equity research dashboard.",
    endpoint: "https://market.jackgpt.org/health",
    publicUrl: "https://market.jackgpt.org",
    latencyMs: null,
    httpStatus: "-",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "casino",
    name: "JackGPT Casino",
    description: "Checking the playable casino game endpoint.",
    endpoint: "https://casino.jackgpt.org/health",
    publicUrl: "https://casino.jackgpt.org",
    latencyMs: null,
    httpStatus: "-",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "kalshi-temperature-bot",
    name: "Kalshi Climate Desk",
    description: "Checking the Kalshi Climate Desk scanner heartbeat.",
    endpoint: "https://kalshi.jackgpt.org/health",
    publicUrl: "https://kalshi.jackgpt.org",
    latencyMs: null,
    httpStatus: "-",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "pearl-desk",
    name: "JackGPT Pearl Desk",
    description: "Checking PRL mining telemetry, wallet balance, and GPU idle-guard status.",
    endpoint: "https://pearl.jackgpt.org/health",
    publicUrl: "https://pearl.jackgpt.org",
    latencyMs: null,
    httpStatus: "-",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "moomoo-paper-trader",
    name: "Moomoo Trading Bot",
    description: "Checking the public-safe paper-trading automation dashboard.",
    endpoint: "https://moomoo.jackgpt.org/health",
    publicUrl: "https://moomoo.jackgpt.org",
    latencyMs: null,
    httpStatus: "-",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "salad-compute-node",
    name: "Salad Compute Node",
    description: "Checking the public-safe host compute dashboard.",
    endpoint: "https://salad.jackgpt.org/health",
    publicUrl: "https://salad.jackgpt.org",
    latencyMs: null,
    httpStatus: "-",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "minecraft",
    name: "Minecraft Server",
    description: "Intentionally paused for now; excluded from outage scoring.",
    endpoint: "https://market.jackgpt.org/api/minecraft/health",
    publicUrl: "",
    showEndpoint: false,
    latencyMs: null,
    httpStatus: "-",
    checkedAt: null,
    status: "maintenance",
  },
  {
    key: "website",
    name: "JackGPT Homepage",
    description: "Checking the portfolio homepage.",
    endpoint: "https://jackgpt.org",
    publicUrl: "https://jackgpt.org",
    latencyMs: null,
    httpStatus: "-",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "external-watchdog",
    name: "JackGPT Public Status",
    description: "Checking the Cloudflare-hosted external watchdog.",
    endpoint: "https://status.jackgpt.org/health",
    publicUrl: "https://status.jackgpt.org",
    latencyMs: null,
    httpStatus: "-",
    checkedAt: null,
    status: "checking",
  },
];

function mergeStatuses(incoming) {
  if (!Array.isArray(incoming) || incoming.length === 0) return fallbackStatuses;
  return fallbackStatuses.map((fallback) => {
    const match = incoming.find((item) => item.key === fallback.key);
    if (fallback.status === "maintenance") {
      return {
        ...fallback,
        checkedAt: match?.checkedAt || fallback.checkedAt,
      };
    }
    return match ? { ...fallback, ...match } : fallback;
  });
}

function formatCheckedAt(value) {
  if (!value) return "Waiting for first check";
  try {
    return new Date(value).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "Waiting for first check";
  }
}

function formatEndpointHost(value) {
  if (!value) return "";
  try {
    return new URL(value).host;
  } catch {
    return value.replace(/^https?:\/\//, "");
  }
}


const accessLinks = [

  {
    label: "JackGPT AI Workspace",
    href: "https://app.jackgpt.org",
    description: "Self-hosted JackGPT 3.1 workspace with local models, web search, and image generation",
    accessLabel: "Sign up to try",
    accessTone: "signup",
    note: "Create an account from the sign-in page to explore the public AI workspace.",
  },
  {
    label: "JackGPT Image Gen",
    href: "https://images.jackgpt.org",
    description: "GPU-backed image and short-video generation studio",
    accessLabel: "Public demo",
    accessTone: "public",
    note: "Try text-to-image, text-to-video, or image-to-video generation on the live local GPU stack.",
  },
  {
    label: "JackGPT Mesh",
    href: "https://mesh.jackgpt.org",
    description: "Private remote-management portal and infrastructure operations surface",
    accessLabel: "Private admin",
    accessTone: "private",
    note: "Shown for infrastructure context and uptime; device access is restricted.",
  },
  {
    label: "JackGPT Ops Control Room",
    href: "https://ops.jackgpt.org",
    description: "Private demo-readiness monitor with alerts, browser checks, and allowlisted repairs",
    accessLabel: "Private ops",
    accessTone: "private",
    note: "Access is gated by Cloudflare Access; the public case study explains the architecture without exposing controls.",
  },
  {
    label: "JackGPT Public Status",
    href: "https://status.jackgpt.org",
    description: "Cloudflare-hosted external watchdog for public reachability and synthetic demo journeys.",
    accessLabel: "Public status",
    accessTone: "public",
    note: "Runs outside the home PC, so it can still report public outages if the local Docker host or tunnel is unhealthy.",
  },
  {
    label: "JackGPT Search",
    href: "https://search.jackgpt.org",
    description: "Branded public web-search endpoint",
    accessLabel: "Public demo",
    accessTone: "public",
    note: "A good quick demo of the JackGPT-branded utility services.",
  },
  {
    label: "JackGPT Market Desk",
    href: "https://market.jackgpt.org",
    description:
      "AI-powered equity research dashboard with live market snapshots and generated bull/bear analysis.",
    accessLabel: "Best first stop",
    accessTone: "featured",
    note: "Search a ticker like NVDA, MSFT, or AAPL to see the full product demo.",
  },
  {
    label: "JackGPT Casino",
    href: "https://casino.jackgpt.org",
    description: "Secondary interactive demo with craps, blackjack, racing, sound, and shared bankroll state.",
    accessLabel: "Public demo",
    accessTone: "public",
    note: "A secondary interactive demo of game logic, UI polish, and animation.",
  },
  {
    label: "Kalshi Climate Desk",
    href: "https://kalshi.jackgpt.org",
    description: "Public-safe operations dashboard for a live weather-market automation system.",
    accessLabel: "Live status",
    accessTone: "public",
    note: "Watch scanner uptime, bankroll trend, sanitized exposure, performance, and exit-system health without exposing trade rows, prices, or private strategy details.",
  },
  {
    label: "JackGPT Pearl Desk",
    href: "https://pearl.jackgpt.org",
    description: "PRL mining telemetry with wallet balances, hashrate timelines, revenue estimates, and GPU idle-guard status.",
    accessLabel: "Public demo",
    accessTone: "public",
    note: "Shows mining performance and how JackGPT pauses mining when AI or image-generation workloads need the GPU.",
  },
  {
    label: "Moomoo Trading Bot",
    href: "https://moomoo.jackgpt.org",
    description: "Public-safe paper-trading automation status dashboard.",
    accessLabel: "Live status",
    accessTone: "public",
    note: "Shows runner, gateway, scheduler, and heartbeat status while redacting accounts, orders, signals, and strategy details.",
  },
  {
    label: "Salad Compute Node",
    href: "https://salad.jackgpt.org",
    description: "Public-safe host compute workload status dashboard.",
    accessLabel: "Live status",
    accessTone: "public",
    note: "Shows host compute readiness without exposing local paths, logs, account state, or workload internals.",
  },
  {
    label: "JackGPT Homepage",
    href: "https://jackgpt.org",
    description: "Public portfolio homepage",
    accessLabel: "You are here",
    accessTone: "home",
    note: "Use this page to jump into demos, case studies, code, and live status.",
  },
];

const companionPrompts = [
  "Give me a 5-minute recruiter tour.",
  "Walk me through the guided demo mode.",
  "Explain the architecture map.",
  "Which demo best proves full-stack engineering?",
  "What should I inspect in Market Desk?",
  "What is new in the JackGPT ecosystem?",
];

const demoSequence = [
  {
    step: "01",
    title: "Open the guided demo path",
    body:
      "Use the demo mode as the polished recruiter script: Market Desk first, AI Workspace second, then Image Gen/Search, Kalshi/Pearl/Ops, code, and contact.",
    href: "#/demo",
    cta: "Launch demo mode",
    icon: Compass,
  },
  {
    step: "02",
    title: "Prove product depth with Market Desk",
    body:
      "Search NVDA, WD, CVS, or MSFT to show data ingestion, financial statement handling, charting, source health, news, and stock-aware chat.",
    href: "https://market.jackgpt.org",
    cta: "Open Market Desk",
    icon: LineChart,
    external: true,
  },
  {
    step: "03",
    title: "Show self-hosted AI operations",
    body:
      "JackGPT AI Workspace, Image Gen, and Search demonstrate local LLMs, tool use, GPU workloads, theming, and Cloudflare-routed service design.",
    href: "https://app.jackgpt.org",
    cta: "Open AI Workspace",
    icon: Bot,
    external: true,
  },
  {
    step: "04",
    title: "Close with reliability and code",
    body:
      "Use the public status page, Ops case study, screenshots, GitHub, and contact card to make the engineering discipline visible without exposing private controls.",
    href: "#/blog/cloudflare-watchdog-keeps-jackgpt-honest",
    cta: "Read ops note",
    icon: Shield,
  },
];

const architectureLayers = [
  {
    title: "Visitor-facing layer",
    icon: Globe,
    body:
      "jackgpt.org, Market Desk, AI Workspace, Image Gen, Search, Kalshi, Pearl, Moomoo, Salad, and Casino are grouped by product value instead of raw hostnames.",
    points: ["Recruiter navigation", "Case studies and screenshots", "Human-friendly service names", "Public-safe explanations"],
  },
  {
    title: "Application layer",
    icon: Server,
    body:
      "React/Vite frontends and FastAPI or upstream-backed services expose small health endpoints, graceful degraded states, and clear public boundaries.",
    points: ["React/Vite product UIs", "FastAPI service APIs", "OpenWebUI/Ollama", "Docker Compose health checks"],
  },
  {
    title: "AI and data layer",
    icon: Cpu,
    body:
      "Ollama, JackGPT Search, public market/SEC data, image generation, PRL telemetry, and host-agent bridges feed the demos while staying configurable and observable.",
    points: ["Local LLM inference", "Search context", "Market/news data", "GPU workload coordination"],
  },
  {
    title: "Operations layer",
    icon: Activity,
    body:
      "Private Ops plus the Cloudflare external watchdog watch demos from inside and outside the machine, alert on repeated failures, and document predictable repair paths.",
    points: ["ops.jackgpt.org private", "status.jackgpt.org public", "ntfy alerts", "Allowlisted repairs"],
  },
];

const demoClips = [
  {
    title: "Market Desk in 90 seconds",
    body:
      "Load a ticker, scan the snapshot, explain the chart/financial statements/signals, then ask the stock chat a business question.",
    href: "https://market.jackgpt.org",
    image: "/project-images/market-desk/market-desk-terminal.png",
  },
  {
    title: "Ops Control Room story",
    body:
      "Explain how the ecosystem is monitored, how demo readiness is measured, and why private repair controls stay behind Cloudflare Access.",
    href: "#/project/ops-control-room",
    image: "/project-images/ops-control-room/ops-demo-runbook.png",
  },
  {
    title: "AI Workspace tool demo",
    body:
      "Sign up, ask JackGPT 3.1 for web-grounded context, then try an image-generation prompt to show local AI plus tools.",
    href: "https://app.jackgpt.org",
    image: "/project-images/jackgpt/jackgpt-chat-home.png",
  },
];

const blogPosts = [
  {
    slug: "operating-jackgpt-like-a-product",
    title: "Operating JackGPT Like a Product, Not a Portfolio Page",
    date: "2026-06-30",
    readTime: "4 min read",
    summary:
      "Why I turned jackgpt.org into a live command center with demo paths, public status, screenshots, AI guidance, and recruiter-safe boundaries.",
    tags: ["Portfolio", "Product design", "Operations"],
    sections: [
      {
        heading: "The problem",
        body: [
          "A portfolio that only lists projects makes the viewer do too much work. Recruiters should not need a guided call to understand what is impressive, what is live, and what is intentionally private.",
          "JackGPT now treats the homepage as a product surface: human service names, public endpoint cards, project drilldowns, screenshots, live status, contact links, GitHub, and an AI guide that knows the ecosystem.",
        ],
      },
      {
        heading: "The product decision",
        body: [
          "The first path prioritizes the strongest proof: Market Desk, JackGPT AI Workspace, Image Gen/Search, Kalshi Climate Desk, Pearl Desk, Ops, GitHub, and then secondary demos like Casino.",
          "That order matters. It sells full-stack engineering, local AI infrastructure, GPU work, automation reliability, and public-safe deployment before showing lighter experiments.",
        ],
      },
      {
        heading: "What it proves",
        body: [
          "The project is not just individual apps. It is a small operated ecosystem: Dockerized services, Cloudflare routing, health endpoints, degraded states, alerting, visual QA, and public/private data boundaries.",
        ],
      },
    ],
  },
  {
    slug: "self-hosted-ai-workspace-demo-ready",
    title: "Making a Self-Hosted AI Workspace Demo-Ready",
    date: "2026-06-30",
    readTime: "5 min read",
    summary:
      "The engineering behind app.jackgpt.org: OpenWebUI, Ollama, branded onboarding, search, image generation, model context, and operational guardrails.",
    tags: ["AI", "Ollama", "OpenWebUI", "Docker"],
    sections: [
      {
        heading: "From local model to product",
        body: [
          "The difference between a local LLM and a product is everything around it: sign-up flow, theming, tool use, service dependencies, helpful starter prompts, model identity, and uptime monitoring.",
          "JackGPT 3.1 is configured as the default assistant with current ecosystem context, but it is instructed not to force portfolio context into unrelated conversations.",
        ],
      },
      {
        heading: "Tools and boundaries",
        body: [
          "The workspace can use JackGPT Search for web grounding and JackGPT Image Gen for visual generation. It does not volunteer the search backend implementation unless specifically asked.",
          "The same context includes public-safety rules: no secrets, private paths, tunnel tokens, account data, order IDs, or valuable trading strategy details.",
        ],
      },
      {
        heading: "Demo readiness",
        body: [
          "Ops and the external watchdog check the AI workspace from different angles. The goal is not to pretend nothing fails; it is to make failures visible, recoverable, and less likely during a live demo.",
        ],
      },
    ],
  },
  {
    slug: "market-desk-public-data-ai",
    title: "Market Desk: Useful AI Around Messy Public Data",
    date: "2026-06-30",
    readTime: "5 min read",
    summary:
      "How Market Desk combines ticker search, public market data, financial statements, news, signals, and stock-aware chat without pretending to be investment advice.",
    tags: ["Finance", "AI", "FastAPI", "React"],
    sections: [
      {
        heading: "Why it exists",
        body: [
          "Market Desk is the flagship full-stack product demo because it has real product shape: a terminal UI, backend data aggregation, dependency health, charting, financial statements, news, signals, and contextual chat.",
          "The demo is intentionally framed as research and portfolio work, not financial advice.",
        ],
      },
      {
        heading: "Data reality",
        body: [
          "Free public market data is inconsistent. Rather than hide that, Market Desk shows source health, uses fallbacks, and answers from loaded data before leaning on AI prose.",
          "The stock chat was adjusted to answer business-description questions directly first, using ticker context, company profile data, filings/news context when available, and clear uncertainty.",
        ],
      },
      {
        heading: "Recruiter signal",
        body: [
          "This project shows React/Vite frontend work, FastAPI backend design, rate/request guards, graceful degradation, local AI integration, and the discipline to avoid fake analyst consensus.",
        ],
      },
    ],
  },
  {
    slug: "public-safe-ops-for-automation",
    title: "Public-Safe Ops for Trading and Compute Automation",
    date: "2026-06-30",
    readTime: "4 min read",
    summary:
      "How Kalshi, Moomoo, Salad, and Pearl expose useful operational information without leaking valuable strategy or credentials.",
    tags: ["Security", "Automation", "Monitoring"],
    sections: [
      {
        heading: "The public/private split",
        body: [
          "Some projects are impressive precisely because they are sensitive. A trading dashboard can show health, bankroll curve, sanitized exposure, outcomes, and lifecycle status without exposing order IDs, prices, brackets, edges, or model weights.",
          "The same principle applies to Moomoo, Salad, and Pearl: show operational quality, not secrets.",
        ],
      },
      {
        heading: "Examples",
        body: [
          "Kalshi Climate Desk shows aggregate bot health and performance. Moomoo shows paper-trading status and sanitized P/L. Salad shows compute-node status. Pearl shows mining telemetry and GPU idle coordination.",
          "The shared design principle is to show meaningful operational behavior while keeping credentials, account identifiers, private logs, and strategy internals out of public views.",
        ],
      },
      {
        heading: "The lesson",
        body: [
          "Recruiter-visible work can be transparent without being reckless. The goal is to prove engineering taste: useful telemetry, redaction, health checks, and safe defaults.",
        ],
      },
    ],
  },
  {
    slug: "cloudflare-watchdog-keeps-jackgpt-honest",
    title: "A Cloudflare Watchdog That Keeps JackGPT Honest",
    date: "2026-06-30",
    readTime: "4 min read",
    summary:
      "Why status.jackgpt.org runs outside the home PC, what it checks, and how it complements the private Ops Control Room.",
    tags: ["Cloudflare", "Workers", "Reliability"],
    sections: [
      {
        heading: "Why outside monitoring matters",
        body: [
          "If the home machine, WSL, Docker, or a Cloudflare tunnel breaks, an internal monitor can be blind. The external watchdog runs on Cloudflare Workers so it can still report public reachability from outside the host.",
          "It stores state in Workers KV, runs on a cron trigger, and sends concise ntfy alerts only after repeated failures or recovery events.",
        ],
      },
      {
        heading: "What it checks",
        body: [
          "The watchdog checks core public services and synthetic user journeys: homepage status, AI workspace version, image generation, search results, Market Desk ticker/news flows, Kalshi public summary, Pearl wallet telemetry, utilities, and Minecraft probe health.",
          "The public status page is sanitized. Admin manual runs and alert tests remain protected by a bearer token.",
        ],
      },
      {
        heading: "How it fits Ops",
        body: [
          "Private Ops is the repair/control room. The Cloudflare watchdog is the outside witness. Together they make demo failures more detectable, less mysterious, and easier to fix before a recruiter sees them.",
        ],
      },
    ],
  },
];

const initialCompanionMessage = {
  role: "assistant",
  content:
    "I can give you a recruiter-ready tour of JackGPT: guided demo mode, where to start, what each project proves, which demos are public, and what is intentionally private. Ask for a 5-minute path, architecture map, or project-by-project review.",
};

function BrandMark({ size = 32 }) {
  return (
    <svg
      className="brand-symbol"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="4" y="4" width="56" height="56" rx="6" fill="currentColor" />
      <path d="M17 20 29 32 17 44" className="brand-symbol-command" />
      <path d="M33 44h11" className="brand-symbol-cursor" />
      <rect x="45" y="15" width="8" height="8" rx="2" className="brand-symbol-node" />
    </svg>
  );
}

function SiteNav({ onOpenContact, onOpenGuide }) {
  return (
    <header className="site-nav">
      <div className="site-nav-inner">
        <a href="#top" className="brand-lockup" aria-label="JackGPT portfolio home">
          <span className="brand-mark">
            <BrandMark size={32} />
          </span>
          <span className="brand-copy">
            <strong>JackGPT</strong>
            <small>Jack VanSickle</small>
          </span>
        </a>

        <nav className="nav-links" aria-label="Portfolio navigation">
          <a href="#projects">Work</a>
          <a href="#/demo">Demo</a>
          <a href="#/architecture">Architecture</a>
          <a href="#/hire/spreadsheet-rescue">Hire</a>
          <a href="#/blog">Notes</a>
        </nav>

        <div className="nav-actions">
          <a
            href="https://status.jackgpt.org"
            className="nav-action"
            target="_blank"
            rel="noreferrer"
            title="Open public status"
          >
            <Activity size={17} />
            <span className="nav-action-text">Status</span>
          </a>
          <a
            href="https://github.com/jackvansickle1"
            className="nav-action icon-only"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Jack VanSickle's GitHub profile"
            title="GitHub profile"
          >
            <FolderGit size={17} />
          </a>
          <button
            type="button"
            className="nav-action icon-only"
            onClick={onOpenGuide}
            aria-label="Open JackGPT recruiter guide"
            aria-controls="guide-panel"
            title="Ask the recruiter guide"
          >
            <MessageCircle size={17} />
          </button>
          <button
            type="button"
            className="nav-action icon-only"
            onClick={onOpenContact}
            aria-label="Open contact information"
            title="Contact Jack"
          >
            <Mail size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}

function App() {
  const [route, setRoute] = useState(window.location.hash || "#/");

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const detailId = useMemo(() => {
    const match = route.match(/^#\/project\/(.+)$/);
    return match ? match[1] : null;
  }, [route]);

  const blogSlug = useMemo(() => {
    const match = route.match(/^#\/blog\/(.+)$/);
    return match ? match[1] : null;
  }, [route]);

  const selectedProject = projects.find((project) => project.id === detailId);
  const selectedPost = blogPosts.find((post) => post.slug === blogSlug);

  if (route === "#/demo") {
    return <DemoModePage />;
  }

  if (route === "#/architecture") {
    return <ArchitecturePage />;
  }

  if (route === "#/blog") {
    return <BlogIndexPage />;
  }

  if (route === "#/hire/spreadsheet-rescue") {
    return <SpreadsheetRescuePage />;
  }

  if (selectedPost) {
    return <BlogPostPage post={selectedPost} />;
  }

  if (selectedProject) {
    return <ProjectDetail project={selectedProject} />;
  }

  return <HomePage />;
}


function HomePage() {
  const [liveStatuses, setLiveStatuses] = useState(fallbackStatuses);
  const [activeAccessIndex, setActiveAccessIndex] = useState(0);
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [companionMessages, setCompanionMessages] = useState([initialCompanionMessage]);
  const [companionMessagesNode, setCompanionMessagesNode] = useState(null);
  const [companionInput, setCompanionInput] = useState("");
  const [companionLoading, setCompanionLoading] = useState(false);
  const [companionStatus, setCompanionStatus] = useState("Ready with recruiter project context");
  const [statusMeta, setStatusMeta] = useState({
    loading: true,
    error: "",
    source: "/api/status/summary",
  });

  useEffect(() => {
    let cancelled = false;

    const loadStatuses = async () => {
      try {
        const response = await fetch("/api/status/summary", {
          headers: { accept: "application/json" },
          cache: "default",
        });

        if (!response.ok) {
          throw new Error(`Status endpoint returned ${response.status}`);
        }

        const data = await response.json();

        if (cancelled) return;

        setLiveStatuses(mergeStatuses(data.services));
        setStatusMeta({
          loading: false,
          error: "",
          source: "/api/status/summary",
        });
      } catch (error) {
        if (cancelled) return;

        setLiveStatuses((current) =>
          current.map((item) => ({
            ...item,
            status: item.checkedAt ? item.status : "checking",
          }))
        );
        setStatusMeta({
          loading: false,
          error: error instanceof Error ? error.message : "Status check failed",
          source: "/api/status/summary",
        });
      }
    };

    loadStatuses();
    const intervalId = setInterval(loadStatuses, 60000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const openFromGuideHash = () => {
      if (window.location.hash === "#guide") {
        setIsCompanionOpen(true);
      }
    };

    openFromGuideHash();
    window.addEventListener("hashchange", openFromGuideHash);
    return () => window.removeEventListener("hashchange", openFromGuideHash);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("modal-scroll-lock", isCompanionOpen || isContactOpen);
    return () => document.body.classList.remove("modal-scroll-lock");
  }, [isCompanionOpen, isContactOpen]);

  useEffect(() => {
    if (!isCompanionOpen && !isContactOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      setIsCompanionOpen(false);
      setIsContactOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isCompanionOpen, isContactOpen]);

  useEffect(() => {
    if (!isCompanionOpen || !companionMessagesNode) return;

    const frameId = window.requestAnimationFrame(() => {
      companionMessagesNode.scrollTop = companionMessagesNode.scrollHeight;
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [companionMessages, companionMessagesNode, companionLoading, isCompanionOpen]);

  const askCompanion = async (rawQuestion = companionInput) => {
    const question = rawQuestion.trim();
    if (!question || companionLoading) return;

    setIsCompanionOpen(true);

    const outgoingMessages = [
      ...companionMessages,
      {
        role: "user",
        content: question,
      },
    ];

    setCompanionMessages(outgoingMessages);
    setCompanionInput("");
    setCompanionLoading(true);
    setCompanionStatus("Building a recruiter-focused answer...");

    try {
      const response = await fetch("/api/companion", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question,
          messages: outgoingMessages,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || `Companion returned ${response.status}`);
      }

      const aiStatus = data.dependencies?.ollama?.status;
      setCompanionMessages([
        ...outgoingMessages,
        {
          role: "assistant",
          content: data.answer || "I could not generate a useful answer, but the homepage project cards are the best next place to look.",
        },
      ]);
      setCompanionStatus(
        aiStatus === "online"
          ? "Answered by AI with curated project context"
          : "Answered with reliable public-context fallback"
      );
    } catch (error) {
      setCompanionMessages([
        ...outgoingMessages,
        {
          role: "assistant",
          content:
            "I could not reach the companion endpoint. Start with Market Desk, then JackGPT AI Workspace, Image Gen, Search, Kalshi Climate Desk, the project cards, and live status.",
        },
      ]);
      setCompanionStatus(error instanceof Error ? error.message : "Companion request failed");
    } finally {
      setCompanionLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <SiteNav
        onOpenContact={() => setIsContactOpen(true)}
        onOpenGuide={() => setIsCompanionOpen(true)}
      />

      <header id="top" className="hero section">
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow">
            <span className="signal-node" aria-hidden="true" />
            Recruiter portfolio / systems in production
          </span>
          <h1 className="hero-title">
            <span>Jack VanSickle builds</span>
            <span className="hero-title-accent">AI products that operate</span>
            <span>beyond the demo.</span>
          </h1>
          <p className="hero-text">
            I design, deploy, and maintain full-stack AI, fintech, automation, and
            infrastructure systems. The work below is live, observable, and documented
            with real interfaces, implementation detail, and public-safe boundaries.
          </p>
          <div className="hero-capabilities" aria-label="Core engineering capabilities">
            <span>React + FastAPI</span>
            <span>Docker + Cloudflare</span>
            <span>Local AI + GPU orchestration</span>
          </div>
          <div className="hero-actions">
            <a href="#/demo" className="button primary">
              Run the 5-minute tour <ArrowRight size={16} />
            </a>
            <a href="#projects" className="button secondary">
              Review the work <ArrowRight size={16} />
            </a>
            <a href="#/hire/spreadsheet-rescue" className="button secondary">
              Hire me for CSV cleanup <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-label="Featured project previews">
          <a className="hero-preview hero-preview-main" href="#/project/market-desk">
            <img
              src="/project-images/market-desk/market-desk-terminal.png"
              alt="Market Desk equity research terminal showing an NVIDIA snapshot and service status"
            />
            <span className="hero-preview-caption">
              <small>Flagship full-stack product</small>
              <strong>Market Desk</strong>
              <span>Market data, research briefs, charts, and stock-aware AI</span>
            </span>
          </a>
          <div className="hero-preview-stack">
            <a className="hero-preview" href="#/project/jackgpt">
              <img
                src="/project-images/jackgpt/jackgpt-chat-home.png"
                alt="JackGPT local AI workspace ready for a new conversation"
              />
              <span className="hero-preview-caption">
                <small>Self-hosted AI</small>
                <strong>AI Workspace</strong>
              </span>
            </a>
            <a className="hero-preview" href="#/project/automatic1111">
              <img
                src="/project-images/automatic1111/jackgpt-images-dashboard.png"
                alt="JackGPT GPU image and video generation studio"
              />
              <span className="hero-preview-caption">
                <small>Shared GPU platform</small>
                <strong>Image Gen</strong>
              </span>
            </a>
          </div>
        </div>
      </header>

      <section className="proof-strip" aria-label="Portfolio evidence">
        <div>
          <strong>{projects.length}</strong>
          <span>documented systems</span>
        </div>
        <div>
          <strong>Product</strong>
          <span>interfaces backed by real services</span>
        </div>
        <div>
          <strong>Operations</strong>
          <span>health checks, fallbacks, and repair paths</span>
        </div>
        <div>
          <strong>Boundaries</strong>
          <span>public proof without private leakage</span>
        </div>
      </section>

      <section id="start" className="section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Recruiter review path</span>
            <h2>Three signals, in the order that matters</h2>
          </div>
          <p>
            Start with product depth, move through the local AI stack, and close on
            the operating discipline that keeps the public demos credible.
          </p>
          <a href="#/demo" className="button secondary small section-header-action">
            Open guided tour <ArrowRight size={16} />
          </a>
        </div>

        <div className="demo-sequence-grid recruiter-sequence">
          {demoSequence.slice(1).map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className="demo-sequence-card"
              >
                <div className="sequence-index">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Icon size={19} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <span className="view-link">
                  {item.cta}
                  {item.external ? <ArrowUpRight size={15} /> : <ArrowRight size={15} />}
                </span>
              </a>
            );
          })}
        </div>

        <div className="recruiter-note">
          <Shield size={19} />
          <div>
            <strong>Public proof is deliberate; private controls stay private.</strong>
            <p>
              Account-based demos are labeled, admin surfaces remain restricted, and
              trading views expose sanitized health rather than strategy internals.
            </p>
          </div>
        </div>
      </section>

      <section id="architecture" className="section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Architecture map</span>
            <h2>How the ecosystem fits together</h2>
          </div>
          <p>
            The public map explains the stack at a useful level: product surfaces,
            application services, AI/data dependencies, and operations monitoring
            without leaking secrets or private strategy internals.
          </p>
        </div>
        <ArchitectureMap compact />
      </section>

      <section id="blog" className="section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Engineering notes</span>
            <h2>Blog</h2>
          </div>
          <p>
            Short writeups that make the engineering decisions easier to evaluate:
            reliability, public-safe automation, AI tooling, and data-driven demos.
          </p>
        </div>
        <div className="blog-grid">
          {blogPosts.slice(0, 3).map((post) => (
            <a href={`#/blog/${post.slug}`} className="blog-card" key={post.slug}>
              <span className="eyebrow">{post.date} / {post.readTime}</span>
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
              <div className="tag-row">
                {post.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
              </div>
              <span className="view-link">Read post <ArrowRight size={15} /></span>
            </a>
          ))}
        </div>
        <div className="section-action-row">
          <a href="#/blog" className="button secondary">
            View all posts <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {isContactOpen ? (
        <div className="contact-overlay" role="presentation" onClick={() => setIsContactOpen(false)}>
          <article
            className="contact-card"
            role="dialog"
            aria-modal="true"
            aria-label="Contact Jack VanSickle"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="contact-head">
              <div>
                <span className="eyebrow">Contact</span>
                <h2>Reach Jack VanSickle</h2>
              </div>
              <button
                type="button"
                className="companion-close"
                onClick={() => setIsContactOpen(false)}
                aria-label="Close contact information"
              >
                <X size={17} />
              </button>
            </div>
            <p>
              Available for paid CSV cleanup, including Excel worksheets exported
              to CSV, plus recruiting and project follow-up. For Spreadsheet Rescue,
              start with the scope below and do not attach confidential data before
              we agree on handling.
            </p>
            <div className="contact-actions">
              <a href="#/hire/spreadsheet-rescue" className="contact-link">
                <CreditCard size={17} />
                <span>
                  <strong>View fixed Spreadsheet Rescue packages</strong>
                  Starting at $29 with Venmo preferred
                </span>
              </a>
              <a
                href="mailto:jvan8076@gmail.com?subject=Spreadsheet%20Rescue%20inquiry&body=File%20type%20%28Excel%2FCSV%29%3A%0AApproximate%20rows%3A%0ACleanup%20needed%3A%0ADeadline%3A%0A%0APlease%20do%20not%20attach%20confidential%20files%20to%20this%20first%20email."
                className="contact-link"
              >
                <Mail size={17} />
                <span>
                  <strong>Hire me for Spreadsheet Rescue</strong>
                  Request a paid cleanup quote
                </span>
              </a>
              <a
                href="https://github.com/jackvansickle1/spreadsheet-rescue"
                className="contact-link"
                target="_blank"
                rel="noreferrer"
              >
                <FolderGit size={17} />
                <span>
                  <strong>View the Spreadsheet Rescue work sample</strong>
                  Public tool, reports, PDF, and verified release
                </span>
              </a>
              <a href="mailto:jackvansickle@mst.edu" className="contact-link">
                <Mail size={17} />
                <span>
                  <strong>School email</strong>
                  jackvansickle@mst.edu
                </span>
              </a>
              <a href="mailto:jvan8076@gmail.com" className="contact-link">
                <Mail size={17} />
                <span>
                  <strong>Personal email</strong>
                  jvan8076@gmail.com
                </span>
              </a>
              <a href="tel:+18164166618" className="contact-link">
                <PhoneCall size={17} />
                <span>
                  <strong>Phone</strong>
                  816-416-6618
                </span>
              </a>
            </div>
          </article>
        </div>
      ) : null}

      <div id="guide" className={`companion-widget ${isCompanionOpen ? "open" : ""}`}>
        {isCompanionOpen ? (
          <article
            id="guide-panel"
            className="companion-panel"
            role="dialog"
            aria-modal="true"
            aria-label="JackGPT AI guide"
          >
            <div className="companion-head">
              <div className="companion-title">
                <span className="companion-icon">
                  <Sparkles size={18} />
                </span>
                <div>
                  <h3>JackGPT Guide</h3>
                  <p>{companionStatus}</p>
                </div>
              </div>
              <div className="companion-actions">
                <span className={`status-pill ${companionLoading ? "checking" : "online"}`}>
                  {companionLoading ? <LoaderCircle size={14} className="spin-icon" /> : <MessageCircle size={14} />}
                  {companionLoading ? "Thinking" : "Ready"}
                </span>
                <button
                  type="button"
                  className="companion-close"
                  onClick={() => setIsCompanionOpen(false)}
                  aria-label="Close JackGPT guide"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            <div className="companion-messages" aria-live="polite" ref={setCompanionMessagesNode}>
              {companionMessages.map((message, index) => (
                <div className={`companion-message ${message.role}`} key={`${message.role}-${index}`}>
                  <span className="message-avatar">
                    {message.role === "assistant" ? <Sparkles size={15} /> : <UserRound size={15} />}
                  </span>
                  <div>
                    {message.content.split("\n").map((line, lineIndex) => (
                      <p key={`${index}-${lineIndex}`}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
              {companionLoading ? (
                <div className="companion-message assistant">
                  <span className="message-avatar">
                    <LoaderCircle size={15} className="spin-icon" />
                  </span>
                  <div>
                    <p>Reading the project map and shaping a recruiter-focused answer...</p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="companion-prompts compact" aria-label="Suggested questions">
              <div className="companion-prompt-head">
                <Compass size={16} />
                <h3>Try asking</h3>
              </div>
              <div className="prompt-row">
                {companionPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="prompt-chip"
                    onClick={() => askCompanion(prompt)}
                    disabled={companionLoading}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <form
              className="companion-form"
              onSubmit={(event) => {
                event.preventDefault();
                askCompanion();
              }}
            >
              <textarea
                value={companionInput}
                onChange={(event) => setCompanionInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    askCompanion();
                  }
                }}
                placeholder="Ask for a recruiter tour, project comparison, or what to inspect first..."
                maxLength={900}
                rows={3}
                aria-label="Ask the JackGPT guide a question"
              />
              <button type="submit" className="button primary companion-send" disabled={companionLoading || !companionInput.trim()}>
                <Send size={16} />
                Ask
              </button>
            </form>
          </article>
        ) : (
          <button
            type="button"
            className="companion-launcher"
            onClick={() => setIsCompanionOpen(true)}
            aria-label="Open JackGPT AI guide"
            aria-controls="guide-panel"
            aria-expanded="false"
          >
            <span className="launcher-icon">
              <MessageCircle size={24} />
            </span>
            <span className="launcher-copy">
              <strong>Ask JackGPT</strong>
              <small>Recruiter guide</small>
            </span>
          </button>
        )}
      </div>

      <section id="live-services" className="section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Access</span>
            <h2>Live services and public endpoints</h2>
          </div>
          <p>
            Direct links to the live interfaces that are published as part of the
            JackGPT environment. Badges show which services are instant public demos,
            which ones use signup, and which ones are intentionally restricted.
          </p>
        </div>

        <div className="access-carousel-shell">
          <div
            className="access-grid access-carousel-track"
            style={{ transform: `translateX(-${activeAccessIndex * 100}%)` }}
          >
            {accessLinks.map((link, index) => (
              <Motion.a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="access-card"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
              >
                <div className="access-top">
                  <span className={`access-badge ${link.accessTone}`}>{link.accessLabel}</span>
                  <ArrowUpRight size={18} className="card-arrow" />
                </div>
                <h3>{link.label}</h3>
                <p className="project-summary">{link.description}</p>
                <p className="access-note">{link.note}</p>
                <span className="view-link">Open service</span>
              </Motion.a>
            ))}
          </div>

          <div className="access-carousel-controls" aria-label="Access panel controls">
            <button
              type="button"
              className="carousel-button"
              onClick={() =>
                setActiveAccessIndex((current) =>
                  current === 0 ? accessLinks.length - 1 : current - 1
                )
              }
              aria-label="Previous endpoint"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="carousel-dots" aria-label="Endpoint pages">
              {accessLinks.map((link, index) => (
                <button
                  key={link.href}
                  type="button"
                  className={`carousel-dot ${index === activeAccessIndex ? "active" : ""}`}
                  onClick={() => setActiveAccessIndex(index)}
                  aria-label={`Go to ${link.label}`}
                  aria-pressed={index === activeAccessIndex}
                />
              ))}
            </div>
            <span className="carousel-count" aria-live="polite">
              {activeAccessIndex + 1} / {accessLinks.length}
            </span>

            <button
              type="button"
              className="carousel-button"
              onClick={() =>
                setActiveAccessIndex((current) =>
                  current === accessLinks.length - 1 ? 0 : current + 1
                )
              }
              aria-label="Next endpoint"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section id="projects" className="section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Selected engineering work</span>
            <h2>Real systems, shown in use</h2>
          </div>
          <p>
            Each card opens a dedicated case study with architecture, development
            decisions, screenshots, and live or public-safe code links.
          </p>
        </div>

        <div className="project-index-key" aria-label="Project ordering">
          <span><span className="key-line cyan" aria-hidden="true" /> Product and AI</span>
          <span><span className="key-line mint" aria-hidden="true" /> Automation and operations</span>
          <span><span className="key-line amber" aria-hidden="true" /> Finance and secondary builds</span>
        </div>

        <div className="project-grid">
          {homepageProjects.map((project, index) => {
            const Icon = project.icon;
            const projectShot = project.screenshots[0];
            const isFeatured = index < 4;
            return (
              <Motion.a
                key={project.id}
                href={`#/project/${project.id}`}
                className={`project-card ${isFeatured ? "project-card-featured" : "project-card-compact"} ${project.id === "casino" ? "secondary-project" : ""}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                {projectShot ? (
                  <div className="project-card-media">
                    <img
                      src={projectShot.src}
                      alt={projectShot.caption}
                      loading={index < 2 ? "eager" : "lazy"}
                    />
                    <span className={`project-role ${project.accent}`}>
                      {project.id === "casino" ? "Secondary build" : isFeatured ? "Featured system" : "Case study"}
                    </span>
                  </div>
                ) : null}
                <div className="project-card-body">
                  <div className="project-card-heading">
                    <div className={`icon-wrap ${project.accent}`}>
                      <Icon size={19} />
                    </div>
                    <div className="card-top">
                      <h3>{project.name}</h3>
                      <ArrowUpRight size={18} className="card-arrow" />
                    </div>
                  </div>
                  <p className="project-subtitle">{project.subtitle}</p>
                  <p className="project-summary">{project.summary}</p>
                  <div className="tag-row">
                    {project.tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="project-card-footer">
                    <span>{project.screenshots.length > 0 ? `${project.screenshots.length} screenshots` : "Overview page"}</span>
                    <span className="view-link">View case study <ArrowRight size={15} /></span>
                  </div>
                </div>
              </Motion.a>
            );
          })}
        </div>
      </section>

<section id="status" className="section">
  <div className="section-header">
    <div>
      <span className="eyebrow">Live monitoring</span>
      <h2>Real-time service status</h2>
    </div>
    <p>
      Live checks are pulled from a same-origin Pages Function so visitors can
      see current reachability, response time, and the most recent check time.
    </p>
  </div>

  <div className="status-grid">
    {liveStatuses.map((status, index) => (
      <Motion.article
        key={status.name}
        className="status-card"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.35, delay: index * 0.04 }}
      >
        <div className="status-head">
          <span className="status-label">Live system status</span>
          <span className={`status-pill ${status.status}`}>
            <Activity size={14} />
            {status.status === "online"
              ? "Online"
              : status.status === "degraded"
                ? "Degraded"
                : status.status === "offline"
                  ? "Offline"
                  : status.status === "maintenance"
                    ? "Paused"
                  : "Checking"}
          </span>
        </div>
        <h3>{status.name}</h3>
        <p className="status-description">{status.description}</p>
        {status.publicUrl && status.showEndpoint !== false ? (
          <a className="status-endpoint" href={status.publicUrl} target="_blank" rel="noreferrer">
            {formatEndpointHost(status.publicUrl)}
            <ArrowUpRight size={14} />
          </a>
        ) : null}
        <div className="metrics-grid metrics-grid-compact">
          <MetricBox
            label="Latency"
            value={typeof status.latencyMs === "number" ? `${status.latencyMs} ms` : "-"}
          />
          <MetricBox label="HTTP" value={status.httpStatus ?? "-"} />
          <MetricBox label="Checked" value={formatCheckedAt(status.checkedAt)} />
        </div>
      </Motion.article>
    ))}
  </div>
  <p className="status-footnote">
    {statusMeta.loading
      ? "Running first live check..."
      : statusMeta.error
        ? `Last refresh error: ${statusMeta.error}`
        : "Status checks refresh automatically every 60 seconds."}
  </p>
</section>

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true">
            <BrandMark size={30} />
          </span>
          <div>
            <strong>JackGPT</strong>
            <span>Built and operated by Jack VanSickle</span>
          </div>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <a href="#projects">Work</a>
          <a href="#/demo">Demo</a>
          <a href="#/architecture">Architecture</a>
          <a href="#/hire/spreadsheet-rescue">Hire</a>
          <a href="#/blog">Notes</a>
          <a href="https://status.jackgpt.org" target="_blank" rel="noreferrer">Status</a>
          <a href="https://github.com/jackvansickle1" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
        <button type="button" className="button secondary small" onClick={() => setIsContactOpen(true)}>
          <Mail size={16} /> Contact Jack
        </button>
      </footer>

    </div>
  );
}

function PageNav({ label = "Back to portfolio", href = "#/" }) {
  return (
    <div className="detail-nav">
      <div className="detail-nav-inner">
        <a href="#/" className="brand-lockup" aria-label="JackGPT portfolio home">
          <span className="brand-mark">
            <BrandMark size={30} />
          </span>
          <span className="brand-copy">
            <strong>JackGPT</strong>
            <small>Jack VanSickle</small>
          </span>
        </a>
        <nav className="detail-nav-links" aria-label="Portfolio routes">
          <a href="#/demo">Demo</a>
          <a href="#/architecture">Architecture</a>
          <a href="#/hire/spreadsheet-rescue">Hire</a>
          <a href="#/blog">Notes</a>
        </nav>
        <a href={href} className="button secondary small detail-back-link">
          <ArrowLeft size={16} /> {label}
        </a>
      </div>
    </div>
  );
}

function SpreadsheetRescuePage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const intakeHref =
    "mailto:jvan8076@gmail.com?subject=Spreadsheet%20Rescue%20%E2%80%94%20paid%20cleanup%20request&body=Package%20%28Quick%2FFull%2FRepeatable%29%3A%0AFile%20type%20%28CSV%20export%29%3A%0AApproximate%20rows%3A%0ACleanup%20needed%3A%0ADeadline%20and%20time%20zone%3A%0AAny%20sensitive%20data%3F%3A%0A%0APlease%20do%20not%20attach%20confidential%20files%20to%20this%20first%20email.";

  const packages = [
    {
      name: "Quick Rescue",
      price: "$29",
      note: "One CSV export, up to 2,500 rows",
      items: [
        "Conservative header and whitespace cleanup",
        "Approved blank-row and exact-duplicate removal",
        "Up to two explicit field-normalization rules",
        "Cleaned CSV, change report, and one scope-correction round",
      ],
    },
    {
      name: "Full Rescue",
      price: "From $79",
      note: "Up to three compatible CSV exports",
      items: [
        "Approved header, whitespace, blank-row, and duplicate cleanup",
        "Explicit date, currency, and phone normalization rules",
        "Markdown and JSON audit reports",
        "Written validation summary and one scope-correction round",
      ],
    },
    {
      name: "Repeatable Cleanup",
      price: "From $149",
      note: "A reusable workflow for a stable CSV schema",
      items: [
        "Reusable JSON cleanup configuration",
        "One verified example run on an approved export",
        "Dry-run and safe-rerun walkthrough",
        "Runbook, handoff notes, and one scope-correction round",
      ],
    },
  ];

  return (
    <div className="app-shell route-page service-page">
      <PageNav />

      <section className="detail-hero section service-hero">
        <span className="eyebrow">Same-day paid service</span>
        <h1>Clean the CSV. Keep the evidence.</h1>
        <p className="detail-description">
          Spreadsheet Rescue turns messy CSV exports into conservative, reviewable
          outputs. Your source stays untouched, ambiguous values stay unchanged,
          and every approved change is summarized before the job closes.
        </p>
        <div className="detail-links service-actions">
          <a href={intakeHref} className="button primary">
            Request a paid slot <Mail size={16} />
          </a>
          <a
            href="https://github.com/jackvansickle1/spreadsheet-rescue"
            target="_blank"
            rel="noreferrer"
            className="button secondary"
          >
            Inspect the public tool <FolderGit size={16} />
          </a>
        </div>
        <p className="service-availability">
          Same-day delivery is available only after the file shape, scope, price,
          and deadline are confirmed in writing.
        </p>
      </section>

      <section className="section service-proof-strip" aria-label="Service safeguards">
        <div>
          <Shield size={18} />
          <span><strong>Source preserved</strong>No in-place overwrite</span>
        </div>
        <div>
          <CheckCircle2 size={18} />
          <span><strong>16 tested behaviors</strong>Dry-run and audit controls</span>
        </div>
        <div>
          <CreditCard size={18} />
          <span><strong>Venmo preferred</strong>PayPal also accepted</span>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Clear starting scope</span>
            <h2>Choose the smallest package that solves the problem</h2>
          </div>
          <p>
            These are starting packages, not a promise that every workbook or export
            fits. You receive a written scope before payment is requested.
          </p>
        </div>
        <div className="detail-grid service-pricing-grid">
          {packages.map((item) => (
            <article className="detail-card service-price-card" key={item.name}>
              <span className="eyebrow">{item.name}</span>
              <strong className="service-price">{item.price}</strong>
              <p className="service-price-note">{item.note}</p>
              <ul className="detail-list service-list">
                {item.items.map((point) => <li key={point}>{point}</li>)}
              </ul>
              <a href={intakeHref} className="view-link service-card-cta">
                Check fit and availability <ArrowRight size={15} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section detail-grid service-terms-grid">
        <article className="detail-card service-wide-card">
          <div className="detail-card-header">
            <CreditCard size={18} />
            <h2>Payment without the awkward part</h2>
          </div>
          <p className="project-summary">
            New buyers pay a 50% deposit only after written scope confirmation.
            The balance is due after a delivery preview and audit summary, before
            release of the final cleaned files.
          </p>
          <div className="payment-actions">
            <a href="https://venmo.com/u/jv816" target="_blank" rel="noreferrer" className="button primary small">
              Venmo @jv816 <ArrowUpRight size={15} />
            </a>
            <a href="https://www.paypal.com/paypalme/wwzw" target="_blank" rel="noreferrer" className="button secondary small">
              PayPal @wwzw <ArrowUpRight size={15} />
            </a>
          </div>
          <p className="service-disclaimer">
            For paid services, tag a Venmo payment as a purchase or choose PayPal
            Goods &amp; Services when available. Never use Friends &amp; Family for this work.
          </p>
        </article>

        <article className="detail-card service-wide-card">
          <div className="detail-card-header">
            <Shield size={18} />
            <h2>Start without exposing the data</h2>
          </div>
          <p className="project-summary">
            The first email should contain only file type, approximate row count,
            requested cleanup, deadline, and whether the data is sensitive. Do not
            attach confidential files until a transfer and deletion plan is agreed.
          </p>
          <ul className="detail-list service-list">
            <li>CSV exports only; formulas, macros, charts, and formatting are out of scope.</li>
            <li>No fuzzy identity matching, enrichment, or invented missing values.</li>
            <li>Ambiguous typed values remain unchanged and are counted in the report.</li>
            <li>If delivered work misses the written scope, one correction round is included.</li>
          </ul>
        </article>
      </section>

      <section className="section service-final-cta">
        <span className="eyebrow">Ready when the file is</span>
        <h2>Send the shape of the problem, not the confidential file.</h2>
        <p>I will confirm fit, exact scope, price, deadline, payment, and delivery terms in writing.</p>
        <a href={intakeHref} className="button primary">
          Start the intake email <Send size={16} />
        </a>
      </section>
    </div>
  );
}

function ArchitectureMap({ compact = false }) {
  return (
    <div className={`architecture-map ${compact ? "compact" : ""}`}>
      <div className="architecture-flow">
        <span>Visitors</span>
        <ArrowRight size={16} />
        <span>Cloudflare</span>
        <ArrowRight size={16} />
        <span>Docker services</span>
        <ArrowRight size={16} />
        <span>AI, data, and host agents</span>
        <ArrowRight size={16} />
        <span>Ops and status</span>
      </div>
      <div className="architecture-grid">
        {architectureLayers.map((layer) => {
          const Icon = layer.icon;
          return (
            <article className="architecture-card" key={layer.title}>
              <div className="architecture-card-head">
                <span className="icon-wrap cyan"><Icon size={19} /></span>
                <h3>{layer.title}</h3>
              </div>
              <p>{layer.body}</p>
              <ul>
                {layer.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function DemoModePage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="app-shell route-page">
      <PageNav />
      <section className="detail-hero section demo-hero">
        <span className="eyebrow">Guided recruiter demo</span>
        <h1>Demo JackGPT in the order that sells the strongest engineering story.</h1>
        <p className="detail-description">
          This path is designed for someone arriving cold: start with the flagship
          product, show self-hosted AI, prove operations discipline, then close
          with code, status, and contact.
        </p>
        <div className="detail-links">
          <a href="https://market.jackgpt.org" target="_blank" rel="noreferrer" className="button primary small">
            Start with Market Desk <ExternalLink size={16} />
          </a>
          <a href="https://status.jackgpt.org" target="_blank" rel="noreferrer" className="button secondary small">
            Check public status <ExternalLink size={16} />
          </a>
        </div>
      </section>

      <section className="section">
        <div className="demo-timeline">
          {demoSequence.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className="demo-timeline-card"
              >
                <span className="step-badge">{item.step}</span>
                <div>
                  <div className="detail-card-header">
                    <Icon size={18} />
                    <h2>{item.title}</h2>
                  </div>
                  <p>{item.body}</p>
                  <span className="view-link">
                    {item.cta}
                    {item.external ? <ArrowUpRight size={15} /> : <ArrowRight size={15} />}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Demo clips</span>
            <h2>Short stories to tell while clicking</h2>
          </div>
          <p>
            These are recruiter-facing clip cards: each one points to a visible
            flow and gives the 30-90 second story to narrate.
          </p>
        </div>
        <div className="clip-grid">
          {demoClips.map((clip) => (
            <a href={clip.href} className="clip-card" key={clip.title}>
              <img src={clip.image} alt="" loading="lazy" />
              <div>
                <h3>{clip.title}</h3>
                <p>{clip.body}</p>
                <span className="view-link">Open flow <ArrowRight size={15} /></span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function ArchitecturePage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="app-shell route-page">
      <PageNav />
      <section className="detail-hero section">
        <span className="eyebrow">Public architecture map</span>
        <h1>JackGPT is an operated ecosystem, not a pile of unrelated demos.</h1>
        <p className="detail-description">
          The map explains how visitors, Cloudflare routing, Dockerized services,
          AI/data dependencies, private Ops, and the Cloudflare external watchdog
          work together while keeping sensitive controls and strategy private.
        </p>
      </section>
      <section className="section">
        <ArchitectureMap />
      </section>
      <section className="section detail-grid">
        <article className="detail-card">
          <div className="detail-card-header">
            <Shield size={18} />
            <h2>Public-safe boundary</h2>
          </div>
          <p className="project-summary">
            Public pages show what a recruiter should evaluate: product behavior,
            uptime, sanitized metrics, architecture, and screenshots. Private
            screens keep credentials, account identifiers, strategy logic, local
            paths, order rows, tokens, and admin controls out of view.
          </p>
        </article>
        <article className="detail-card">
          <div className="detail-card-header">
            <Activity size={18} />
            <h2>Reliability loop</h2>
          </div>
          <p className="project-summary">
            Private Ops watches containers, browser renders, host services, and
            repair playbooks. status.jackgpt.org watches public reachability from
            Cloudflare so the ecosystem has both an inside view and an outside witness.
          </p>
        </article>
        <article className="detail-card">
          <div className="detail-card-header">
            <FolderGit size={18} />
            <h2>Recruiter proof</h2>
          </div>
          <p className="project-summary">
            The strongest code and architecture are exposed through case studies,
            screenshots, public-safe GitHub repos, blog posts, and live URLs. The
            valuable private trading logic stays private by design.
          </p>
        </article>
      </section>
    </div>
  );
}

function BlogIndexPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="app-shell route-page">
      <PageNav />
      <section className="detail-hero section">
        <span className="eyebrow">Engineering blog</span>
        <h1>Notes on building and operating JackGPT.</h1>
        <p className="detail-description">
          Short public-safe writeups for recruiters and technical reviewers:
          product decisions, AI infrastructure, data fallbacks, operations, and
          reliability.
        </p>
      </section>
      <section className="section">
        <div className="blog-grid full">
          {blogPosts.map((post) => (
            <a href={`#/blog/${post.slug}`} className="blog-card" key={post.slug}>
              <span className="eyebrow">{post.date} / {post.readTime}</span>
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
              <div className="tag-row">
                {post.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
              </div>
              <span className="view-link">Read post <ArrowRight size={15} /></span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function BlogPostPage({ post }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [post.slug]);

  return (
    <div className="app-shell route-page blog-post-page">
      <PageNav label="Back to blog" href="#/blog" />
      <section className="detail-hero section">
        <span className="eyebrow">{post.date} / {post.readTime}</span>
        <h1>{post.title}</h1>
        <p className="detail-description">{post.summary}</p>
        <div className="tag-row">
          {post.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
        </div>
      </section>
      <article className="blog-post-body">
        {post.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
      </article>
      <div className="section-action-row">
        <a href="#/blog" className="button secondary">
          More posts <ArrowRight size={16} />
        </a>
        <a href="#/demo" className="button primary">
          Guided demo <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
}

function ProjectDetail({ project }) {
  const Icon = project.icon;
  const [selectedShotState, setSelectedShotState] = useState({
    projectId: project.id,
    shot: null,
  });
  const selectedShot =
    selectedShotState.projectId === project.id ? selectedShotState.shot : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [project.id]);

  return (
    <div className="app-shell project-detail-page">
      <PageNav />

      <section className="detail-hero section">
        <div className="detail-heading">
          <div className={`icon-wrap large ${project.accent}`}>
            <Icon size={22} />
          </div>
          <div>
            <span className="eyebrow">Project overview</span>
            <h1>{project.name}</h1>
            <p className="project-subtitle detail-subtitle">{project.subtitle}</p>
          </div>
        </div>
        <p className="detail-description">{project.description}</p>
        <div className="tag-row">
          {project.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        {project.links?.length > 0 && (
          <div className="detail-links">
            {project.links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="button primary small">
                {link.label} <ExternalLink size={16} />
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="section detail-grid">
        <article className="detail-card">
          <div className="detail-card-header">
            <Server size={18} />
            <h2>How it works</h2>
          </div>
          <ul className="detail-list">
            {project.howItWorks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="detail-card">
          <div className="detail-card-header">
            <Cpu size={18} />
            <h2>How it was developed</h2>
          </div>
          <ul className="detail-list">
            {project.developed.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="detail-card">
          <div className="detail-card-header">
            <Globe size={18} />
            <h2>Key technologies</h2>
          </div>
          <div className="tag-row">
            {project.tech.map((tech) => (
              <span className="tag" key={tech}>
                {tech}
              </span>
            ))}
          </div>
        </article>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Demonstration</span>
            <h2>Screenshots</h2>
          </div>
          <p>
            {project.screenshots.length > 0
              ? "Selected screenshots showing the project in use."
              : "Screenshots will be added as more images are captured."}
          </p>
        </div>

        {project.screenshots.length > 0 ? (
          <div className="gallery-grid">
            {project.screenshots.map((shot) => (
              <button
                type="button"
                className="gallery-card gallery-button"
                key={shot.src}
                onClick={() => setSelectedShotState({ projectId: project.id, shot })}
              >
                <figure>
                  <img src={shot.src} alt={shot.caption} />
                  <figcaption>{shot.caption}</figcaption>
                </figure>
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Shield size={20} />
            <span>Screenshot set in progress</span>
          </div>
        )}
      </section>

      {selectedShot && (
        <div
          className="lightbox"
          onClick={() => setSelectedShotState({ projectId: project.id, shot: null })}
        >
          <div
            className="lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setSelectedShotState({ projectId: project.id, shot: null })}
              aria-label="Close screenshot"
            >
              <X size={20} />
            </button>
            <img src={selectedShot.src} alt={selectedShot.caption} />
            <p>{selectedShot.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}

function MetricBox({ label, value }) {
  return (
    <div className="metric-box">
      <span className="metric-label">{label}</span>
      <span className="metric-value">{value}</span>
    </div>
  );
}

export default App;
