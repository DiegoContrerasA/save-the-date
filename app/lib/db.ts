import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Cliente de Supabase con la publishable key. La tabla `guests` no es
 * accesible directamente (RLS sin policies): solo se usan las funciones
 * `get_guest` y `save_rsvp` de supabase/rpc.sql.
 * Devuelve null si faltan las variables de entorno.
 */
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  client ??= createClient(url, key, { auth: { persistSession: false } });
  return client;
}
