import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bot,
  BrainCircuit,
  Cloud,
  Cpu,
  ExternalLink,
  Globe,
  Image as ImageIcon,
  LineChart,
  MonitorSmartphone,
  Shield,
  TrendingUp,
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
      "JackGPT is a self-hosted AI platform built on OpenWebUI and published through a Cloudflare Tunnel. It provides conversational responses, web-enabled answers, and image generation through a single consistent interface at app.jackgpt.org.",
    howItWorks: [
      "OpenWebUI provides the browser-based chat interface and routes requests to underlying model services.",
      "The system can perform web searches for current information and generate images from natural-language prompts.",
      "Cloudflare Tunnel exposes the application securely without opening local ports to the public internet.",
    ],
    developed: [
      "Configured a self-hosted deployment and routed traffic securely through Cloudflare.",
      "Integrated web-search and image-generation capabilities into a single interface.",
      "Focused on reliability, usability, and extensibility so the system can grow with additional models and tools.",
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
        caption: "Web-search example with cited current results",
      },
      {
        src: "/project-images/jackgpt/image-generation-capabilities.png",
        caption: "Image-generation example produced from a natural-language prompt",
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
      "This project combines OpenWebUI with Ollama to provide a local environment for running and testing language models. It allows models to be served on local hardware while users interact through a browser interface with persistent conversations and model selection.",
    howItWorks: [
      "Ollama serves local language models on the host system.",
      "OpenWebUI provides a user-friendly interface for conversations, history, and model selection.",
      "The environment can be used privately on a local network or exposed securely through Cloudflare when needed.",
    ],
    developed: [
      "Installed and configured OpenWebUI and Ollama for local inference.",
      "Validated service availability and model integration with the broader JackGPT ecosystem.",
      "Used the environment as the foundation for self-hosted AI experimentation and workflows.",
    ],
    tech: ["OpenWebUI", "Ollama", "Local inference", "Cloudflare"],
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
      "This project packages AUTOMATIC1111 in Docker with GPU access and publishes it through Cloudflare Tunnel. It provides a stable, remotely accessible image-generation service that can be started automatically with Docker and used through a browser.",
    howItWorks: [
      "A Docker container runs AUTOMATIC1111 with GPU acceleration on local hardware.",
      "Cloudflare Tunnel exposes the service at images.jackgpt.org without directly opening local ports to the public internet.",
      "The service supports prompt-based image generation and can be managed alongside the rest of the home-lab infrastructure.",
    ],
    developed: [
      "Created a Docker-based deployment for AUTOMATIC1111 and configured GPU support.",
      "Set up Cloudflare Tunnel and hostname routing for secure external access.",
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
    id: "kalshi-temperature-bot",
    name: "Kalshi Temperature Bot",
    subtitle: "Automated weather-market monitoring",
    icon: Cloud,
    accent: "blue",
    tags: ["Python", "APIs", "Automation", "Trading signals"],
    summary:
      "A bot designed to monitor weather-based prediction markets and evaluate potential opportunities.",
    description:
      "This project monitors Kalshi weather contracts and compares market pricing with temperature forecasts and other data sources. The goal is to identify pricing inefficiencies and surface trade ideas based on measurable weather conditions.",
    howItWorks: [
      "The bot retrieves market data and weather-forecast information from relevant APIs.",
      "It compares implied probabilities with expected weather outcomes.",
      "The system flags actionable scenarios and can be extended with alerts or automated order placement.",
    ],
    developed: [
      "Built data-ingestion and monitoring logic around weather and market feeds.",
      "Tested calculations and threshold logic for identifying candidate positions.",
      "Structured the project for future expansion into more automated execution.",
    ],
    tech: ["Python", "Weather APIs", "Kalshi API", "Automation"],
    links: [],
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
      "The bot pulls market data, evaluates bid–ask spreads, and determines where to place orders.",
      "It manages risk using position limits and order-update logic.",
      "The strategy can be tuned based on volatility, expected value, and inventory constraints.",
    ],
    developed: [
      "Researched exchange behavior and market structure.",
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
    tags: ["NinjaTrader", "Futures", "Automation", "Risk management"],
    summary:
      "A rules-based trading bot built to automate futures trade execution and risk controls.",
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
    links: [],
    screenshots: [],
  },
  {
    id: "windows-use-agent-mode",
    name: "Windows-use Agent Mode",
    subtitle: "Desktop automation and task execution",
    icon: MonitorSmartphone,
    accent: "blue",
    tags: ["Windows", "Automation", "Agentic workflows", "Browser control"],
    summary:
      "A Windows-based agent environment for automating desktop and browser tasks through natural-language instructions.",
    description:
      "This project explores Windows agent mode for carrying out multi-step tasks across desktop applications and the web. It translates natural-language instructions into on-screen actions such as opening programs, navigating interfaces, and completing repeatable workflows.",
    howItWorks: [
      "Accepts task instructions and plans a series of actions within a Windows environment.",
      "Interacts with desktop applications and web interfaces to complete multi-step tasks.",
      "Can be used for workflow automation, browser navigation, and repetitive operational tasks.",
    ],
    developed: [
      "Set up a Windows-based environment for agent-driven task execution and evaluation.",
      "Tested workflows across desktop applications and web interfaces to understand capabilities and limitations.",
      "Documented representative tasks for future demonstrations and iteration.",
    ],
    tech: ["Windows", "Automation", "Browser control", "Agentic AI"],
    links: [],
    screenshots: [],
  },
];

const serviceAccess = [
  {
    name: "app.jackgpt.org",
    description: "JackGPT chat interface and model tools",
    href: "https://app.jackgpt.org",
  },
  {
    name: "images.jackgpt.org",
    description: "Public image-generation endpoint",
    href: "https://images.jackgpt.org",
  },
  {
    name: "mesh.jackgpt.org",
    description: "Remote device-management portal",
    href: "https://mesh.jackgpt.org",
  },
];

const statuses = [
  {
    name: "app.jackgpt.org",
    description: "Primary chat interface and model routing",
    latency: "142 ms",
    uptime: "99.94%",
    checked: "4/16/2026 5:19 AM",
  },
  {
    name: "images.jackgpt.org",
    description: "Public image-generation service",
    latency: "126 ms",
    uptime: "99.91%",
    checked: "4/16/2026 5:19 AM",
  },
  {
    name: "mesh.jackgpt.org",
    description: "Remote-management endpoint",
    latency: "151 ms",
    uptime: "99.88%",
    checked: "4/16/2026 5:19 AM",
  },
  {
    name: "JackGPT website",
    description: "Portfolio site and routing",
    latency: "118 ms",
    uptime: "99.98%",
    checked: "4/16/2026 5:19 AM",
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
  return (
    <div className="app-shell">
      <header className="hero section">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="eyebrow">Jack Vansickle</span>
          <h1>FinTech, trading automation, and self-hosted systems</h1>
          <p className="hero-text">
            A portfolio centered on quantitative trading ideas, market automation,
            and the infrastructure used to build and operate them. Projects span
            prediction-market bots, a NinjaTrader execution bot, self-hosted AI tools,
            and secure remote services.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="button primary">
              View projects <ArrowRight size={16} />
            </a>
            <a href="#status" className="button secondary">
              Live status
            </a>
          </div>
        </motion.div>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <StatCard label="Projects" value={String(projects.length)} />
          <StatCard label="Focus" value="FinTech & automation" />
          <StatCard label="Live services" value="3 public endpoints" />
          <StatCard label="Stack" value="Python, React, Docker, Cloudflare" />
        </motion.div>
      </header>

      <section className="section" id="access">
        <div className="section-header compact">
          <div>
            <span className="eyebrow">Access</span>
            <h2>Public services</h2>
          </div>
          <p>Direct links to live endpoints and interfaces.</p>
        </div>
        <div className="access-grid">
          {serviceAccess.map((service, index) => (
            <motion.a
              key={service.name}
              href={service.href}
              target="_blank"
              rel="noreferrer"
              className="access-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <div>
                <span className="status-label">Public endpoint</span>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </div>
              <ExternalLink size={18} className="card-arrow" />
            </motion.a>
          ))}
        </div>
      </section>

      <section id="projects" className="section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Projects</span>
            <h2>Projects</h2>
          </div>
          <p>
            Click any project to view a dedicated page with an overview,
            implementation notes, and demonstration images where available.
          </p>
        </div>

        <div className="project-grid">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.a
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
              </motion.a>
            );
          })}
        </div>
      </section>

      <section id="status" className="section">
        <div className="section-header compact">
          <div>
            <span className="eyebrow">Live monitoring</span>
            <h2>Real-time service status</h2>
          </div>
          <p>
            Status cards are designed to consume same-origin health-check endpoints
            and display live availability, latency, and most recent check times.
          </p>
        </div>

        <div className="status-list">
          {statuses.map((status, index) => (
            <motion.article
              key={status.name}
              className="status-row"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
            >
              <div className="status-main">
                <div className="status-title-row">
                  <h3>{status.name}</h3>
                  <span className="status-pill">
                    <Activity size={14} /> Online
                  </span>
                </div>
                <p className="status-description">{status.description}</p>
              </div>
              <div className="status-metrics">
                <MetricInline label="Latency" value={status.latency} />
                <MetricInline label="Uptime" value={status.uptime} />
                <MetricInline label="Checked" value={status.checked} />
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProjectDetail({ project }) {
  const Icon = project.icon;
  const [activeScreenshot, setActiveScreenshot] = useState(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setActiveScreenshot(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
            <p className="detail-subtitle">{project.subtitle}</p>
          </div>
        </div>

        <div className="detail-summary">
          <p>{project.description}</p>
          <div className="tag-row detail-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <div className="detail-links">
            {project.links?.map((link) => (
              <a key={link.href} href={link.href} className="button primary" target="_blank" rel="noreferrer">
                {link.label}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="detail-columns section">
        <div className="detail-card">
          <h3>
            <Cpu size={18} /> How it works
          </h3>
          <ul className="detail-list">
            {project.howItWorks.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="detail-card">
          <h3>
            <Shield size={18} /> How it was developed
          </h3>
          <ul className="detail-list">
            {project.developed.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="detail-card">
          <h3>
            <Globe size={18} /> Key technologies
          </h3>
          <div className="tag-row detail-tags">
            {project.tech.map((item) => (
              <span key={item} className="tag">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="detail-gallery section">
        <div className="section-header compact">
          <div>
            <span className="eyebrow">Demonstration</span>
            <h2>Screenshots</h2>
          </div>
          <p>
            Selected screenshots illustrating the project in use. Click an image to enlarge it.
          </p>
        </div>

        {project.screenshots?.length ? (
          <div className="gallery-grid">
            {project.screenshots.map((image) => (
              <figure
                key={image.src}
                className="gallery-card gallery-large"
                onClick={() => setActiveScreenshot(image)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    setActiveScreenshot(image);
                  }
                }}
              >
                <img src={image.src} alt={image.caption} />
                <figcaption>{image.caption}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Screenshots will be added as the project is documented further.</p>
          </div>
        )}
      </section>

      {activeScreenshot && (
        <div className="lightbox" onClick={() => setActiveScreenshot(null)}>
          <button className="lightbox-close" onClick={() => setActiveScreenshot(null)}>
            <X size={18} />
          </button>
          <div className="lightbox-content" onClick={(event) => event.stopPropagation()}>
            <img src={activeScreenshot.src} alt={activeScreenshot.caption} />
            <p>{activeScreenshot.caption}</p>
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

function MetricInline({ label, value }) {
  return (
    <div className="metric-inline">
      <span className="metric-inline-label">{label}</span>
      <span className="metric-inline-value">{value}</span>
    </div>
  );
}

export default App;
