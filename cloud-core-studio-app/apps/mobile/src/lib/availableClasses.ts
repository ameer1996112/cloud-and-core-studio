import type { ClassSession } from "@cloud-core/shared";
import { sessions as fixtureSessions } from "@/fixtures/classes";
import {
  filterAvailableClassRows,
  mapAvailableClassRow,
  type AvailableClassRow,
  type StatusRow,
} from "@/lib/availableClassesData";

export { filterAvailableClassRows, mapAvailableClassRow };

function sessionToStatusRow(session: ClassSession): ClassSession & StatusRow {
  return {
    ...session,
    starts_at: session.startsAt,
    status: session.status,
  };
}

export function hasSupabaseMobileConfig() {
  return Boolean(
    process.env.EXPO_PUBLIC_SUPABASE_URL &&
      (process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
  );
}

export async function loadAvailableClasses(now = new Date()): Promise<{ sessions: ClassSession[]; isLive: boolean; error: string | null }> {
  if (!hasSupabaseMobileConfig()) {
    const sessions = filterAvailableClassRows(fixtureSessions.map(sessionToStatusRow), now).map(({ starts_at: _startsAt, ...session }) => session);

    return {
      sessions,
      isLive: false,
      error: null,
    };
  }

  const { supabase } = await import("@/lib/supabase");
  const { data, error } = await supabase
    .from("class_sessions")
    .select(
      `
      id,
      category_id,
      title_he,
      title_en,
      description_he,
      description_en,
      starts_at,
      ends_at,
      level,
      capacity,
      status,
      instructors(id, profile_id, display_name, bio, avatar_url),
      rooms(name),
      cancellation_policies(free_cancel_until_hours),
      bookings(status),
      waitlist_entries(status)
    `,
    )
    .is("deleted_at", null)
    .order("starts_at", { ascending: true });

  if (error) {
    return { sessions: fixtureSessions, isLive: false, error: error.message };
  }

  return {
    sessions: filterAvailableClassRows((data ?? []) as AvailableClassRow[], now).map(mapAvailableClassRow),
    isLive: true,
    error: null,
  };
}
