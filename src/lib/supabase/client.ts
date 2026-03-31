"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowser() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/[\s\r\n]+/g, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.replace(/[\s\r\n]+/g, "");

  if (!url || !key) {
    console.warn("[UBEX] Supabase env vars missing. URL:", !!url, "KEY:", !!key);
    return null;
  }

  client = createBrowserClient<Database>(url, key, {
    auth: {
      // Bypass navigator.locks which causes hangs with multiple instances
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lock: async (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => {
        return await fn();
      },
    },
  });
  return client;
}
