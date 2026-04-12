export interface Team {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  badge_label?: string | null;
  badge_color?: string | null;
}

export interface Member {
  id: string;
  name: string;
  team_id: string;
  phone: string;
  address: string;
  location: string;
  birthday: string;
  email: string;
}

export interface AttendanceRecord {
  id: string;
  member_id: string;
  sunday: string;
  present: boolean;
  reason?: string | null;
}
