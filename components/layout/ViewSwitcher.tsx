"use client";

import React from "react";
import { LayoutGrid, List } from "lucide-react";

import type { ViewMode } from "@/types";

interface ViewSwitcherProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewSwitcher({ viewMode, onChange }: ViewSwitcherProps) {
  return (
    <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
      <button
        type="button"
        onClick={() => onChange("board")}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
          viewMode === "board"
            ? "bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        <span>Board</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("list")}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
          viewMode === "list"
            ? "bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
      >
        <List className="h-3.5 w-3.5" />
        <span>List</span>
      </button>
    </div>
  );
}
