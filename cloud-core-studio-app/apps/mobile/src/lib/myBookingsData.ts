export type BookingTab = "upcoming" | "history";

export interface MyBooking {
  bookingId: string;
  sessionId: string;
  title: string;
  startsAt: string;
  endsAt: string;
  instructorName: string;
  roomName: string;
  status: string; // booking status: confirmed | completed | cancelled | late_cancelled | no_show
  attendance: string | null;
  isWaitlisted: boolean;
  waitlistPosition: number | null;
  cancellationWindowHours: number;
}

export interface MyBookingRow {
  id: string;
  status: string;
  class_session_id: string;
  class_sessions:
    | {
        title_en: string;
        title_he: string;
        starts_at: string;
        ends_at: string;
        instructors: { display_name: string } | Array<{ display_name: string }> | null;
        rooms: { name: string } | Array<{ name: string }> | null;
        cancellation_policies:
          | { free_cancel_until_hours: number }
          | Array<{ free_cancel_until_hours: number }>
          | null;
      }
    | Array<unknown>
    | null;
  attendance_records?: Array<{ status: string }> | null;
}

export interface MyWaitlistRow {
  id: string;
  position: number;
  status: string;
  class_session_id: string;
  class_sessions: MyBookingRow["class_sessions"];
}

function relationOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return (value[0] as T) ?? null;
  return (value as T) ?? null;
}

const upcomingStatuses = new Set(["confirmed"]);
const historyStatuses = new Set(["completed", "cancelled", "late_cancelled", "no_show"]);

export function mapMyBookingRow(row: MyBookingRow, locale: "he" | "en" = "en"): MyBooking {
  const session = relationOne(row.class_sessions as never) as {
    title_en: string;
    title_he: string;
    starts_at: string;
    ends_at: string;
    instructors: { display_name: string } | Array<{ display_name: string }> | null;
    rooms: { name: string } | Array<{ name: string }> | null;
    cancellation_policies:
      | { free_cancel_until_hours: number }
      | Array<{ free_cancel_until_hours: number }>
      | null;
  } | null;

  const instructor = relationOne(session?.instructors);
  const room = relationOne(session?.rooms);
  const policy = relationOne(session?.cancellation_policies);
  const attendance = (row.attendance_records ?? [])[0]?.status ?? null;

  return {
    bookingId: row.id,
    sessionId: row.class_session_id,
    title: session ? (locale === "he" ? session.title_he : session.title_en) : "Class",
    startsAt: session?.starts_at ?? "",
    endsAt: session?.ends_at ?? "",
    instructorName: instructor?.display_name ?? "Cloud & Core",
    roomName: room?.name ?? "Studio",
    status: row.status,
    attendance,
    isWaitlisted: false,
    waitlistPosition: null,
    cancellationWindowHours: policy?.free_cancel_until_hours ?? 12,
  };
}

export function mapMyWaitlistRow(row: MyWaitlistRow, locale: "he" | "en" = "en"): MyBooking {
  const base = mapMyBookingRow(
    { id: row.id, status: "waitlisted", class_session_id: row.class_session_id, class_sessions: row.class_sessions },
    locale,
  );
  return { ...base, isWaitlisted: true, waitlistPosition: row.position };
}

/**
 * Split bookings into upcoming vs history.
 * Upcoming = confirmed/waitlisted with a future start. History = terminal
 * statuses, or confirmed classes whose start time has passed.
 */
export function partitionBookings(
  bookings: MyBooking[],
  now = new Date(),
): { upcoming: MyBooking[]; history: MyBooking[] } {
  const upcoming: MyBooking[] = [];
  const history: MyBooking[] = [];

  for (const b of bookings) {
    const start = b.startsAt ? new Date(b.startsAt) : null;
    const isFuture = start ? start > now : false;
    const isActive = b.isWaitlisted || upcomingStatuses.has(b.status);

    if (isActive && isFuture) {
      upcoming.push(b);
    } else if (historyStatuses.has(b.status) || (isActive && !isFuture)) {
      history.push(b);
    } else {
      history.push(b);
    }
  }

  upcoming.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  history.sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());
  return { upcoming, history };
}

/**
 * Whether a confirmed booking can still be cancelled with a credit refund:
 * now must be before (start - cancellationWindowHours).
 */
export function canCancelEarly(booking: MyBooking, now = new Date()): boolean {
  if (booking.isWaitlisted) return true; // leaving a waitlist is always allowed
  if (booking.status !== "confirmed") return false;
  if (!booking.startsAt) return false;
  const deadline = new Date(new Date(booking.startsAt).getTime() - booking.cancellationWindowHours * 3600 * 1000);
  return now < deadline;
}
