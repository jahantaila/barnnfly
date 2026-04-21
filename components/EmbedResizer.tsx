"use client";

import { useEffect } from "react";

/**
 * Inside-the-iframe companion for the WordPress embed.
 * Emits the current document height to the parent window whenever it changes,
 * so the parent can auto-size the iframe (no vertical scroll inside iframe).
 *
 * Message shape:
 *   { type: "barknfly:resize", height: number }
 *
 * Also responds to a "barknfly:ping" message with a "barknfly:pong" so the
 * parent snippet can confirm the survey finished loading.
 */
export function EmbedResizer() {
  useEffect(() => {
    if (typeof window === "undefined" || window.parent === window) return;

    let last = 0;
    const send = () => {
      const h = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      if (h !== last) {
        last = h;
        window.parent.postMessage(
          { type: "barknfly:resize", height: h },
          "*"
        );
      }
    };

    send();

    const ro = new ResizeObserver(send);
    ro.observe(document.documentElement);
    ro.observe(document.body);

    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === "barknfly:ping") {
        window.parent.postMessage({ type: "barknfly:pong" }, "*");
        send();
      }
    };
    window.addEventListener("message", onMessage);

    // Also emit on common interactions that can change height
    const interval = window.setInterval(send, 600);

    return () => {
      ro.disconnect();
      window.removeEventListener("message", onMessage);
      window.clearInterval(interval);
    };
  }, []);

  return null;
}
