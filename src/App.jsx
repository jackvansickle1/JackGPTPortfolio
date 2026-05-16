import { useEffect, useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bot,
  BrainCircuit,
  Cpu,
  Dices,
  ExternalLink,
  FolderGit,
  Globe,
  Image as ImageIcon,
  LineChart,
  MonitorSmartphone,
  Search,
  Server,
  Shield,
  TrendingUp,
  TerminalSquare,
  Cloud,
  Trophy,
  X,
} from "lucide-react";
import "./index.css";

const projects = [
  {
    id: "jackgpt",
    name: "JackGPT Platform",
    subtitle: "Self-hosted OpenWebUI experience with web search and image generation",
    icon: Bot,
    accent: "cyan",
    tags: ["OpenWebUI", "LLM orchestration", "Web search", "Image generation"],
    summary:
      "A private AI workspace that combines conversational assistance, web search, and image generation behind a clean web interface.",
    description:
      "JackGPT is a self-hosted AI platform built on OpenWebUI and exposed through a Cloudflare Tunnel. It provides conversational responses, web-enabled answers, and image generation through a single consistent interface at app.jackgpt.org. The system is designed to be reliable, easy to access remotely, and flexible enough to grow with additional models and tools.",
    howItWorks: [
      "OpenWebUI provides the browser-based chat interface and routes requests to the underlying model services.",
      "The system can perform web searches when live information is needed and can generate images for visual requests.",
      "Cloudflare Tunnel publishes the application securely without exposing local ports directly to the internet.",
    ],
    developed: [
      "Configured a self-hosted deployment and exposed it through Cloudflare.",
      "Integrated model routing and image-generation capabilities into a single interface.",
      "Focused on usability, stable access, and a clean user experience for day-to-day use.",
    ],
    tech: ["OpenWebUI", "Cloudflare Tunnel", "Self-hosted inference", "Custom routing"],
    links: [
      { label: "app.jackgpt.org", href: "https://app.jackgpt.org" },
      { label: "GitHub: stack template", href: "https://github.com/jackvansickle1/jackgpt-selfhosted-stack-template" },
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
    id: "openwebui",
    name: "OpenWebUI + Ollama",
    subtitle: "Local model serving and chat interface",
    icon: BrainCircuit,
    accent: "emerald",
    tags: ["OpenWebUI", "Ollama", "Local LLMs"],
    summary:
      "A local AI environment for serving language models through a modern web interface.",
    description:
      "This project combines OpenWebUI with Ollama to provide a local environment for running and testing language models. It allows models to be served on local hardware while users interact through a browser interface with persistent conversations and prompt history.",
    howItWorks: [
      "Ollama runs local language models on the host machine.",
      "OpenWebUI provides a user-friendly interface for conversations, prompt history, and model selection.",
      "The service can be used privately on a local network or exposed securely through Cloudflare if needed.",
    ],
    developed: [
      "Installed and configured OpenWebUI and Ollama for local inference.",
      "Validated service availability and integration with upstream tools.",
      "Used the environment as the foundation for the broader JackGPT ecosystem.",
    ],
    tech: ["OpenWebUI", "Ollama", "Cloudflare Tunnel", "Local inference"],
    links: [
      { label: "app.jackgpt.org", href: "https://app.jackgpt.org" },
      { label: "GitHub: brand kit", href: "https://github.com/jackvansickle1/jackgpt-openwebui-brand-kit" },
    ],
    screenshots: [
      {
        src: "/project-images/openwebui/openwebui-model-home.png",
        caption: "Local model workspace with JackGPT 3.1 selected as the default assistant",
      },
      {
        src: "/project-images/openwebui/openwebui-chat-answer.png",
        caption: "OpenWebUI/Ollama stack serving a live JackGPT response through the branded interface",
      },
    ],
  },
  {
    id: "automatic1111",
    name: "AUTOMATIC1111",
    subtitle: "Self-hosted Stable Diffusion image generation service",
    icon: ImageIcon,
    accent: "violet",
    tags: ["Stable Diffusion", "Docker", "GPU", "Cloudflare Tunnel"],
    summary:
      "A containerized AUTOMATIC1111 deployment exposed securely at images.jackgpt.org for browser-based image generation.",
    description:
      "This project packages AUTOMATIC1111 in Docker with GPU access and publishes it through Cloudflare Tunnel. It provides a stable, remotely accessible image-generation service that can be started automatically with Docker and used through a browser without manual PowerShell commands.",
    howItWorks: [
      "A Docker container runs AUTOMATIC1111 with GPU acceleration on local hardware.",
      "Cloudflare Tunnel exposes the service at images.jackgpt.org without directly opening local ports to the public internet.",
      "The service supports prompt-based image generation and can be managed alongside the rest of the JackGPT infrastructure.",
    ],
    developed: [
      "Created a Docker-based deployment for AUTOMATIC1111 and configured GPU support.",
      "Set up Cloudflare Tunnel and hostname routing for external access.",
      "Verified container startup, public reachability, and model loading during testing.",
    ],
    tech: ["Docker", "NVIDIA GPU", "AUTOMATIC1111", "Cloudflare Tunnel"],
    links: [{ label: "images.jackgpt.org", href: "https://images.jackgpt.org" }],
    screenshots: [
      {
        src: "/project-images/automatic1111/jackgpt-images-dashboard.png",
        caption: "JackGPT Images prompt studio running from the live containerized image-generation service",
      },
      {
        src: "/project-images/automatic1111/jackgpt-images-result-board.png",
        caption: "Fresh safe-for-work prompt-to-image result generated by the live Docker service",
      },
    ],
  },
  {
    id: "meshcentral",
    name: "MeshCentral",
    subtitle: "Remote device management and support",
    icon: MonitorSmartphone,
    accent: "amber",
    tags: ["Remote management", "Cloudflare Tunnel", "Docker"],
    summary:
      "A self-hosted remote management system that enables secure device enrollment, monitoring, and remote sessions.",
    description:
      "MeshCentral is deployed in Docker and exposed through Cloudflare Tunnel at mesh.jackgpt.org. It allows remote device enrollment, browser-based management, and remote desktop functionality while keeping infrastructure under direct control.",
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
    subtitle: "Private search endpoint for the JackGPT ecosystem",
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
    subtitle: "Playable browser casino with craps tables and animated horse racing",
    icon: Trophy,
    accent: "amber",
    tags: ["React", "Docker", "Game UI", "Animation", "Cloudflare Tunnel", "Portfolio"],
    summary:
      "A polished public casino demo with standard craps, bubble craps, crapless craps, animated horse racing, bankroll accounting, and responsive game controls.",
    description:
      "JackGPT Casino is a Dockerized browser game at casino.jackgpt.org. It combines casino-style craps layouts with a live animated horse racing track, all styled to match the JackGPT command-center visual system.",
    howItWorks: [
      "The React frontend runs game state instantly in the browser, including chip placement, point state, dice rolls, payout resolution, horse movement, odds, and race history.",
      "A small FastAPI backend serves the compiled app and exposes a public health endpoint for status monitoring.",
      "Cloudflare Tunnel routes casino.jackgpt.org to the local Docker container without exposing the host directly.",
    ],
    developed: [
      "Implemented standard, bubble, and crapless craps with table-specific visual treatments and rule differences.",
      "Built an animated horse racing game with selectable runners, odds, wager sizing, live lane movement, and finish-line resolution.",
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
    id: "kalshi-temperature-bot",
    name: "Kalshi Temperature Bot",
    subtitle: "Automated weather-market monitoring",
    icon: Cloud,
    accent: "blue",
    tags: ["Python", "APIs", "Automation", "Trading signals"],
    summary:
      "A bot designed to monitor weather-based prediction markets and evaluate market opportunities.",
    description:
      "This project monitors weather-market contracts and compares market pricing against temperature forecasts and other data sources. The goal is to identify market inefficiencies and surface trade opportunities based on quantifiable conditions.",
    howItWorks: [
      "The bot retrieves market data and weather forecast information from relevant APIs.",
      "It applies rules or analysis to compare implied probabilities with expected weather outcomes.",
      "The system flags actionable scenarios and can be extended with notifications or order placement.",
    ],
    developed: [
      "Built data-ingestion and monitoring logic around weather and market feeds.",
      "Tested calculations and threshold logic for identifying candidate positions.",
      "Structured the project for future expansion into more automated execution.",
    ],
    tech: ["Python", "Weather APIs", "Kalshi API", "Automation"],
    links: [{ label: "GitHub demo", href: "https://github.com/jackvansickle1/kalshi-weather-resolver-demo" }],
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
    links: [{ label: "GitHub demo", href: "https://github.com/jackvansickle1/kalshi-market-maker-simulator" }],
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
  {
    id: "windows-use",
    name: "Windows-use Agent",
    subtitle: "GUI automation with AI assistance",
    icon: TerminalSquare,
    accent: "rose",
    tags: ["Automation", "Windows", "Agent workflows"],
    summary:
      "An agent-based approach to automating Windows tasks through interface interaction.",
    description:
      "This project explores using an AI-guided agent to interact with Windows applications and user interfaces. It is intended to automate repetitive tasks and demonstrate how language-model reasoning can be applied to real desktop environments.",
    howItWorks: [
      "The agent interprets instructions and performs actions within a Windows environment.",
      "It interacts with the GUI to navigate applications, enter data, and respond to on-screen context.",
      "The system can be extended with guardrails and monitoring for repeatable workflows.",
    ],
    developed: [
      "Tested tools for controlling and reading Windows interfaces.",
      "Developed workflows for repeatable task execution.",
      "Explored practical applications of agent-based desktop automation.",
    ],
    tech: ["Windows", "Automation", "AI agent workflows"],
    screenshots: [
      {
        src: "/project-images/windows-use/windows-use-agent-config.png",
        caption: "Local Windows-use configuration artifact for GUI automation with a local model provider",
      },
      {
        src: "/project-images/windows-use/windows-use-workflow-map.png",
        caption: "Portfolio-safe workflow map for observe, plan, act, and verify desktop automation loops",
      },
    ],
  },
];


const fallbackStatuses = [
  {
    key: "openwebui",
    name: "OpenWebUI + Ollama",
    description: "Checking the public chat interface and model routing.",
    endpoint: "https://app.jackgpt.org/api/version",
    latencyMs: null,
    httpStatus: "-",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "automatic1111",
    name: "AUTOMATIC1111",
    description: "Checking the public image-generation interface.",
    endpoint: "https://images.jackgpt.org/sdapi/v1/memory",
    latencyMs: null,
    httpStatus: "-",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "images",
    name: "images.jackgpt.org",
    description: "Checking the public image-generation endpoint.",
    endpoint: "https://images.jackgpt.org/sdapi/v1/sd-models",
    latencyMs: null,
    httpStatus: "-",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "meshcentral",
    name: "mesh.jackgpt.org",
    description: "Checking the remote-management portal.",
    endpoint: "https://mesh.jackgpt.org",
    latencyMs: null,
    httpStatus: "-",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "jackgpt-search",
    name: "search.jackgpt.org",
    description: "Checking the branded JackGPT Search endpoint.",
    endpoint: "https://search.jackgpt.org",
    latencyMs: null,
    httpStatus: "-",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "market-desk",
    name: "Market Desk",
    description: "Checking the AI-powered equity research dashboard.",
    endpoint: "https://market.jackgpt.org/health",
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
    showEndpoint: false,
    latencyMs: null,
    httpStatus: "-",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "website",
    name: "JackGPT Platform",
    description: "Checking the portfolio homepage.",
    endpoint: "https://jackgpt.org",
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
    label: "app.jackgpt.org",
    href: "https://app.jackgpt.org",
    description: "Primary AI workspace and chat interface",
    accessLabel: "Sign up to try",
    accessTone: "signup",
    note: "Create an account from the sign-in page to explore the public AI workspace.",
  },
  {
    label: "images.jackgpt.org",
    href: "https://images.jackgpt.org",
    description: "Public image generation endpoint",
    accessLabel: "Public demo",
    accessTone: "public",
    note: "Try prompt-to-image generation from the live GPU-backed image service.",
  },
  {
    label: "mesh.jackgpt.org",
    href: "https://mesh.jackgpt.org",
    description: "Remote management portal",
    accessLabel: "Private admin",
    accessTone: "private",
    note: "Shown for infrastructure context and uptime; device access is restricted.",
  },
  {
    label: "search.jackgpt.org",
    href: "https://search.jackgpt.org",
    description: "Branded private search endpoint",
    accessLabel: "Public demo",
    accessTone: "public",
    note: "A good quick demo of the JackGPT-branded utility services.",
  },
  {
    label: "market.jackgpt.org",
    href: "https://market.jackgpt.org",
    description:
      "AI-powered equity research dashboard with live market snapshots and generated bull/bear analysis.",
    accessLabel: "Best first stop",
    accessTone: "featured",
    note: "Search a ticker like NVDA, MSFT, or AAPL to see the full product demo.",
  },
  {
    label: "casino.jackgpt.org",
    href: "https://casino.jackgpt.org",
    description: "Playable JackGPT casino with craps tables and animated horse racing.",
    accessLabel: "Public demo",
    accessTone: "public",
    note: "A fast interactive demo of game logic, UI polish, and animation.",
  },
  {
    label: "jackgpt.org",
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
    title: "Try a live demo",
    body:
      "Start with Market Desk, Casino, Search, or Images. These are the fastest ways to see the stack working without extra context.",
    href: "#live-services",
    cta: "View live demos",
    icon: Globe,
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
      "The status section shows live reachability and response times so visitors know whether a demo is healthy right now.",
    href: "#status",
    cta: "See status",
    icon: Activity,
  },
  {
    eyebrow: "4",
    title: "Review public code",
    body:
      "GitHub contains recruiter-safe repos, demos, and templates while private credentials and valuable strategy code stay out of public view.",
    href: "https://github.com/jackvansickle1",
    cta: "Open GitHub",
    icon: FolderGit,
    external: true,
  },
];

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

  const selectedProject = projects.find((project) => project.id === detailId);

  if (selectedProject) {
    return <ProjectDetail project={selectedProject} />;
  }

  return <HomePage />;
}


function HomePage() {
  const [liveStatuses, setLiveStatuses] = useState(fallbackStatuses);
  const [activeAccessIndex, setActiveAccessIndex] = useState(0);
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

  return (
    <div className="app-shell">
      <header className="hero section">
        <div className="hero-copy">
          <span className="eyebrow">JackGPT</span>
          <h1 className="hero-title">
            <span>AI, automation, and</span>
            <span>self-hosted</span>
            <span>infrastructure projects</span>
          </h1>
          <p className="hero-text">
            A portfolio of practical projects spanning AI interfaces, image generation,
            remote management, trading automation, and local infrastructure exposed
            securely through Cloudflare. Project cards open into detailed case studies
            with implementation notes, screenshots, and live links.
          </p>
          <div className="hero-actions">
            <a href="#start" className="button primary">
              Start here <ArrowRight size={16} />
            </a>
            <a href="#projects" className="button secondary">
              View projects <ArrowRight size={16} />
            </a>
            <a href="#status" className="button secondary">
              Live status
            </a>
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
          <StatCard label="Public services" value={String(accessLinks.length)} />
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
              Start with Market Desk or JackGPT Casino if you want the quickest
              product demo, then use the screenshots and architecture notes to inspect
              the rest of the ecosystem.
            </p>
          </div>
          <div className="guide-steps">
            <span><ArrowUpRight size={15} /> Click a card</span>
            <span><Server size={15} /> Read architecture</span>
            <span><ImageIcon size={15} /> View screenshots</span>
          </div>
        </div>

        <div className="project-grid">
          {projects.map((project, index) => {
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
        {status.endpoint && status.showEndpoint !== false ? (
          <a className="status-endpoint" href={status.endpoint} target="_blank" rel="noreferrer">
            {formatEndpointHost(status.endpoint)}
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
