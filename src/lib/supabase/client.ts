"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowser() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;

  try {
    new URL(url);
  } catch {
    console.error("Invalid NEXT_PUBLIC_SUPABASE_URL:", url);
    return null;
  }

  client = createBrowserClient<Database>(url, key);
  return client;
}
