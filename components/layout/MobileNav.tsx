"use client";

import React, { useEffect } from "react";
import { FolderKanban, Kanban, LogOut, Settings, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Avatar } from "@/components/ui/Avatar";
import { useWorkspace } from "@/context/WorkspaceContext";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    isMobileNavOpen,
    setIsMobileNavOpen,
    currentUser,
    activeRole,
    logout,
  } = useWorkspace();

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname, setIsMobileNavOpen]);

  if (!isMobileNavOpen) return null;

  const navItems = [
    {
      label: "Workspace Tasks",
      href: "/",
      icon: <Kanban className="h-5 w-5" />,
    },
    {
      label: "Team Members",
      href: "/members",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in-0 duration-200">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsMobileNavOpen(false)}
      />
      <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between p-5 z-10 animate-in slide-in-from-left duration-200">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <FolderKanban className="h-5 w-5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Flowdesk
              </span>
            </div>
            <button
              onClick={() => setIsMobileNavOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-50 text-indigo-600 font-semibold dark:bg-indigo-950/60 dark:text-indigo-400"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer User Info & Sign Out */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {currentUser && (
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
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
                <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                  {activeRole}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              logout();
              setIsMobileNavOpen(false);
              router.push("/login");
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors border border-rose-200/60 dark:border-rose-900/40 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
