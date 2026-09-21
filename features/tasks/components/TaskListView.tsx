"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  CheckSquare,
  Edit2,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { Pagination } from "@/components/ui/Pagination";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { useMembers } from "@/features/members/hooks/useMembers";
import { useStatuses } from "@/features/statuses/hooks/useStatuses";
import { cn, formatDate, isOverdue } from "@/lib/utils";
import type { SortField, Task } from "@/types";

interface TaskListViewProps {
  tasks: Task[];
  sortField: SortField;
  sortDir: "asc" | "desc";
  onSort: (field: SortField) => void;
  onSelectTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTaskStatus: (taskId: string, newStatusId: string) => void;
}

export function TaskListView({
  tasks,
  sortField,
  sortDir,
  onSort,
  onSelectTask,
  onEditTask,
  onDeleteTask,
  onMoveTaskStatus,
}: TaskListViewProps) {
  const { statuses } = useStatuses();
  const { getMemberById } = useMembers();
  const { canEditTask, canDeleteTask, canMoveTask } = usePermissions();
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalTasks = tasks.length;
  const totalPages = Math.max(1, Math.ceil(totalTasks / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalTasks);

  const paginatedTasks = useMemo(() => {
    return tasks.slice(startIndex, endIndex);
  }, [tasks, startIndex, endIndex]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-slate-400 opacity-60" />;
    }
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
    ) : (
      <ArrowDown className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
    );
  };

  if (tasks.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-white/50 dark:bg-slate-900/30">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          No tasks found matching your filters.
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Try clearing some filters or creating a new task.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
                <th
                  onClick={() => onSort("title")}
                  className="px-5 py-3 cursor-pointer select-none hover:text-slate-900 dark:hover:text-slate-200"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Task Title</span>
                    {renderSortIcon("title")}
                  </div>
                </th>
                <th className="px-4 py-3">Status</th>
                <th
                  onClick={() => onSort("priority")}
                  className="px-4 py-3 cursor-pointer select-none hover:text-slate-900 dark:hover:text-slate-200"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Priority</span>
                    {renderSortIcon("priority")}
                  </div>
                </th>
                <th className="px-4 py-3">Assignee</th>
                <th
                  onClick={() => onSort("dueDate")}
                  className="px-4 py-3 cursor-pointer select-none hover:text-slate-900 dark:hover:text-slate-200"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Due Date</span>
                    {renderSortIcon("dueDate")}
                  </div>
                </th>
                <th className="px-4 py-3">Subtasks</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
              {paginatedTasks.map((task) => {
                const assignee = getMemberById(task.assigneeId);
                const currentStatus = statuses.find(
                  (s) => s.id === task.statusId
                );
                const completedSubtasks = task.subtasks.filter(
                  (s) => s.completed
                ).length;
                const overdue = task.dueDate
                  ? isOverdue(task.dueDate) &&
                    !currentStatus?.name.toLowerCase().includes("done")
                  : false;

                const otherStatuses = statuses.filter(
                  (s) => s.id !== task.statusId
                );

                const menuItems = [
                  {
                    id: "edit",
                    label: "Edit Task",
                    icon: <Edit2 className="h-3.5 w-3.5" />,
                    onClick: () => onEditTask(task),
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
                    onClick: () => onMoveTaskStatus(task.id, s.id),
                    disabled: !canMoveTask,
                  })),
                  {
                    id: "delete",
                    label: "Delete Task",
                    icon: <Trash2 className="h-3.5 w-3.5" />,
                    onClick: () => setTaskToDelete(task),
                    variant: "danger" as const,
                    disabled: !canDeleteTask,
                  },
                ];

                return (
                  <tr
                    key={task.id}
                    onClick={() => onSelectTask(task.id)}
                    className="group hover:bg-slate-50/75 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    {/* Title */}
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400 transition-colors">
                        {task.title}
                      </div>
                      {task.tags && task.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {task.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td
                      className="px-4 py-3.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        disabled={!canMoveTask}
                        value={task.statusId}
                        onChange={(e) =>
                          onMoveTaskStatus(task.id, e.target.value)
                        }
                        className="text-xs font-medium rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                      >
                        {statuses.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3.5">
                      <Badge variant="priority" priority={task.priority} />
                    </td>

                    {/* Assignee */}
                    <td className="px-4 py-3.5">
                      {assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar
                            name={assignee.name}
                            src={assignee.avatar}
                            size="xs"
                          />
                          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                            {assignee.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Unassigned
                        </span>
                      )}
                    </td>

                    {/* Due Date */}
                    <td className="px-4 py-3.5">
                      {task.dueDate ? (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 text-xs font-medium",
                            overdue
                              ? "text-rose-600 font-bold dark:text-rose-400 animate-pulse"
                              : "text-slate-600 dark:text-slate-400"
                          )}
                        >
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {formatDate(task.dueDate)}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>

                    {/* Subtasks */}
                    <td className="px-4 py-3.5">
                      {task.subtasks.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                          <CheckSquare className="h-3.5 w-3.5 text-slate-400" />
                          {completedSubtasks}/{task.subtasks.length}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td
                      className="px-4 py-3.5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu
                        align="right"
                        trigger={
                          <button className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        }
                        items={menuItems}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {paginatedTasks.map((task) => {
            const assignee = getMemberById(task.assigneeId);
            const currentStatus = statuses.find((s) => s.id === task.statusId);
            const completedSubtasks = task.subtasks.filter(
              (s) => s.completed
            ).length;
            const overdue = task.dueDate
              ? isOverdue(task.dueDate) &&
                !currentStatus?.name.toLowerCase().includes("done")
              : false;

            const otherStatuses = statuses.filter(
              (s) => s.id !== task.statusId
            );

            const menuItems = [
              {
                id: "edit",
                label: "Edit Task",
                icon: <Edit2 className="h-3.5 w-3.5" />,
                onClick: () => onEditTask(task),
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
                onClick: () => onMoveTaskStatus(task.id, s.id),
                disabled: !canMoveTask,
              })),
              {
                id: "delete",
                label: "Delete Task",
                icon: <Trash2 className="h-3.5 w-3.5" />,
                onClick: () => setTaskToDelete(task),
                variant: "danger" as const,
                disabled: !canDeleteTask,
              },
            ];

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task.id)}
                className="p-4 space-y-3 active:bg-slate-50 dark:active:bg-slate-800/50 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: currentStatus?.color }}
                      />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {currentStatus?.name}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {task.title}
                    </h4>
                  </div>

                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu
                      align="right"
                      trigger={
                        <button className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      }
                      items={menuItems}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant="priority" priority={task.priority} />
                    {task.subtasks.length > 0 && (
                      <span className="text-slate-500">
                        {completedSubtasks}/{task.subtasks.length}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {task.dueDate && (
                      <span
                        className={cn(
                          "font-medium",
                          overdue
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-slate-500"
                        )}
                      >
                        {formatDate(task.dueDate)}
                      </span>
                    )}
                    {assignee && (
                      <Avatar
                        name={assignee.name}
                        src={assignee.avatar}
                        size="xs"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={totalTasks}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setCurrentPage(1);
          }}
          pageSizeOptions={[5, 10, 20, 50]}
          itemName="tasks"
        />
      </div>

      <ConfirmDialog
        isOpen={taskToDelete !== null}
        onClose={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) {
            onDeleteTask(taskToDelete.id);
            setTaskToDelete(null);
          }
        }}
        title="Delete Task"
        description={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Task"
        variant="danger"
      />
    </>
  );
}
