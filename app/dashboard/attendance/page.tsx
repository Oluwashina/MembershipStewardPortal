"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Team, Member, AttendanceRecord } from "@/lib/types";
import { getSundays, formatSunday, getInitials } from "@/lib/helpers";
import TeamIcon from "@/components/TeamIcon";
import {
  ChevronDown,
  Check,
  X,
  MessageSquare,
  Save,
  CalendarDays,
  Loader2,
} from "lucide-react";

export default function AttendancePage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedSunday, setSelectedSunday] = useState(() => {
    const sundays = getSundays();
    const today = new Date();
    const past = sundays.filter((s) => new Date(s + "T00:00:00") <= today);
    return past[past.length - 1] || sundays[0];
  });

  const [attendance, setAttendance] = useState<
    Record<string, { present: boolean; reason: string }>
  >({});
  const [editingReason, setEditingReason] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const sundays = getSundays();
  const today = new Date();

  // Fetch teams + members
  useEffect(() => {
    async function fetchData() {
      const [teamsRes, membersRes] = await Promise.all([
        supabase.from("teams").select("*"),
        supabase.from("members").select("*"),
      ]);
      const fetchedTeams = teamsRes.data || [];
      setTeams(fetchedTeams);
      setAllMembers(membersRes.data || []);
      if (fetchedTeams.length > 0 && !selectedTeam) {
        setSelectedTeam(fetchedTeams[0].id);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const teamMembers = useMemo(
    () => allMembers.filter((m) => m.team_id === selectedTeam),
    [allMembers, selectedTeam]
  );

  const currentTeam = teams.find((t) => t.id === selectedTeam);

  // Load attendance records for selected team + sunday
  const loadAttendance = useCallback(
    async (teamId: string, sunday: string) => {
      const memberIds = allMembers
        .filter((m) => m.team_id === teamId)
        .map((m) => m.id);

      if (memberIds.length === 0) {
        setAttendance({});
        return;
      }

      const { data: records } = await supabase
        .from("attendance_records")
        .select("*")
        .in("member_id", memberIds)
        .eq("sunday", sunday);

      const init: Record<string, { present: boolean; reason: string }> = {};
      const tMembers = allMembers.filter((m) => m.team_id === teamId);
      for (const member of tMembers) {
        const record = records?.find((r: AttendanceRecord) => r.member_id === member.id);
        init[member.id] = {
          present: record?.present ?? true,
          reason: record?.reason || "",
        };
      }
      setAttendance(init);
    },
    [allMembers]
  );

  // Reload attendance on team/sunday change
  useEffect(() => {
    if (selectedTeam && allMembers.length > 0) {
      loadAttendance(selectedTeam, selectedSunday);
    }
  }, [selectedTeam, selectedSunday, allMembers, loadAttendance]);

  const handleTeamChange = (teamId: string) => {
    setSelectedTeam(teamId);
    setSaved(false);
  };

  const handleSundayChange = (sunday: string) => {
    setSelectedSunday(sunday);
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

  const handleSave = async () => {
    setSaving(true);
    const upserts = Object.entries(attendance).map(([memberId, data]) => ({
      member_id: memberId,
      sunday: selectedSunday,
      present: data.present,
      reason: data.present ? null : data.reason || null,
    }));

    const { error } = await supabase
      .from("attendance_records")
      .upsert(upserts, { onConflict: "member_id,sunday" });

    if (!error) {
      setSaved(true);
    }
    setSaving(false);
  };

  const presentCount = Object.values(attendance).filter(
    (a) => a.present
  ).length;
  const absentCount = teamMembers.length - presentCount;

  const isFuture = (dateStr: string) => new Date(dateStr + "T00:00:00") > today;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-navy-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-275 mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-navy-800">
            Mark Attendance
          </h1>
          <p className="text-sm text-navy-400 mt-1">
            Record Sunday attendance for each team
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            saved
              ? "bg-accent-green text-white"
              : "bg-navy-700 hover:bg-navy-800 text-white"
          } disabled:opacity-70`}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
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
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
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
      <div className="flex flex-wrap items-center gap-4 lg:gap-6 mb-6 bg-white rounded-2xl border border-navy-100/60 p-4">
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
        <div className="w-px h-8 bg-navy-100 hidden sm:block" />
        <div className="hidden sm:flex items-center gap-2">
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
        <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-navy-100">
              <th className="text-left px-4 lg:px-6 py-3.5 text-xs font-semibold text-navy-400 tracking-wider uppercase">
                Member
              </th>
              <th className="text-center px-4 lg:px-6 py-3.5 text-xs font-semibold text-navy-400 tracking-wider uppercase">
                Status
              </th>
              <th className="text-left px-4 lg:px-6 py-3.5 text-xs font-semibold text-navy-400 tracking-wider uppercase">
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
                  <td className="px-4 lg:px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center text-navy-600 text-xs font-semibold">
                        {getInitials(member.name)}
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
                  <td className="px-4 lg:px-6 py-3.5">
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
                  <td className="px-4 lg:px-6 py-3.5">
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
    </div>
  );
}
