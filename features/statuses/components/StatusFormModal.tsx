"use client";

import React from "react";
import { Form, Formik, FormikHelpers } from "formik";
import { Palette, Tag } from "lucide-react";
import * as Yup from "yup";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useStatuses } from "@/features/statuses/hooks/useStatuses";
import type { Status } from "@/types";

const PRESET_COLORS = [
  "#64748b", // Slate
  "#f59e0b", // Amber
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#f43f5e", // Rose
  "#06b6d4", // Cyan
];

interface StatusFormValues {
  name: string;
  color: string;
}

const statusValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, "Status name must be at least 2 characters")
    .max(30, "Status name cannot exceed 30 characters")
    .required("Status name is required"),
  color: Yup.string()
    .matches(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Must be a valid hex color code"
    )
    .required("Color is required"),
});

interface StatusFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  statusToEdit?: Status | null;
}

export function StatusFormModal({
  isOpen,
  onClose,
  statusToEdit,
}: StatusFormModalProps) {
  const { createStatus, updateStatus } = useStatuses();
  const isEditing = !!statusToEdit;

  const initialValues: StatusFormValues = {
    name: statusToEdit?.name || "",
    color: statusToEdit?.color || PRESET_COLORS[0],
  };

  const handleSubmit = (
    values: StatusFormValues,
    { setSubmitting }: FormikHelpers<StatusFormValues>
  ) => {
    let success = false;
    if (isEditing && statusToEdit) {
      success = updateStatus(statusToEdit.id, {
        name: values.name.trim(),
        color: values.color,
      });
    } else {
      success = createStatus({
        name: values.name.trim(),
        color: values.color,
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
      size="md"
      title={isEditing ? "Edit Workflow Status" : "Create Workflow Status"}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={statusValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          isSubmitting,
        }) => (
          <Form className="space-y-4">
            {/* Status Name */}
            <div>
              <label
                htmlFor="status-name"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Status Name <span className="text-rose-500">*</span>
              </label>
              <Input
                id="status-name"
                name="name"
                placeholder="e.g. In Review, QA Testing"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && errors.name ? errors.name : undefined}
                prefixIcon={<Tag className="h-4 w-4" />}
              />
            </div>

            {/* Color Palette Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-slate-400" />
                Color Theme
              </label>

              <div className="flex flex-wrap gap-2 mb-3">
                {PRESET_COLORS.map((color) => {
                  const isSelected =
                    values.color.toLowerCase() === color.toLowerCase();
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFieldValue("color", color)}
                      className={`h-7 w-7 rounded-full transition-transform cursor-pointer ${
                        isSelected
                          ? "ring-2 ring-indigo-500 ring-offset-2 scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  );
                })}
              </div>

              {/* Custom Hex input */}
              <div className="flex items-center gap-2">
                <div
                  className="h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0"
                  style={{ backgroundColor: values.color }}
                />
                <Input
                  name="color"
                  placeholder="#6366f1"
                  value={values.color}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.color && errors.color ? errors.color : undefined
                  }
                  className="font-mono text-xs"
                />
              </div>
            </div>

            {/* Live Preview */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Live Preview:</span>
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                style={{
                  color: values.color,
                  borderColor: `${values.color}40`,
                  backgroundColor: `${values.color}15`,
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: values.color }}
                />
                {values.name.trim() || "Status Name"}
              </span>
            </div>

            {/* Actions */}
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
                {isEditing ? "Save Changes" : "Create Status"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
