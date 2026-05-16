
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
    endpoint: "https://images.jackgpt.org/sdapi/v1/sd-models",
    description: "Public image-generation endpoint is reachable.",
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
  const { signal, clear } = buildTimeoutSignal(4500);

  try {
    let response;

    try {
      response = await fetch(target.endpoint, {
        method: "HEAD",
        redirect: "follow",
        signal,
        cf: { cacheTtl: 20, cacheEverything: true },
        headers: {
          "user-agent": "jackgpt-status-probe",
        },
      });
    } catch {
      response = await fetch(target.endpoint, {
        method: "GET",
        redirect: "follow",
        signal,
        cf: { cacheTtl: 20, cacheEverything: true },
        headers: {
          "user-agent": "jackgpt-status-probe",
        },
      });
    }

    const latencyMs = Date.now() - startedAt;
    const httpStatus = response.status;
    const status =
      response.ok
        ? latencyMs > 2000
          ? "degraded"
          : "online"
        : "offline";

    return {
      ...target,
      status,
      httpStatus,
      latencyMs,
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
