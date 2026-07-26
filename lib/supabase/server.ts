import { createClient } from "@supabase/supabase-js";

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
}

function getSupabaseServiceKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_KEY
  );
}

/**
 * Supabase admin client — server-side only.
 * Uses service_role key for full database access.
 * Never import this in client components.
 */
export function createServiceClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseServiceKey();
  if (!url || !key) {
    return null;
  }
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

/**
 * Supabase anon client — safe for server-side rendering.
 * Uses anon key; RLS policies constrain access.
 */
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return null;
  }
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
