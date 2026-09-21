"use client";

import React, { useState } from "react";
import { Calendar, Clock, Edit2, Trash2, User } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Drawer } from "@/components/ui/Drawer";
import { useWorkspace } from "@/context/WorkspaceContext";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { useStatuses } from "@/features/statuses/hooks/useStatuses";
import { useTaskDetail } from "@/features/tasks/hooks/useTaskDetail";
import { formatDate, formatRelativeTime, isOverdue } from "@/lib/utils";
import type { Task } from "@/types";

import { TaskActivityLog } from "./TaskActivityLog";
import { TaskComments } from "./TaskComments";
import { TaskSubtasks } from "./TaskSubtasks";

interface TaskDetailDrawerProps {
  onEditTask: (task: Task) => void;
}

export function TaskDetailDrawer({ onEditTask }: TaskDetailDrawerProps) {
  const {
    task,
    status,
    assignee,
    activities,
    comments,
    isOpen,
    closeTask,
    moveTaskStatus,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    addComment,
  } = useTaskDetail();

  const { deleteTask: removeTask } = useWorkspace();
  const { statuses } = useStatuses();
  const { canEditTask, canDeleteTask, canMoveTask } = usePermissions();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "activity">("details");

  const handleDeleteClick = () => {
    if (!task) return;
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
    closeTask();
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      removeTask(taskToDelete.id);
    }
    setIsDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleEditClick = () => {
    if (!task) return;
    const taskToPass = task;
    closeTask();
    onEditTask(taskToPass);
  };

  if (!task && !isDeleteDialogOpen) return null;

  const overdue =
    task?.dueDate &&
    isOverdue(task.dueDate) &&
    !status?.name.toLowerCase().includes("done");

  return (
    <>
      {task && (
        <>
          <Drawer
            isOpen={isOpen}
            onClose={closeTask}
            title={
              <div className="flex items-center gap-2">
                <Badge variant="priority" priority={task.priority} />
                {status && (
                  <Badge variant="status" statusColor={status.color}>
                    {status.name}
                  </Badge>
                )}
              </div>
            }
            description={
              <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
                <span>Created {formatRelativeTime(task.createdAt)}</span>
                <span>•</span>
                <span>Updated {formatRelativeTime(task.updatedAt)}</span>
              </div>
            }
            footer={
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  {canDeleteTask && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDeleteClick}
                      className="text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 text-xs gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {canEditTask && (
                    <Button
                      size="sm"
                      onClick={handleEditClick}
                      className="gap-1.5 text-xs cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit Details</span>
                    </Button>
                  )}
                </div>
              </div>
            }
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {task.title}
                </h2>
                {task.description && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-900/50">
                {/* Status Selector */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase">
                    Status
                  </span>
                  <div className="flex items-center gap-2">
                    <select
                      value={task.statusId}
                      disabled={!canMoveTask}
                      onChange={(e) => moveTaskStatus(e.target.value)}
                      className="w-full text-xs font-semibold rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 disabled:opacity-60 cursor-pointer"
                    >
                      {statuses.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Assignee */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase">
                    Assignee
                  </span>
                  <div className="flex items-center gap-2 py-0.5">
                    {assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={assignee.name}
                          src={assignee.avatar}
                          size="xs"
                        />
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                          {assignee.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <User className="h-3.5 w-3.5" />
                        <span>Unassigned</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Due Date */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase">
                    Due Date
                  </span>
                  <div className="flex items-center gap-1.5 py-0.5">
                    {task.dueDate ? (
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          overdue
                            ? "text-rose-600 font-bold dark:text-rose-400"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {overdue ? (
                          <Clock className="h-3.5 w-3.5 text-rose-500" />
                        ) : (
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        )}
                        {formatDate(task.dueDate)}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        No date set
                      </span>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase">
                    Tags
                  </span>
                  <div className="flex flex-wrap gap-1 py-0.5">
                    {task.tags && task.tags.length > 0 ? (
                      task.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        None
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Subtasks Checklist */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <TaskSubtasks
                  subtasks={task.subtasks}
                  onToggle={toggleSubtask}
                  onAdd={addSubtask}
                  onDelete={deleteSubtask}
                />
              </div>

              {/* Tab Selector: Comments vs Activity */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                      activeTab === "details"
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    Comments ({comments.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("activity")}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                      activeTab === "activity"
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    Audit Log ({activities.length})
                  </button>
                </div>

                <div className="mt-4">
                  {activeTab === "details" ? (
                    <TaskComments
                      comments={comments}
                      onAddComment={addComment}
                    />
                  ) : (
                    <TaskActivityLog activities={activities} />
                  )}
                </div>
              </div>
            </div>
          </Drawer>

          <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            onClose={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            title="Delete Task"
            description={`Are you sure you want to permanently delete "${taskToDelete?.title || "this task"}"?`}
            confirmText="Delete Task"
            variant="danger"
          />
        </>
      )}
    </>
  );
}
