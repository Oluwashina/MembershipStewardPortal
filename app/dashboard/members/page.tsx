"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  teams,
  members,
  getTeamMembers,
} from "@/lib/mock-data";
import TeamIcon from "@/components/TeamIcon";
import {
  Search,
  Plus,
  Phone,
  MapPin,
  Cake,
  ChevronDown,
  X,
  User,
} from "lucide-react";

export default function MembersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-navy-400">Loading...</div>}>
      <MembersContent />
    </Suspense>
  );
}

function MembersContent() {
  const searchParams = useSearchParams();
  const initialTeam = searchParams.get("team") || "all";

  const [selectedTeam, setSelectedTeam] = useState(initialTeam);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const filteredMembers = useMemo(() => {
    let list =
      selectedTeam === "all" ? members : getTeamMembers(selectedTeam);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.phone.includes(q) ||
          m.location.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedTeam, searchQuery]);

  const activeMember = selectedMember
    ? members.find((m) => m.id === selectedMember)
    : null;

  return (
    <div className="max-w-350 mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-navy-800">Team Members</h1>
          <p className="text-sm text-navy-400 mt-1">
            {filteredMembers.length} members
            {selectedTeam !== "all" &&
              ` in ${teams.find((t) => t.id === selectedTeam)?.name}`}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-navy-700 rounded-xl text-sm font-medium text-white hover:bg-navy-800 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
          <input
            type="text"
            placeholder="Search by name, phone, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-navy-100 text-sm text-navy-700 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-200 transition-all"
          />
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

      {/* Team filter chips */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setSelectedTeam("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedTeam === "all"
              ? "bg-navy-700 text-white"
              : "bg-white border border-navy-100 text-navy-500 hover:bg-navy-50"
          }`}
        >
          All ({members.length})
        </button>
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => setSelectedTeam(team.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedTeam === team.id
                ? "bg-navy-700 text-white"
                : "bg-white border border-navy-100 text-navy-500 hover:bg-navy-50"
            }`}
          >
            <TeamIcon name={team.icon} className="w-3 h-3" />
            {team.name} ({getTeamMembers(team.id).length})
          </button>
        ))}
      </div>

      {/* Members — card list on mobile, table on desktop */}
      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {filteredMembers.map((member) => {
          const team = teams.find((t) => t.id === member.teamId);
          const bday = new Date(member.birthday);
          return (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member.id)}
              className="bg-white rounded-xl border border-navy-100/60 p-4 active:bg-navy-50 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-navy-100 rounded-full flex items-center justify-center text-navy-600 text-xs font-semibold shrink-0">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy-700 truncate">{member.name}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-navy-500 bg-navy-50 px-2 py-0.5 rounded-md">
                    <TeamIcon name={team?.icon || ""} className="w-3 h-3" />
                    {team?.name}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-navy-500">
                <div><span className="text-navy-400">Phone:</span> {member.phone}</div>
                <div><span className="text-navy-400">Location:</span> {member.location}</div>
                <div><span className="text-navy-400">Birthday:</span> {bday.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="bg-white rounded-2xl border border-navy-100/60 overflow-hidden hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-navy-100">
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-navy-400 tracking-wider uppercase">
                Member
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-navy-400 tracking-wider uppercase">
                Team
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-navy-400 tracking-wider uppercase">
                Phone
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-navy-400 tracking-wider uppercase">
                Location
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-navy-400 tracking-wider uppercase">
                Birthday
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => {
              const team = teams.find((t) => t.id === member.teamId);
              const bday = new Date(member.birthday);

              return (
                <tr
                  key={member.id}
                  onClick={() => setSelectedMember(member.id)}
                  className="border-b border-navy-50 last:border-none hover:bg-navy-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center text-navy-600 text-xs font-semibold shrink-0">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="text-sm font-semibold text-navy-700">
                        {member.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-navy-500 bg-navy-50 px-2.5 py-1 rounded-lg">
                      <TeamIcon name={team?.icon || ""} className="w-3 h-3" />
                      {team?.name}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-navy-500">
                    {member.phone}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-navy-500">
                    {member.location}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-navy-500">
                    {bday.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredMembers.length === 0 && (
          <div className="p-12 text-center">
            <User className="w-12 h-12 text-navy-200 mx-auto mb-3" />
            <p className="text-sm text-navy-400">No members found</p>
          </div>
        )}
      </div>

      {/* Member Detail Slide-over */}
      {activeMember && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-navy-900/30 backdrop-blur-sm"
            onClick={() => setSelectedMember(null)}
          />
          <div className="relative w-full sm:w-105 bg-white h-full shadow-2xl overflow-auto">
            <div className="p-6">
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center text-navy-400 hover:bg-navy-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-navy-700 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                  {activeMember.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h2 className="text-lg font-bold text-navy-800">
                  {activeMember.name}
                </h2>
                <p className="text-sm text-navy-400">
                  {teams.find((t) => t.id === activeMember.teamId)?.name}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-navy-50 rounded-xl">
                  <Phone className="w-4 h-4 text-navy-400" />
                  <div>
                    <p className="text-xs text-navy-400">Phone</p>
                    <p className="text-sm font-medium text-navy-700">
                      {activeMember.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-navy-50 rounded-xl">
                  <MapPin className="w-4 h-4 text-navy-400" />
                  <div>
                    <p className="text-xs text-navy-400">Address</p>
                    <p className="text-sm font-medium text-navy-700">
                      {activeMember.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-navy-50 rounded-xl">
                  <MapPin className="w-4 h-4 text-navy-400" />
                  <div>
                    <p className="text-xs text-navy-400">Location</p>
                    <p className="text-sm font-medium text-navy-700">
                      {activeMember.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-navy-50 rounded-xl">
                  <Cake className="w-4 h-4 text-navy-400" />
                  <div>
                    <p className="text-xs text-navy-400">Birthday</p>
                    <p className="text-sm font-medium text-navy-700">
                      {new Date(activeMember.birthday).toLocaleDateString(
                        "en-US",
                        { month: "long", day: "numeric", year: "numeric" }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-navy-900/30 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 sm:mx-auto p-5 sm:p-6">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center text-navy-400 hover:bg-navy-100 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold text-navy-800 mb-1">
              Add New Member
            </h2>
            <p className="text-sm text-navy-400 mb-6">
              Fill in the details for the new team member
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowAddModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-navy-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm text-navy-700 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-600 mb-1">
                  Team
                </label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm text-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-200">
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="080XXXXXXXX"
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm text-navy-700 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-600 mb-1">
                    Birthday
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm text-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-600 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Street address"
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm text-navy-700 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-600 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ibadan North"
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm text-navy-700 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-200"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-navy-700 hover:bg-navy-800 text-white font-semibold rounded-xl transition-all text-sm"
              >
                Add Member
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
