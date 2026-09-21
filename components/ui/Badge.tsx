"use client";

import React from "react";
import { ArrowUp, Clock, Flame, Shield, User } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Priority, Role } from "@/types";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "priority" | "role" | "status" | "tag";
  priority?: Priority;
  role?: Role;
  statusColor?: string;
  dot?: boolean;
}

export function Badge({
  className,
  variant = "default",
  priority,
  role,
  statusColor,
  dot,
  children,
  ...props
}: BadgeProps) {
  if (variant === "priority" && priority) {
    const priorityConfig = {
      urgent: {
        className: "badge-urgent",
        icon: (
          <Flame className="h-3 w-3 text-rose-600 dark:text-rose-400 shrink-0" />
        ),
        label: "Urgent",
      },
      high: {
        className: "badge-high",
        icon: (
          <ArrowUp className="h-3 w-3 text-amber-600 dark:text-amber-400 shrink-0" />
        ),
        label: "High",
      },
      medium: {
        className: "badge-medium",
        icon: (
          <Clock className="h-3 w-3 text-sky-600 dark:text-sky-400 shrink-0" />
        ),
        label: "Medium",
      },
      low: {
        className: "badge-low",
        icon: (
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0" />
        ),
        label: "Low",
      },
    };

    const cfg = priorityConfig[priority];
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider",
          cfg.className,
          className
        )}
        {...props}
      >
        {cfg.icon}
        <span>{children || cfg.label}</span>
      </span>
    );
  }

  if (variant === "role" && role) {
    const roleConfig = {
      admin: {
        className:
          "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800/50",
        icon: (
          <Shield className="h-3 w-3 text-violet-600 dark:text-violet-400" />
        ),
        label: "Admin",
      },
      member: {
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50",
        icon: (
          <User className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
        ),
        label: "Member",
      },
      viewer: {
        className:
          "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/50",
        icon: <User className="h-3 w-3 text-slate-500 dark:text-slate-400" />,
        label: "Viewer",
      },
    };

    const cfg = roleConfig[role];
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-xs font-semibold",
          cfg.className,
          className
        )}
        {...props}
      >
        {cfg.icon}
        <span>{children || cfg.label}</span>
      </span>
    );
  }

  if (variant === "status" && statusColor) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-xs font-semibold",
          className
        )}
        style={{
          color: statusColor,
          borderColor: `${statusColor}40`,
          backgroundColor: `${statusColor}15`,
        }}
        {...props}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: statusColor }}
        />
        <span>{children}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300",
        className
      )}
      {...props}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
      )}
      {children}
    </span>
  );
}
