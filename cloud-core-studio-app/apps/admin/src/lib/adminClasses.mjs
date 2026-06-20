const jerusalemFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Jerusalem",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function relationOne(value) {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function countByStatus(rows, activeStatuses) {
  return (rows ?? []).filter((row) => activeStatuses.has(row.status)).length;
}

function formatTime(value) {
  return jerusalemFormatter.format(new Date(value));
}

export const fallbackClassSessions = [
  {
    id: "fixture-morning-flow",
    name: "Morning Flow Yoga",
    type: "Yoga",
    description: "Beginner-friendly aerial flow for the first production booking path.",
    date: "21/06/2026",
    timeRange: "09:30-10:30",
    instructor: "Maya Khoury",
    studio: "Studio A",
    capacity: 12,
    confirmedCount: 7,
    waitlistCount: 0,
    availableSpots: 5,
    status: "open",
    color: "#7aaad0",
  },
  {
    id: "fixture-core-pilates",
    name: "Core Pilates",
    type: "Pilates",
    description: "Small-group mat and core class.",
    date: "21/06/2026",
    timeRange: "11:00-11:50",
    instructor: "Sara Rosen",
    studio: "Studio B",
    capacity: 8,
    confirmedCount: 8,
    waitlistCount: 2,
    availableSpots: 0,
    status: "waitlist",
    color: "#d4af6a",
  },
  {
    id: "fixture-stretch-flow",
    name: "Stretch & Flow",
    type: "Mobility",
    description: "Evening recovery class with waitlist enabled.",
    date: "22/06/2026",
    timeRange: "18:00-19:00",
    instructor: "Lena Ramos",
    studio: "Studio A",
    capacity: 10,
    confirmedCount: 6,
    waitlistCount: 0,
    availableSpots: 4,
    status: "open",
    color: "#91b58d",
  },
];

export function mapClassSessionRow(row) {
  const category = relationOne(row.class_categories);
  const instructor = relationOne(row.instructors);
  const room = relationOne(row.rooms);
  const confirmedCount = countByStatus(row.bookings, new Set(["confirmed", "completed"]));
  const waitlistCount = countByStatus(row.waitlist_entries, new Set(["waiting", "offered"]));
  const startsAt = new Date(row.starts_at);

  return {
    id: row.id,
    name: row.title_en || row.title_he,
    type: category?.name_en ?? "Class",
    description: row.description_en || row.description_he || "",
    date: startsAt.toLocaleDateString("en-GB", { timeZone: "Asia/Jerusalem" }),
    timeRange: `${formatTime(row.starts_at)}-${formatTime(row.ends_at)}`,
    instructor: instructor?.display_name ?? "Unassigned",
    studio: room?.name ?? "Studio",
    capacity: row.capacity,
    confirmedCount,
    waitlistCount,
    availableSpots: Math.max(row.capacity - confirmedCount, 0),
    status: row.status,
    color: category?.color ?? "#7aaad0",
  };
}
