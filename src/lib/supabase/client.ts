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

  try {
    new URL(url);
  } catch {
    console.error("[UBEX] Invalid SUPABASE_URL:", url);
    return null;
  }

  client = createBrowserClient<Database>(url, key);
  return client;
}
