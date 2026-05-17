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

function fallbackAnswer(question) {
  const text = question.toLowerCase();

  if (/(start|first|recommend|where)/.test(text)) {
    return [
      "Start with Market Desk at market.jackgpt.org. It is the strongest full product demo because it combines live market data, financial statements, AI analysis, signals, news, and stock-aware chat.",
      "After that, try JackGPT Casino for interactive UI and game logic, then Search or Images for fast utility demos. Drill into the project cards for screenshots and architecture notes, check live status for uptime, and use GitHub for public-safe code.",
    ].join("\n\n");
  }

  if (/(github|code|repo|repository)/.test(text)) {
    return "Use the GitHub link on the homepage or visit https://github.com/jackvansickle1. The public repos are recruiter-safe demos and templates; secrets and valuable private strategy logic are intentionally not public.";
  }

  if (/(market|stock|finance|ticker|balance|analysis)/.test(text)) {
    return "Market Desk is the main finance demo. Search a ticker like NVDA, MSFT, or AAPL to see market snapshots, advanced charting, company profile fields, balance sheet data when available, buy/sell signal analysis, news, AI bull/bear cases, and stock-aware chat. It is a portfolio research demo, not financial advice.";
  }

  if (/(app|chat|jackgpt 3\.1|account|sign)/.test(text)) {
    return "app.jackgpt.org is the account-based JackGPT AI workspace. Visitors can sign up from the sign-in page, then explore JackGPT 3.1 chat, web search, image generation, and the branded self-hosted AI experience.";
  }

  if (/(casino|craps|crapless|bubble|horse|racing|game)/.test(text)) {
    return "JackGPT Casino at casino.jackgpt.org is the interactive gaming demo. It includes standard craps, crapless craps, bubble craps, animated horse racing, chips, sound, responsive layouts, and a polished game-selection lobby.";
  }

  if (/(search|web search|engine)/.test(text)) {
    if (/(power|powered|backend|technical|technically|underlying)/.test(text)) {
      return "JackGPT Search at search.jackgpt.org is the branded public search surface. At the backend level it is powered by SearXNG, wrapped in JackGPT branding and kept free of private configuration details.";
    }

    return "JackGPT Search at search.jackgpt.org is the branded public web-search endpoint. Recruiters can use it directly, and JackGPT 3.1 can use web search inside the AI workspace. Implementation details stay quiet unless someone asks specifically for backend architecture.";
  }

  if (/(image|images|generate|picture|stable|diffusion)/.test(text)) {
    return "JackGPT Images at images.jackgpt.org is the GPU-backed image-generation demo. It is branded into the JackGPT theme, uses a safe-for-work model, and also powers image generation from the app.jackgpt.org workspace.";
  }

  if (/(kalshi|climate|temperature|trade|trading|position|p.?l|orders?)/.test(text)) {
    return "Kalshi Climate Desk at kalshi.jackgpt.org is a public-safe operations dashboard. It shows scanner health, bankroll, exposure, estimated open P/L, realized P/L, active positions, recent sanitized trades, city exposure, bankroll history, and pending-order visibility without exposing private strategy logic.";
  }

  if (/(minecraft|mc\.jackgpt|paper|server)/.test(text)) {
    return "The Minecraft project is a Dockerized Paper server exposed through mc.jackgpt.org and represented honestly in live status. It is a service-health and infrastructure example rather than a web-app card with a public website link.";
  }

  if (/(mesh|admin|remote|device)/.test(text)) {
    return "JackGPT Mesh demonstrates self-hosted remote-management infrastructure, but it is a private admin surface with public account creation disabled. Treat it as architecture, uptime, and themed infrastructure context rather than a public device-management demo.";
  }

  if (/(docker|cloudflare|deploy|infrastructure|how)/.test(text)) {
    return "Most of the ecosystem is Dockerized and published through Cloudflare Tunnel. That lets local services run behind clean public subdomains while the homepage ties everything together with case studies, screenshots, links, and live status checks.";
  }

  return "I can help you navigate JackGPT. The best path is Market Desk first, Casino second, Search or Images for quick demos, Kalshi Climate Desk for operations-dashboard polish, project cards for case studies, live status for health, and GitHub for public-safe code.";
}

function fallbackPayload(question, reason = "backend unavailable") {
  return {
    app: "JackGPT Homepage Companion",
    generatedAt: new Date().toISOString(),
    question,
    answer: fallbackAnswer(question),
    suggestions: [
      "Where should I start?",
      "Which project best shows full-stack work?",
      "How is the ecosystem deployed?",
      "What should a recruiter inspect first?",
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
