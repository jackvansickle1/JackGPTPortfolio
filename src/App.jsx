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
  ExternalLink,
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
    links: [{ label: "app.jackgpt.org", href: "https://app.jackgpt.org" }],
    screenshots: [
      {
        src: "/project-images/jackgpt/text-based-capabilities.png",
        caption: "Text-based capabilities overview in the JackGPT interface",
      },
      {
        src: "/project-images/jackgpt/web-search-capabilities.png",
        caption: "Web search example with cited, current results",
      },
      {
        src: "/project-images/jackgpt/image-generation-capabilities.png",
        caption: "Image generation example from a natural-language prompt",
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
    links: [{ label: "app.jackgpt.org", href: "https://app.jackgpt.org" }],
    screenshots: [
      {
        src: "/project-images/jackgpt/text-based-capabilities.png",
        caption: "Conversation view illustrating model responses in OpenWebUI",
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
        src: "/project-images/automatic1111/automatic1111-interface.png",
        caption: "AUTOMATIC1111 running in the browser after successful deployment",
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
        src: "/project-images/meshcentral/meshcentral-dashboard.png",
        caption: "MeshCentral dashboard showing enrolled devices",
      },
      {
        src: "/project-images/meshcentral/meshcentral-device.png",
        caption: "Device details and system information",
      },
      {
        src: "/project-images/meshcentral/meshcentral-remote.png",
        caption: "Remote desktop session established through MeshCentral",
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
        src: "/project-images/jackgpt-search/jackgpt-search-brand.png",
        caption: "JackGPT Search brand mark used across the search theme",
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
    links: [{ label: "market.jackgpt.org", href: "https://market.jackgpt.org" }],
    screenshots: [],
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
      "The bot pulls market data, evaluates bidâ€“ask spreads, and determines where to place orders.",
      "It manages risk using position limits and order-update logic.",
      "The strategy can be tuned based on volatility, expected value, and inventory constraints.",
    ],
    developed: [
      "Researched exchange behavior and trading constraints.",
      "Implemented order-management logic and tested execution flow.",
      "Designed the system for iterative tuning and monitoring.",
    ],
    tech: ["Python", "Kalshi API", "Trading logic", "Risk controls"],
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
    screenshots: [],
  },
];


const fallbackStatuses = [
  {
    key: "openwebui",
    name: "OpenWebUI + Ollama",
    description: "Checking the public chat interface and model routing.",
    endpoint: "https://app.jackgpt.org",
    latencyMs: null,
    httpStatus: "â€”",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "automatic1111",
    name: "AUTOMATIC1111",
    description: "Checking the public image-generation interface.",
    endpoint: "https://images.jackgpt.org",
    latencyMs: null,
    httpStatus: "â€”",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "images",
    name: "images.jackgpt.org",
    description: "Checking the public image-generation endpoint.",
    endpoint: "https://images.jackgpt.org",
    latencyMs: null,
    httpStatus: "â€”",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "meshcentral",
    name: "mesh.jackgpt.org",
    description: "Checking the remote-management portal.",
    endpoint: "https://mesh.jackgpt.org",
    latencyMs: null,
    httpStatus: "â€”",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "jackgpt-search",
    name: "search.jackgpt.org",
    description: "Checking the branded JackGPT Search endpoint.",
    endpoint: "https://search.jackgpt.org",
    latencyMs: null,
    httpStatus: "â€”",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "market-desk",
    name: "Market Desk",
    description: "Checking the AI-powered equity research dashboard.",
    endpoint: "https://market.jackgpt.org/health",
    latencyMs: null,
    httpStatus: "â€”",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "minecraft",
    name: "Minecraft Server",
    description: "Checking the public Minecraft server status probe.",
    endpoint: "https://market.jackgpt.org/api/minecraft/health",
    latencyMs: null,
    httpStatus: "â€”",
    checkedAt: null,
    status: "checking",
  },
  {
    key: "website",
    name: "JackGPT Platform",
    description: "Checking the portfolio homepage.",
    endpoint: "https://jackgpt.org",
    latencyMs: null,
    httpStatus: "â€”",
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
  },
  {
    label: "images.jackgpt.org",
    href: "https://images.jackgpt.org",
    description: "Public image generation endpoint",
  },
  {
    label: "mesh.jackgpt.org",
    href: "https://mesh.jackgpt.org",
    description: "Remote management portal",
  },
  {
    label: "search.jackgpt.org",
    href: "https://search.jackgpt.org",
    description: "Branded private search endpoint",
  },
  {
    label: "market.jackgpt.org",
    href: "https://market.jackgpt.org",
    description:
      "AI-powered equity research dashboard with live market snapshots and generated bull/bear analysis.",
  },
  {
    label: "jackgpt.org",
    href: "https://jackgpt.org",
    description: "Public portfolio homepage",
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
          cache: "no-store",
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
        <Motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="eyebrow">JackGPT</span>
          <h1>AI, automation, and self-hosted infrastructure projects</h1>
          <p className="hero-text">
            A portfolio of practical projects spanning AI interfaces, image generation,
            remote management, trading automation, and local infrastructure exposed
            securely through Cloudflare.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="button primary">
              View projects <ArrowRight size={16} />
            </a>
            <a href="#status" className="button secondary">
              Live status
            </a>
          </div>
        </Motion.div>
        <Motion.div
          className="hero-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <StatCard label="Projects" value={String(projects.length)} />
          <StatCard label="Public services" value={String(accessLinks.length)} />
          <StatCard label="Core stack" value="React, Docker, Cloudflare" />
          <StatCard label="Focus" value="FinTech, AI, and automation" />
        </Motion.div>
      </header>

      <section className="section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Access</span>
            <h2>Live services and public endpoints</h2>
          </div>
          <p>
            Direct links to the live interfaces that are published as part of the
            JackGPT environment.
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
                  <span className="status-label">Live endpoint</span>
                  <ArrowUpRight size={18} className="card-arrow" />
                </div>
                <h3>{link.label}</h3>
                <p className="project-summary">{link.description}</p>
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
            Click any project to view a dedicated page with overview, implementation
            details, and demonstration images.
          </p>
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
                <span className="view-link">Open project page</span>
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
        <a className="status-endpoint" href={status.endpoint} target="_blank" rel="noreferrer">
          {formatEndpointHost(status.endpoint)}
          <ArrowUpRight size={14} />
        </a>
        <div className="metrics-grid metrics-grid-compact">
          <MetricBox
            label="Latency"
            value={typeof status.latencyMs === "number" ? `${status.latencyMs} ms` : "â€”"}
          />
          <MetricBox label="HTTP" value={status.httpStatus ?? "â€”"} />
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
