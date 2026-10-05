import { getSupabase } from "./db";

export type Guest = {
  slug: string;
  name: string;
  // null = sin responder
  confirmed: boolean | null;
  vegetarian: boolean;
  restrictions: string | null;
  // Invitados con un rol especial en la boda (mismo mensaje para todos)
  hasRole: boolean;
};

export async function getGuestBySlug(slug: string): Promise<Guest | null> {
  let key: string;
  try {
    key = decodeURIComponent(slug);
  } catch {
    return null;
  }

  const db = getSupabase();
  if (!db) {
    console.error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY en .env.local",
    );
    return null;
  }

  const { data: rows, error } = await db.rpc("get_guest", { p_slug: key });

  if (error) {
    console.error(error);
    return null;
  }
  const data = rows?.[0];
  if (!data) return null;

  return {
    slug: data.slug,
    name: data.name,
    confirmed: data.confirmed,
    vegetarian: data.vegetarian,
    restrictions: data.restrictions,
    hasRole: data.has_role,
  };
}
