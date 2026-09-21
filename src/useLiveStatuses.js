import { useEffect, useReducer } from "react";
import { createStatusState, nextStatusExpiry, statusStateReducer } from "./status-state.js";

const POLL_INTERVAL_MS = 60_000;
const REQUEST_TIMEOUT_MS = 10_000;

// Pass the static fallback allowlist. Identity and links never come from the API.
export function useLiveStatuses(fallbackStatuses) {
  const [{ liveStatuses, statusMeta }, dispatch] = useReducer(
    statusStateReducer,
    fallbackStatuses,
    createStatusState,
  );

  useEffect(() => {
    let disposed = false;
    let pollTimer;
    let activeRequest = null;
    let resumePending = false;

    const canPoll = () => document.visibilityState === "visible" && navigator.onLine !== false;

    function pause() {
      clearTimeout(pollTimer);
      resumePending = false;
      activeRequest?.controller.abort();
      dispatch({
        type: "unavailable",
        error: navigator.onLine === false
          ? "Your browser is offline. Service availability is unknown."
          : "Live checks are paused while this page is hidden.",
      });
    }

    function schedule(delay) {
      clearTimeout(pollTimer);
      if (!disposed && canPoll()) pollTimer = setTimeout(loadStatuses, delay);
    }

    async function loadStatuses() {
      if (disposed) return;
      if (!canPoll()) {
        pause();
        return;
      }
      if (activeRequest) return;

      const request = { controller: new AbortController(), timedOut: false, timeout: null };
      activeRequest = request;
      dispatch({ type: "expire", now: Date.now() });
      dispatch({ type: "loading" });
      request.timeout = setTimeout(() => {
        request.timedOut = true;
        request.controller.abort();
      }, REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch("/api/status/summary", {
          headers: { accept: "application/json" },
          cache: "default",
          signal: request.controller.signal,
        });
        if (!response.ok) {
          request.httpStatus = response.status;
          throw new Error("Status request failed");
        }
        const payload = await response.json();
        if (!disposed && !request.controller.signal.aborted && canPoll()) {
          dispatch({ type: "success", payload, now: Date.now() });
        }
      } catch {
        if (!disposed && canPoll() && (!request.controller.signal.aborted || request.timedOut)) {
          dispatch({
            type: "unavailable",
            error: request.timedOut
              ? "Live status is unavailable. The check timed out."
              : `Live status is unavailable. The latest refresh failed.${request.httpStatus ? ` HTTP ${request.httpStatus}.` : ""}`,
          });
        }
      } finally {
        clearTimeout(request.timeout);
        activeRequest = null;
        if (!disposed && canPoll()) schedule(resumePending ? 0 : POLL_INTERVAL_MS);
        resumePending = false;
      }
    }

    function activityChanged() {
      if (disposed) return;
      if (!canPoll()) {
        pause();
      } else if (activeRequest) {
        // A rapid hide/show or offline/online waits for the aborted fetch to settle.
        resumePending = activeRequest.controller.signal.aborted;
      } else {
        schedule(0);
      }
    }

    document.addEventListener("visibilitychange", activityChanged);
    window.addEventListener("online", activityChanged);
    window.addEventListener("offline", activityChanged);
    pollTimer = setTimeout(activityChanged, 0);

    return () => {
      disposed = true;
      clearTimeout(pollTimer);
      clearTimeout(activeRequest?.timeout);
      activeRequest?.controller.abort();
      document.removeEventListener("visibilitychange", activityChanged);
      window.removeEventListener("online", activityChanged);
      window.removeEventListener("offline", activityChanged);
    };
  }, []);

  useEffect(() => {
    const delay = nextStatusExpiry(liveStatuses, Date.now());
    if (delay === null) return;
    const timer = setTimeout(() => dispatch({ type: "expire", now: Date.now() }), delay);
    return () => clearTimeout(timer);
  }, [liveStatuses]);

  return { liveStatuses, statusMeta };
}
