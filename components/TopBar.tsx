"use client";

import { Bell, Settings, Search } from "lucide-react";

export default function TopBar() {
  return (
    <header className="h-16 bg-white border-b border-navy-100 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
          <input
            type="text"
            placeholder="Search members, teams..."
            className="pl-10 pr-4 py-2 w-72 rounded-xl bg-navy-50 border-none text-sm text-navy-700 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-200 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-400 hover:bg-navy-100 hover:text-navy-600 transition-all relative">
          <Bell className="w-[18px] h-[18px]" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-red rounded-full" />
        </button>
        <button className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-400 hover:bg-navy-100 hover:text-navy-600 transition-all">
          <Settings className="w-[18px] h-[18px]" />
        </button>
        <div className="w-px h-6 bg-navy-100 mx-1" />
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-navy-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
