"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabaseServer";

const classSchema = z.object({
  titleHe: z.string().min(2),
  titleEn: z.string().min(2),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  capacity: z.coerce.number().int().positive(),
});

export async function createClassSession(_: { message: string }, formData: FormData) {
  const parsed = classSchema.safeParse({
    titleHe: formData.get("title_he"),
    titleEn: formData.get("title_en"),
    startsAt: formData.get("starts_at"),
    endsAt: formData.get("ends_at"),
    capacity: formData.get("capacity"),
  });

  if (!parsed.success) {
    return { message: "Class details are incomplete." };
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("class_sessions").insert({
    title_he: parsed.data.titleHe,
    title_en: parsed.data.titleEn,
    starts_at: parsed.data.startsAt,
    ends_at: parsed.data.endsAt,
    capacity: parsed.data.capacity,
    status: "draft",
  });

  if (error) {
    return { message: error.message };
  }

  revalidatePath("/classes");
  return { message: "Class created." };
}
