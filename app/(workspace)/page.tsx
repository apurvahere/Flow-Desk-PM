"use client";

import React, { Suspense, useState } from "react";
import { Calendar, CheckCircle2, Clock, Layers, Plus } from "lucide-react";

import { ViewSwitcher } from "@/components/layout/ViewSwitcher";
import { Button } from "@/components/ui/Button";
import { useWorkspace } from "@/context/WorkspaceContext";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { TaskBoardView } from "@/features/tasks/components/TaskBoardView";
import { TaskDetailDrawer } from "@/features/tasks/components/TaskDetailDrawer";
import { TaskFilters } from "@/features/tasks/components/TaskFilters";
import { TaskFormModal } from "@/features/tasks/components/TaskFormModal";
import { TaskListView } from "@/features/tasks/components/TaskListView";
import { useTaskFilters } from "@/features/tasks/hooks/useTaskFilters";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import type { Task } from "@/types";

function TasksDashboardContent() {
  const { viewMode, setViewMode, setSelectedTaskId } = useWorkspace();
  const {
    filters,
    setSearch,
    setPriority,
    setAssigneeId,
    setStatusId,
    setSort,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
    filterAndSortTasks,
  } = useTaskFilters();

  const { tasks, statuses, deleteTask, moveTaskStatus } = useTasks();

  const { canCreateTask } = usePermissions();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [defaultStatusId, setDefaultStatusId] = useState<string | undefined>();

  const filteredTasks = filterAndSortTasks(tasks);

  const handleOpenCreate = (statusId?: string) => {
    setTaskToEdit(null);
    setDefaultStatusId(statusId);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsFormModalOpen(true);
  };

  const completedCount = tasks.filter((t) => {
    const status = statuses.find((s) => s.id === t.statusId);
    return (
      status?.name.toLowerCase().includes("done") ||
      status?.name.toLowerCase().includes("completed")
    );
  }).length;

  return (
    <div className="space-y-6">
      {/* Top Header & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Project Tasks
            </h1>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-100 px-2 text-xs font-bold text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
              {filteredTasks.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Organize, track, and complete your sprint deliverables.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <ViewSwitcher viewMode={viewMode} onChange={setViewMode} />

          {canCreateTask && (
            <Button
              size="sm"
              onClick={() => handleOpenCreate()}
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Create Task</span>
            </Button>
          )}
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">
              Total Tasks
            </p>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              {tasks.length}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Completed</p>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              {completedCount}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">
              Urgent Priority
            </p>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              {tasks.filter((t) => t.priority === "urgent").length}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">
              Active Columns
            </p>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              {statuses.length}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <TaskFilters
        filters={filters}
        onSearchChange={setSearch}
        onPriorityChange={setPriority}
        onAssigneeChange={setAssigneeId}
        onStatusChange={setStatusId}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* workspace Kanban Board or List View */}
      <div className="min-h-[400px]">
        {viewMode === "board" ? (
          <TaskBoardView
            statuses={statuses}
            tasks={filteredTasks}
            onSelectTask={setSelectedTaskId}
            onEditTask={handleOpenEdit}
            onDeleteTask={deleteTask}
            onMoveStatus={moveTaskStatus}
            onQuickAdd={(statusId) => handleOpenCreate(statusId)}
          />
        ) : (
          <TaskListView
            tasks={filteredTasks}
            sortField={filters.sort}
            sortDir={filters.sortDir}
            onSort={(field) => setSort(field)}
            onSelectTask={setSelectedTaskId}
            onEditTask={handleOpenEdit}
            onDeleteTask={deleteTask}
            onMoveTaskStatus={moveTaskStatus}
          />
        )}
      </div>

      {/* Task add/edit modal */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setTaskToEdit(null);
          setDefaultStatusId(undefined);
        }}
        taskToEdit={taskToEdit}
        defaultStatusId={defaultStatusId}
      />

      {/* Task detail drawer */}
      <TaskDetailDrawer onEditTask={handleOpenEdit} />
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      }
    >
      <TasksDashboardContent />
    </Suspense>
  );
}
