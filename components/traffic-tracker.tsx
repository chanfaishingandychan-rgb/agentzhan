"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const visitorKey = "agentzhan_visitor_id";
const sessionKey = "agentzhan_session_id";
const ignoredPrefixes = ["/admin", "/api", "/_next"];

function shouldTrack(pathname: string) {
  return pathname.startsWith("/") && !ignoredPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

function getStorageId(storage: Storage, key: string, prefix: string) {
  const existing = storage.getItem(key);
  if (existing) return existing;

  const next = createId(prefix);
  storage.setItem(key, next);
  return next;
}

function getVisitorId() {
  try {
    return getStorageId(window.localStorage, visitorKey, "v");
  } catch {
    return createId("v");
  }
}

function getSessionId() {
  try {
    return getStorageId(window.sessionStorage, sessionKey, "s");
  } catch {
    return createId("s");
  }
}

export function TrafficTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    if (!pathname || !shouldTrack(pathname)) return;

    const payload = {
      path: pathname,
      search,
      title: document.title,
      referrer: document.referrer,
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
    };
    const body = JSON.stringify(payload);

    if ("sendBeacon" in navigator) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/traffic", blob);
      return;
    }

    void fetch("/api/traffic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname, search]);

  return null;
}
