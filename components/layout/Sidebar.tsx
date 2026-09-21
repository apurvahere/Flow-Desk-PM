"use client";

import React from "react";
import { Kanban, LogOut, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useWorkspace } from "@/context/WorkspaceContext";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, activeRole, logout } = useWorkspace();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    {
      label: "Workspace Tasks",
      href: "/",
      icon: <Kanban className="h-4 w-4" />,
    },
    {
      label: "Team Members",
      href: "/members",
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-4 w-4" />,
      count: 0,
    },
  ];

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col shrink-0 border-r border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-900/90 h-[calc(100vh-4rem)] sticky top-16 transition-colors">
      <div className="flex h-full flex-col justify-between p-4 overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Workspace Views
            </div>
            {/* Navigation Links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-indigo-50 text-indigo-600 font-semibold shadow-xs dark:bg-indigo-950/60 dark:text-indigo-400"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "transition-colors",
                          isActive
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-slate-400 dark:text-slate-500"
                        )}
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Current User & Sign Out */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {currentUser && (
            <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800/80">
              <Avatar
                name={currentUser.name}
                src={currentUser.avatar}
                size="sm"
                className="shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge
                    variant="role"
                    role={activeRole}
                    className="scale-90 origin-left"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors border border-rose-200/60 dark:border-rose-900/40 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
