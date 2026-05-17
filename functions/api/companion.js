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
      "After that, try JackGPT Casino for interactive UI and game logic, then Search or Images for fast utility demos. Use the project cards for screenshots and architecture notes, then check GitHub for public-safe code.",
    ].join("\n\n");
  }

  if (/(github|code|repo|repository)/.test(text)) {
    return "Use the GitHub link on the homepage or visit https://github.com/jackvansickle1. The public repos are recruiter-safe demos and templates; secrets and valuable private strategy logic are intentionally not public.";
  }

  if (/(market|stock|finance|ticker|balance|analysis)/.test(text)) {
    return "Market Desk is the main finance demo. Search a ticker like NVDA, MSFT, or AAPL to see snapshots, charting, financial statements, buy/sell signal analysis, news, AI bull/bear cases, and stock-aware chat.";
  }

  if (/(app|chat|jackgpt 3\.1|account|sign)/.test(text)) {
    return "app.jackgpt.org is the account-based JackGPT AI workspace. Visitors can sign up from the sign-in page, then explore chat, web search, image generation, and the branded self-hosted AI experience.";
  }

  if (/(mesh|admin|remote|device)/.test(text)) {
    return "JackGPT Mesh demonstrates self-hosted remote-management infrastructure, but it is a private admin surface. Treat it as architecture and uptime context rather than a public device-management demo.";
  }

  if (/(docker|cloudflare|deploy|infrastructure|how)/.test(text)) {
    return "Most of the ecosystem is Dockerized and published through Cloudflare Tunnel. That lets local services run behind clean public subdomains while the homepage ties everything together with case studies, screenshots, links, and live status checks.";
  }

  return "I can help you navigate JackGPT. The best path is Market Desk first, Casino second, Search or Images for quick demos, project cards for case studies, live status for health, and GitHub for public-safe code.";
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
