// Public login gates only. Never read account APIs or claim application health.
export const SITES_BOUNDARY_TARGETS = Object.freeze([
  Object.freeze({
    key: "sports",
    name: "Sports public access boundary",
    endpoint: "https://sports.jackgpt.org/",
    publicUrl: "https://sports.jackgpt.org",
    description: "Rally account gate only; application health unverified.",
  }),
  Object.freeze({
    key: "trade",
    name: "Trade private sign-in boundary",
    endpoint: "https://trade.jackgpt.org/",
    publicUrl: "https://trade.jackgpt.org",
    accessMode: "Private",
    description: "Private Trade owner sign-in gate only; application health unverified.",
  }),
]);

export const SITES_BOUNDARY_MAX_BYTES = 64 * 1024;
const DEADLINE_MS = 8000;
const SLOW_MS = 6500;
const normalize = (text) => text.replace(/\s+/g, " ").trim();

// HTMLRewriter token text retains entities. Decode marker characters only;
// unknown named entities remain unmatched instead of broadening the contract.
function decodeMarker(text) {
  const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", mdash: "\u2014" };
  return text.replace(/&(#x[0-9a-f]+|#[0-9]+|amp|lt|gt|quot|apos|nbsp|mdash);/gi, (whole, entity) => {
    if (!entity.startsWith("#")) return named[entity] ?? whole;
    const value = /^#x/i.test(entity) ? Number.parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    return value > 0 && value <= 0x10ffff ? String.fromCodePoint(value) : whole;
  });
}

export async function matchesSitesBoundary(key, body) {
  const page = { title: [], heading: [], text: [], links: [], anonymous: false, gate: false, locked: false, redirecting: false };
  let ignored = 0;
  let title = 0;
  let heading = 0;
  let link = null;
  const rewriter = new globalThis.HTMLRewriter().on("*", {
    element(element) {
      const tag = element.tagName;
      if (tag === "script" || tag === "style") {
        ignored += 1;
        element.onEndTag(() => { ignored -= 1; });
      }
      if (ignored) return;
      const attr = (name) => decodeMarker(element.getAttribute(name) ?? "");
      if (tag === "base" || (tag === "meta" && attr("http-equiv").toLowerCase() === "refresh")) page.redirecting = true;
      if (tag === "title") { title += 1; element.onEndTag(() => { title -= 1; }); }
      if (tag === "h1") { heading += 1; element.onEndTag(() => { heading -= 1; }); }
      if (tag === "a") {
        const current = { href: attr("href"), text: [] };
        link = current;
        element.onEndTag(() => { page.links.push(current); link = null; });
      }
      if (tag === "html" && attr("data-rally-authenticated") === "false") page.anonymous = true;
      if (tag === "section" && attr("id") === "auth-gate" && attr("aria-label") === "Rally account access") page.gate = true;
      if (tag === "div" && attr("id") === "sports-app" && element.hasAttribute("hidden") && element.hasAttribute("inert")) page.locked = true;
    },
  }).onDocument({
    text(chunk) {
      if (ignored) return;
      page.text.push(chunk.text);
      if (title) page.title.push(chunk.text);
      if (heading) page.heading.push(chunk.text);
      if (link) link.text.push(chunk.text);
    },
  });
  await rewriter.transform(new Response(body)).arrayBuffer();
  if (page.redirecting) return false;
  const titleText = normalize(decodeMarker(page.title.join("")));
  if (key === "sports") {
    return titleText === "Rally \u2014 Your game. Your call." && page.anonymous && page.gate && page.locked
      && decodeMarker(page.text.join(" ")).includes("Enable JavaScript to sign in to Rally.");
  }
  if (key !== "trade" || titleText !== "Sign in required" || normalize(decodeMarker(page.heading.join(""))) !== "Log in to access") return false;
  return page.links.some(({ href, text }) => {
    if (normalize(decodeMarker(text.join(""))) !== "Continue with ChatGPT") return false;
    try {
      const url = new URL(href, "https://trade.jackgpt.org/");
      const params = [...url.searchParams];
      return url.origin === "https://trade.jackgpt.org" && !url.username && !url.password && !url.hash
        && url.pathname === "/signin-with-chatgpt" && params.length === 1
        && params[0][0] === "return_to" && params[0][1] === "/";
    } catch { return false; }
  });
}

export async function checkSitesBoundary(key, {
  fetchImpl = globalThis.fetch, deadlineMs = DEADLINE_MS, now = Date.now,
} = {}) {
  const target = SITES_BOUNDARY_TARGETS.find((item) => item.key === key);
  if (!target) throw new Error("Unknown access-boundary target.");
  const started = now();
  const controller = new AbortController();
  let timer;
  let reader;
  let httpStatus = "ERR";
  let phase = "transport";
  const prefix = key === "trade" ? "Private Trade owner sign-in gate" : "Rally account gate";
  const result = (status, detail) => ({
    ...target, status, httpStatus, latencyMs: Math.max(0, now() - started),
    checkedAt: new Date().toISOString(), scope: "access boundary", applicationHealth: "unverified",
    autoRepair: false, repairable: false,
    description: `${prefix}: ${detail}; application health unverified.`,
  });
  const cancelReader = () => { if (reader) void reader.cancel().catch(() => {}); };
  const deadline = new Promise((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      cancelReader();
      reject(new Error("Access-boundary deadline reached."));
    }, deadlineMs);
  });
  const inspect = async () => {
    const response = await fetchImpl(target.endpoint, {
      method: "GET", redirect: "manual", credentials: "omit", signal: controller.signal,
      cf: { cacheTtlByStatus: { "100-599": -1 }, cacheEverything: false },
      headers: { accept: "text/html", "cache-control": "no-cache, no-store", pragma: "no-cache", "user-agent": "jackgpt-status-probe" },
    });
    if (controller.signal.aborted) {
      void response.body?.cancel().catch(() => {});
      throw new Error("Access-boundary deadline reached.");
    }
    httpStatus = response.status;
    reader = response.body?.getReader();
    if (response.url !== target.endpoint || response.redirected || (httpStatus >= 300 && httpStatus < 400)) {
      return result("degraded", "unexpected origin or redirect");
    }
    if (httpStatus !== (key === "sports" ? 200 : 401)) return result("degraded", `unexpected HTTP ${httpStatus}`);
    if (response.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "text/html") {
      return result("degraded", "unexpected content type");
    }
    const chunks = [];
    let size = 0;
    while (reader) {
      const { value, done } = await reader.read();
      if (controller.signal.aborted) throw new Error("Access-boundary deadline reached.");
      if (done) break;
      size += value.byteLength;
      if (size > SITES_BOUNDARY_MAX_BYTES) return result("degraded", "response exceeds size limit");
      chunks.push(value);
    }
    phase = "validation";
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const body = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    const matches = await matchesSitesBoundary(key, body);
    if (controller.signal.aborted) throw new Error("Access-boundary deadline reached.");
    if (!matches) return result("degraded", "expected sign-in markers not found");
    if (now() - started > SLOW_MS) return result("degraded", "expected access boundary responded slowly");
    return result("online", "public endpoint reachable with expected sign-in markers");
  };
  try {
    return await Promise.race([inspect(), deadline]);
  } catch {
    return result(controller.signal.aborted || phase === "transport" ? "offline" : "degraded",
      controller.signal.aborted ? "public access-boundary check timed out" : phase === "transport" ? "public access boundary unreachable" : "public access-boundary check failed");
  } finally {
    clearTimeout(timer);
    cancelReader();
  }
}
