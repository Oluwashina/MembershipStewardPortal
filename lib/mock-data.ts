import { Team, Member, AttendanceRecord } from "./types";

export const teams: Team[] = [
  {
    id: "new-music",
    name: "The New Music",
    description: "Choir",
    icon: "Music",
    color: "#1B2559",
    badgeLabel: "ACTIVE",
    badgeColor: "#22C55E",
  },
  {
    id: "amplified",
    name: "Amplified",
    description: "Technical & Sound Design",
    icon: "Speaker",
    color: "#1B2559",
    badgeLabel: "ELITE TIER",
    badgeColor: "#1B2559",
  },
  {
    id: "elites",
    name: "Elites",
    description: "Protocol & Logistics",
    icon: "Shield",
    color: "#1B2559",
  },
  {
    id: "shutterbox",
    name: "Shutterbox",
    description: "Visual & Media Production",
    icon: "Camera",
    color: "#1B2559",
  },
  {
    id: "amiables",
    name: "Amiables",
    description: "Hospitality & Welcome",
    icon: "Heart",
    color: "#1B2559",
  },
  {
    id: "treasureville",
    name: "Treasureville",
    description: "Children's Ministry",
    icon: "SmilePlus",
    color: "#1B2559",
  },
  {
    id: "heralds",
    name: "Heralds",
    description: "Ushers",
    icon: "Megaphone",
    color: "#1B2559",
  },
  {
    id: "marshalls",
    name: "Marshalls",
    description: "Security & Crowd Control",
    icon: "ShieldCheck",
    color: "#1B2559",
  },
  {
    id: "comms",
    name: "Loud",
    description: "Communications & Branding",
    icon: "AtSign",
    color: "#1B2559",
  },
  {
    id: 'tephilah',
    name: 'Tephilah',
    description: 'Prayer Ministry',
    icon: 'HelpCircle',
    color: '#1B2559',
  }
];

export const members: Member[] = [
  // The New Music (42 members - showing representative subset)
  { id: "m1", name: "Toluwani Omo-Osa", address: "12 Aare Ave, Oluyole", phone: "08012345678", location: "Ibadan South", birthday: "2000-04-08", teamId: "new-music", avatarUrl: "" },
  { id: "m2", name: "Chidi Benson", address: "5 Ring Road, Ibadan", phone: "08023456789", location: "Ibadan Central", birthday: "1998-04-09", teamId: "new-music", avatarUrl: "" },
  { id: "m3", name: "Grace Adekunle", address: "14 Bodija Estate", phone: "08034567890", location: "Ibadan North", birthday: "1999-04-24", teamId: "new-music", avatarUrl: "" },
  { id: "m4", name: "Dapo Richards", address: "3 Agodi GRA", phone: "08045678901", location: "Ibadan East", birthday: "1997-04-27", teamId: "new-music", avatarUrl: "" },
  { id: "m5", name: "Funke Adeyemi", address: "22 Challenge Road", phone: "08056789012", location: "Ibadan South", birthday: "2001-05-15", teamId: "new-music" },
  { id: "m6", name: "Samuel Okafor", address: "7 UI Road", phone: "08067890123", location: "Ibadan North", birthday: "1996-06-20", teamId: "new-music" },
  { id: "m7", name: "Deborah Alabi", address: "9 Mokola Hill", phone: "08078901234", location: "Ibadan Central", birthday: "2000-07-03", teamId: "new-music" },
  { id: "m8", name: "Ayo Ogundimu", address: "15 Dugbe Market Road", phone: "08089017345", location: "Ibadan Central", birthday: "1999-08-11", teamId: "new-music" },

  // Amplified
  { id: "m9", name: "Emeka Nwosu", address: "18 Sango Eleyele", phone: "09012345678", location: "Ibadan North", birthday: "1997-05-02", teamId: "amplified" },
  { id: "m10", name: "Tunde Bakare", address: "6 Apata Road", phone: "09023456789", location: "Ibadan West", birthday: "1998-06-14", teamId: "amplified" },
  { id: "m11", name: "Blessing Eze", address: "11 Jericho GRA", phone: "09034567890", location: "Ibadan Central", birthday: "2000-07-22", teamId: "amplified" },
  { id: "m12", name: "Kola Adesanya", address: "4 Agbowo", phone: "09045678901", location: "Ibadan North", birthday: "1996-08-30", teamId: "amplified" },
  { id: "m13", name: "Yetunde Fashola", address: "20 Ojoo Road", phone: "09056789012", location: "Ibadan North", birthday: "1999-09-05", teamId: "amplified" },

  // Elites
  { id: "m14", name: "Ibukun Olawale", address: "2 Ashi Road", phone: "07012345678", location: "Ibadan North", birthday: "1998-04-18", teamId: "elites" },
  { id: "m15", name: "Chioma Obi", address: "13 Iwo Road", phone: "07023456789", location: "Ibadan East", birthday: "2000-05-25", teamId: "elites" },
  { id: "m16", name: "Segun Martins", address: "8 Oke-Ado", phone: "07034567890", location: "Ibadan Central", birthday: "1997-06-12", teamId: "elites" },
  { id: "m17", name: "Adaeze Umeh", address: "16 Molete", phone: "07045678901", location: "Ibadan South", birthday: "1999-07-19", teamId: "elites" },
  { id: "m18", name: "Femi Adeoye", address: "1 Orita UI", phone: "07056789012", location: "Ibadan North", birthday: "2001-08-08", teamId: "elites" },
  { id: "m19", name: "Nneka Chukwu", address: "19 Adamasingba", phone: "07067890123", location: "Ibadan Central", birthday: "1996-09-15", teamId: "elites" },
  { id: "m20", name: "Bayo Akinwale", address: "10 Felele", phone: "07078901234", location: "Ibadan South", birthday: "1998-10-03", teamId: "elites" },

  // Shutterbox
  { id: "m21", name: "Olumide Fasanya", address: "5 Agodi Gate", phone: "08112345678", location: "Ibadan Central", birthday: "1999-05-10", teamId: "shutterbox" },
  { id: "m22", name: "Amara Okeke", address: "21 Sabo Road", phone: "08123456789", location: "Ibadan East", birthday: "2000-06-28", teamId: "shutterbox" },
  { id: "m23", name: "Tobi Akinsola", address: "3 Oke-Bola", phone: "08134567890", location: "Ibadan Central", birthday: "1997-11-14", teamId: "shutterbox" },

  // Amiables
  { id: "m24", name: "Folake Ogunlade", address: "17 Alalubosa", phone: "08145678901", location: "Ibadan East", birthday: "1998-04-05", teamId: "amiables" },
  { id: "m25", name: "Uche Agu", address: "7 Eleyele Road", phone: "08156789012", location: "Ibadan North", birthday: "2001-05-22", teamId: "amiables" },
  { id: "m26", name: "Mercy Johnson", address: "14 Oluyole Estate", phone: "08167890123", location: "Ibadan South", birthday: "1999-06-17", teamId: "amiables" },
  { id: "m27", name: "Damilola Ojo", address: "11 New Bodija", phone: "08178901234", location: "Ibadan North", birthday: "2000-12-01", teamId: "amiables" },
  { id: "m28", name: "Obinna Ezeh", address: "9 Liberty Road", phone: "08189012345", location: "Ibadan Central", birthday: "1997-07-31", teamId: "amiables" },
  { id: "m29", name: "Jumoke Balogun", address: "6 Agbeni", phone: "08190123456", location: "Ibadan South", birthday: "1996-08-19", teamId: "amiables" },

  // Treasureville
  { id: "m30", name: "Bukola Adeniyi", address: "4 Mokola Road", phone: "09112345678", location: "Ibadan Central", birthday: "1998-05-09", teamId: "treasureville" },
  { id: "m31", name: "Victor Okonkwo", address: "18 Polytechnic Road", phone: "09123456789", location: "Ibadan North", birthday: "2000-06-03", teamId: "treasureville" },
  { id: "m32", name: "Abiola Salami", address: "12 Beere", phone: "09134567890", location: "Ibadan Central", birthday: "1999-10-20", teamId: "treasureville" },
  { id: "m33", name: "Chinwe Ani", address: "1 Dugbe Road", phone: "09145678901", location: "Ibadan Central", birthday: "2001-11-11", teamId: "treasureville" },

  // Heralds
  { id: "m34", name: "Kayode Olatunde", address: "15 Ososami", phone: "09156789012", location: "Ibadan South", birthday: "1997-04-14", teamId: "heralds" },
  { id: "m35", name: "Ngozi Ibe", address: "8 Agodi Hills", phone: "09167890123", location: "Ibadan Central", birthday: "1999-09-27", teamId: "heralds" },
  { id: "m36", name: "Tolu Babatunde", address: "20 Sango Road", phone: "09178901234", location: "Ibadan North", birthday: "2000-12-15", teamId: "heralds" },

  // Marshalls
  { id: "m37", name: "Emeka Udoh", address: "2 Ikolaba", phone: "07112345678", location: "Ibadan North", birthday: "1996-05-18", teamId: "marshalls" },
  { id: "m38", name: "Adebayo Olaniyi", address: "13 Oke-Fia", phone: "07123456789", location: "Ibadan East", birthday: "1998-06-25", teamId: "marshalls" },
  { id: "m39", name: "Ifeanyi Madu", address: "10 Old Bodija", phone: "07134567890", location: "Ibadan North", birthday: "2000-07-09", teamId: "marshalls" },
  { id: "m40", name: "Sade Olujimi", address: "6 Ogunpa", phone: "07145678901", location: "Ibadan Central", birthday: "1999-08-22", teamId: "marshalls" },
  { id: "m41", name: "Kunle Afolabi", address: "19 Gate Road", phone: "07156789012", location: "Ibadan East", birthday: "1997-11-30", teamId: "marshalls" },

  // Comms
  { id: "m42", name: "Ronke Ajayi", address: "3 Premier Road", phone: "07167890123", location: "Ibadan Central", birthday: "1998-05-01", teamId: "comms" },
  { id: "m43", name: "Chukwuemeka Ikeh", address: "16 Oke-Ado", phone: "07178901234", location: "Ibadan Central", birthday: "2000-04-12", teamId: "comms" },
  { id: "m44", name: "Olayinka Dosunmu", address: "7 Molete Road", phone: "07189012345", location: "Ibadan South", birthday: "1999-10-07", teamId: "comms" },
];

// Generate all Sundays from April to December 2026
export function getSundays(): string[] {
  const sundays: string[] = [];
  const start = new Date(2026, 3, 1); // April 1, 2026
  const end = new Date(2026, 11, 31); // December 31, 2026

  const current = new Date(start);
  // Find first Sunday
  while (current.getDay() !== 0) {
    current.setDate(current.getDate() + 1);
  }

  while (current <= end) {
    sundays.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 7);
  }

  return sundays;
}

// Generate mock attendance data
export function generateMockAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const sundays = getSundays();
  // Only generate for past sundays up to "today" (April 8, 2026)
  const today = new Date(2026, 3, 8);

  const pastSundays = sundays.filter((s) => new Date(s) <= today);
  const reasons = [
    "Travelled out of town",
    "Feeling unwell",
    "Family emergency",
    "Work commitment",
    "School exams",
    "Out of state",
  ];

  for (const member of members) {
    for (const sunday of pastSundays) {
      const present = Math.random() > 0.15; // ~85% attendance
      records.push({
        memberId: member.id,
        date: sunday,
        present,
        reason: present
          ? undefined
          : reasons[Math.floor(Math.random() * reasons.length)],
      });
    }
  }

  return records;
}

export const attendanceRecords = generateMockAttendance();

// Helper: get team member count
export function getTeamMembers(teamId: string): Member[] {
  return members.filter((m) => m.teamId === teamId);
}

// Helper: get team attendance percentage
export function getTeamAttendance(teamId: string): number {
  const teamMembers = getTeamMembers(teamId);
  const teamMemberIds = new Set(teamMembers.map((m) => m.id));
  const teamRecords = attendanceRecords.filter((r) =>
    teamMemberIds.has(r.memberId)
  );
  if (teamRecords.length === 0) return 0;
  const presentCount = teamRecords.filter((r) => r.present).length;
  return Math.round((presentCount / teamRecords.length) * 100);
}

// Helper: get upcoming birthdays (within next 7 days)
export function getUpcomingBirthdays(): (Member & { daysUntil: number })[] {
  const today = new Date(2026, 3, 8); // April 8, 2026
  const results: (Member & { daysUntil: number })[] = [];

  for (const member of members) {
    const bday = new Date(member.birthday);
    const thisYearBday = new Date(
      today.getFullYear(),
      bday.getMonth(),
      bday.getDate()
    );
    const diffTime = thisYearBday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays <= 30) {
      results.push({ ...member, daysUntil: diffDays });
    }
  }

  return results.sort((a, b) => a.daysUntil - b.daysUntil);
}

// Helper: get monthly report for a team
export function getMonthlyReport(
  teamId: string,
  month: number,
  year: number
): {
  totalMembers: number;
  avgAttendance: number;
  sundayBreakdown: { date: string; present: number; absent: number }[];
} {
  const teamMembers = getTeamMembers(teamId);
  const teamMemberIds = new Set(teamMembers.map((m) => m.id));

  const sundays = getSundays().filter((s) => {
    const d = new Date(s);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

  const breakdown = sundays.map((sunday) => {
    const dayRecords = attendanceRecords.filter(
      (r) => r.date === sunday && teamMemberIds.has(r.memberId)
    );
    const present = dayRecords.filter((r) => r.present).length;
    return { date: sunday, present, absent: dayRecords.length - present };
  });

  const totalPresent = breakdown.reduce((sum, b) => sum + b.present, 0);
  const totalRecords = breakdown.reduce(
    (sum, b) => sum + b.present + b.absent,
    0
  );

  return {
    totalMembers: teamMembers.length,
    avgAttendance: totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0,
    sundayBreakdown: breakdown,
  };
}
