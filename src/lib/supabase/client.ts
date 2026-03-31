"use client";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

let client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseBrowser() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/[\s\r\n]+/g, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.replace(/[\s\r\n]+/g, "");

  if (!url || !key) {
    console.warn("[UBEX] Supabase env vars missing. URL:", !!url, "KEY:", !!key);
    return null;
  }

  client = createClient<Database>(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: "ubex-auth",
    },
  });
  return client;
}
