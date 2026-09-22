"use client";

import React, { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): "light" | "dark" {
  return "light";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = (newTheme: "light" | "dark") => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("flowdesk-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("flowdesk-theme", "light");
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Theme selection"
      className="flex items-center rounded-xl bg-slate-100/90 p-1 border border-slate-200/80 dark:bg-slate-800/80 dark:border-slate-700/60 shadow-inner transition-colors"
    >
      <button
        type="button"
        role="radio"
        aria-checked={theme === "light"}
        onClick={() => toggleTheme("light")}
        title="Light Mode"
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all duration-200 cursor-pointer ${
          theme === "light"
            ? "bg-white text-amber-600 shadow-xs border border-slate-200/60 dark:bg-slate-700 dark:text-amber-400 dark:border-slate-600"
            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
      >
        <Sun className="h-3.5 w-3.5 shrink-0" />
        <span className="hidden sm:inline">Light</span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={theme === "dark"}
        onClick={() => toggleTheme("dark")}
        title="Dark Mode"
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all duration-200 cursor-pointer ${
          theme === "dark"
            ? "bg-slate-900 text-indigo-400 shadow-xs border border-slate-700 dark:bg-slate-950 dark:text-indigo-400 dark:border-slate-800"
            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
      >
        <Moon className="h-3.5 w-3.5 shrink-0" />
        <span className="hidden sm:inline">Dark</span>
      </button>
    </div>
  );
}
