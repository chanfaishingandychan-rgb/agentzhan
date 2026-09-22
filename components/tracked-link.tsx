"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type TrackedLinkProps = {
  href: string;
  eventName: string;
  className?: string;
  children: ReactNode;
};

export function TrackedLink({ href, eventName, className, children }: TrackedLinkProps) {
  function trackClick() {
    let visitorId: string | null = null;

    try {
      visitorId = window.localStorage.getItem("agentzhan_visitor_id");
    } catch {
      // Some privacy modes disable localStorage; click tracking should still work.
    }

    const payload = JSON.stringify({
      eventName,
      path: window.location.pathname,
      href,
      visitorId,
    });

    if ("sendBeacon" in navigator) {
      navigator.sendBeacon("/api/events", new Blob([payload], { type: "application/json" }));
      return;
    }

    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  }

  return (
    <Link href={href} className={className} onClick={trackClick}>
      {children}
    </Link>
  );
}
