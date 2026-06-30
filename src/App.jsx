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
  TerminalSquare,
  Cloud,
  Compass,
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
    subtitle: "GPU-backed prompt-to-image service",
    icon: ImageIcon,
    accent: "violet",
    tags: ["Stable Diffusion", "Docker", "NVIDIA GPU", "Cloudflare Tunnel", "Branding"],
    summary:
      "A branded, Dockerized image-generation service exposed at images.jackgpt.org with GPU acceleration and a safe-for-work model.",
    description:
      "JackGPT Image Gen packages a Stable Diffusion web interface in Docker with NVIDIA GPU access and publishes it through Cloudflare Tunnel. It is presented as a JackGPT product surface instead of a raw upstream tool, and it also supports image-generation workflows from the AI workspace.",
    howItWorks: [
      "A Docker container runs the image-generation backend with GPU acceleration on local hardware.",
      "Cloudflare Tunnel exposes the service at images.jackgpt.org without directly opening local ports to the public internet.",
      "The service supports prompt-based generation with JackGPT theming, safe-for-work model defaults, and health checks alongside the rest of the stack.",
    ],
    developed: [
      "Created a Docker-based image-generation deployment and configured GPU support.",
      "Set up Cloudflare Tunnel and hostname routing for external access.",
      "Rebranded the interface and assets so recruiters see JackGPT Image Gen rather than raw upstream signage.",
      "Verified container startup, public reachability, model loading, and integration from app.jackgpt.org.",
    ],
    tech: ["Docker", "NVIDIA GPU", "Stable Diffusion", "Cloudflare Tunnel", "Custom theme"],
    links: [{ label: "images.jackgpt.org", href: "https://images.jackgpt.org" }],
    screenshots: [
      {
        src: "/project-images/automatic1111/jackgpt-images-dashboard.png",
        caption: "JackGPT Image Gen prompt studio running from the live containerized image-generation service",
      },
      {
        src: "/project-images/automatic1111/jackgpt-images-result-board.png",
        caption: "Fresh safe-for-work prompt-to-image result generated by the live Docker service",
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
    screenshots: [],
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
    screenshots: [],
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
      "Salad Compute Node tracks whether the host-side Salad Bowl service, workload process, and desktop controller are available. It demonstrates that the JackGPT ecosystem monitors not just web apps and Docker containers, but also host-level compute services that affect demo readiness and machine utilization.",
    howItWorks: [
      "The private host-agent checks the Salad Bowl Windows service and related workload/controller processes.",
      "salad.jackgpt.org exposes a sanitized health dashboard that reports only generic component status and timestamps.",
      "The homepage consumes that endpoint in the same live monitoring section as the rest of the JackGPT ecosystem.",
    ],
    developed: [
      "Added host-service checks for Salad without exposing local paths, logs, account state, or workload internals.",
      "Integrated Salad into the JackGPT Ops monitor, public live-status layer, and a dedicated salad.jackgpt.org dashboard.",
      "Kept it positioned as infrastructure visibility rather than a flagship recruiter project.",
    ],
    tech: ["Windows service monitoring", "Host-agent bridge", "Ops", "GPU/compute workloads"],
    links: [{ label: "salad.jackgpt.org", href: "https://salad.jackgpt.org" }],
    screenshots: [],
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
    links: [],
    screenshots: [],
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
    screenshots: [],
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
    description: "Checking the public GPU-backed image-generation endpoint.",
    endpoint: "https://images.jackgpt.org/sdapi/v1/sd-models",
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
    description: "Checking the public Minecraft server status probe.",
    endpoint: "https://market.jackgpt.org/api/minecraft/health",
    publicUrl: "",
    showEndpoint: false,
    latencyMs: null,
    httpStatus: "-",
    checkedAt: null,
    status: "checking",
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
    description: "GPU-backed prompt-to-image generation service",
    accessLabel: "Public demo",
    accessTone: "public",
    note: "Try prompt-to-image generation from the live GPU-backed image service.",
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

const visitorPath = [
  {
    eyebrow: "1",
    title: "Launch guided demo mode",
    body:
      "Use the self-serve recruiter path when Jack is not narrating: Market Desk, AI Workspace, Image Gen/Search, Kalshi/Pearl/Ops, status, code, and contact.",
    href: "#/demo",
    cta: "Open demo mode",
    icon: Compass,
  },
  {
    eyebrow: "2",
    title: "Open a case study",
    body:
      "Project cards drill into what was built, why it exists, how it works, screenshots, and public-safe code links when available.",
    href: "#projects",
    cta: "Browse projects",
    icon: ImageIcon,
  },
  {
    eyebrow: "3",
    title: "Check what is online",
    body:
      "The homepage shows same-origin status, while status.jackgpt.org checks public reachability and synthetic journeys from Cloudflare.",
    href: "https://status.jackgpt.org",
    cta: "Open public status",
    icon: Activity,
    external: true,
  },
  {
    eyebrow: "4",
    title: "Review code and contact Jack",
    body:
      "GitHub contains recruiter-safe repos while private credentials and valuable strategy code stay out of public view. Contact options are available from the hero.",
    href: "https://github.com/jackvansickle1",
    cta: "Open GitHub",
    icon: FolderGit,
    external: true,
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
      <header className="hero section">
        <div className="hero-copy">
          <div className="brand-lockup" aria-label="JackGPT">
            <span className="brand-mark" aria-hidden="true">
              <TerminalSquare size={24} strokeWidth={2.2} />
            </span>
            <span>
              <strong>JackGPT</strong>
              <small>AI systems, automation, and infrastructure</small>
            </span>
          </div>
          <span className="eyebrow">Jack VanSickle Portfolio</span>
          <h1 className="hero-title">
            <span>AI, automation, and</span>
            <span>self-hosted</span>
            <span>infrastructure projects</span>
          </h1>
          <p className="hero-text">
            A live portfolio of self-hosted AI products, finance intelligence tooling,
            GPU image generation, automation dashboards, and Docker/Cloudflare
            infrastructure. Project cards open into detailed case studies with
            implementation notes, screenshots, live links, and public-safe code.
          </p>
          <div className="hero-actions">
            <a href="#/demo" className="button primary">
              Guided demo <ArrowRight size={16} />
            </a>
            <a href="#start" className="button primary">
              Start here <ArrowRight size={16} />
            </a>
            <a href="#projects" className="button secondary">
              View projects <ArrowRight size={16} />
            </a>
            <a href="https://status.jackgpt.org" className="button secondary" target="_blank" rel="noreferrer">
              Public status <ArrowUpRight size={14} />
            </a>
            <a href="#/architecture" className="button secondary">
              Architecture
            </a>
            <a href="#/blog" className="button secondary">Blog</a>
            <button type="button" className="button secondary" onClick={() => setIsContactOpen(true)}>
              <Mail size={16} />
              Contact me
            </button>
            <a
              href="https://github.com/jackvansickle1"
              className="button secondary"
              target="_blank"
              rel="noreferrer"
              aria-label="Open Jack VanSickle's GitHub profile"
            >
              <FolderGit size={16} />
              GitHub
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
        <div className="hero-stats">
          <StatCard label="Projects" value={String(projects.length)} />
          <StatCard label="Live endpoints" value={String(accessLinks.length)} />
          <StatCard label="Core stack" value="React, Docker, Cloudflare" />
          <StatCard label="Focus" value="FinTech, AI, and automation" />
        </div>
      </header>

      <section id="start" className="section">
        <div className="section-header">
          <div>
            <span className="eyebrow">New visitor path</span>
            <h2>What to do first</h2>
          </div>
          <p>
            If you are seeing JackGPT without a walkthrough, use this quick path:
            try a public demo, open the case studies, check live health, then review
            the public code.
          </p>
        </div>

        <div className="visitor-path">
          {visitorPath.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className="visitor-card"
              >
                <div className="visitor-card-top">
                  <span className="step-badge">{item.eyebrow}</span>
                  <Icon size={18} />
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

        <div className="visitor-note">
          <Shield size={19} />
          <div>
            <strong>Some endpoints are instant demos, some ask visitors to sign up first.</strong>
            <p>
              Public services are labeled below. Account-based AI surfaces can be
              joined from their sign-in page, while admin tools stay visible for
              architecture and status context but remain restricted.
            </p>
          </div>
        </div>
      </section>

      <section id="demo-mode" className="section spotlight-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Recruiter demo mode</span>
            <h2>A guided path when Jack is not there to narrate</h2>
          </div>
          <p>
            The demo mode turns the ecosystem into a short walkthrough with the
            strongest product, AI, operations, code, and contact beats already ordered.
          </p>
        </div>
        <div className="demo-sequence-grid">
          {demoSequence.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className="demo-sequence-card"
              >
                <span className="step-badge">{item.step}</span>
                <Icon size={20} />
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
              Best reached by text message, phone call, or voicemail. Email is also
              open for school, recruiting, and project follow-up.
            </p>
            <div className="contact-actions">
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
          <article className="companion-panel" aria-label="JackGPT AI guide">
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
            <span className="eyebrow">Projects</span>
            <h2>Projects</h2>
          </div>
          <p>
            Click any project card to open a dedicated case-study page with overview,
            implementation details, screenshots, and demo links.
          </p>
        </div>

        <div className="project-guide" aria-label="How to review projects">
          <div>
            <span className="guide-kicker">Recruiter guide</span>
            <strong>Every project card opens into a deeper walkthrough.</strong>
            <p>
              Start with Market Desk, JackGPT AI Workspace, JackGPT Image Gen, and
              Kalshi Climate Desk for the strongest engineering story. Ops Control Room,
              Pearl Desk, Moomoo, Salad, Mesh, and the status layer show the
              operating discipline around the product surfaces.
            </p>
          </div>
          <div className="guide-steps">
            <span><ArrowUpRight size={15} /> Click a card</span>
            <span><Server size={15} /> Read architecture</span>
            <span><ImageIcon size={15} /> View screenshots</span>
          </div>
        </div>

        <div className="project-grid">
          {homepageProjects.map((project, index) => {
            const Icon = project.icon;
            return (
              <Motion.a
                key={project.id}
                href={`#/project/${project.id}`}
                className="project-card"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <div className={`icon-wrap ${project.accent}`}>
                  <Icon size={20} />
                </div>
                <div className="card-top">
                  <h3>{project.name}</h3>
                  <ArrowUpRight size={18} className="card-arrow" />
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

    </div>
  );
}

function PageNav({ label = "Back to portfolio", href = "#/" }) {
  return (
    <div className="detail-nav">
      <a href={href} className="button secondary small">
        <ArrowLeft size={16} /> {label}
      </a>
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
      <div className="detail-nav">
        <a href="#/" className="button secondary small">
          <ArrowLeft size={16} /> Back to portfolio
        </a>
      </div>

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
