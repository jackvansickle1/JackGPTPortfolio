import { checkSitesBoundary, matchesSitesBoundary, SITES_BOUNDARY_TARGETS } from "../lib/sites-boundary.js";
import { onRequestGet } from "../functions/api/status/summary.js";

const encoder = new TextEncoder();

export default {
  async fetch(request) {
    const fixture = await request.json();
    if (fixture.op === "match") return Response.json({ matches: await matchesSitesBoundary(fixture.key, fixture.body) });
    const calls = [];
    let reads = 0;
    let cancels = 0;
    let signal;
    const fakeFetch = async (url, options) => {
      // Exercise native workerd RequestInit support without issuing a request.
      new Request(url, options);
      calls.push({ url, options: { ...options, signal: undefined, hasSignal: options.signal instanceof AbortSignal } });
      signal = options.signal;
      const site = SITES_BOUNDARY_TARGETS.find((target) => target.endpoint === url);
      if (!site && fixture.op !== "summary") throw new Error("Unexpected outbound request.");
      if (!site) {
        if (url === "https://moomoo.jackgpt.org/office/health") {
          return Response.json({ service: "office", status: "online", checkedAt: new Date().toISOString(), description: "Office" });
        }
        return Response.json({ status: "online", results: [{}] });
      }
      const current = fixture.op === "summary" ? fixture.sites[site.key] : fixture;
      if (current.throw) throw new Error("PRIVATE_SENTINEL");
      if (current.hangFetch) return new Promise(() => {});
      const parts = current.chunks ?? [current.body ?? "PRIVATE_SENTINEL"];
      let index = 0;
      const body = new ReadableStream({
        pull(controller) {
          reads += 1;
          if (current.hangBody) return new Promise(() => {});
          if (index === parts.length) { controller.close(); return; }
          controller.enqueue(Array.isArray(parts[index]) ? new Uint8Array(parts[index++]) : encoder.encode(parts[index++]));
        },
        cancel() { cancels += 1; },
      }, { highWaterMark: 0 });
      return {
        status: current.status ?? (site.key === "sports" ? 200 : 401),
        url: current.url ?? url,
        redirected: current.redirected ?? false,
        headers: new Headers({ "content-type": current.type ?? "text/html; charset=utf-8", ...(current.headers ?? {}) }),
        body,
      };
    };
    const savedFetch = globalThis.fetch;
    const savedRewriter = globalThis.HTMLRewriter;
    try {
      if (fixture.hangParse) {
        globalThis.HTMLRewriter = class {
          on() { return this; }
          onDocument() { return this; }
          transform() { return { arrayBuffer: () => new Promise(() => {}) }; }
        };
      }
      let row;
      if (fixture.op === "summary") {
        globalThis.fetch = fakeFetch;
        row = await (await onRequestGet()).json();
      } else {
        let tick = 0;
        const now = fixture.elapsed === undefined ? Date.now : () => tick++ ? fixture.elapsed : 0;
        row = await checkSitesBoundary(fixture.key, { fetchImpl: fakeFetch, deadlineMs: fixture.deadlineMs ?? 8000, now });
      }
      if (fixture.waitAfter) await new Promise((resolve) => setTimeout(resolve, fixture.waitAfter));
      return Response.json({ row, calls, reads, cancels, aborted: signal?.aborted });
    } catch {
      return Response.json({ error: "REJECTED", calls, reads, cancels });
    } finally {
      globalThis.fetch = savedFetch;
      globalThis.HTMLRewriter = savedRewriter;
    }
  },
};
