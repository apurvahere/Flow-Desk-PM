"use client";

import React from "react";
import { Form, Formik, FormikHelpers } from "formik";
import { AlertTriangle } from "lucide-react";
import * as Yup from "yup";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useStatuses } from "@/features/statuses/hooks/useStatuses";
import type { Status } from "@/types";

interface MigrationFormValues {
  destinationStatusId: string;
}

const migrationValidationSchema = Yup.object().shape({
  destinationStatusId: Yup.string().required(
    "Please choose a destination status"
  ),
});

interface StatusDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  statusToDelete: Status | null;
}

export function StatusDeleteModal({
  isOpen,
  onClose,
  statusToDelete,
}: StatusDeleteModalProps) {
  const { statusTaskCounts, getFallbackStatuses, deleteStatus } = useStatuses();

  if (!statusToDelete) return null;

  const fallbackStatuses = getFallbackStatuses(statusToDelete.id);
  const taskCount = statusTaskCounts[statusToDelete.id] || 0;

  const handleSubmit = (
    values: MigrationFormValues,
    { setSubmitting }: FormikHelpers<MigrationFormValues>
  ) => {
    const success = deleteStatus(statusToDelete.id, values.destinationStatusId);
    setSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
          <AlertTriangle className="h-5 w-5" />
          <span>Delete Workflow Status</span>
        </div>
      }
    >
      <Formik
        initialValues={{
          destinationStatusId: fallbackStatuses[0]?.id || "",
        }}
        validationSchema={migrationValidationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
          <Form className="space-y-4">
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
              <p className="font-semibold">
                You are deleting status &quot;{statusToDelete.name}&quot;
              </p>
              {taskCount > 0 ? (
                <p className="mt-1">
                  There are currently <strong>{taskCount} task(s)</strong> in
                  this status. Choose a destination status to migrate these
                  tasks to so no data is lost.
                </p>
              ) : (
                <p className="mt-1">
                  There are no tasks currently in this status. It can be safely
                  deleted.
                </p>
              )}
            </div>

            {taskCount > 0 && (
              <div>
                <label
                  htmlFor="destination-status"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Migrate existing tasks to:{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <select
                  id="destination-status"
                  name="destinationStatusId"
                  value={values.destinationStatusId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 cursor-pointer"
                >
                  {fallbackStatuses.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {touched.destinationStatusId && errors.destinationStatusId && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.destinationStatusId}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                isLoading={isSubmitting}
                disabled={fallbackStatuses.length === 0}
              >
                Delete & Migrate
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
