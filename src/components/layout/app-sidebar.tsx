"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Brain,
  LayoutDashboard,
  FileSearch,
  History,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  Building2,
  Kanban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

const navItems = [
  { label: "Dashboard",    href: "/dashboard", icon: LayoutDashboard },
  { label: "New Analysis", href: "/workspace",  icon: FileSearch },
  { label: "Pipeline",     href: "/pipeline",   icon: Kanban },
  { label: "History",      href: "/dashboard?tab=history",    icon: History },
  { label: "Clients",      href: "/dashboard?tab=clients",    icon: Building2 },
  { label: "Candidates",   href: "/dashboard?tab=candidates", icon: Users },
];

const bottomItems = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help & Support", href: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { data: session } = useSession();
  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "Recruiter";
  const userInitials = userName.substring(0, 2).toUpperCase();

  return (
    <aside
      className={cn(
        "flex flex-col bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-white tracking-tight truncate">
              Hire<span className="text-blue-400">MIQ</span>
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/workspace" && pathname.startsWith("/workspace")) ||
            (item.href === "/pipeline"  && pathname.startsWith("/pipeline"));
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom items */}
      <div className="py-4 px-3 space-y-1 border-t border-slate-800">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors"
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}

        {/* User avatar */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 mt-2 w-full rounded-lg hover:bg-slate-800 transition-colors"
          title="Sign out"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">{userInitials}</span>
          </div>
          {!collapsed && (
            <div className="min-w-0 text-left">
              <p className="text-sm font-medium text-slate-200 truncate">
                {userName}
              </p>
              <p className="text-xs text-slate-500 truncate">Sign out</p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
