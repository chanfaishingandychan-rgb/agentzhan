"use client";

import { Analytics } from "@vercel/analytics/next";

export function VercelAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        try {
          const url = new URL(event.url);
          if (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) return null;
        } catch {
          return event;
        }

        return event;
      }}
    />
  );
}
