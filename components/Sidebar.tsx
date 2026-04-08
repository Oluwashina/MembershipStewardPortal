"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  BarChart3,
  Church,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/members", label: "Team Members", icon: Users },
  { href: "/dashboard/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-62.5 bg-white border-r border-navy-100 flex flex-col h-screen sticky top-0">
      {/* Branding */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-navy-700 rounded-xl flex items-center justify-center">
            <Church className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-navy-700 leading-none">Ministries</span>
            <p className="text-[10px] text-navy-400 tracking-wider">STEWARDSHIP PORTAL</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-navy-700 text-white shadow-sm"
                  : "text-navy-500 hover:bg-navy-50 hover:text-navy-700"
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-navy-100">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-navy-400 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <LogOut className="w-4.5 h-4.5" />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
