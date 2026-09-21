"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import type { Status, Task } from "@/types";

import { TaskCard } from "./TaskCard";

interface TaskBoardColumnProps {
  status: Status;
  tasks: Task[];
  onSelectTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveStatus: (taskId: string, newStatusId: string) => void;
  onQuickAdd: (statusId: string) => void;
}

export function TaskBoardColumn({
  status,
  tasks,
  onSelectTask,
  onEditTask,
  onDeleteTask,
  onMoveStatus,
  onQuickAdd,
}: TaskBoardColumnProps) {
  const { canCreateTask } = usePermissions();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      onMoveStatus(taskId, status.id);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col flex-shrink-0 w-80 md:w-84 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border transition-all duration-200 p-3.5 max-h-full ${
        isDragOver
          ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-950/20"
          : "border-slate-200/80 dark:border-slate-800"
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900"
            style={{ backgroundColor: status.color }}
          />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {status.name}
          </h3>
          <span className="flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-xs font-semibold bg-slate-200/70 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {tasks.length}
          </span>
        </div>

        {canCreateTask && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onQuickAdd(status.id)}
            className="h-7 w-7 p-0 text-slate-500 hover:text-indigo-600 rounded-lg"
            title={`Add task to ${status.name}`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Task Cards */}
      <div className="mt-3 flex-1 space-y-3 overflow-y-auto pr-0.5 custom-scrollbar min-h-[120px]">
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", task.id);
            }}
          >
            <TaskCard
              task={task}
              onSelect={onSelectTask}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMoveStatus={onMoveStatus}
            />
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-4">
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
              No tasks in this column
            </p>
            {canCreateTask && (
              <button
                onClick={() => onQuickAdd(status.id)}
                className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                + Create task
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
