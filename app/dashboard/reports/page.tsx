"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Team, Member, AttendanceRecord } from "@/lib/types";
import { getSundays, downloadCSV } from "@/lib/helpers";
import TeamIcon from "@/components/TeamIcon";
import {
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Users,
  CalendarCheck,
  AlertCircle,
  BarChart3,
  Loader2,
  Download,
  Cake,
  UserX,
  PieChart,
  Award,
} from "lucide-react";

const months = [
  { value: 4, label: "April 2026" },
  { value: 5, label: "May 2026" },
  { value: 6, label: "June 2026" },
  { value: 7, label: "July 2026" },
  { value: 8, label: "August 2026" },
  { value: 9, label: "September 2026" },
  { value: 10, label: "October 2026" },
  { value: 11, label: "November 2026" },
  { value: 12, label: "December 2026" },
];

export default function ReportsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(4);
  const [selectedTeam, setSelectedTeam] = useState<string>("all");

  useEffect(() => {
    async function fetchData() {
      const [teamsRes, membersRes, attendanceRes] = await Promise.all([
        supabase.from("teams").select("*"),
        supabase.from("members").select("*"),
        supabase.from("attendance_records").select("*"),
      ]);
      setTeams(teamsRes.data || []);
      setMembers(membersRes.data || []);
      setAttendance(attendanceRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const monthLabel =
    months.find((m) => m.value === selectedMonth)?.label || "";

  const teamsToShow =
    selectedTeam === "all" ? teams : teams.filter((t) => t.id === selectedTeam);

  const getTeamMembers = (teamId: string) =>
    members.filter((m) => m.team_id === teamId);

  const getMonthlyReport = (teamId: string, month: number, year: number) => {
    const teamMemberList = getTeamMembers(teamId);
    const teamMemberIds = new Set(teamMemberList.map((m) => m.id));

    const sundays = getSundays().filter((s) => {
      const d = new Date(s + "T00:00:00");
      return d.getMonth() + 1 === month && d.getFullYear() === year;
    });

    const breakdown = sundays.map((sunday) => {
      const dayRecords = attendance.filter(
        (r) => r.sunday === sunday && teamMemberIds.has(r.member_id)
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
      totalMembers: teamMemberList.length,
      avgAttendance:
        totalRecords > 0
          ? Math.round((totalPresent / totalRecords) * 100)
          : 0,
      sundayBreakdown: breakdown,
    };
  };

  const reports = useMemo(() => {
    return teamsToShow.map((team) => ({
      team,
      report: getMonthlyReport(team.id, selectedMonth, 2026),
    }));
  }, [teamsToShow, selectedMonth, attendance, members]);

  const overallStats = useMemo(() => {
    const allReports = teams.map((t) =>
      getMonthlyReport(t.id, selectedMonth, 2026)
    );
    const totalMembers = allReports.reduce(
      (sum, r) => sum + r.totalMembers,
      0
    );
    const totalAvg =
      allReports.length > 0
        ? Math.round(
            allReports.reduce((sum, r) => sum + r.avgAttendance, 0) /
              allReports.length
          )
        : 0;

    const teamPerformance = teams
      .map((t) => ({
        team: t,
        attendance: getMonthlyReport(t.id, selectedMonth, 2026).avgAttendance,
      }))
      .sort((a, b) => b.attendance - a.attendance);

    return {
      totalMembers,
      avgAttendance: totalAvg,
      bestTeam: teamPerformance[0],
      worstTeam: teamPerformance[teamPerformance.length - 1],
    };
  }, [selectedMonth, teams, attendance, members]);

  const absentees = useMemo(() => {
    const memberAbsences: Record<
      string,
      { name: string; teamName: string; absences: number; total: number }
    > = {};

    for (const team of teamsToShow) {
      const teamMemberList = getTeamMembers(team.id);
      for (const member of teamMemberList) {
        const records = attendance.filter((r) => {
          const d = new Date(r.sunday + "T00:00:00");
          return (
            r.member_id === member.id &&
            d.getMonth() + 1 === selectedMonth &&
            d.getFullYear() === 2026
          );
        });
        const absences = records.filter((r) => !r.present).length;
        if (absences > 0) {
          memberAbsences[member.id] = {
            name: member.name,
            teamName: team.name,
            absences,
            total: records.length,
          };
        }
      }
    }

    return Object.entries(memberAbsences)
      .sort((a, b) => b[1].absences - a[1].absences)
      .slice(0, 5)
      .map(([id, data]) => ({ id, ...data }));
  }, [teamsToShow, selectedMonth, attendance, members]);

  // Attendance trend — avg attendance per month across all teams
  const attendanceTrend = useMemo(() => {
    return months.map((m) => {
      const monthReports = teams.map((t) =>
        getMonthlyReport(t.id, m.value, 2026)
      );
      const avg =
        monthReports.length > 0
          ? Math.round(
              monthReports.reduce((s, r) => s + r.avgAttendance, 0) /
                monthReports.length
            )
          : 0;
      const hasData = monthReports.some(
        (r) => r.sundayBreakdown.some((b) => b.present + b.absent > 0)
      );
      return { month: m.label, value: m.value, avg, hasData };
    });
  }, [teams, attendance, members]);

  // Consistency scores — per member attendance percentage
  const consistencyScores = useMemo(() => {
    const scores: {
      id: string;
      name: string;
      teamName: string;
      attended: number;
      total: number;
      score: number;
    }[] = [];

    for (const team of teamsToShow) {
      const teamMemberList = getTeamMembers(team.id);
      for (const member of teamMemberList) {
        const records = attendance.filter((r) => {
          const d = new Date(r.sunday + "T00:00:00");
          return (
            r.member_id === member.id &&
            d.getMonth() + 1 === selectedMonth &&
            d.getFullYear() === 2026
          );
        });
        const attended = records.filter((r) => r.present).length;
        scores.push({
          id: member.id,
          name: member.name,
          teamName: team.name,
          attended,
          total: records.length,
          score: records.length > 0 ? Math.round((attended / records.length) * 100) : 0,
        });
      }
    }

    return scores.sort((a, b) => b.score - a.score);
  }, [teamsToShow, selectedMonth, attendance, members]);

  // Birthdays this month
  const birthdaysThisMonth = useMemo(() => {
    const monthNum = selectedMonth;
    return members
      .filter((m) => {
        if (!m.birthday) return false;
        const d = new Date(m.birthday + "T00:00:00");
        return d.getMonth() + 1 === monthNum;
      })
      .map((m) => {
        const team = teams.find((t) => t.id === m.team_id);
        const d = new Date(m.birthday + "T00:00:00");
        return {
          id: m.id,
          name: m.name,
          teamName: team?.name || "",
          day: d.getDate(),
          birthday: m.birthday,
        };
      })
      .sort((a, b) => a.day - b.day);
  }, [members, teams, selectedMonth]);

  // Inactive members — 3+ consecutive absences in the month
  const inactiveMembers = useMemo(() => {
    const result: {
      id: string;
      name: string;
      teamName: string;
      streak: number;
    }[] = [];

    const sundays = getSundays().filter((s) => {
      const d = new Date(s + "T00:00:00");
      return d.getMonth() + 1 === selectedMonth && d.getFullYear() === 2026;
    });

    for (const team of teamsToShow) {
      const teamMemberList = getTeamMembers(team.id);
      for (const member of teamMemberList) {
        let maxStreak = 0;
        let currentStreak = 0;
        for (const sunday of sundays) {
          const rec = attendance.find(
            (r) => r.member_id === member.id && r.sunday === sunday
          );
          if (rec && !rec.present) {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
          } else {
            currentStreak = 0;
          }
        }
        if (maxStreak >= 3) {
          result.push({
            id: member.id,
            name: member.name,
            teamName: team.name,
            streak: maxStreak,
          });
        }
      }
    }

    return result.sort((a, b) => b.streak - a.streak);
  }, [teamsToShow, selectedMonth, attendance, members]);

  // Team size distribution
  const teamSizes = useMemo(() => {
    return teams
      .map((t) => ({
        team: t,
        count: getTeamMembers(t.id).length,
      }))
      .sort((a, b) => b.count - a.count);
  }, [teams, members]);

  const totalMembersAll = teamSizes.reduce((s, t) => s + t.count, 0);

  // -- Export handlers --
  const handleExportReport = () => {
    const headers = ["Team", "Members", "Avg Attendance %", ...getSundays()
      .filter((s) => {
        const d = new Date(s + "T00:00:00");
        return d.getMonth() + 1 === selectedMonth && d.getFullYear() === 2026;
      })
      .map((s) => {
        const d = new Date(s + "T00:00:00");
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      })];

    const rows = reports.map(({ team, report }) => [
      team.name,
      String(report.totalMembers),
      String(report.avgAttendance),
      ...report.sundayBreakdown.map((w) => {
        const total = w.present + w.absent;
        return total > 0 ? `${w.present}/${total}` : "-";
      }),
    ]);

    downloadCSV(`attendance-report-${monthLabel.replace(" ", "-")}.csv`, headers, rows);
  };

  const handleExportAbsentees = () => {
    const headers = ["Name", "Team", "Absences", "Total Sundays", "Attendance %"];
    const rows = absentees.map((m) => [
      m.name,
      m.teamName,
      String(m.absences),
      String(m.total),
      String(m.total > 0 ? Math.round(((m.total - m.absences) / m.total) * 100) : 0),
    ]);
    downloadCSV(`absentees-${monthLabel.replace(" ", "-")}.csv`, headers, rows);
  };

  const handleExportConsistency = () => {
    const headers = ["Name", "Team", "Attended", "Total Sundays", "Score %"];
    const rows = consistencyScores.map((m) => [
      m.name,
      m.teamName,
      String(m.attended),
      String(m.total),
      String(m.score),
    ]);
    downloadCSV(`consistency-scores-${monthLabel.replace(" ", "-")}.csv`, headers, rows);
  };

  const handleExportFullReport = () => {
    const sundays = getSundays().filter((s) => {
      const d = new Date(s + "T00:00:00");
      return d.getMonth() + 1 === selectedMonth && d.getFullYear() === 2026;
    });

    const headers = ["Member", "Team", ...sundays.map((s) => {
      const d = new Date(s + "T00:00:00");
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }), "Total Present", "Total Absent", "Attendance %"];

    const rows: string[][] = [];

    for (const team of teamsToShow) {
      const teamMemberList = getTeamMembers(team.id);
      for (const member of teamMemberList) {
        const sundayStatus = sundays.map((sunday) => {
          const rec = attendance.find(
            (r) => r.member_id === member.id && r.sunday === sunday
          );
          if (!rec) return "-";
          return rec.present ? "Present" : "Absent";
        });
        const totalPresent = sundayStatus.filter((s) => s === "Present").length;
        const totalAbsent = sundayStatus.filter((s) => s === "Absent").length;
        const totalRecorded = totalPresent + totalAbsent;
        rows.push([
          member.name,
          team.name,
          ...sundayStatus,
          String(totalPresent),
          String(totalAbsent),
          String(totalRecorded > 0 ? Math.round((totalPresent / totalRecorded) * 100) : 0),
        ]);
      }
    }

    downloadCSV(`full-attendance-${monthLabel.replace(" ", "-")}.csv`, headers, rows);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-navy-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-350 mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Monthly Reports</h1>
          <p className="text-sm text-navy-400 mt-1">
            Holistic view of team attendance and performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2.5 bg-navy-700 text-white rounded-xl text-sm font-medium hover:bg-navy-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Summary</span>
          </button>
          <button
            onClick={handleExportFullReport}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-navy-200 text-navy-700 rounded-xl text-sm font-medium hover:bg-navy-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Full Report</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-white border border-navy-100 text-sm font-medium text-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-200 transition-all cursor-pointer"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-white border border-navy-100 text-sm font-medium text-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-200 transition-all cursor-pointer"
          >
            <option value="all">All Teams</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-navy-100/60 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-navy-50 rounded-xl flex items-center justify-center">
              <Users className="w-4 h-4 text-navy-600" />
            </div>
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-wider">
              Total Members
            </p>
          </div>
          <p className="text-2xl font-bold text-navy-800">
            {overallStats.totalMembers}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-navy-100/60 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-accent-green/10 rounded-xl flex items-center justify-center">
              <CalendarCheck className="w-4 h-4 text-accent-green" />
            </div>
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-wider">
              Avg Attendance
            </p>
          </div>
          <p className="text-2xl font-bold text-accent-green">
            {overallStats.avgAttendance}%
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-navy-100/60 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-accent-blue/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-accent-blue" />
            </div>
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-wider">
              Best Team
            </p>
          </div>
          <p className="text-lg font-bold text-navy-800">
            {overallStats.bestTeam?.team.name}
          </p>
          <p className="text-sm text-accent-green font-medium">
            {overallStats.bestTeam?.attendance}%
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-navy-100/60 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-accent-amber/10 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-accent-amber" />
            </div>
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-wider">
              Needs Attention
            </p>
          </div>
          <p className="text-lg font-bold text-navy-800">
            {overallStats.worstTeam?.team.name}
          </p>
          <p className="text-sm text-accent-amber font-medium">
            {overallStats.worstTeam?.attendance}%
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Team breakdown */}
        <div className="flex-1 min-w-0 space-y-4">
          <h2 className="text-base font-bold text-navy-700 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Team Breakdown — {monthLabel}
          </h2>

          {reports.map(({ team, report }) => (
            <div
              key={team.id}
              className="bg-white rounded-2xl border border-navy-100/60 p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center">
                  <TeamIcon
                    name={team.icon}
                    className="w-5 h-5 text-navy-600"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-navy-700">
                    {team.name}
                  </h3>
                  <p className="text-xs text-navy-400">{team.description}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-xl font-bold ${
                      report.avgAttendance >= 90
                        ? "text-accent-green"
                        : report.avgAttendance >= 80
                        ? "text-accent-blue"
                        : "text-accent-amber"
                    }`}
                  >
                    {report.avgAttendance}%
                  </p>
                  <p className="text-[10px] font-semibold text-navy-400 uppercase tracking-wider">
                    Avg Attendance
                  </p>
                </div>
              </div>

              {/* Weekly breakdown */}
              {report.sundayBreakdown.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {report.sundayBreakdown.map((week) => {
                    const total = week.present + week.absent;
                    const pct =
                      total > 0
                        ? Math.round((week.present / total) * 100)
                        : 0;
                    const d = new Date(week.date);

                    return (
                      <div
                        key={week.date}
                        className="bg-navy-50 rounded-xl p-3 text-center"
                      >
                        <p className="text-[10px] text-navy-400 font-medium mb-1">
                          {d.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p
                          className={`text-lg font-bold ${
                            pct >= 90
                              ? "text-accent-green"
                              : pct >= 80
                              ? "text-accent-blue"
                              : "text-accent-amber"
                          }`}
                        >
                          {pct}%
                        </p>
                        <p className="text-[10px] text-navy-400">
                          {week.present}/{total}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-navy-300 text-center py-4">
                  No attendance data for this month yet
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar — members needing attention */}
        <div className="w-full lg:w-[320px] shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-navy-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Most Absent — {monthLabel}
            </h2>
            {absentees.length > 0 && (
              <button
                onClick={handleExportAbsentees}
                className="text-xs text-navy-400 hover:text-navy-600 flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                CSV
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-navy-100/60 p-5 space-y-3">
            {absentees.length > 0 ? (
              absentees.map((member) => {
                const rate =
                  member.total > 0
                    ? Math.round(
                        ((member.total - member.absences) / member.total) * 100
                      )
                    : 0;
                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 bg-navy-50 rounded-xl"
                  >
                    <div className="w-8 h-8 bg-navy-200 rounded-full flex items-center justify-center text-navy-600 text-xs font-semibold shrink-0">
                      {member.name.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy-700 truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-navy-400">
                        {member.teamName}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-accent-red">
                        {member.absences}
                      </p>
                      <p className="text-[10px] text-navy-400">
                        absences
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-navy-300 text-center py-4">
                No absence data for this month yet
              </p>
            )}
          </div>

          {/* Overall attendance bar chart (simplified) */}
          <h2 className="text-base font-bold text-navy-700 mt-6 mb-4">
            Team Rankings
          </h2>
          <div className="bg-white rounded-2xl border border-navy-100/60 p-5 space-y-3">
            {teams
              .map((team) => ({
                team,
                attendance: getMonthlyReport(team.id, selectedMonth, 2026)
                  .avgAttendance,
              }))
              .sort((a, b) => b.attendance - a.attendance)
              .map(({ team, attendance }, i) => (
                <div key={team.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-navy-300 w-4">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-navy-600 truncate">
                        {team.name}
                      </p>
                      <p
                        className={`text-xs font-bold ${
                          attendance >= 90
                            ? "text-accent-green"
                            : attendance >= 80
                            ? "text-accent-blue"
                            : "text-accent-amber"
                        }`}
                      >
                        {attendance}%
                      </p>
                    </div>
                    <div className="h-2 bg-navy-50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          attendance >= 90
                            ? "bg-accent-green"
                            : attendance >= 80
                            ? "bg-accent-blue"
                            : "bg-accent-amber"
                        }`}
                        style={{ width: `${attendance}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Attendance Trend */}
      <div className="mt-8">
        <h2 className="text-base font-bold text-navy-700 flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4" />
          Attendance Trend — 2026
        </h2>
        <div className="bg-white rounded-2xl border border-navy-100/60 p-5">
          <div className="flex items-end gap-2 h-48">
            {attendanceTrend.map((m) => (
              <div
                key={m.value}
                className="flex-1 flex flex-col items-center justify-end h-full"
              >
                <p className="text-xs font-bold text-navy-600 mb-1">
                  {m.hasData ? `${m.avg}%` : "—"}
                </p>
                <div
                  className={`w-full rounded-t-lg transition-all ${
                    m.value === selectedMonth
                      ? "bg-navy-700"
                      : m.hasData
                      ? "bg-navy-200"
                      : "bg-navy-50"
                  }`}
                  style={{ height: m.hasData ? `${Math.max(m.avg, 5)}%` : "5%" }}
                />
                <p className="text-[10px] text-navy-400 mt-2 font-medium">
                  {m.month.split(" ")[0].slice(0, 3)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional sections row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Consistency Scores */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-navy-700 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Consistency Scores
            </h2>
            {consistencyScores.length > 0 && (
              <button
                onClick={handleExportConsistency}
                className="text-xs text-navy-400 hover:text-navy-600 flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                CSV
              </button>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-navy-100/60 p-5 space-y-2 max-h-80 overflow-y-auto">
            {consistencyScores.length > 0 ? (
              consistencyScores.slice(0, 15).map((m, i) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 p-2.5 bg-navy-50 rounded-xl"
                >
                  <span className="text-xs font-bold text-navy-300 w-4">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy-700 truncate">
                      {m.name}
                    </p>
                    <p className="text-[10px] text-navy-400">{m.teamName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`text-sm font-bold ${
                        m.score >= 90
                          ? "text-accent-green"
                          : m.score >= 70
                          ? "text-accent-blue"
                          : "text-accent-amber"
                      }`}
                    >
                      {m.score}%
                    </p>
                    <p className="text-[10px] text-navy-400">
                      {m.attended}/{m.total}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-navy-300 text-center py-4">
                No attendance data yet
              </p>
            )}
          </div>
        </div>

        {/* Birthdays This Month */}
        <div>
          <h2 className="text-base font-bold text-navy-700 flex items-center gap-2 mb-4">
            <Cake className="w-4 h-4" />
            Birthdays in {monthLabel.split(" ")[0]}
          </h2>
          <div className="bg-white rounded-2xl border border-navy-100/60 p-5 space-y-2 max-h-80 overflow-y-auto">
            {birthdaysThisMonth.length > 0 ? (
              birthdaysThisMonth.map((m) => {
                const d = new Date(m.birthday + "T00:00:00");
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 p-2.5 bg-navy-50 rounded-xl"
                  >
                    <div className="w-9 h-9 bg-accent-amber/10 rounded-xl flex items-center justify-center shrink-0">
                      <Cake className="w-4 h-4 text-accent-amber" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy-700 truncate">
                        {m.name}
                      </p>
                      <p className="text-[10px] text-navy-400">{m.teamName}</p>
                    </div>
                    <p className="text-sm font-bold text-navy-600 shrink-0">
                      {d.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-navy-300 text-center py-4">
                No birthdays this month
              </p>
            )}
          </div>
        </div>

        {/* Team Size Distribution */}
        <div>
          <h2 className="text-base font-bold text-navy-700 flex items-center gap-2 mb-4">
            <PieChart className="w-4 h-4" />
            Team Size Distribution
          </h2>
          <div className="bg-white rounded-2xl border border-navy-100/60 p-5 space-y-2">
            {teamSizes.map(({ team, count }) => {
              const pct =
                totalMembersAll > 0
                  ? Math.round((count / totalMembersAll) * 100)
                  : 0;
              return (
                <div key={team.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-navy-50 rounded-lg flex items-center justify-center shrink-0">
                    <TeamIcon name={team.icon} className="w-4 h-4 text-navy-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-navy-600 truncate">
                        {team.name}
                      </p>
                      <p className="text-xs font-bold text-navy-700">
                        {count}{" "}
                        <span className="text-navy-300 font-normal">
                          ({pct}%)
                        </span>
                      </p>
                    </div>
                    <div className="h-2 bg-navy-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-navy-400 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Inactive Members */}
      {inactiveMembers.length > 0 && (
        <div className="mt-8">
          <h2 className="text-base font-bold text-navy-700 flex items-center gap-2 mb-4">
            <UserX className="w-4 h-4" />
            Inactive Members — 3+ Consecutive Absences
          </h2>
          <div className="bg-white rounded-2xl border border-navy-100/60 p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {inactiveMembers.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 p-3 bg-accent-red/5 rounded-xl border border-accent-red/10"
                >
                  <div className="w-8 h-8 bg-accent-red/10 rounded-full flex items-center justify-center shrink-0">
                    <UserX className="w-4 h-4 text-accent-red" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy-700 truncate">
                      {m.name}
                    </p>
                    <p className="text-[10px] text-navy-400">{m.teamName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-accent-red">
                      {m.streak}
                    </p>
                    <p className="text-[10px] text-navy-400">weeks</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
