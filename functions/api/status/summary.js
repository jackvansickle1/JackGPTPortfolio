
const SERVICE_TARGETS = [
  {
    key: "openwebui",
    name: "JackGPT AI Workspace",
    endpoint: "https://app.jackgpt.org/api/version",
    publicUrl: "https://app.jackgpt.org",
    description: "Public AI workspace and model routing are reachable.",
  },
  {
    key: "images",
    name: "JackGPT Image Gen",
    endpoint: "https://images.jackgpt.org",
    publicUrl: "https://images.jackgpt.org",
    method: "GET",
    description: "Public GPU-backed image-generation interface is reachable.",
  },
  {
    key: "meshcentral",
    name: "JackGPT Mesh",
    endpoint: "https://mesh.jackgpt.org",
    publicUrl: "https://mesh.jackgpt.org",
    description: "Remote-management endpoint is reachable.",
  },
  {
    key: "jackgpt-search",
    name: "JackGPT Search",
    endpoint: "https://search.jackgpt.org/search?q=openai&categories=general&format=json",
    publicUrl: "https://search.jackgpt.org",
    method: "GET",
    minResults: 1,
    description: "Branded JackGPT Search is returning real search results.",
  },
  {
    key: "market-desk",
    name: "JackGPT Market Desk",
    endpoint: "https://market.jackgpt.org/health",
    publicUrl: "https://market.jackgpt.org",
    description: "AI-powered equity research dashboard health endpoint is reachable.",
  },
  {
    key: "casino",
    name: "JackGPT Casino",
    endpoint: "https://casino.jackgpt.org/health",
    publicUrl: "https://casino.jackgpt.org",
    description: "Playable casino game endpoint is reachable.",
  },
  {
    key: "kalshi-temperature-bot",
    name: "Kalshi Climate Desk",
    endpoint: "https://kalshi.jackgpt.org/health",
    publicUrl: "https://kalshi.jackgpt.org",
    description: "Kalshi Climate Desk scanner heartbeat is reachable.",
    readJsonStatus: true,
  },
  {
    key: "pearl-desk",
    name: "JackGPT Pearl Desk",
    endpoint: "https://pearl.jackgpt.org/health",
    publicUrl: "https://pearl.jackgpt.org",
    description: "PRL mining telemetry and GPU idle-guard status are reachable.",
    readJsonStatus: true,
  },
  {
    key: "moomoo-paper-trader",
    name: "Moomoo Trading Bot",
    endpoint: "https://moomoo.jackgpt.org/health",
    publicUrl: "https://moomoo.jackgpt.org",
    description: "Moomoo paper-trading runner, OpenD gateway, and scheduler dashboard is reachable.",
    readJsonStatus: true,
  },
  {
    key: "salad-compute-node",
    name: "Salad Compute Node",
    endpoint: "https://salad.jackgpt.org/health",
    publicUrl: "https://salad.jackgpt.org",
    description: "Salad host compute service and workload dashboard is reachable.",
    readJsonStatus: true,
  },
  {
    key: "minecraft",
    name: "Minecraft Server",
    endpoint: "https://market.jackgpt.org/api/minecraft/health",
    publicUrl: "",
    showEndpoint: false,
    description: "Minecraft server is answering the internal status probe.",
  },
  {
    key: "website",
    name: "JackGPT Homepage",
    endpoint: "https://jackgpt.org",
    publicUrl: "https://jackgpt.org",
    description: "Portfolio homepage is reachable.",
  },
  {
    key: "external-watchdog",
    name: "JackGPT Public Status",
    endpoint: "https://status.jackgpt.org/health",
    publicUrl: "https://status.jackgpt.org",
    description: "Cloudflare-hosted external watchdog is reachable.",
    readJsonStatus: true,
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
          accept: target.readJsonStatus || target.minResults ? "application/json" : "text/html,application/json;q=0.9,*/*;q=0.8",
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
        } else if (typeof data.message === "string" && data.message.trim()) {
          description = data.message.trim();
        }
      } catch {
        status = response.ok ? status : "offline";
      }
    }

    if (target.minResults) {
      try {
        const data = await response.clone().json();
        const resultCount = Array.isArray(data.results) ? data.results.length : 0;
        if (!response.ok) {
          status = "offline";
          description = "JackGPT Search functional probe failed.";
        } else if (resultCount < target.minResults) {
          status = "degraded";
          description = `JackGPT Search loaded but returned ${resultCount} result(s).`;
        } else if (status === "online") {
          description = `JackGPT Search returned ${resultCount} result(s).`;
        }
      } catch {
        status = response.ok ? "degraded" : "offline";
        description = "JackGPT Search functional probe did not return valid JSON.";
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
