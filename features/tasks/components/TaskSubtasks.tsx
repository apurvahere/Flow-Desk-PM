"use client";

import React from "react";
import { Form, Formik, FormikHelpers } from "formik";
import { Check, CheckSquare, Plus, Trash2 } from "lucide-react";
import * as Yup from "yup";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { cn } from "@/lib/utils";
import type { Subtask } from "@/types";

interface SubtaskFormValues {
  title: string;
}

const subtaskValidationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .min(2, "Subtask must be at least 2 characters")
    .max(120, "Subtask cannot exceed 120 characters")
    .required("Subtask title is required"),
});

interface TaskSubtasksProps {
  subtasks: Subtask[];
  onToggle: (id: string) => void;
  onAdd: (title: string) => void;
  onDelete: (id: string) => void;
}

export function TaskSubtasks({
  subtasks,
  onToggle,
  onAdd,
  onDelete,
}: TaskSubtasksProps) {
  const { canManageSubtasks } = usePermissions();

  const completedCount = subtasks.filter((s) => s.completed).length;
  const totalCount = subtasks.length;
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAddSubtask = (
    values: SubtaskFormValues,
    { resetForm, setSubmitting }: FormikHelpers<SubtaskFormValues>
  ) => {
    onAdd(values.title.trim());
    resetForm();
    setSubmitting(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          <span className="flex items-center gap-1.5">
            <CheckSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Subtasks
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            {completedCount} of {totalCount} completed ({percentage}%)
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-indigo-600 transition-all duration-300 dark:bg-indigo-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Subtasks List */}
      <div className="space-y-1.5">
        {subtasks.length === 0 ? (
          <p className="py-2 text-xs italic text-slate-400 dark:text-slate-500">
            No subtasks added yet.
          </p>
        ) : (
          subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2 transition-all hover:bg-slate-100/70 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:bg-slate-800/50"
            >
              <label
                className={cn(
                  "flex flex-1 items-center gap-2.5 text-xs font-medium transition-colors cursor-pointer select-none",
                  !canManageSubtasks && "cursor-not-allowed opacity-80",
                  subtask.completed
                    ? "text-slate-400 line-through dark:text-slate-500"
                    : "text-slate-800 dark:text-slate-200"
                )}
              >
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  disabled={!canManageSubtasks}
                  onChange={() => onToggle(subtask.id)}
                  className="hidden"
                />
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                    subtask.completed
                      ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500"
                      : "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900"
                  )}
                >
                  {subtask.completed && (
                    <Check className="h-3 w-3 stroke-[3]" />
                  )}
                </span>
                <span>{subtask.title}</span>
              </label>

              {canManageSubtasks && (
                <button
                  type="button"
                  onClick={() => onDelete(subtask.id)}
                  className="rounded p-1 text-slate-400 opacity-0 transition-opacity hover:bg-slate-200 hover:text-rose-600 group-hover:opacity-100 dark:hover:bg-slate-800 dark:hover:text-rose-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Subtask Form */}
      {canManageSubtasks && (
        <Formik
          initialValues={{ title: "" }}
          validationSchema={subtaskValidationSchema}
          onSubmit={handleAddSubtask}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            handleChange,
            handleBlur,
          }) => (
            <Form className="space-y-1">
              <div className="flex gap-2">
                <Input
                  name="title"
                  placeholder="Add a new checklist item..."
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.title && errors.title ? errors.title : undefined
                  }
                  className="h-9 text-xs"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="secondary"
                  disabled={!values.title.trim() || isSubmitting}
                  isLoading={isSubmitting}
                  className="shrink-0 h-9"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}
