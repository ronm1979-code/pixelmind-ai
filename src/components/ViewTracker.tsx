"use client";
import { useEffect } from "react";

export function ViewTracker({ type, slug }: { type: "article" | "guide" | "tool"; slug: string }) {
  useEffect(() => {
    fetch("/api/analytics/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, slug }),
    }).catch(() => {});
  }, [type, slug]);

  return null;
}
