export const STATUS_MAX_AGE_MS = 120_000;

const CHECKED_STATES = new Set(["online", "degraded", "offline"]);
const DESCRIPTIONS = {
  online: "The latest check reached this service.",
  degraded: "The latest check reported reduced availability.",
  offline: "The latest check could not reach this service.",
  maintenance: "Intentionally paused; not treated as an outage.",
};
const UNAVAILABLE = "Live status is unavailable.";
const OUTDATED = "The last check is out of date.";

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function checkedTime(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)
  ) return NaN;
  return Date.parse(value);
}

function isFresh(time, now) {
  return Number.isFinite(time) && time <= now && now - time < STATUS_MAX_AGE_MS;
}

function unavailable(service, message, missing = false) {
  if (service.status === "maintenance") return service;
  const hasCheck = Number.isFinite(checkedTime(service.checkedAt));
  return {
    ...service,
    status: hasCheck && !missing ? "stale" : "unknown",
    description: `${message} ${hasCheck ? "Previous metrics are not current." : "No verified check yet."}`,
  };
}

function failedState(state, error) {
  return {
    ...state,
    liveStatuses: state.liveStatuses.map((service) => unavailable(service, error)),
    statusMeta: { loading: false, error },
  };
}

function validCheck(service, now) {
  if (!isRecord(service) || typeof service.status !== "string" || !Object.hasOwn(DESCRIPTIONS, service.status)) return false;
  const time = checkedTime(service.checkedAt);
  if (!Number.isFinite(time) || time > now) return false;
  if (
    service.latencyMs != null &&
    (typeof service.latencyMs !== "number" || !Number.isFinite(service.latencyMs) || service.latencyMs < 0)
  ) return false;
  return service.httpStatus == null || service.httpStatus === "-" || service.httpStatus === "ERR" ||
    (Number.isInteger(service.httpStatus) && service.httpStatus >= 100 && service.httpStatus <= 599);
}

// The supplied fallback list is the per-mount allowlist, never endpoint data.
export function createStatusState(fallbackStatuses) {
  const defaults = fallbackStatuses.map((service) => ({ ...service }));
  return {
    defaults,
    liveStatuses: defaults.map((service) => service.status === "maintenance" ? { ...service } : {
      ...service,
      status: "unknown",
      latencyMs: null,
      httpStatus: "-",
      checkedAt: null,
      description: "Live status is not available yet. No verified check yet.",
    }),
    statusMeta: { loading: true, error: "" },
  };
}

function receiveSummary(state, payload, now) {
  if (!isRecord(payload) || !Array.isArray(payload.services) || payload.services.length === 0) {
    return failedState(state, "Live status is unavailable. The response contained no valid service checks.");
  }

  const allowed = new Set(state.defaults.map((service) => service.key));
  const incoming = new Map();
  for (const service of payload.services) {
    if (!isRecord(service) || typeof service.key !== "string" || !service.key) {
      return failedState(state, "Live status is unavailable. The response contained an invalid service check.");
    }
    if (!allowed.has(service.key)) continue;
    // Duplicate keys are ambiguous; do not pick whichever record arrived last.
    incoming.set(service.key, incoming.has(service.key) ? null : service);
  }
  if (incoming.size === 0) return failedState(state, UNAVAILABLE);

  const previous = new Map(state.liveStatuses.map((service) => [service.key, service]));
  let incomplete = false;
  const liveStatuses = state.defaults.map((fallback) => {
    const current = previous.get(fallback.key);
    const check = incoming.get(fallback.key);
    if (fallback.status === "maintenance") {
      return {
        ...fallback,
        checkedAt: validCheck(check, now) ? check.checkedAt : current.checkedAt,
      };
    }
    if (!incoming.has(fallback.key)) {
      incomplete = true;
      // A missing service is unknown even if an earlier response checked it.
      return unavailable({ ...current, status: "unknown" }, "This service was missing from the latest update.", true);
    }
    if (!validCheck(check, now)) {
      incomplete = true;
      return unavailable(current, "The latest service check was invalid.");
    }

    const time = checkedTime(check.checkedAt);
    if (time < checkedTime(current.checkedAt)) {
      incomplete = true;
      return unavailable(current, "No newer service check is available.");
    }
    const next = {
      ...fallback,
      status: check.status,
      latencyMs: check.latencyMs ?? null,
      httpStatus: check.httpStatus ?? "-",
      checkedAt: check.checkedAt,
      description: DESCRIPTIONS[check.status],
    };
    if (check.status !== "maintenance" && !isFresh(time, now)) {
      incomplete = true;
      return unavailable(next, OUTDATED);
    }
    return next;
  });
  return {
    ...state,
    liveStatuses,
    statusMeta: {
      loading: false,
      error: incomplete ? "Some live checks are unavailable or out of date." : "",
    },
  };
}

export function statusStateReducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, statusMeta: { ...state.statusMeta, loading: true } };
    case "success":
      return receiveSummary(state, action.payload, action.now);
    case "unavailable":
      return failedState(state, action.error || UNAVAILABLE);
    case "expire": {
      let expired = false;
      const liveStatuses = state.liveStatuses.map((service) => {
        if (!CHECKED_STATES.has(service.status) || isFresh(checkedTime(service.checkedAt), action.now)) return service;
        expired = true;
        return unavailable(service, OUTDATED);
      });
      return expired ? {
        ...state,
        liveStatuses,
        statusMeta: { ...state.statusMeta, error: "Some live checks are out of date." },
      } : state;
    }
    default:
      return state;
  }
}

export function nextStatusExpiry(liveStatuses, now) {
  const remaining = liveStatuses.filter((service) => CHECKED_STATES.has(service.status)).map((service) => {
    const time = checkedTime(service.checkedAt);
    return !isFresh(time, now) ? 0 : time + STATUS_MAX_AGE_MS - now;
  });
  return remaining.length ? Math.min(...remaining) : null;
}
