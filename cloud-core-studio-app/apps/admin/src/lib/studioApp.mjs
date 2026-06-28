export const today = "Sunday, 21 June";

const rooms = [
  { id: "room-sun", name: "Sun Room", capacity: 18 },
  { id: "room-ground", name: "Ground Studio", capacity: 14 },
  { id: "room-reformer", name: "Reformer Room", capacity: 9 },
  { id: "room-private", name: "Private Room", capacity: 4 },
];

const instructors = {
  maya: {
    id: "inst-maya",
    name: "Maya Cohen",
    initials: "MC",
    color: "sage",
    email: "maya@studioflow.local",
    phone: "+972 54 318 2201",
    specialties: ["Vinyasa", "Breathwork", "Beginners"],
    status: "Available",
    utilization: 82,
    availability: "Mon-Fri mornings",
    bio: "Calm, alignment-led classes with a practical pace for mixed levels.",
  },
  lina: {
    id: "inst-lina",
    name: "Lina Haddad",
    initials: "LH",
    color: "clay",
    email: "lina@studioflow.local",
    phone: "+972 52 810 4471",
    specialties: ["Pilates", "Reformer", "Posture"],
    status: "Teaching today",
    utilization: 91,
    availability: "Sun-Thu evenings",
    bio: "Detail-oriented reformer instructor focused on strength and control.",
  },
  daniel: {
    id: "inst-daniel",
    name: "Daniel Levi",
    initials: "DL",
    color: "teal",
    email: "daniel@studioflow.local",
    phone: "+972 50 418 2231",
    specialties: ["Mobility", "Strength", "Recovery"],
    status: "Available",
    utilization: 67,
    availability: "Tue, Thu, Sat",
    bio: "Blends mobility drills with accessible strength progressions.",
  },
  noor: {
    id: "inst-noor",
    name: "Noor Amer",
    initials: "NA",
    color: "amber",
    email: "noor@studioflow.local",
    phone: "+972 53 948 7712",
    specialties: ["Yin", "Restorative", "Meditation"],
    status: "On leave Tue",
    utilization: 58,
    availability: "Sun, Mon, Wed",
    bio: "Quiet nervous-system focused sessions for recovery and regulation.",
  },
  sarah: {
    id: "inst-sarah",
    name: "Sarah Klein",
    initials: "SK",
    color: "rose",
    email: "sarah@studioflow.local",
    phone: "+972 55 104 9008",
    specialties: ["Power Yoga", "Core", "Workshops"],
    status: "Teaching today",
    utilization: 88,
    availability: "Daily except Friday",
    bio: "High-energy classes with clear options and strong pacing.",
  },
};

const classes = [
  {
    id: "class-1",
    day: "Sun",
    date: "21/06/2026",
    time: "07:30",
    endTime: "08:30",
    name: "Morning Flow",
    type: "Yoga",
    instructor: instructors.maya,
    studio: "Sun Room",
    roomId: "room-sun",
    capacity: 18,
    registered: 15,
    waitlist: 1,
    color: "sage",
    duration: "60 min",
    level: "All levels",
    status: "Few spots left",
    price: 95,
    eligiblePlans: ["Unlimited", "10-class pack", "Drop-in"],
    cancelDeadlineHours: 6,
    description: "A steady morning vinyasa with breath-led transitions and enough options for regulars and newer students.",
    bring: ["Mat towel", "Water bottle", "Comfortable layers"],
  },
  {
    id: "class-2",
    day: "Sun",
    date: "21/06/2026",
    time: "09:00",
    endTime: "09:50",
    name: "Pilates Sculpt",
    type: "Pilates",
    instructor: instructors.lina,
    studio: "Reformer Room",
    roomId: "room-reformer",
    capacity: 9,
    registered: 9,
    waitlist: 4,
    color: "clay",
    duration: "50 min",
    level: "Intermediate",
    status: "Full",
    price: 120,
    eligiblePlans: ["Unlimited+", "Reformer pack", "Drop-in"],
    cancelDeadlineHours: 8,
    description: "Small-group reformer work with focused core strength, posture, and slower control sets.",
    bring: ["Grip socks", "Water bottle", "Hair tied back"],
  },
  {
    id: "class-3",
    day: "Sun",
    date: "21/06/2026",
    time: "11:15",
    endTime: "12:00",
    name: "Breathwork & Mobility",
    type: "Mobility",
    instructor: instructors.daniel,
    studio: "Ground Studio",
    roomId: "room-ground",
    capacity: 14,
    registered: 8,
    waitlist: 0,
    color: "teal",
    duration: "45 min",
    level: "Beginner",
    status: "Available",
    price: 80,
    eligiblePlans: ["Unlimited", "10-class pack", "Drop-in"],
    cancelDeadlineHours: 6,
    description: "A low-pressure class for breath, joint range, and gentle strength after a long week.",
    bring: ["Warm layer", "Notebook optional"],
  },
  {
    id: "class-4",
    day: "Sun",
    date: "21/06/2026",
    time: "17:30",
    endTime: "18:45",
    name: "Yin Reset",
    type: "Yoga",
    instructor: instructors.noor,
    studio: "Sun Room",
    roomId: "room-sun",
    capacity: 16,
    registered: 13,
    waitlist: 0,
    color: "amber",
    duration: "75 min",
    level: "All levels",
    status: "Few spots left",
    price: 90,
    eligiblePlans: ["Unlimited", "10-class pack", "Drop-in"],
    cancelDeadlineHours: 6,
    description: "Longer floor-based holds, props, and calm guidance for a softer evening reset.",
    bring: ["Socks", "Light sweater"],
  },
  {
    id: "class-5",
    day: "Sun",
    date: "21/06/2026",
    time: "19:00",
    endTime: "20:00",
    name: "Power Yoga",
    type: "Yoga",
    instructor: instructors.sarah,
    studio: "Ground Studio",
    roomId: "room-ground",
    capacity: 14,
    registered: 14,
    waitlist: 2,
    color: "rose",
    duration: "60 min",
    level: "Advanced",
    status: "Waitlist",
    price: 95,
    eligiblePlans: ["Unlimited", "10-class pack", "Drop-in"],
    cancelDeadlineHours: 8,
    description: "A stronger evening flow with arm-balance options and a direct pace.",
    bring: ["Mat towel", "Water bottle"],
  },
  {
    id: "class-6",
    day: "Mon",
    date: "22/06/2026",
    time: "08:00",
    endTime: "08:55",
    name: "Reformer Basics",
    type: "Pilates",
    instructor: instructors.lina,
    studio: "Reformer Room",
    roomId: "room-reformer",
    capacity: 9,
    registered: 5,
    waitlist: 0,
    color: "clay",
    duration: "55 min",
    level: "Beginner",
    status: "Available",
    price: 120,
    eligiblePlans: ["Unlimited+", "Reformer pack", "Drop-in"],
    cancelDeadlineHours: 8,
    description: "Intro-level reformer class for setup, breath, alignment, and confidence on the carriage.",
    bring: ["Grip socks", "Water bottle"],
  },
  {
    id: "class-7",
    day: "Mon",
    date: "22/06/2026",
    time: "18:00",
    endTime: "18:50",
    name: "Core Strength",
    type: "Strength",
    instructor: instructors.daniel,
    studio: "Ground Studio",
    roomId: "room-ground",
    capacity: 12,
    registered: 7,
    waitlist: 0,
    color: "teal",
    duration: "50 min",
    level: "All levels",
    status: "Available",
    price: 85,
    eligiblePlans: ["Unlimited", "10-class pack", "Drop-in"],
    cancelDeadlineHours: 6,
    description: "Mat-based strength with clear progressions for core, hips, and shoulders.",
    bring: ["Water bottle"],
  },
  {
    id: "class-8",
    day: "Tue",
    date: "23/06/2026",
    time: "20:00",
    endTime: "20:50",
    name: "Restorative Stretch",
    type: "Recovery",
    instructor: instructors.noor,
    studio: "Private Room",
    roomId: "room-private",
    capacity: 4,
    registered: 0,
    waitlist: 0,
    color: "amber",
    duration: "50 min",
    level: "Beginner",
    status: "Cancelled",
    price: 75,
    eligiblePlans: ["Unlimited", "10-class pack", "Drop-in"],
    cancelDeadlineHours: 6,
    description: "Cancelled this week while Noor is away. Similar evening recovery classes are listed below.",
    bring: ["Warm layer"],
  },
];

const members = [
  {
    id: "mem-1",
    name: "Noa Amir",
    email: "noa@studioflow.local",
    phone: "+972 54 221 1100",
    plan: "Unlimited",
    planType: "Monthly",
    status: "Active",
    credits: null,
    attended: 42,
    month: 8,
    renewal: "28/06/2026",
    price: 420,
    tags: ["Regular", "VIP"],
    lastVisit: "19/06/2026",
    noShows: 0,
    notes: "Prefers quiet evening classes. Loves Maya's flow.",
  },
  {
    id: "mem-2",
    name: "Shira Tal",
    email: "shira@example.com",
    phone: "+972 52 553 0194",
    plan: "Annual Unlimited",
    planType: "Annual",
    status: "Active",
    credits: null,
    attended: 86,
    month: 11,
    renewal: "02/02/2027",
    price: 4200,
    tags: ["VIP", "Regular"],
    lastVisit: "21/06/2026",
    noShows: 1,
    notes: "Renewal call scheduled for July.",
  },
  {
    id: "mem-3",
    name: "Miriam Levi",
    email: "miriam@example.com",
    phone: "+972 50 418 2231",
    plan: "10-class pack",
    planType: "10-class pack",
    status: "Active",
    credits: 6,
    attended: 18,
    month: 4,
    renewal: "31/08/2026",
    price: 720,
    tags: ["New"],
    lastVisit: "18/06/2026",
    noShows: 0,
    notes: "Interested in Pilates. Offer reformer intro after next visit.",
  },
  {
    id: "mem-4",
    name: "Yael Cohen",
    email: "yael@example.com",
    phone: "+972 53 948 7712",
    plan: "Unlimited",
    planType: "Monthly",
    status: "Active",
    credits: null,
    attended: 27,
    month: 6,
    renewal: "22/06/2026",
    price: 420,
    tags: ["Regular"],
    lastVisit: "20/06/2026",
    noShows: 2,
    notes: "Needs waitlist notifications by WhatsApp.",
  },
  {
    id: "mem-5",
    name: "Dalia Rosen",
    email: "dalia@example.com",
    phone: "+972 55 104 9008",
    plan: "10-class pack",
    planType: "10-class pack",
    status: "Expired",
    credits: 0,
    attended: 9,
    month: 0,
    renewal: "03/06/2026",
    price: 720,
    tags: ["At Risk"],
    lastVisit: "01/06/2026",
    noShows: 1,
    notes: "Send renewal offer before end of week.",
  },
  {
    id: "mem-6",
    name: "Lior Ben Ami",
    email: "lior@example.com",
    phone: "+972 54 662 1207",
    plan: "Annual Unlimited",
    planType: "Annual",
    status: "Active",
    credits: null,
    attended: 63,
    month: 10,
    renewal: "14/11/2026",
    price: 4200,
    tags: ["Regular"],
    lastVisit: "21/06/2026",
    noShows: 0,
    notes: "Attends morning sessions.",
  },
  {
    id: "mem-7",
    name: "Rina Haddad",
    email: "rina@example.com",
    phone: "+972 52 810 4471",
    plan: "Unlimited",
    planType: "Monthly",
    status: "Paused",
    credits: null,
    attended: 32,
    month: 2,
    renewal: "19/07/2026",
    price: 420,
    tags: ["At Risk"],
    lastVisit: "04/06/2026",
    noShows: 0,
    notes: "Plan paused until 01/07.",
  },
  {
    id: "mem-8",
    name: "Tamar Azulay",
    email: "tamar@example.com",
    phone: "+972 58 910 6644",
    plan: "10-class pack",
    planType: "10-class pack",
    status: "Active",
    credits: 2,
    attended: 15,
    month: 3,
    renewal: "05/07/2026",
    price: 720,
    tags: ["Regular"],
    lastVisit: "17/06/2026",
    noShows: 1,
    notes: "Offer monthly plan if credits run out.",
  },
];

const memberships = [
  { id: "plan-1", name: "Unlimited", type: "unlimited", price: 420, billingCycle: "monthly", credits: null, activeMembers: 84, status: "Active" },
  { id: "plan-2", name: "10-class pack", type: "class_pack", price: 720, billingCycle: "expires in 90 days", credits: 10, activeMembers: 38, status: "Active" },
  { id: "plan-3", name: "Drop-in", type: "drop_in", price: 95, billingCycle: "per class", credits: 1, activeMembers: 21, status: "Active" },
  { id: "plan-4", name: "Reformer pack", type: "class_pack", price: 960, billingCycle: "expires in 90 days", credits: 8, activeMembers: 19, status: "Draft" },
];

const payments = [
  { id: "pay-1", member: "Noa Amir", clientId: "mem-1", type: "Monthly renewal", date: "21/06/2026", amount: 420, status: "Paid", method: "Visa 4242" },
  { id: "pay-2", member: "Shira Tal", clientId: "mem-2", type: "Annual plan", date: "20/06/2026", amount: 4200, status: "Paid", method: "Mastercard" },
  { id: "pay-3", member: "Miriam Levi", clientId: "mem-3", type: "10-class pack", date: "19/06/2026", amount: 720, status: "Paid", method: "Apple Pay" },
  { id: "pay-4", member: "Dalia Rosen", clientId: "mem-5", type: "Refund", date: "18/06/2026", amount: -90, status: "Refunded", method: "Visa 1111" },
  { id: "pay-5", member: "Lior Ben Ami", clientId: "mem-6", type: "Private workshop", date: "17/06/2026", amount: 480, status: "Paid", method: "Cash" },
  { id: "pay-6", member: "Tamar Azulay", clientId: "mem-8", type: "10-class pack", date: "16/06/2026", amount: 720, status: "Paid", method: "Visa 9912" },
  { id: "pay-7", member: "Yael Cohen", clientId: "mem-4", type: "Monthly renewal", date: "15/06/2026", amount: 420, status: "Failed", method: "Visa expired" },
  { id: "pay-8", member: "Rina Haddad", clientId: "mem-7", type: "Pause credit", date: "14/06/2026", amount: -60, status: "Partially refunded", method: "Credit balance" },
  { id: "pay-9", member: "Noa Amir", clientId: "mem-1", type: "Workshop", date: "13/06/2026", amount: 220, status: "Paid", method: "Visa 4242" },
  { id: "pay-10", member: "Miriam Levi", clientId: "mem-3", type: "Grip socks", date: "12/06/2026", amount: 40, status: "Paid", method: "POS" },
];

const bookings = [
  { id: "book-1", classId: "class-1", memberId: "mem-1", status: "booked", attendance: null, paymentStatus: "covered", membershipUsed: "Unlimited", notes: "Front row if available" },
  { id: "book-2", classId: "class-1", memberId: "mem-2", status: "checked_in", attendance: "present", paymentStatus: "covered", membershipUsed: "Annual Unlimited", notes: "" },
  { id: "book-3", classId: "class-1", memberId: "mem-3", status: "booked", attendance: null, paymentStatus: "covered", membershipUsed: "10-class pack", notes: "First morning class" },
  { id: "book-4", classId: "class-2", memberId: "mem-4", status: "waitlisted", attendance: null, paymentStatus: "pending", membershipUsed: "Unlimited", notes: "Auto-promote if spot opens" },
  { id: "book-5", classId: "class-2", memberId: "mem-6", status: "booked", attendance: null, paymentStatus: "paid", membershipUsed: "Drop-in", notes: "" },
  { id: "book-6", classId: "class-5", memberId: "mem-8", status: "no_show", attendance: "absent", paymentStatus: "covered", membershipUsed: "10-class pack", notes: "Second no-show warning after next miss" },
  { id: "book-7", classId: "class-3", memberId: "mem-5", status: "cancelled", attendance: null, paymentStatus: "refunded", membershipUsed: "Drop-in", notes: "Cancelled within policy" },
];

const attendance = [
  { id: "att-1", classId: "class-1", memberId: "mem-1", status: "not_arrived", note: "Usually arrives 5 minutes early" },
  { id: "att-2", classId: "class-1", memberId: "mem-2", status: "checked_in", note: "Checked in by front desk" },
  { id: "att-3", classId: "class-1", memberId: "mem-3", status: "not_arrived", note: "First morning class" },
  { id: "att-4", classId: "class-2", memberId: "mem-6", status: "checked_in", note: "Paid drop-in" },
  { id: "att-5", classId: "class-5", memberId: "mem-8", status: "no_show", note: "No-show fee warning" },
];

const activity = [
  "Noa Amir booked Morning Flow",
  "Yael Cohen's payment failed for Monthly renewal",
  "Pilates Sculpt reached waitlist",
  "Two clients are eligible to move from waitlist",
  "Maya Cohen has 3 classes today",
  "Tamar Azulay has 2 credits left",
  "Rina Haddad's pause ends on 01/07",
  "Reminder sent for Yin Reset",
  "Power Yoga is 100% full this week",
  "Dalia Rosen received a renewal offer",
];

const tasks = [
  { id: "task-1", title: "Promote next waitlisted client", detail: "Pilates Sculpt has 1 likely cancellation.", tone: "amber" },
  { id: "task-2", title: "Fix failed payments", detail: "3 members need updated cards.", tone: "red" },
  { id: "task-3", title: "Review class pressure", detail: "Power Yoga is 95% full this week.", tone: "sage" },
  { id: "task-4", title: "Instructor load check", detail: "Maya has 6 classes today.", tone: "teal" },
];

const analytics = {
  revenue: [14200, 15100, 16800, 17600, 18400, 19300],
  attendanceRate: 87,
  capacityUtilization: 78,
  activeMembers: 126,
  churnRisk: 9,
  membershipGrowth: 14,
  topClasses: [
    ["Power Yoga", 96],
    ["Pilates Sculpt", 94],
    ["Morning Flow", 86],
    ["Yin Reset", 81],
  ],
  instructorUtilization: [
    ["Lina Haddad", 91],
    ["Sarah Klein", 88],
    ["Maya Cohen", 82],
    ["Daniel Levi", 67],
  ],
};

const settings = {
  pushNotifications: true,
  whatsAppReminders: true,
  waitlistAutoEnroll: true,
  cancelDeadline: "6h",
  language: "English",
  timezone: "Asia/Jerusalem",
  studioName: "StudioFlow",
  location: "Rothschild 22, Tel Aviv",
};

export function formatIls(amount) {
  return `₪${Math.abs(amount).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function capacityTone(registered, capacity) {
  if (registered >= capacity) return "red";
  const spotsLeft = capacity - registered;
  if (spotsLeft <= 3 || registered / capacity >= 0.8) return "gold";
  return "green";
}

export function capacityPercent(registered, capacity) {
  return Math.min(100, Math.round((registered / capacity) * 100));
}

export function classAction(session) {
  if (session.status === "Cancelled") return "Cancelled";
  if (session.registered >= session.capacity || session.status === "Waitlist" || session.status === "Full") return "Join waitlist";
  return "Book";
}

export function getMemberCreditsLabel(member) {
  return member.credits === null ? "∞ Unlimited" : `${member.credits} left`;
}

export function getDaySchedule(snapshot, day) {
  return snapshot.classes
    .filter((session) => session.day === day)
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function getClassBookings(snapshot, classId) {
  return snapshot.bookings
    .filter((booking) => booking.classId === classId)
    .map((booking) => ({
      ...booking,
      member: snapshot.members.find((member) => member.id === booking.memberId),
      session: snapshot.classes.find((session) => session.id === booking.classId),
    }))
    .filter((booking) => booking.member && booking.session);
}

export function getMemberBookings(snapshot, memberId) {
  return snapshot.bookings
    .filter((booking) => booking.memberId === memberId)
    .map((booking) => ({
      ...booking,
      session: snapshot.classes.find((session) => session.id === booking.classId),
    }))
    .filter((booking) => booking.session);
}

export function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function buildStudioSnapshot() {
  return {
    admin: { name: "Ameer", role: "Owner" },
    member: members[0],
    today,
    studio: {
      id: "studio-1",
      name: "StudioFlow",
      location: "Rothschild 22, Tel Aviv",
      timezone: "Asia/Jerusalem",
      rooms,
      bookingRules: "Bookings open 14 days ahead. Cancel up to 6 hours before class.",
      cancellationPolicy: "Late cancellations return the spot to the room but keep the credit used.",
    },
    stats: {
      totalMembers: 8,
      bookingsToday: 47,
      revenueMonth: 18400,
      attendanceRate: analytics.attendanceRate,
      activeMembers: analytics.activeMembers,
      capacityPressure: 82,
      waitlistAlerts: 7,
    },
    classes,
    members,
    memberships,
    payments,
    bookings,
    attendance,
    tasks,
    activity,
    analytics,
    settings,
    instructors: Object.values(instructors),
  };
}
