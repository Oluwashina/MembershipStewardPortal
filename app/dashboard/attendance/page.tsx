"use client";

import { useState, useMemo } from "react";
import {
  teams,
  members,
  getTeamMembers,
  getSundays,
  attendanceRecords,
} from "@/lib/mock-data";
import TeamIcon from "@/components/TeamIcon";
import {
  ChevronDown,
  Check,
  X,
  MessageSquare,
  Save,
  CalendarDays,
} from "lucide-react";

export default function AttendancePage() {
  const [selectedTeam, setSelectedTeam] = useState(teams[0].id);
  const [selectedSunday, setSelectedSunday] = useState(() => {
    // Default to most recent past Sunday
    const sundays = getSundays();
    const today = new Date(2026, 3, 8);
    const past = sundays.filter((s) => new Date(s) <= today);
    return past[past.length - 1] || sundays[0];
  });

  const [attendance, setAttendance] = useState<
    Record<string, { present: boolean; reason: string }>
  >(() => {
    // Initialize from mock data
    const init: Record<string, { present: boolean; reason: string }> = {};
    const teamMembers = getTeamMembers(selectedTeam);
    for (const member of teamMembers) {
      const record = attendanceRecords.find(
        (r) => r.memberId === member.id && r.date === selectedSunday
      );
      init[member.id] = {
        present: record?.present ?? true,
        reason: record?.reason || "",
      };
    }
    return init;
  });

  const [editingReason, setEditingReason] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const sundays = getSundays();
  const today = new Date(2026, 3, 8);
  const teamMembers = useMemo(
    () => getTeamMembers(selectedTeam),
    [selectedTeam]
  );
  const currentTeam = teams.find((t) => t.id === selectedTeam);

  // Re-initialize attendance when team or sunday changes
  const reinitAttendance = (teamId: string, sunday: string) => {
    const init: Record<string, { present: boolean; reason: string }> = {};
    const tMembers = getTeamMembers(teamId);
    for (const member of tMembers) {
      const record = attendanceRecords.find(
        (r) => r.memberId === member.id && r.date === sunday
      );
      init[member.id] = {
        present: record?.present ?? true,
        reason: record?.reason || "",
      };
    }
    setAttendance(init);
  };

  const handleTeamChange = (teamId: string) => {
    setSelectedTeam(teamId);
    reinitAttendance(teamId, selectedSunday);
    setSaved(false);
  };

  const handleSundayChange = (sunday: string) => {
    setSelectedSunday(sunday);
    reinitAttendance(selectedTeam, sunday);
    setSaved(false);
  };

  const toggleAttendance = (memberId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        present: !prev[memberId]?.present,
        reason: !prev[memberId]?.present === true ? "" : prev[memberId]?.reason || "",
      },
    }));
    setSaved(false);
  };

  const updateReason = (memberId: string, reason: string) => {
    setAttendance((prev) => ({
      ...prev,
      [memberId]: { ...prev[memberId], reason },
    }));
    setSaved(false);
  };

  const presentCount = Object.values(attendance).filter(
    (a) => a.present
  ).length;
  const absentCount = teamMembers.length - presentCount;

  const formatSunday = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isFuture = (dateStr: string) => new Date(dateStr) > today;

  return (
    <div className="max-w-275 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">
            Mark Attendance
          </h1>
          <p className="text-sm text-navy-400 mt-1">
            Record Sunday attendance for each team
          </p>
        </div>
        <button
          onClick={() => setSaved(true)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            saved
              ? "bg-accent-green text-white"
              : "bg-navy-700 hover:bg-navy-800 text-white"
          }`}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Attendance
            </>
          )}
        </button>
      </div>

      {/* Selectors */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <select
            value={selectedTeam}
            onChange={(e) => handleTeamChange(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-white border border-navy-100 text-sm font-medium text-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-200 transition-all cursor-pointer"
          >
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={selectedSunday}
            onChange={(e) => handleSundayChange(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-white border border-navy-100 text-sm font-medium text-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-200 transition-all cursor-pointer"
          >
            {sundays.map((sunday) => (
              <option key={sunday} value={sunday} disabled={isFuture(sunday)}>
                {formatSunday(sunday)} {isFuture(sunday) ? "(upcoming)" : ""}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex items-center gap-6 mb-6 bg-white rounded-2xl border border-navy-100/60 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center">
            <TeamIcon
              name={currentTeam?.icon || ""}
              className="w-5 h-5 text-navy-600"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-navy-700">
              {currentTeam?.name}
            </p>
            <p className="text-xs text-navy-400">{currentTeam?.description}</p>
          </div>
        </div>
        <div className="w-px h-8 bg-navy-100" />
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-navy-400" />
          <span className="text-sm font-medium text-navy-600">
            {formatSunday(selectedSunday)}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-accent-green">
              {presentCount}
            </p>
            <p className="text-[10px] font-semibold text-navy-400 uppercase tracking-wider">
              Present
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-accent-red">{absentCount}</p>
            <p className="text-[10px] font-semibold text-navy-400 uppercase tracking-wider">
              Absent
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-navy-700">
              {teamMembers.length > 0
                ? Math.round((presentCount / teamMembers.length) * 100)
                : 0}
              %
            </p>
            <p className="text-[10px] font-semibold text-navy-400 uppercase tracking-wider">
              Rate
            </p>
          </div>
        </div>
      </div>

      {/* Attendance list */}
      <div className="bg-white rounded-2xl border border-navy-100/60 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-navy-100">
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-navy-400 tracking-wider uppercase">
                Member
              </th>
              <th className="text-center px-6 py-3.5 text-xs font-semibold text-navy-400 tracking-wider uppercase">
                Status
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-navy-400 tracking-wider uppercase">
                Reason (if absent)
              </th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => {
              const record = attendance[member.id] || {
                present: true,
                reason: "",
              };

              return (
                <tr
                  key={member.id}
                  className="border-b border-navy-50 last:border-none"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center text-navy-600 text-xs font-semibold">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy-700">
                          {member.name}
                        </p>
                        <p className="text-xs text-navy-400">
                          {member.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex justify-center">
                      <button
                        onClick={() => toggleAttendance(member.id)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          record.present
                            ? "bg-accent-green/10 text-accent-green hover:bg-accent-green/20"
                            : "bg-accent-red/10 text-accent-red hover:bg-accent-red/20"
                        }`}
                      >
                        {record.present ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    {!record.present ? (
                      editingReason === member.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={record.reason}
                            onChange={(e) =>
                              updateReason(member.id, e.target.value)
                            }
                            onBlur={() => setEditingReason(null)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && setEditingReason(null)
                            }
                            autoFocus
                            placeholder="Why were they absent?"
                            className="flex-1 px-3 py-1.5 rounded-lg border border-navy-200 text-sm text-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-200"
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingReason(member.id)}
                          className="flex items-center gap-2 text-sm text-navy-400 hover:text-navy-600 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          {record.reason || "Add a reason..."}
                        </button>
                      )
                    ) : (
                      <span className="text-xs text-navy-300">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
