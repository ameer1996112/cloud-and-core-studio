import type { ClassSession, SessionStatus } from "@cloud-core/shared";

export type StatusRow = {
  id: string;
  starts_at: string;
  status: string;
};

export type AvailableClassRow = StatusRow & {
  category_id: string;
  title_he: string;
  title_en: string;
  description_he: string | null;
  description_en: string | null;
  ends_at: string;
  level: ClassSession["level"];
  capacity: number;
  instructors:
    | {
        id: string;
        profile_id: string;
        display_name: string;
        bio: string | null;
        avatar_url: string | null;
      }
    | Array<{
        id: string;
        profile_id: string;
        display_name: string;
        bio: string | null;
        avatar_url: string | null;
      }>
    | null;
  rooms: { name: string } | Array<{ name: string }> | null;
  cancellation_policies: { free_cancel_until_hours: number } | Array<{ free_cancel_until_hours: number }> | null;
  bookings?: Array<{ status: string }> | null;
  waitlist_entries?: Array<{ status: string }> | null;
};

const visibleStatuses = new Set(["open", "full", "waitlist"]);
const activeBookingStatuses = new Set(["confirmed", "completed"]);
const activeWaitlistStatuses = new Set(["waiting", "offered"]);

function relationOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function countByStatus(rows: Array<{ status: string }> | null | undefined, statuses: Set<string>) {
  return (rows ?? []).filter((row) => statuses.has(row.status)).length;
}

export function filterAvailableClassRows<T extends StatusRow>(rows: T[], now = new Date()): T[] {
  return rows
    .filter((row) => visibleStatuses.has(row.status))
    .filter((row) => new Date(row.starts_at) > now)
    .sort((left, right) => new Date(left.starts_at).getTime() - new Date(right.starts_at).getTime());
}

export function mapAvailableClassRow(row: AvailableClassRow): ClassSession {
  const instructor = relationOne(row.instructors);
  const room = relationOne(row.rooms);
  const cancellationPolicy = relationOne(row.cancellation_policies);

  return {
    id: row.id,
    categoryId: row.category_id,
    titleHe: row.title_he,
    titleEn: row.title_en,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    instructor: {
      id: instructor?.id ?? "unassigned",
      profileId: instructor?.profile_id ?? "unassigned",
      displayName: instructor?.display_name ?? "Cloud & Core",
      bio: instructor?.bio ?? null,
      avatarUrl: instructor?.avatar_url ?? null,
    },
    roomName: room?.name ?? "Studio",
    level: row.level,
    capacity: row.capacity,
    bookedCount: countByStatus(row.bookings, activeBookingStatuses),
    waitlistCount: countByStatus(row.waitlist_entries, activeWaitlistStatuses),
    status: row.status as SessionStatus,
    cancellationWindowHours: cancellationPolicy?.free_cancel_until_hours ?? 12,
    descriptionHe: row.description_he ?? "",
    descriptionEn: row.description_en ?? "",
    equipmentHe: [],
    equipmentEn: [],
  };
}

export function selectSessionById<T extends { id: string }>(sessions: T[], id: string | null | undefined): T | null {
  return sessions.find((session) => session.id === id) ?? sessions[0] ?? null;
}
