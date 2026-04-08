"use client";

import {
  teams,
  getTeamMembers,
  getTeamAttendance,
  getUpcomingBirthdays,
  members,
} from "@/lib/mock-data";
import TeamIcon from "@/components/TeamIcon";
import {
  UserPlus,
  CalendarCheck,
  Video,
  ChevronRight,
  TrendingUp,
  Cake,
  Plus,
  Download,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const upcomingBirthdays = getUpcomingBirthdays().slice(0, 4);
  const totalMembers = members.length;

  return (
    <div className="max-w-350 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-navy-400 tracking-wider uppercase mb-1">
            IBADAN CAMPUS
          </p>
          <h1 className="text-2xl font-bold text-navy-800">
            The New Church Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-navy-200 rounded-xl text-sm font-medium text-navy-600 hover:bg-navy-50 transition-all">
            <Download className="w-4 h-4" />
            Monthly Report
          </button>
          <Link
            href="/dashboard/members"
            className="flex items-center gap-2 px-4 py-2.5 bg-navy-700 rounded-xl text-sm font-medium text-white hover:bg-navy-800 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add New Member
          </Link>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Main content — team cards grid */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-2 gap-4">
            {teams.map((team) => {
              const memberCount = getTeamMembers(team.id).length;
              const attendance = getTeamAttendance(team.id);

              return (
                <Link
                  key={team.id}
                  href={`/dashboard/members?team=${team.id}`}
                  className="bg-white rounded-2xl p-5 border border-navy-100/60 hover:border-navy-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center group-hover:bg-navy-100 transition-colors">
                      <TeamIcon
                        name={team.icon}
                        className="w-5 h-5 text-navy-600"
                      />
                    </div>
                    {team.badgeLabel && (
                      <span
                        className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full text-white"
                        style={{ backgroundColor: team.badgeColor }}
                      >
                        {team.badgeLabel}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-navy-800 mb-0.5">
                    {team.name}
                  </h3>
                  <p className="text-xs text-navy-400 mb-4">
                    {team.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-navy-800">
                        {memberCount}
                      </p>
                      <p className="text-[10px] font-semibold text-navy-400 tracking-wider uppercase">
                        Members
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-xl font-bold ${
                          attendance >= 90
                            ? "text-accent-green"
                            : attendance >= 80
                            ? "text-accent-blue"
                            : "text-accent-amber"
                        }`}
                      >
                        {attendance}%
                      </p>
                      <p className="text-[10px] font-semibold text-navy-400 tracking-wider uppercase">
                        Attendance
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-75 shrink-0 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-navy-100/60 p-5">
            <h3 className="text-sm font-bold text-navy-700 mb-4 flex items-center gap-2">
              <span className="text-base">⚡</span> Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                href="/dashboard/members"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-navy-50 transition-all group"
              >
                <div className="w-9 h-9 bg-navy-50 rounded-lg flex items-center justify-center group-hover:bg-navy-100 transition-colors">
                  <UserPlus className="w-4 h-4 text-navy-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy-700">
                    New Member
                  </p>
                  <p className="text-xs text-navy-400">
                    Add to a ministry team
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-navy-300" />
              </Link>
              <Link
                href="/dashboard/attendance"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-navy-50 transition-all group"
              >
                <div className="w-9 h-9 bg-navy-50 rounded-lg flex items-center justify-center group-hover:bg-navy-100 transition-colors">
                  <CalendarCheck className="w-4 h-4 text-navy-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy-700">
                    Mark Attendance
                  </p>
                  <p className="text-xs text-navy-400">
                    Record weekly turnout
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-navy-300" />
              </Link>
              <Link
                href="/dashboard/reports"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-navy-50 transition-all group"
              >
                <div className="w-9 h-9 bg-navy-50 rounded-lg flex items-center justify-center group-hover:bg-navy-100 transition-colors">
                  <Video className="w-4 h-4 text-navy-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy-700">
                    View Reports
                  </p>
                  <p className="text-xs text-navy-400">
                    Monthly ministry reports
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-navy-300" />
              </Link>
            </div>
          </div>

          {/* Upcoming Birthdays */}
          <div className="bg-white rounded-2xl border border-navy-100/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-navy-700">
                Upcoming Birthdays
              </h3>
              <Link
                href="/dashboard/members"
                className="text-xs font-semibold text-navy-400 hover:text-navy-600 transition-colors"
              >
                VIEW ALL
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingBirthdays.map((member) => {
                const team = teams.find((t) => t.id === member.teamId);
                const bdayDate = new Date(member.birthday);
                const displayDate =
                  member.daysUntil === 0
                    ? "Today"
                    : member.daysUntil === 1
                    ? "Tomorrow"
                    : bdayDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });

                return (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-navy-700 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy-700 truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-navy-400">
                        <span className="text-navy-500">{team?.name}</span>
                        {" · "}
                        <span
                          className={
                            member.daysUntil === 0
                              ? "text-accent-green font-semibold"
                              : ""
                          }
                        >
                          {displayDate}
                        </span>
                      </p>
                    </div>
                    <Cake className="w-4 h-4 text-navy-300 shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Campus Health */}
          <div className="bg-navy-700 rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 right-4 w-16 h-16 bg-white/5 rounded-full translate-y-1/3" />
            <p className="text-[10px] font-bold tracking-wider text-white/50 mb-1">
              CAMPUS HEALTH
            </p>
            <p className="text-sm font-semibold text-white/80 mb-2">
              Total Membership
            </p>
            <p className="text-4xl font-bold mb-2">{totalMembers}</p>
            <div className="flex items-center gap-1.5 text-accent-green text-xs font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              +12.4% from last quarter
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
