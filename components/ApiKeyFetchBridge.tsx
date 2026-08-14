"use client";

import { useEffect } from "react";

import { DEEPSEEK_API_KEY_HEADER, DEEPSEEK_API_KEY_STORAGE_KEY } from "@/lib/api-key";

declare global {
  interface Window {
    __wenmaiFetchBridgeInstalled?: boolean;
  }
}

function shouldAttachKey(input: RequestInfo | URL) {
  const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
  const parsed = new URL(url, window.location.origin);
  return parsed.origin === window.location.origin && parsed.pathname.startsWith("/api/");
}

function mergeHeaders(initHeaders: HeadersInit | undefined, apiKey: string) {
  const headers = new Headers(initHeaders);
  if (!headers.has(DEEPSEEK_API_KEY_HEADER)) headers.set(DEEPSEEK_API_KEY_HEADER, apiKey);
  return headers;
}

export function ApiKeyFetchBridge() {
  useEffect(() => {
    if (window.__wenmaiFetchBridgeInstalled) return;
    window.__wenmaiFetchBridgeInstalled = true;

    const originalFetch = window.fetch.bind(window);

    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      const apiKey = window.localStorage.getItem(DEEPSEEK_API_KEY_STORAGE_KEY)?.trim();

      if (!apiKey || !shouldAttachKey(input)) {
        return originalFetch(input, init);
      }

      if (input instanceof Request) {
        const headers = mergeHeaders(init?.headers ?? input.headers, apiKey);
        return originalFetch(input, { ...init, headers });
      }

      return originalFetch(input, { ...init, headers: mergeHeaders(init?.headers, apiKey) });
    };
  }, []);

  return null;
}
