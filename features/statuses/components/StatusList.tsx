"use client";

import React, { useState } from "react";
import { ArrowDown, ArrowUp, Edit2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { useStatuses } from "@/features/statuses/hooks/useStatuses";
import type { Status } from "@/types";

import { StatusDeleteModal } from "./StatusDeleteModal";
import { StatusFormModal } from "./StatusFormModal";

export function StatusList() {
  const {
    statuses,
    statusTaskCounts,
    moveStatusUp,
    moveStatusDown,
    canDeleteMore,
  } = useStatuses();
  const { canManageStatuses, canDeleteStatus } = usePermissions();

  const [editingStatus, setEditingStatus] = useState<Status | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [statusToDelete, setStatusToDelete] = useState<Status | null>(null);

  const handleOpenCreate = () => {
    setEditingStatus(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (status: Status) => {
    setEditingStatus(status);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Workflow Statuses
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Customize column order and color tags for your task board.
          </p>
        </div>

        {canManageStatuses && (
          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="gap-1.5 text-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Status</span>
          </Button>
        )}
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/80 rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {statuses.map((status, index) => {
          const taskCount = statusTaskCounts[status.id] || 0;
          const isFirst = index === 0;
          const isLast = index === statuses.length - 1;

          return (
            <div
              key={status.id}
              className="flex items-center justify-between p-4 transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
            >
              {/* Left: Reorder Arrows & Status Chip */}
              <div className="flex items-center gap-3">
                {canManageStatuses ? (
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => moveStatusUp(index)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-800 disabled:opacity-30 dark:hover:bg-slate-700 cursor-pointer disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => moveStatusDown(index)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-800 disabled:opacity-30 dark:hover:bg-slate-700 cursor-pointer disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="w-5 text-center text-xs font-bold text-slate-400">
                    {index + 1}
                  </span>
                )}

                <div className="flex items-center gap-2.5">
                  <span
                    className="h-3.5 w-3.5 rounded-full ring-2 ring-white dark:ring-slate-800 shrink-0"
                    style={{ backgroundColor: status.color }}
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {status.name}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {taskCount} {taskCount === 1 ? "task" : "tasks"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-1.5">
                {canManageStatuses && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(status)}
                    className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600 rounded-lg"
                    title="Edit status"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}

                {canDeleteStatus && (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!canDeleteMore}
                    onClick={() => setStatusToDelete(status)}
                    className="h-8 w-8 p-0 text-slate-500 hover:text-rose-600 rounded-lg disabled:opacity-30"
                    title={
                      canDeleteMore
                        ? "Delete status"
                        : "Cannot delete the only status"
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      <StatusFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingStatus(null);
        }}
        statusToEdit={editingStatus}
      />

      {/* Delete / Migration Modal */}
      <StatusDeleteModal
        isOpen={statusToDelete !== null}
        onClose={() => setStatusToDelete(null)}
        statusToDelete={statusToDelete}
      />
    </div>
  );
}
