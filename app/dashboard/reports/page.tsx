"use client";

import { useState, useMemo } from "react";
import {
  teams,
  getMonthlyReport,
  getTeamMembers,
  attendanceRecords,
} from "@/lib/mock-data";
import TeamIcon from "@/components/TeamIcon";
import {
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Users,
  CalendarCheck,
  AlertCircle,
  BarChart3,
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
  const [selectedMonth, setSelectedMonth] = useState(4); // April
  const [selectedTeam, setSelectedTeam] = useState<string>("all");

  const monthLabel =
    months.find((m) => m.value === selectedMonth)?.label || "";

  const teamsToShow =
    selectedTeam === "all" ? teams : teams.filter((t) => t.id === selectedTeam);

  const reports = useMemo(() => {
    return teamsToShow.map((team) => ({
      team,
      report: getMonthlyReport(team.id, selectedMonth, 2026),
    }));
  }, [teamsToShow, selectedMonth]);

  // Overall stats across all teams for the month
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

    // Find best and worst performing teams
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
  }, [selectedMonth]);

  // Find most absent members across teams for the month
  const absentees = useMemo(() => {
    const memberAbsences: Record<
      string,
      { name: string; teamName: string; absences: number; total: number }
    > = {};

    for (const team of teamsToShow) {
      const teamMemberList = getTeamMembers(team.id);
      for (const member of teamMemberList) {
        const records = attendanceRecords.filter(
          (r) => {
            const d = new Date(r.date);
            return (
              r.memberId === member.id &&
              d.getMonth() + 1 === selectedMonth &&
              d.getFullYear() === 2026
            );
          }
        );
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
  }, [teamsToShow, selectedMonth]);

  return (
    <div className="max-w-350 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Monthly Reports</h1>
          <p className="text-sm text-navy-400 mt-1">
            Holistic view of team attendance and performance
          </p>
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
      <div className="grid grid-cols-4 gap-4 mb-6">
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

      <div className="flex gap-6">
        {/* Team breakdown */}
        <div className="flex-1 space-y-4">
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
                <div className="grid grid-cols-5 gap-2">
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
        <div className="w-[320px] shrink-0">
          <h2 className="text-base font-bold text-navy-700 flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4" />
            Most Absent — {monthLabel}
          </h2>

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
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
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
    </div>
  );
}
