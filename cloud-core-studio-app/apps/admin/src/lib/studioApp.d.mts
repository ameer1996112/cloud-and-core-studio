export type Tone = "green" | "gold" | "red";

export interface Room {
  id: string;
  name: string;
  capacity: number;
}

export interface Instructor {
  id: string;
  name: string;
  initials: string;
  color: string;
  email: string;
  phone: string;
  specialties: string[];
  status: string;
  utilization: number;
  availability: string;
  bio: string;
}

export interface StudioClass {
  id: string;
  day: string;
  date: string;
  time: string;
  endTime: string;
  name: string;
  type: string;
  instructor: Instructor;
  studio: string;
  roomId: string;
  capacity: number;
  registered: number;
  waitlist: number;
  color: string;
  duration: string;
  level: string;
  status: string;
  price: number;
  eligiblePlans: string[];
  cancelDeadlineHours: number;
  description: string;
  bring: string[];
}

export interface StudioMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  planType: string;
  status: string;
  credits: number | null;
  attended: number;
  month: number;
  renewal: string;
  price: number;
  tags: string[];
  lastVisit: string;
  noShows: number;
  notes: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  type: string;
  price: number;
  billingCycle: string;
  credits: number | null;
  activeMembers: number;
  status: string;
}

export interface PaymentRecord {
  id: string;
  member: string;
  clientId: string;
  type: string;
  date: string;
  amount: number;
  status: string;
  method: string;
}

export interface BookingRecord {
  id: string;
  classId: string;
  memberId: string;
  status: string;
  attendance: string | null;
  paymentStatus: string;
  membershipUsed: string;
  notes: string;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  memberId: string;
  status: string;
  note: string;
}

export interface StudioSnapshot {
  admin: { name: string; role: string };
  member: StudioMember;
  today: string;
  studio: {
    id: string;
    name: string;
    location: string;
    timezone: string;
    rooms: Room[];
    bookingRules: string;
    cancellationPolicy: string;
  };
  stats: {
    totalMembers: number;
    bookingsToday: number;
    revenueMonth: number;
    attendanceRate: number;
    activeMembers: number;
    capacityPressure: number;
    waitlistAlerts: number;
  };
  classes: StudioClass[];
  members: StudioMember[];
  memberships: MembershipPlan[];
  payments: PaymentRecord[];
  bookings: BookingRecord[];
  attendance: AttendanceRecord[];
  tasks: Array<{ id: string; title: string; detail: string; tone: string }>;
  activity: string[];
  analytics: {
    revenue: number[];
    attendanceRate: number;
    capacityUtilization: number;
    activeMembers: number;
    churnRisk: number;
    membershipGrowth: number;
    topClasses: Array<[string, number]>;
    instructorUtilization: Array<[string, number]>;
  };
  settings: Record<string, boolean | string>;
  instructors: Instructor[];
}

export function formatIls(amount: number): string;
export function capacityTone(registered: number, capacity: number): Tone;
export function capacityPercent(registered: number, capacity: number): number;
export function classAction(session: StudioClass): string;
export function getMemberCreditsLabel(member: StudioMember): string;
export function getDaySchedule(snapshot: StudioSnapshot, day: string): StudioClass[];
export function getClassBookings(
  snapshot: StudioSnapshot,
  classId: string,
): Array<BookingRecord & { member: StudioMember; session: StudioClass }>;
export function getMemberBookings(snapshot: StudioSnapshot, memberId: string): Array<BookingRecord & { session: StudioClass }>;
export function initials(name: string): string;
export function buildStudioSnapshot(): StudioSnapshot;
