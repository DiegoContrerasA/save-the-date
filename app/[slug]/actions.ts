"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSupabase } from "../lib/db";

const schema = z.object({
  slug: z.string().min(1).max(200),
  confirmed: z.boolean(),
  vegetarian: z.boolean(),
  restrictions: z.string().trim().max(500).nullable(),
});

export type RsvpResult =
  | { ok: true }
  | { ok: false; error: "invalid" | "save" };

export async function saveRsvp(input: unknown): Promise<RsvpResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "invalid" };
  }
  const { slug, confirmed } = parsed.data;

  // Quien no asiste no necesita dejar preferencias de comida
  const vegetarian = confirmed && parsed.data.vegetarian;
  const restrictions = confirmed ? parsed.data.restrictions || null : null;

  const db = getSupabase();
  if (!db) return { ok: false, error: "save" };

  const { data: updated, error } = await db.rpc("save_rsvp", {
    p_slug: slug,
    p_confirmed: confirmed,
    p_vegetarian: vegetarian,
    p_restrictions: restrictions,
  });

  if (error || !updated) {
    console.error(error);
    return { ok: false, error: "save" };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}
