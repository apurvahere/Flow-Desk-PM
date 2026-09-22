"use client";

import React, { useState } from "react";
import { FolderKanban, Menu, Sparkles } from "lucide-react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useWorkspace } from "@/context/WorkspaceContext";
import { UserProfileMenu } from "@/features/auth/components/UserProfileMenu";

export function Navbar() {
  const { isMobileNavOpen, setIsMobileNavOpen, resetToSampleData } =
    useWorkspace();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 transition-colors">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-sm shadow-indigo-500/20">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-base tracking-tight">
                  Flowdesk
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <Sparkles className="h-2.5 w-2.5" /> Workspace
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Dark Mode & Light Mode Toggle Switch */}
          <ThemeToggle />

          {/* User Profile Menu & Logout */}
          <div className="pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
            <UserProfileMenu />
          </div>
        </div>
      </header>

      <ConfirmDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={() => {
          resetToSampleData();
          setIsResetDialogOpen(false);
        }}
        title="Reset Demo Data"
        description="This will restore initial tasks, workflow statuses, comments, and members. Any custom modifications will be replaced."
        confirmText="Reset Workspace"
        variant="danger"
      />
    </>
  );
}
