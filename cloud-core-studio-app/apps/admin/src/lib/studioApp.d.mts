export type Tone = "green" | "gold" | "red";

export interface Instructor {
  id: string;
  name: string;
  initials: string;
  color: string;
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
  capacity: number;
  registered: number;
  waitlist: number;
  color: string;
  duration: string;
  cancelDeadlineHours: number;
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
  notes: string;
}

export interface PaymentRecord {
  id: string;
  member: string;
  type: string;
  date: string;
  amount: number;
}

export interface StudioSnapshot {
  admin: { name: string; role: string };
  member: StudioMember;
  today: string;
  stats: { totalMembers: number; bookingsToday: number; revenueMonth: number };
  classes: StudioClass[];
  members: StudioMember[];
  payments: PaymentRecord[];
  bookings: Array<{ id: string; classId: string; memberId: string; attendance: string | null }>;
  activity: string[];
  settings: Record<string, boolean | string>;
  instructors: Instructor[];
}

export function formatIls(amount: number): string;
export function capacityTone(registered: number, capacity: number): Tone;
export function capacityPercent(registered: number, capacity: number): number;
export function getMemberCreditsLabel(member: StudioMember): string;
export function getDaySchedule(snapshot: StudioSnapshot, day: string): StudioClass[];
export function getClassBookings(
  snapshot: StudioSnapshot,
  classId: string,
): Array<{ id: string; classId: string; memberId: string; attendance: string | null; member: StudioMember }>;
export function initials(name: string): string;
export function buildStudioSnapshot(): StudioSnapshot;
