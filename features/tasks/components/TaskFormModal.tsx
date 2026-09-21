"use client";

import React from "react";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { Calendar, Tag, User } from "lucide-react";
import * as Yup from "yup";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useWorkspace } from "@/context/WorkspaceContext";
import type { Priority, Task } from "@/types";

export interface TaskFormValues {
  title: string;
  description: string;
  statusId: string;
  priority: Priority;
  assigneeId: string;
  dueDate: string;
  tagsString: string;
}

const taskValidationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .min(2, "Task title must be at least 2 characters")
    .max(100, "Task title must not exceed 100 characters")
    .required("Task title is required"),
  description: Yup.string()
    .max(1000, "Description cannot exceed 1000 characters")
    .default(""),
  statusId: Yup.string().required("Please select a status"),
  priority: Yup.string()
    .oneOf(["low", "medium", "high", "urgent"], "Invalid priority level")
    .required("Priority is required"),
  assigneeId: Yup.string().default(""),
  dueDate: Yup.string().default(""),
  tagsString: Yup.string().max(150, "Tags string is too long").default(""),
});

export interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  defaultStatusId?: string;
}

export function TaskFormModal({
  isOpen,
  onClose,
  taskToEdit,
  defaultStatusId,
}: TaskFormModalProps) {
  const { statuses, members, createTask, updateTask } = useWorkspace();

  const isEditing = !!taskToEdit;

  const initialValues: TaskFormValues = {
    title: taskToEdit?.title || "",
    description: taskToEdit?.description || "",
    statusId:
      taskToEdit?.statusId ||
      defaultStatusId ||
      statuses[0]?.id ||
      "status-backlog",
    priority: taskToEdit?.priority || "medium",
    assigneeId: taskToEdit?.assigneeId || "",
    dueDate: taskToEdit?.dueDate || "",
    tagsString: taskToEdit?.tags?.join(", ") || "",
  };

  const handleSubmit = (
    values: TaskFormValues,
    { setSubmitting }: FormikHelpers<TaskFormValues>
  ) => {
    const parsedTags = values.tagsString
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    let success = false;

    if (isEditing && taskToEdit) {
      success = updateTask(taskToEdit.id, {
        title: values.title.trim(),
        description: values.description.trim(),
        statusId: values.statusId,
        priority: values.priority,
        assigneeId: values.assigneeId || undefined,
        dueDate: values.dueDate || undefined,
        tags: parsedTags,
      });
    } else {
      success = createTask({
        title: values.title.trim(),
        description: values.description.trim(),
        statusId: values.statusId,
        priority: values.priority,
        assigneeId: values.assigneeId || undefined,
        dueDate: values.dueDate || undefined,
        tags: parsedTags,
      });
    }

    setSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Task" : "Create New Task"}
      size="lg"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={taskValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          handleChange,
          handleBlur,
        }) => (
          <Form className="space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="task-title"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Task Title <span className="text-rose-500">*</span>
              </label>
              <Field
                id="task-title"
                name="title"
                type="text"
                placeholder="e.g. Design auth & onboarding screens"
                className={`w-full rounded-xl border bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-none focus:ring-2 disabled:opacity-50 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                  errors.title && touched.title
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 dark:focus:border-indigo-400"
                }`}
              />
              <ErrorMessage
                name="title"
                component="p"
                className="mt-1 text-xs text-rose-500 dark:text-rose-400"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="task-description"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Description
              </label>
              <Field
                as="textarea"
                id="task-description"
                name="description"
                rows={3}
                placeholder="Add context, acceptance criteria, or notes..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 resize-none"
              />
              <ErrorMessage
                name="description"
                component="p"
                className="mt-1 text-xs text-rose-500 dark:text-rose-400"
              />
            </div>

            {/* Status & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="task-status"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Status <span className="text-rose-500">*</span>
                </label>
                <select
                  id="task-status"
                  name="statusId"
                  value={values.statusId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 cursor-pointer"
                >
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
                <ErrorMessage
                  name="statusId"
                  component="p"
                  className="mt-1 text-xs text-rose-500"
                />
              </div>

              <div>
                <label
                  htmlFor="task-priority"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Priority <span className="text-rose-500">*</span>
                </label>
                <select
                  id="task-priority"
                  name="priority"
                  value={values.priority}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 cursor-pointer"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <ErrorMessage
                  name="priority"
                  component="p"
                  className="mt-1 text-xs text-rose-500"
                />
              </div>
            </div>

            {/* Assignee & Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="task-assignee"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  Assignee
                </label>
                <select
                  id="task-assignee"
                  name="assigneeId"
                  value={values.assigneeId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 cursor-pointer"
                >
                  <option value="">Unassigned</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="task-duedate"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5"
                >
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Due Date
                </label>
                <Field
                  id="task-duedate"
                  name="dueDate"
                  type="date"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Tags Input */}
            <div>
              <label
                htmlFor="task-tags"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5"
              >
                <Tag className="h-3.5 w-3.5 text-slate-400" />
                Tags (comma separated)
              </label>
              <Field
                id="task-tags"
                name="tagsString"
                type="text"
                placeholder="e.g. Design, Frontend, MVP"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                {isEditing ? "Save Changes" : "Create Task"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
