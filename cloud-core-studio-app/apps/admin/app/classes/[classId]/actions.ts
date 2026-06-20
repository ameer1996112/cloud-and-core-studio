"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabaseServer";

const ATTENDANCE_VALUES = new Set(["present", "absent", "late", "no_show"]);

/** Mark attendance for a single booking via the transactional RPC. */
export async function markAttendance(formData: FormData) {
  const session = await requireAdmin();
  const bookingId = String(formData.get("booking_id") ?? "");
  const status = String(formData.get("status") ?? "");
  const classId = String(formData.get("class_id") ?? "");

  if (!bookingId || !ATTENDANCE_VALUES.has(status)) {
    return { error: "Invalid attendance request." };
  }

  const supabase = createSupabaseAdminClient();
  // Attribute the action to the admin by passing their JWT-less identity via RPC;
  // the RPC uses auth.uid(), so we call it through a user-scoped client instead.
  const { error } = await supabase.rpc("mark_attendance_as", {
    p_booking_id: bookingId,
    p_status: status,
    p_actor: session.userId,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/classes/${classId}`);
  return { ok: true };
}

/** Mark every confirmed booking in a class as present. */
export async function markAllPresent(formData: FormData) {
  const session = await requireAdmin();
  const classId = String(formData.get("class_id") ?? "");
  if (!classId) {
    return;
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.rpc("mark_all_present", {
    p_session_id: classId,
    p_actor: session.userId,
  });

  if (!error) {
    revalidatePath(`/classes/${classId}`);
  }
}

/** Soft-cancel a class (never hard-delete classes with bookings). */
export async function cancelClass(formData: FormData) {
  const session = await requireAdmin();
  const classId = String(formData.get("class_id") ?? "");
  if (!classId) {
    return;
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.rpc("admin_cancel_class", {
    p_session_id: classId,
    p_actor: session.userId,
  });

  if (!error) {
    revalidatePath(`/classes/${classId}`);
    revalidatePath("/classes");
  }
}
