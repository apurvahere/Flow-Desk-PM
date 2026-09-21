"use client";

import React, { useRef } from "react";

import type { Status, Task } from "@/types";

import { TaskBoardColumn } from "./TaskBoardColumn";

interface TaskBoardViewProps {
  statuses: Status[];
  tasks: Task[];
  onSelectTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveStatus: (taskId: string, newStatusId: string) => void;
  onQuickAdd: (statusId: string) => void;
}

export function TaskBoardView({
  statuses,
  tasks,
  onSelectTask,
  onEditTask,
  onDeleteTask,
  onMoveStatus,
  onQuickAdd,
}: TaskBoardViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToStatus = (statusId: string) => {
    const el = document.getElementById(`column-${statusId}`);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Mobile Column Jump Badges (small screens) */}
      <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-1 px-1 custom-scrollbar">
        <span className="text-[11px] font-semibold text-slate-400 uppercase shrink-0">
          Jump to:
        </span>
        {statuses.map((status) => {
          const count = tasks.filter((t) => t.statusId === status.id).length;
          return (
            <button
              key={status.id}
              onClick={() => scrollToStatus(status.id)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shrink-0 hover:bg-slate-200 transition-colors"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: status.color }}
              />
              {status.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Columns Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-start gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory md:snap-none custom-scrollbar min-h-[calc(100vh-280px)]"
      >
        {statuses.map((status) => {
          const columnTasks = tasks.filter((t) => t.statusId === status.id);
          return (
            <div
              key={status.id}
              id={`column-${status.id}`}
              className="snap-center"
            >
              <TaskBoardColumn
                status={status}
                tasks={columnTasks}
                onSelectTask={onSelectTask}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                onMoveStatus={onMoveStatus}
                onQuickAdd={onQuickAdd}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
