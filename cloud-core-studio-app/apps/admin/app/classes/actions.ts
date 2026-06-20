"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabaseServer";

const classSchema = z.object({
  categoryId: z.string().uuid(),
  instructorId: z.string().uuid().optional(),
  roomId: z.string().uuid().optional(),
  titleHe: z.string().min(2),
  titleEn: z.string().min(2),
  descriptionEn: z.string().optional(),
  startsAt: z.string().min(1),
  endsAt: z.string().min(1),
  capacity: z.coerce.number().int().positive(),
});

function localDateTimeToIso(value: string) {
  if (value.endsWith("Z") || /[+-]\d\d:\d\d$/.test(value)) {
    return new Date(value).toISOString();
  }

  return new Date(`${value}:00+03:00`).toISOString();
}

export async function createClassSession(formData: FormData) {
  const parsed = classSchema.safeParse({
    categoryId: formData.get("category_id"),
    instructorId: formData.get("instructor_id") || undefined,
    roomId: formData.get("room_id") || undefined,
    titleHe: formData.get("title_he"),
    titleEn: formData.get("title_en"),
    descriptionEn: formData.get("description_en") || undefined,
    startsAt: formData.get("starts_at"),
    endsAt: formData.get("ends_at"),
    capacity: formData.get("capacity"),
  });

  if (!parsed.success) {
    return { message: "Class details are incomplete." };
  }

  const startsAt = localDateTimeToIso(parsed.data.startsAt);
  const endsAt = localDateTimeToIso(parsed.data.endsAt);

  if (new Date(endsAt) <= new Date(startsAt)) {
    return { message: "End time must be after start time." };
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("class_sessions").insert({
    category_id: parsed.data.categoryId,
    instructor_id: parsed.data.instructorId ?? null,
    room_id: parsed.data.roomId ?? null,
    title_he: parsed.data.titleHe,
    title_en: parsed.data.titleEn,
    description_en: parsed.data.descriptionEn ?? "",
    description_he: parsed.data.descriptionEn ?? "",
    starts_at: startsAt,
    ends_at: endsAt,
    capacity: parsed.data.capacity,
    status: "open",
  });

  if (error) {
    return { message: error.message };
  }

  revalidatePath("/classes");
  return { message: "Class created." };
}
