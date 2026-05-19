
const SERVICE_TARGETS = [
  {
    key: "openwebui",
    name: "OpenWebUI + Ollama",
    endpoint: "https://app.jackgpt.org/api/version",
    description: "Public chat interface and model routing are reachable.",
  },
  {
    key: "automatic1111",
    name: "AUTOMATIC1111",
    endpoint: "https://images.jackgpt.org/sdapi/v1/memory",
    description: "Image-generation service is reachable.",
  },
  {
    key: "images",
    name: "images.jackgpt.org",
    endpoint: "https://images.jackgpt.org",
    method: "GET",
    description: "Public JackGPT Images interface is reachable.",
  },
  {
    key: "meshcentral",
    name: "mesh.jackgpt.org",
    endpoint: "https://mesh.jackgpt.org",
    description: "Remote-management endpoint is reachable.",
  },
  {
    key: "jackgpt-search",
    name: "search.jackgpt.org",
    endpoint: "https://search.jackgpt.org",
    method: "GET",
    description: "Branded JackGPT Search endpoint is reachable.",
  },
  {
    key: "market-desk",
    name: "Market Desk",
    endpoint: "https://market.jackgpt.org/health",
    description: "AI-powered equity research dashboard health endpoint is reachable.",
  },
  {
    key: "casino",
    name: "JackGPT Casino",
    endpoint: "https://casino.jackgpt.org/health",
    description: "Playable casino game endpoint is reachable.",
  },
  {
    key: "kalshi-temperature-bot",
    name: "Kalshi Temperature Bot",
    endpoint: "https://kalshi.jackgpt.org/health",
    description: "Kalshi Climate Desk scanner heartbeat is reachable.",
    readJsonStatus: true,
  },
  {
    key: "minecraft",
    name: "Minecraft Server",
    endpoint: "https://market.jackgpt.org/api/minecraft/health",
    showEndpoint: false,
    description: "Minecraft server is answering the internal status probe.",
  },
  {
    key: "website",
    name: "JackGPT Platform",
    endpoint: "https://jackgpt.org",
    description: "Portfolio homepage is reachable.",
  },
];

function buildTimeoutSignal(ms) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort("timeout"), ms);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  };
}

async function checkTarget(target) {
  const startedAt = Date.now();
  const { signal, clear } = buildTimeoutSignal(6500);

  try {
    const fetchTarget = (method) =>
      fetch(target.endpoint, {
        method,
        redirect: "follow",
        signal,
        cf: { cacheTtl: 20, cacheEverything: true },
        headers: {
          accept: target.readJsonStatus ? "application/json" : "text/html,application/json;q=0.9,*/*;q=0.8",
          "user-agent": "jackgpt-status-probe",
        },
      });

    let response;
    const preferredMethod = target.readJsonStatus ? "GET" : target.method || "HEAD";

    if (preferredMethod === "HEAD") {
      try {
        response = await fetchTarget("HEAD");
        if (!response.ok && [405, 403, 502, 503, 504].includes(response.status)) {
          response = await fetchTarget("GET");
        }
      } catch (error) {
        response = await fetchTarget("GET");
      }
    } else {
      response = await fetchTarget(preferredMethod);
    }

    const latencyMs = Date.now() - startedAt;
    const httpStatus = response.status;
    let status =
      response.ok
        ? latencyMs > 2000
          ? "degraded"
          : "online"
        : "offline";
    let description = target.description;

    if (target.readJsonStatus) {
      try {
        const data = await response.clone().json();
        if (["online", "degraded", "offline"].includes(data.status)) {
          status = data.status;
        }
        if (data.scanner) {
          description = `Kalshi Climate Desk reports scanner ${data.scanner}; health endpoint is reachable.`;
        }
      } catch {
        status = response.ok ? status : "offline";
      }
    }

    return {
      ...target,
      status,
      httpStatus,
      latencyMs,
      description,
      checkedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      ...target,
      status: "offline",
      httpStatus: "ERR",
      latencyMs: null,
      checkedAt: new Date().toISOString(),
      description:
        error === "timeout" || String(error).includes("timeout")
          ? "Status probe timed out."
          : "Status probe failed.",
    };
  } finally {
    clear();
  }
}

export async function onRequestGet() {
  const checks = await Promise.all(SERVICE_TARGETS.map(checkTarget));

  return new Response(
    JSON.stringify(
      {
        services: checks,
        generatedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
    {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=20, s-maxage=20, stale-while-revalidate=40",
      },
    },
  );
}
