"use client";

import React, { useState } from "react";
import {
  Calendar,
  CheckSquare,
  Clock,
  Edit2,
  MoreVertical,
  Trash2,
} from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { useMembers } from "@/features/members/hooks/useMembers";
import { useStatuses } from "@/features/statuses/hooks/useStatuses";
import { cn, formatDate, isOverdue } from "@/lib/utils";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onSelect: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onMoveStatus: (taskId: string, newStatusId: string) => void;
}

export function TaskCard({
  task,
  onSelect,
  onEdit,
  onDelete,
  onMoveStatus,
}: TaskCardProps) {
  const { getMemberById } = useMembers();
  const { statuses } = useStatuses();
  const { canEditTask, canDeleteTask, canMoveTask } = usePermissions();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const assignee = getMemberById(task.assigneeId);
  const currentStatus = statuses.find((s) => s.id === task.statusId);
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const overdue = task.dueDate
    ? isOverdue(task.dueDate) &&
      !currentStatus?.name.toLowerCase().includes("done")
    : false;

  const otherStatuses = statuses.filter((s) => s.id !== task.statusId);

  const menuItems = [
    {
      id: "edit",
      label: "Edit Task",
      icon: <Edit2 className="h-3.5 w-3.5" />,
      onClick: () => onEdit(task),
      disabled: !canEditTask,
    },
    ...otherStatuses.map((s) => ({
      id: `move-${s.id}`,
      label: `Move to ${s.name}`,
      icon: (
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: s.color }}
        />
      ),
      onClick: () => onMoveStatus(task.id, s.id),
      disabled: !canMoveTask,
    })),
    {
      id: "delete",
      label: "Delete Task",
      icon: <Trash2 className="h-3.5 w-3.5" />,
      onClick: () => setIsDeleteDialogOpen(true),
      variant: "danger" as const,
      disabled: !canDeleteTask,
    },
  ];

  return (
    <>
      <div
        onClick={() => onSelect(task.id)}
        className="group relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-indigo-800/80 cursor-pointer"
      >
        <div className="flex items-center justify-between gap-2">
          <Badge variant="priority" priority={task.priority} />
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu
              align="right"
              trigger={
                <button className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
              }
              items={menuItems}
            />
          </div>
        </div>

        <div className="mt-3">
          <h4 className="text-sm font-semibold text-slate-900 line-clamp-2 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {task.title}
          </h4>
          {task.description && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-2 dark:text-slate-400">
              {task.description}
            </p>
          )}
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Progress bar if it has subtasks */}
        {task.subtasks.length > 0 && (
          <div className="mt-3.5 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-medium">
                <CheckSquare className="h-3 w-3 text-slate-400" />
                Subtasks
              </span>
              <span>
                {completedSubtasks}/{task.subtasks.length}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
                style={{
                  width: `${(completedSubtasks / task.subtasks.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Footer: Due date and assignee info */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5">
            {task.dueDate ? (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                  overdue
                    ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-semibold animate-pulse"
                    : "text-slate-500 dark:text-slate-400"
                )}
              >
                {overdue ? (
                  <Clock className="h-3 w-3 text-rose-500" />
                ) : (
                  <Calendar className="h-3 w-3 text-slate-400" />
                )}
                {formatDate(task.dueDate)}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 italic">No date</span>
            )}
          </div>

          <div className="flex items-center">
            {assignee ? (
              <Avatar
                name={assignee.name}
                src={assignee.avatar}
                size="xs"
                className="ring-1 ring-white dark:ring-slate-900"
              />
            ) : (
              <span className="text-[10px] text-slate-400">Unassigned</span>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          onDelete(task.id);
          setIsDeleteDialogOpen(false);
        }}
        title="Delete Task"
        description={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete Task"
        variant="danger"
      />
    </>
  );
}
