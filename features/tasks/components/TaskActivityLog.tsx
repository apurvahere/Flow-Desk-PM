"use client";

import React from "react";
import {
  ArrowRightLeft,
  CheckCircle,
  History,
  MessageSquare,
  PlusCircle,
  RefreshCw,
  UserCheck,
} from "lucide-react";

import { useMembers } from "@/features/members/hooks/useMembers";
import { formatRelativeTime } from "@/lib/utils";
import type { Activity, ActivityAction } from "@/types";

interface TaskActivityLogProps {
  activities: Activity[];
}

export function TaskActivityLog({ activities }: TaskActivityLogProps) {
  const { getMemberById } = useMembers();

  const getActionIcon = (action: ActivityAction) => {
    switch (action) {
      case "created":
        return (
          <PlusCircle className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
        );
      case "status_changed":
        return (
          <ArrowRightLeft className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
        );
      case "subtask_toggled":
      case "subtask_added":
      case "subtask_deleted":
        return (
          <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        );
      case "comment_added":
        return (
          <MessageSquare className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
        );
      case "assigned":
        return (
          <UserCheck className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
        );
      default:
        return (
          <RefreshCw className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
        );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <History className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <span>Activity Log & History</span>
      </div>

      {activities.length === 0 ? (
        <p className="py-2 text-xs italic text-slate-400 dark:text-slate-500">
          No recorded history for this task.
        </p>
      ) : (
        <div className="relative pl-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 space-y-3">
          {activities.map((act) => {
            const author = getMemberById(act.authorId);
            const authorName = author ? author.name : "Team Member";

            return (
              <div
                key={act.id}
                className="relative flex items-start gap-2.5 text-xs"
              >
                <div className="absolute -left-5 mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-slate-900 ring-2 ring-slate-200 dark:ring-slate-700">
                  {getActionIcon(act.action)}
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {authorName}
                  </span>{" "}
                  <span className="text-slate-600 dark:text-slate-400">
                    {act.description}
                  </span>
                  <div className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                    {formatRelativeTime(act.timestamp)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
