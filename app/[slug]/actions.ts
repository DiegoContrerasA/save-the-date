"use server";

import { supabase } from "../lib/db";
import { revalidatePath } from "next/cache";

export async function confirmAttendance(id: string, confirmed: boolean) {
  try {
    const {  error } = await supabase
      .from("invitations")
      .update({ confirmed, responded_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error(error);
    }

    revalidatePath("/", "layout");
  } catch (error) {
    console.error(error);
  }
}
