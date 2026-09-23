
const SERVICE_TARGETS = [
  {
    key: "openwebui",
    name: "JackGPT AI Workspace",
    endpoint: "https://app.jackgpt.org/api/version",
    publicUrl: "https://app.jackgpt.org",
    description: "Public AI workspace and model routing are reachable.",
  },
  {
    key: "office",
    name: "JackGPT Office",
    endpoint: "https://moomoo.jackgpt.org/office/health",
    publicUrl: "https://office.jackgpt.org",
    description: "Private Office; owner sign-in required.",
    readJsonStatus: true,
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
    maintenance: true,
    description: "Minecraft server is intentionally paused and excluded from outage scoring.",
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

async function readOfficeHealth(response) {
  const unavailable = {
    status: "offline",
    description: "Private Office health could not be verified; owner sign-in required.",
  };
  if (response.redirected || response.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return unavailable;

  try {
    const data = await response.json();
    if (
      data === null || typeof data !== "object" || Array.isArray(data) ||
      data.service !== "office" || !["online", "degraded", "offline"].includes(data.status) ||
      typeof data.description !== "string" || !data.description.trim() ||
      typeof data.checkedAt !== "string" ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(data.checkedAt)
    ) return unavailable;

    const checkedAt = Date.parse(data.checkedAt);
    const age = Date.now() - checkedAt;
    const [year, month, day] = data.checkedAt.slice(0, 10).split("-").map(Number);
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    if (
      !Number.isFinite(checkedAt) || age < 0 || age > 180_000 || day > daysInMonth ||
      response.status !== (data.status === "online" ? 200 : 503)
    ) return unavailable;

    // Never relay descriptions or extra fields, and never freshen the source check time.
    return {
      status: data.status,
      checkedAt: data.checkedAt,
      description: `Private Office health is ${data.status}; owner sign-in required.`,
    };
  } catch {
    return unavailable;
  }
}

async function checkTarget(target) {
  if (target.maintenance) {
    return {
      ...target,
      status: "maintenance",
      httpStatus: "-",
      latencyMs: null,
      checkedAt: new Date().toISOString(),
    };
  }

  const startedAt = Date.now();
  const { signal, clear } = buildTimeoutSignal(6500);
  const isOffice = target.key === "office";

  try {
    const fetchTarget = (method) =>
      fetch(target.endpoint, {
        method,
        redirect: isOffice ? "error" : "follow",
        signal,
        // Avoid Request.cache, which throws on older Pages compatibility dates.
        cf: isOffice ? { cacheTtlByStatus: { "100-599": -1 }, cacheEverything: false } : { cacheTtl: 20, cacheEverything: true },
        headers: {
          ...(isOffice ? { "cache-control": "no-cache, no-store", pragma: "no-cache" } : {}),
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
      } catch {
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
    let checkedAt;

    if (isOffice) {
      const health = await readOfficeHealth(response);
      status = health.status;
      description = health.description;
      checkedAt = health.checkedAt;
    } else if (target.readJsonStatus) {
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
      checkedAt: checkedAt || new Date().toISOString(),
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
