import Link from "next/link";
import { AdminGuard } from "@/components/AdminGuard";
import { createSupabaseAdminClient } from "@/lib/supabaseServer";
import { markAttendance, markAllPresent, cancelClass } from "./actions";
import { AttendanceControls } from "./AttendanceControls";

export const dynamic = "force-dynamic";

interface RosterEntry {
  bookingId: string;
  memberName: string;
  status: string;
  attendance: string | null;
}

interface WaitlistEntry {
  position: number;
  memberName: string;
}

interface ClassDetail {
  id: string;
  title: string;
  startsAt: string | null;
  endsAt: string | null;
  status: string;
  capacity: number;
  instructor: string;
  room: string;
  roster: RosterEntry[];
  waitlist: WaitlistEntry[];
}

function relationOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function formatWhen(value: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jerusalem",
  }).format(new Date(value));
}

async function loadClassDetail(classId: string): Promise<ClassDetail | null> {
  const supabase = createSupabaseAdminClient();

  const { data: session, error } = await supabase
    .from("class_sessions")
    .select(
      `
      id, title_en, starts_at, ends_at, status, capacity,
      instructors(display_name),
      rooms(name)
    `,
    )
    .eq("id", classId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !session) {
    return null;
  }

  const [{ data: bookings }, { data: waitlist }] = await Promise.all([
    supabase
      .from("bookings")
      .select(
        `id, status, member_id, members(profiles(full_name)), attendance_records(status)`,
      )
      .eq("class_session_id", classId)
      .is("deleted_at", null)
      .not("status", "in", "(cancelled,late_cancelled)"),
    supabase
      .from("waitlist_entries")
      .select(`position, members(profiles(full_name))`)
      .eq("class_session_id", classId)
      .eq("status", "waiting")
      .is("deleted_at", null)
      .order("position", { ascending: true }),
  ]);

  const roster: RosterEntry[] = (bookings ?? []).map((b) => {
    const member = relationOne(b.members as never) as { profiles: unknown } | null;
    const profile = relationOne((member?.profiles ?? null) as never) as { full_name?: string } | null;
    const attendance = (b.attendance_records as Array<{ status: string }> | null)?.[0]?.status ?? null;
    return {
      bookingId: b.id as string,
      memberName: profile?.full_name ?? "Member",
      status: b.status as string,
      attendance,
    };
  });

  const waitlistEntries: WaitlistEntry[] = (waitlist ?? []).map((w) => {
    const member = relationOne(w.members as never) as { profiles: unknown } | null;
    const profile = relationOne((member?.profiles ?? null) as never) as { full_name?: string } | null;
    return { position: w.position as number, memberName: profile?.full_name ?? "Member" };
  });

  const instructor = relationOne(session.instructors as never) as { display_name?: string } | null;
  const room = relationOne(session.rooms as never) as { name?: string } | null;

  return {
    id: session.id as string,
    title: (session.title_en as string) ?? "Class",
    startsAt: (session.starts_at as string) ?? null,
    endsAt: (session.ends_at as string) ?? null,
    status: (session.status as string) ?? "scheduled",
    capacity: (session.capacity as number) ?? 0,
    instructor: instructor?.display_name ?? "Unassigned",
    room: room?.name ?? "Studio",
    roster,
    waitlist: waitlistEntries,
  };
}

export default async function ClassDetailPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const detail = await loadClassDetail(classId);

  const presentCount = detail?.roster.filter((r) => r.attendance === "present").length ?? 0;
  const confirmedCount = detail?.roster.filter((r) => r.status === "confirmed" || r.status === "completed").length ?? 0;

  return (
    <AdminGuard>
      <main className="admin-workspace">
        <section className="admin-hero">
          <div>
            <Link href="/classes" className="back-link">
              ← Back to classes
            </Link>
            <h1>{detail?.title ?? "Class not found"}</h1>
            {detail ? (
              <p>
                {formatWhen(detail.startsAt)} · {detail.instructor} · {detail.room}
              </p>
            ) : (
              <p>This class may have been removed.</p>
            )}
          </div>
          {detail ? <div className="live-pill" data-live={detail.status !== "cancelled"}>{detail.status}</div> : null}
        </section>

        {detail ? (
          <>
            <section className="admin-metrics" aria-label="Attendance summary">
              <article>
                <span>Confirmed</span>
                <strong>
                  {confirmedCount}/{detail.capacity}
                </strong>
              </article>
              <article>
                <span>Present</span>
                <strong>{presentCount}</strong>
              </article>
              <article>
                <span>Waitlist</span>
                <strong>{detail.waitlist.length}</strong>
              </article>
            </section>

            <div className="admin-grid">
              <section className="admin-panel">
                <div className="panel-title">
                  <div>
                    <h2>Registered customers</h2>
                    <p>Mark attendance for each confirmed booking.</p>
                  </div>
                  {detail.status !== "cancelled" && detail.roster.length > 0 ? (
                    <form action={markAllPresent}>
                      <input type="hidden" name="class_id" value={detail.id} />
                      <button type="submit" className="ghost-button">
                        Mark all present
                      </button>
                    </form>
                  ) : null}
                </div>

                {detail.roster.length === 0 ? (
                  <div className="empty-block">No bookings yet for this class.</div>
                ) : (
                  <ul className="roster-list">
                    {detail.roster.map((entry) => (
                      <li key={entry.bookingId} className="roster-row">
                        <div className="roster-main">
                          <strong>{entry.memberName}</strong>
                          <span className="roster-status" data-attendance={entry.attendance ?? "not_marked"}>
                            {entry.attendance ? entry.attendance.replace("_", " ") : "not marked"}
                          </span>
                        </div>
                        <AttendanceControls
                          bookingId={entry.bookingId}
                          classId={detail.id}
                          current={entry.attendance}
                          action={markAttendance}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="admin-panel">
                <div className="panel-title">
                  <div>
                    <h2>Waitlist</h2>
                    <p>Promoted automatically when a spot frees up.</p>
                  </div>
                </div>
                {detail.waitlist.length === 0 ? (
                  <div className="empty-block">No one is waiting.</div>
                ) : (
                  <ul className="roster-list">
                    {detail.waitlist.map((entry) => (
                      <li key={entry.position} className="roster-row">
                        <div className="roster-main">
                          <strong>
                            #{entry.position} {entry.memberName}
                          </strong>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {detail.status !== "cancelled" ? (
                  <form action={cancelClass} className="danger-zone">
                    <input type="hidden" name="class_id" value={detail.id} />
                    <button type="submit" className="danger-button">
                      Cancel class &amp; refund credits
                    </button>
                  </form>
                ) : (
                  <div className="empty-block">This class is cancelled.</div>
                )}
              </section>
            </div>
          </>
        ) : null}
      </main>
    </AdminGuard>
  );
}
