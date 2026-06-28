export type CapacityTone = "green" | "gold" | "red";

export type StudioClass = {
  id: string;
  day: string;
  date: string;
  time: string;
  endTime: string;
  name: string;
  type: string;
  instructor: string;
  instructorInitials: string;
  studio: string;
  capacity: number;
  registered: number;
  waitlist: number;
  color: "blue" | "gold" | "sand" | "green" | "red" | "purple";
  duration: string;
};

export type StudioMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  planType: "Monthly" | "Annual" | "10-class pack";
  status: "Active" | "Expired" | "Paused";
  credits: number | null;
  attended: number;
  month: number;
  renewal: string;
};

export const studioSnapshot = {
  admin: { name: "Ameer", role: "Admin" },
  today: "Friday, 20 June",
  stats: {
    totalMembers: 8,
    bookingsToday: 47,
    revenueMonth: 18400,
  },
  classes: [
    {
      id: "class-1",
      day: "Fri",
      date: "20/06/2026",
      time: "09:00",
      endTime: "10:00",
      name: "Beginner Aerial Yoga",
      type: "Yoga",
      instructor: "Maya Khoury",
      instructorInitials: "MK",
      studio: "Studio A",
      capacity: 10,
      registered: 7,
      waitlist: 0,
      color: "blue",
      duration: "60 min",
    },
    {
      id: "class-2",
      day: "Fri",
      date: "20/06/2026",
      time: "11:00",
      endTime: "11:50",
      name: "Core Pilates",
      type: "Pilates",
      instructor: "Sara Rosen",
      instructorInitials: "SR",
      studio: "Studio B",
      capacity: 8,
      registered: 5,
      waitlist: 0,
      color: "gold",
      duration: "50 min",
    },
    {
      id: "class-3",
      day: "Fri",
      date: "20/06/2026",
      time: "13:00",
      endTime: "13:45",
      name: "Meditation Reset",
      type: "Meditation",
      instructor: "Nour Jabri",
      instructorInitials: "NJ",
      studio: "Outdoor",
      capacity: 12,
      registered: 9,
      waitlist: 0,
      color: "sand",
      duration: "45 min",
    },
    {
      id: "class-4",
      day: "Fri",
      date: "20/06/2026",
      time: "17:00",
      endTime: "18:00",
      name: "Stretch & Flow",
      type: "Yoga",
      instructor: "Maya Khoury",
      instructorInitials: "MK",
      studio: "Studio A",
      capacity: 8,
      registered: 8,
      waitlist: 3,
      color: "green",
      duration: "60 min",
    },
    {
      id: "class-5",
      day: "Fri",
      date: "20/06/2026",
      time: "19:30",
      endTime: "20:30",
      name: "Women & Girls Dance",
      type: "Dance",
      instructor: "Lena Ramos",
      instructorInitials: "LR",
      studio: "Studio B",
      capacity: 12,
      registered: 11,
      waitlist: 0,
      color: "purple",
      duration: "60 min",
    },
    {
      id: "class-6",
      day: "Sat",
      date: "21/06/2026",
      time: "10:30",
      endTime: "11:30",
      name: "Cardio Barre",
      type: "Cardio",
      instructor: "Lena Ramos",
      instructorInitials: "LR",
      studio: "Studio B",
      capacity: 10,
      registered: 6,
      waitlist: 0,
      color: "red",
      duration: "60 min",
    },
    {
      id: "class-7",
      day: "Sun",
      date: "22/06/2026",
      time: "18:00",
      endTime: "18:55",
      name: "Strength Foundations",
      type: "Strength",
      instructor: "Sara Rosen",
      instructorInitials: "SR",
      studio: "Studio A",
      capacity: 9,
      registered: 4,
      waitlist: 0,
      color: "blue",
      duration: "55 min",
    },
  ] satisfies StudioClass[],
  members: [
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
    },
  ] satisfies StudioMember[],
  activity: [
    "Noa Amir booked Beginner Aerial Yoga",
    "Miriam Levi renewed 10-class pack",
    "Stretch & Flow reached waitlist",
    "Dalia Rosen cancelled Cardio Barre",
    "Sara Rosen marked Core Pilates present",
    "Tamar Azulay joined Women & Girls Dance",
  ],
};

export function formatIls(amount: number) {
  return `₪${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function capacityTone(registered: number, capacity: number): CapacityTone {
  if (registered >= capacity) return "red";
  const spotsLeft = capacity - registered;
  if (spotsLeft <= 3 || registered / capacity >= 0.8) return "gold";
  return "green";
}

export function capacityPercent(registered: number, capacity: number) {
  return Math.min(100, Math.round((registered / capacity) * 100));
}

export function getDaySchedule(day: string) {
  return studioSnapshot.classes.filter((session) => session.day === day).sort((a, b) => a.time.localeCompare(b.time));
}

export function getMemberCreditsLabel(member: StudioMember) {
  return member.credits === null ? "∞ Unlimited" : `${member.credits} left`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
