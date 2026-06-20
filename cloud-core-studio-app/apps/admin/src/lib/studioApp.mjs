const today = "Friday, 20 June";

const instructors = {
  lena: { id: "inst-lena", name: "Lena Ramos", initials: "LR", color: "blue" },
  maya: { id: "inst-maya", name: "Maya Khoury", initials: "MK", color: "gold" },
  nour: { id: "inst-nour", name: "Nour Jabri", initials: "NJ", color: "sand" },
  sara: { id: "inst-sara", name: "Sara Rosen", initials: "SR", color: "ivory" },
};

const classes = [
  {
    id: "class-1",
    day: "Fri",
    date: "20/06/2026",
    time: "09:00",
    endTime: "10:00",
    name: "Beginner Aerial Yoga",
    type: "Yoga",
    instructor: instructors.maya,
    studio: "Studio A",
    capacity: 10,
    registered: 7,
    waitlist: 0,
    color: "blue",
    duration: "60 min",
    cancelDeadlineHours: 12,
  },
  {
    id: "class-2",
    day: "Fri",
    date: "20/06/2026",
    time: "11:00",
    endTime: "11:50",
    name: "Core Pilates",
    type: "Pilates",
    instructor: instructors.sara,
    studio: "Studio B",
    capacity: 8,
    registered: 5,
    waitlist: 0,
    color: "gold",
    duration: "50 min",
    cancelDeadlineHours: 8,
  },
  {
    id: "class-3",
    day: "Fri",
    date: "20/06/2026",
    time: "13:00",
    endTime: "13:45",
    name: "Meditation Reset",
    type: "Meditation",
    instructor: instructors.nour,
    studio: "Outdoor",
    capacity: 12,
    registered: 9,
    waitlist: 0,
    color: "sand",
    duration: "45 min",
    cancelDeadlineHours: 4,
  },
  {
    id: "class-4",
    day: "Fri",
    date: "20/06/2026",
    time: "17:00",
    endTime: "18:00",
    name: "Stretch & Flow",
    type: "Yoga",
    instructor: instructors.maya,
    studio: "Studio A",
    capacity: 8,
    registered: 8,
    waitlist: 3,
    color: "green",
    duration: "60 min",
    cancelDeadlineHours: 12,
  },
  {
    id: "class-5",
    day: "Fri",
    date: "20/06/2026",
    time: "19:30",
    endTime: "20:30",
    name: "Women & Girls Dance",
    type: "Dance",
    instructor: instructors.lena,
    studio: "Studio B",
    capacity: 12,
    registered: 11,
    waitlist: 0,
    color: "purple",
    duration: "60 min",
    cancelDeadlineHours: 12,
  },
  {
    id: "class-6",
    day: "Sat",
    date: "21/06/2026",
    time: "10:30",
    endTime: "11:30",
    name: "Cardio Barre",
    type: "Cardio",
    instructor: instructors.lena,
    studio: "Studio B",
    capacity: 10,
    registered: 6,
    waitlist: 0,
    color: "red",
    duration: "60 min",
    cancelDeadlineHours: 12,
  },
  {
    id: "class-7",
    day: "Sun",
    date: "22/06/2026",
    time: "18:00",
    endTime: "18:55",
    name: "Strength Foundations",
    type: "Strength",
    instructor: instructors.sara,
    studio: "Studio A",
    capacity: 9,
    registered: 4,
    waitlist: 0,
    color: "blue",
    duration: "55 min",
    cancelDeadlineHours: 24,
  },
];

const members = [
  {
    id: "mem-1",
    name: "Noa Amir",
    email: "noa@cloudcore.studio",
    phone: "+972 54 221 1100",
    plan: "Monthly Unlimited",
    planType: "Monthly",
    status: "Active",
    credits: null,
    attended: 42,
    month: 8,
    renewal: "28/06/2026",
    price: 280,
    notes: "Prefers quiet evening classes.",
  },
  {
    id: "mem-2",
    name: "Shira Tal",
    email: "shira@example.com",
    phone: "+972 52 553 0194",
    plan: "Annual",
    planType: "Annual",
    status: "Active",
    credits: null,
    attended: 86,
    month: 11,
    renewal: "02/02/2027",
    price: 2800,
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
    price: 350,
    notes: "Interested in Pilates.",
  },
  {
    id: "mem-4",
    name: "Yael Cohen",
    email: "yael@example.com",
    phone: "+972 53 948 7712",
    plan: "Monthly Unlimited",
    planType: "Monthly",
    status: "Active",
    credits: null,
    attended: 27,
    month: 6,
    renewal: "22/06/2026",
    price: 280,
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
    price: 350,
    notes: "Send renewal offer.",
  },
  {
    id: "mem-6",
    name: "Lior Ben Ami",
    email: "lior@example.com",
    phone: "+972 54 662 1207",
    plan: "Annual",
    planType: "Annual",
    status: "Active",
    credits: null,
    attended: 63,
    month: 10,
    renewal: "14/11/2026",
    price: 2800,
    notes: "Attends morning sessions.",
  },
  {
    id: "mem-7",
    name: "Rina Haddad",
    email: "rina@example.com",
    phone: "+972 52 810 4471",
    plan: "Monthly Unlimited",
    planType: "Monthly",
    status: "Paused",
    credits: null,
    attended: 32,
    month: 2,
    renewal: "19/07/2026",
    price: 280,
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
    price: 350,
    notes: "Offer monthly plan if credits run out.",
  },
];

const payments = [
  { id: "pay-1", member: "Noa Amir", type: "Monthly renewal", date: "20/06/2026", amount: 280 },
  { id: "pay-2", member: "Shira Tal", type: "Annual plan", date: "19/06/2026", amount: 2800 },
  { id: "pay-3", member: "Miriam Levi", type: "10-class pack", date: "18/06/2026", amount: 350 },
  { id: "pay-4", member: "Dalia Rosen", type: "Refund", date: "17/06/2026", amount: -90 },
  { id: "pay-5", member: "Lior Ben Ami", type: "Private workshop", date: "16/06/2026", amount: 480 },
  { id: "pay-6", member: "Tamar Azulay", type: "10-class pack", date: "15/06/2026", amount: 350 },
  { id: "pay-7", member: "Yael Cohen", type: "Monthly renewal", date: "14/06/2026", amount: 280 },
  { id: "pay-8", member: "Rina Haddad", type: "Pause credit", date: "13/06/2026", amount: -60 },
  { id: "pay-9", member: "Noa Amir", type: "Workshop", date: "12/06/2026", amount: 220 },
  { id: "pay-10", member: "Miriam Levi", type: "Grip socks", date: "11/06/2026", amount: 40 },
];

const bookings = [
  { id: "book-1", classId: "class-1", memberId: "mem-1", attendance: null },
  { id: "book-2", classId: "class-1", memberId: "mem-2", attendance: null },
  { id: "book-3", classId: "class-1", memberId: "mem-3", attendance: "present" },
  { id: "book-4", classId: "class-4", memberId: "mem-4", attendance: null },
  { id: "book-5", classId: "class-4", memberId: "mem-6", attendance: null },
  { id: "book-6", classId: "class-5", memberId: "mem-8", attendance: "absent" },
];

const activity = [
  "Noa Amir booked Beginner Aerial Yoga",
  "Miriam Levi renewed 10-class pack",
  "Stretch & Flow reached waitlist",
  "Dalia Rosen cancelled Cardio Barre",
  "Sara Rosen marked Core Pilates present",
  "Tamar Azulay joined Women & Girls Dance",
  "Rina Haddad paused her monthly plan",
  "WhatsApp reminder sent to Studio A class",
  "Annual payment received from Shira Tal",
  "Nour Jabri added Meditation Reset notes",
];

const settings = {
  pushNotifications: true,
  whatsAppReminders: true,
  waitlistAutoEnroll: true,
  cancelDeadline: "12h",
  language: "English",
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
    }))
    .filter((booking) => booking.member);
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
    admin: { name: "Ameer", role: "Admin" },
    member: members[0],
    today,
    stats: {
      totalMembers: members.length,
      bookingsToday: 47,
      revenueMonth: 18400,
    },
    classes,
    members,
    payments,
    bookings,
    activity,
    settings,
    instructors: Object.values(instructors),
  };
}
