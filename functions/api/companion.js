const COMPANION_BACKEND_URL = "https://market.jackgpt.org/api/ecosystem-chat";
const MAX_QUESTION_CHARS = 900;

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

function timeoutSignal(ms) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort("timeout"), ms);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  };
}

function cleanText(value) {
  return String(value || "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasAny(text, words) {
  return words.some((word) => text.includes(word));
}

function fallbackAnswer(question) {
  const text = question.toLowerCase();

  if (hasAny(text, ["5 minute", "five minute", "quick", "start", "first", "recommend", "where", "recruiter"])) {
    return [
      "Best recruiter path:",
      "1. Use Guided Demo Mode if you want the clean scripted tour. It orders the strongest proof points for a cold recruiter visit.",
      "2. Open Market Desk first. It is the strongest full product demo: React UI, FastAPI backend, public market data, financial statements, signals, news, AI analysis, stock-aware chat, and health checks.",
      "3. Open JackGPT AI Workspace next. It proves self-hosted LLM operations, branded product polish, web search, image generation, and Docker/Cloudflare infrastructure.",
      "4. Use Image Gen, Search, Kalshi Climate Desk, Pearl Desk, and the Ops case study to show GPU services, utility tooling, automation operations, telemetry, and reliability work.",
      "5. Check status.jackgpt.org, project cards, the architecture map, blog posts, and GitHub. Those prove operations discipline and recruiter-safe code.",
      "6. Moomoo, Salad, Mesh, Minecraft, and Casino are supporting examples. Casino is intentionally not the flagship path.",
    ].join("\n");
  }

  if (hasAny(text, ["best project", "full-stack", "full stack", "strongest", "impressive", "prove", "skill"])) {
    return [
      "The strongest full-stack proof is Market Desk: it has a polished product UI, backend aggregation, health endpoints, external data fallbacks, AI-assisted analysis, and deployment through Docker/Cloudflare.",
      "For AI platform and infrastructure depth, use JackGPT AI Workspace, Image Gen, Search, Mesh, Pearl Desk, and the Cloudflare/Docker pattern. For automation discipline, use Kalshi Climate Desk plus the Moomoo and Salad subdomain status monitors at a public-safe level. Casino is useful, but lighter.",
    ].join("\n\n");
  }

  if (hasAny(text, ["public-safe", "public safe", "private", "secret", "safe to show", "valuable"])) {
    return [
      "Public-safe surfaces: Market Desk, JackGPT AI Workspace signup flow, Image Gen, Search, Kalshi Climate Desk aggregates, Pearl Desk telemetry, Moomoo/Salad status monitors, homepage case studies, live status, selected GitHub repos, and Casino as a secondary demo.",
      "Restricted or intentionally redacted areas: secrets, credentials, tunnel tokens, private host paths, admin device controls, order IDs, profitable trading formulas, model weights, exact Kalshi/Moomoo trade details, and source screenshots that reveal valuable strategy code.",
      "Kalshi, Moomoo, Salad, and Pearl expose only public-safe operational data; they do not expose private logs, local paths, account secrets, or strategy internals.",
    ].join("\n\n");
  }

  if (hasAny(text, ["github", "code", "repo", "repository"])) {
    return [
      "Use the GitHub link on the homepage or visit https://github.com/jackvansickle1.",
      "Good recruiter read: compare the public repo structure with the live services. The repos are intentionally public-safe: useful demos, deployment templates, and implementation examples are visible, while secrets, credentials, order IDs, tunnel tokens, and valuable private trading strategy code stay private.",
    ].join("\n\n");
  }

  if (hasAny(text, ["guided demo", "demo mode", "tour mode", "scripted tour"])) {
    return [
      "Guided Demo Mode is the best self-serve path on jackgpt.org. It gives a recruiter the order I would narrate live: Market Desk, AI Workspace, Image Gen/Search, Kalshi/Pearl/Ops, then GitHub/contact.",
      "It also includes demo clip cards with the short story to tell while opening each flow.",
    ].join("\n\n");
  }

  if (hasAny(text, ["architecture", "map", "diagram", "stack", "system design"])) {
    return [
      "The Architecture Map explains JackGPT as four layers: visitor-facing product surfaces, Docker/FastAPI/OpenWebUI applications, AI/data dependencies, and operations monitoring.",
      "The important point: public pages show product behavior, uptime, sanitized metrics, screenshots, and architecture while private controls, credentials, account IDs, order rows, local paths, and strategy logic stay hidden.",
    ].join("\n\n");
  }

  if (hasAny(text, ["blog", "post", "writeup", "engineering note", "article"])) {
    return [
      "The blog on jackgpt.org has public-safe engineering notes about operating JackGPT like a product, building a self-hosted AI workspace, Market Desk's data/AI design, public-safe automation dashboards, and the Cloudflare external watchdog.",
      "The posts are meant to make the engineering choices legible to a recruiter without leaking private strategy or credentials.",
    ].join("\n\n");
  }

  if (hasAny(text, ["status.jackgpt", "public status", "external watchdog", "cloudflare watchdog", "outside monitor"])) {
    return [
      "status.jackgpt.org is the public Cloudflare-hosted external watchdog. It runs outside the home PC, checks public reachability and synthetic user journeys, and reports a sanitized status page.",
      "Private Ops remains behind Cloudflare Access and handles internal checks and repair actions. The public status page is the outside witness; Ops is the private control room.",
    ].join("\n\n");
  }

  if (hasAny(text, ["market", "stock", "finance", "ticker", "balance", "analysis", "signal"])) {
    return [
      "Market Desk is the main finance demo. Try NVDA, MSFT, AAPL, or another ticker.",
      "What to inspect: snapshot fields, advanced charting, financial statements, news, buy/sell signal analysis, AI rating, bull/bear cases, and the stock-aware chat. The important engineering story is graceful degradation: public data can be messy, so the app exposes source health and falls back instead of crashing.",
      "It is a research/demo tool, not investment advice.",
    ].join("\n\n");
  }

  if (hasAny(text, ["app", "chat", "jackgpt 3.1", "account", "sign", "openwebui", "workspace"])) {
    return [
      "app.jackgpt.org is the account-based JackGPT AI Workspace. Visitors can sign up from the sign-in page.",
      "What to inspect: JackGPT 3.1 as the branded default assistant, web search, image generation, custom OpenWebUI theming, Docker/Ollama operations, and the fact that it is tied into the broader self-hosted ecosystem instead of being a generic chat page.",
    ].join("\n\n");
  }

  if (hasAny(text, ["casino", "craps", "crapless", "bubble", "horse", "racing", "game"])) {
    return [
      "JackGPT Casino at casino.jackgpt.org is a secondary interactive UI demo.",
      "What to inspect: standard craps, crapless craps, bubble craps, blackjack, animated horse racing, shared bankroll, chips, sound, race/dice/card state, table-specific layouts, and mobile responsiveness. It is polished, but Market Desk and JackGPT AI Workspace are stronger recruiter starting points.",
    ].join("\n\n");
  }

  if (hasAny(text, ["search", "web search", "engine"])) {
    if (hasAny(text, ["power", "powered", "backend", "technical", "technically", "underlying"])) {
      return "JackGPT Search at search.jackgpt.org is the branded public search surface. At the backend level it is powered by SearXNG, wrapped in JackGPT branding and kept free of private configuration details.";
    }

    return "JackGPT Search at search.jackgpt.org is the branded public web-search endpoint. Recruiters can use it directly, and JackGPT services can use it as search context. Backend engine details stay quiet unless someone specifically asks for implementation internals.";
  }

  if (hasAny(text, ["image", "images", "generate", "picture", "stable", "diffusion"])) {
    return "JackGPT Image Gen at images.jackgpt.org is the GPU-backed image-generation demo. It is Dockerized, branded into the JackGPT theme, uses a safe-for-work model, and also supports image generation from the app.jackgpt.org workspace.";
  }

  if (hasAny(text, ["pearl", "prl", "miner", "mining", "hashrate", "wallet", "gpu idle", "idle guard"])) {
    return [
      "JackGPT Pearl Desk at pearl.jackgpt.org tracks PRL mining telemetry.",
      "What to inspect: per-wallet worker state, active and rolling hashrate, hoverable hashrate timelines, pending and on-chain balances, USD conversion, hourly revenue estimates, source-health badges, and the GPU idle guard.",
      "The engineering point is coordination: mining pauses when JackGPT needs the GPU for image generation or other heavy AI workloads, then resumes after the idle cooldown.",
    ].join("\n\n");
  }

  if (hasAny(text, ["kalshi", "climate", "temperature", "trade", "trading", "position", "orders", "exit"])) {
    return [
      "Kalshi Climate Desk at kalshi.jackgpt.org is a public-safe operations dashboard for the temperature bot.",
      "What to inspect: scanner state, heartbeat, bankroll curve, sanitized active exposure, city exposure, settled performance, operational timeline, and deterministic-exit health as a supporting subsystem.",
      "It intentionally does not expose tickers, order IDs, prices, brackets, edges, model weights, logs, or private strategy logic.",
    ].join("\n\n");
  }

  if (hasAny(text, ["moomoo", "moo moo", "paper trader", "paper trading", "opend"])) {
    return [
      "Moomoo Trading Bot Status is available at moomoo.jackgpt.org and represented in the homepage live-status section and project cards as a public-safe paper-trading automation monitor.",
      "What to inspect: paper runner health, OpenD gateway reachability, scheduler state, heartbeat freshness, sanitized paper positions, and P/L summaries. It intentionally does not expose account IDs, raw order rows, signals, or strategy internals.",
    ].join("\n\n");
  }

  if (hasAny(text, ["salad", "compute node", "bowl", "workload"])) {
    return [
      "Salad Compute Node is available at salad.jackgpt.org and represented as a host-compute operations monitor, not a flagship public app.",
      "What to inspect: service health, workload process availability, and host-level monitoring integration. It shows that JackGPT tracks Docker services and Windows-hosted compute services in one ecosystem.",
    ].join("\n\n");
  }

  if (hasAny(text, ["minecraft", "mc.jackgpt", "paper", "server"])) {
    return "The Minecraft project is a Dockerized Paper server exposed through mc.jackgpt.org and represented honestly in live status. It is a service-health and infrastructure example rather than a web-app card with a public website link.";
  }

  if (hasAny(text, ["mesh", "admin", "remote", "device"])) {
    return "JackGPT Mesh demonstrates self-hosted remote-management infrastructure, but it is a private admin surface with public account creation disabled. Treat it as architecture, uptime, and themed infrastructure context rather than a public device-management demo.";
  }

  if (hasAny(text, ["docker", "cloudflare", "deploy", "infrastructure", "architecture", "how", "built"])) {
    return [
      "Architecture pattern: most services run in Docker or Docker Compose, publish a small health endpoint, and are routed through Cloudflare Tunnel on clean subdomains.",
      "Ops is private at ops.jackgpt.org behind Cloudflare Access. status.jackgpt.org is the public Cloudflare Worker watchdog that checks reachability and synthetic journeys from outside the host.",
      "The homepage is the command center: it lists public endpoints, guided demo mode, project case studies, screenshots, architecture map, blog posts, live status, and GitHub. The design story is an operated ecosystem with monitoring, theming, restart policies, auto-repair hooks, external checks, and public-safe boundaries.",
    ].join("\n\n");
  }

  return [
    "Here is the useful way to evaluate JackGPT:",
    "1. Market Desk: best full-stack AI/finance product demo.",
    "2. JackGPT AI Workspace: self-hosted LLM operations, web search, image generation, and branded AI product polish.",
    "3. Image Gen and Search: fast self-hosted utility demos.",
    "4. Kalshi Climate Desk and Pearl Desk: public-safe operations, automation monitoring, GPU scheduling, and mining telemetry.",
    "5. Moomoo and Salad: host-level monitoring and public-safe automation status.",
    "6. Project cards, status, and GitHub: deeper case studies, uptime, and recruiter-safe code.",
    "7. Guided demo mode, architecture map, and blog posts: the self-serve explanation layer for recruiters.",
  ].join("\n");
}

function fallbackPayload(question, reason = "backend unavailable") {
  return {
    app: "JackGPT Homepage Companion",
    generatedAt: new Date().toISOString(),
    question,
    answer: fallbackAnswer(question),
    suggestions: [
      "Give me a 5-minute recruiter tour.",
      "Walk me through the guided demo mode.",
      "Explain the architecture map.",
      "Which demo best proves full-stack engineering?",
      "What should I inspect in Market Desk?",
      "What is new in the JackGPT ecosystem?",
    ],
    dependencies: {
      backend: {
        status: "degraded",
        message: `Using same-origin public-context fallback because the AI backend was ${reason}.`,
      },
      ollama: {
        status: "degraded",
        message: "AI companion backend was unavailable; no private data was exposed.",
      },
    },
  };
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      ...jsonHeaders,
      allow: "POST, OPTIONS",
    },
  });
}

export async function onRequestPost({ request }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ detail: "Request body must be JSON." }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const question = cleanText(body.question);
  if (!question) {
    return new Response(JSON.stringify({ detail: "Ask a question about JackGPT." }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  if (question.length > MAX_QUESTION_CHARS) {
    return new Response(
      JSON.stringify({ detail: `Questions are limited to ${MAX_QUESTION_CHARS} characters.` }),
      {
        status: 400,
        headers: jsonHeaders,
      },
    );
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-8) : [];
  const { signal, clear } = timeoutSignal(19000);

  try {
    const response = await fetch(COMPANION_BACKEND_URL, {
      method: "POST",
      signal,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "user-agent": "jackgpt-homepage-companion",
      },
      body: JSON.stringify({ question, messages }),
    });

    if (!response.ok) {
      return new Response(JSON.stringify(fallbackPayload(question, `unhealthy (${response.status})`)), {
        status: 200,
        headers: jsonHeaders,
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: jsonHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify(fallbackPayload(question, error === "timeout" ? "timed out" : "unreachable")), {
      status: 200,
      headers: jsonHeaders,
    });
  } finally {
    clear();
  }
}
