import { createClassSession } from "./actions";
import { fallbackClassSessions, mapClassSessionRow, type AdminClassSession } from "@/lib/adminClasses.mjs";
import { createSupabaseAdminClient } from "@/lib/supabaseServer";
import { AdminGuard } from "@/components/AdminGuard";

export const dynamic = "force-dynamic";

interface ReferenceOption {
  id: string;
  label: string;
}

interface ClassesPageData {
  sessions: AdminClassSession[];
  categories: ReferenceOption[];
  instructors: ReferenceOption[];
  rooms: ReferenceOption[];
  isLive: boolean;
  message: string | null;
}

const fallbackCategories = [{ id: "", label: "Yoga" }];
const fallbackInstructors = [{ id: "", label: "Maya Khoury" }];
const fallbackRooms = [{ id: "", label: "Studio A" }];

async function submitClassSession(formData: FormData) {
  "use server";

  await createClassSession(formData);
}

async function loadClassesPageData(): Promise<ClassesPageData> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      sessions: fallbackClassSessions,
      categories: fallbackCategories,
      instructors: fallbackInstructors,
      rooms: fallbackRooms,
      isLive: false,
      message: "Supabase environment variables are missing, so this page is showing seeded MVP data.",
    };
  }

  try {
    const supabase = createSupabaseAdminClient();
    const [sessionsResult, categoriesResult, instructorsResult, roomsResult] = await Promise.all([
      supabase
        .from("class_sessions")
        .select(
          `
          id,
          title_en,
          title_he,
          description_en,
          description_he,
          starts_at,
          ends_at,
          capacity,
          status,
          class_categories(name_en, color),
          instructors(display_name),
          rooms(name),
          bookings(status),
          waitlist_entries(status)
        `,
        )
        .is("deleted_at", null)
        .order("starts_at", { ascending: true })
        .limit(50),
      supabase.from("class_categories").select("id, name_en").is("deleted_at", null).order("name_en"),
      supabase.from("instructors").select("id, display_name").eq("is_active", true).is("deleted_at", null).order("display_name"),
      supabase.from("rooms").select("id, name").is("deleted_at", null).order("name"),
    ]);

    if (sessionsResult.error) {
      throw sessionsResult.error;
    }

    return {
      sessions: (sessionsResult.data ?? []).map(mapClassSessionRow),
      categories: (categoriesResult.data ?? []).map((item) => ({ id: item.id, label: item.name_en })),
      instructors: (instructorsResult.data ?? []).map((item) => ({ id: item.id, label: item.display_name })),
      rooms: (roomsResult.data ?? []).map((item) => ({ id: item.id, label: item.name })),
      isLive: true,
      message: null,
    };
  } catch (error) {
    return {
      sessions: fallbackClassSessions,
      categories: fallbackCategories,
      instructors: fallbackInstructors,
      rooms: fallbackRooms,
      isLive: false,
      message: error instanceof Error ? error.message : "Could not load Supabase class data.",
    };
  }
}

export default async function ClassesPage() {
  const { sessions, categories, instructors, rooms, isLive, message } = await loadClassesPageData();
  const confirmedTotal = sessions.reduce((sum, session) => sum + session.confirmedCount, 0);
  const waitlistTotal = sessions.reduce((sum, session) => sum + session.waitlistCount, 0);
  const capacityTotal = sessions.reduce((sum, session) => sum + session.capacity, 0);

  return (
    <AdminGuard>
      <main className="admin-workspace">
      <section className="admin-hero">
        <div>
          <span className="eyebrow">Admin schedule</span>
          <h1>Classes</h1>
          <p>Create and monitor the real class inventory that customers will book against.</p>
        </div>
        <div className="live-pill" data-live={isLive}>
          {isLive ? "Live Supabase" : "Fixture mode"}
        </div>
      </section>

      {message && <div className="notice">{message}</div>}

      <section className="admin-metrics" aria-label="Schedule summary">
        <article>
          <span>Upcoming classes</span>
          <strong>{sessions.length}</strong>
        </article>
        <article>
          <span>Confirmed</span>
          <strong>{confirmedTotal}</strong>
        </article>
        <article>
          <span>Waitlist</span>
          <strong>{waitlistTotal}</strong>
        </article>
        <article>
          <span>Capacity</span>
          <strong>{capacityTotal}</strong>
        </article>
      </section>

      <div className="admin-grid">
        <section className="admin-panel">
          <div className="panel-title">
            <div>
              <h2>Create class</h2>
              <p>Phase 2 MVP fields from the studio plan.</p>
            </div>
          </div>
          <form action={submitClassSession} className="class-form" aria-disabled={!isLive}>
            <label>
              Class name
              <input name="title_en" type="text" defaultValue="Morning Flow Yoga" disabled={!isLive} required />
            </label>
            <label>
              Hebrew name
              <input name="title_he" type="text" defaultValue="יוגה בוקר" disabled={!isLive} required />
            </label>
            <label className="full-span">
              Description
              <textarea name="description_en" rows={3} defaultValue="Beginner-friendly aerial yoga flow." disabled={!isLive} />
            </label>
            <label>
              Category
              <select name="category_id" disabled={!isLive || categories.length === 0} required>
                {categories.map((category) => (
                  <option key={category.id || category.label} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Instructor
              <select name="instructor_id" disabled={!isLive || instructors.length === 0}>
                <option value="">Unassigned</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id || instructor.label} value={instructor.id}>
                    {instructor.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Studio
              <select name="room_id" disabled={!isLive || rooms.length === 0}>
                <option value="">Default studio</option>
                {rooms.map((room) => (
                  <option key={room.id || room.label} value={room.id}>
                    {room.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Capacity
              <input name="capacity" type="number" min={1} defaultValue={12} disabled={!isLive} required />
            </label>
            <label>
              Starts
              <input name="starts_at" type="datetime-local" defaultValue="2026-06-21T09:30" disabled={!isLive} required />
            </label>
            <label>
              Ends
              <input name="ends_at" type="datetime-local" defaultValue="2026-06-21T10:30" disabled={!isLive} required />
            </label>
            <button type="submit" disabled={!isLive || categories.length === 0}>
              Create class
            </button>
          </form>
        </section>

        <section className="admin-panel schedule-panel">
          <div className="panel-title">
            <div>
              <h2>Upcoming schedule</h2>
              <p>Confirmed and waitlisted counts come from bookings and waitlist entries.</p>
            </div>
          </div>
          <div className="schedule-list">
            {sessions.map((session) => (
              <article className="schedule-row" key={session.id}>
                <div className="class-color" style={{ backgroundColor: session.color }} aria-hidden="true" />
                <div className="class-main">
                  <div className="class-heading">
                    <h3>{session.name}</h3>
                    <span>{session.status}</span>
                  </div>
                  <p>{session.description || `${session.type} with ${session.instructor}`}</p>
                  <div className="class-meta">
                    <span>{session.date}</span>
                    <span>{session.timeRange}</span>
                    <span>{session.instructor}</span>
                    <span>{session.studio}</span>
                  </div>
                </div>
                <div className="class-counts">
                  <strong>
                    {session.confirmedCount}/{session.capacity}
                  </strong>
                  <span>{session.availableSpots} spots</span>
                  <small>{session.waitlistCount} waitlist</small>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
    </AdminGuard>
  );
}
