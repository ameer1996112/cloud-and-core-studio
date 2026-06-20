export interface AdminClassSession {
  id: string;
  name: string;
  type: string;
  description: string;
  date: string;
  timeRange: string;
  instructor: string;
  studio: string;
  capacity: number;
  confirmedCount: number;
  waitlistCount: number;
  availableSpots: number;
  status: string;
  color: string;
}

export const fallbackClassSessions: AdminClassSession[];
export function mapClassSessionRow(row: Record<string, any>): AdminClassSession;
