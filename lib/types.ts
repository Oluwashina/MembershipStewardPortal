export interface Member {
  id: string;
  name: string;
  address: string;
  phone: string;
  location: string;
  birthday: string; // ISO date string
  teamId: string;
  avatarUrl?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  badgeLabel?: string;
  badgeColor?: string;
}

export interface AttendanceRecord {
  memberId: string;
  date: string; // ISO date string (Sunday)
  present: boolean;
  reason?: string; // reason for absence
}

export interface MonthlyReport {
  teamId: string;
  month: number; // 1-12
  year: number;
  totalMembers: number;
  avgAttendance: number;
  sundayBreakdown: {
    date: string;
    present: number;
    absent: number;
  }[];
}
