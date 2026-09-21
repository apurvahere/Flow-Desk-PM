"use client";

import React from "react";
import { Form, Formik, FormikHelpers } from "formik";
import { Mail, Shield, User } from "lucide-react";
import * as Yup from "yup";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useMembers } from "@/features/members/hooks/useMembers";
import type { Role } from "@/types";

interface MemberFormValues {
  name: string;
  email: string;
  role: Role;
}

const memberValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name cannot exceed 50 characters")
    .required("Full name is required"),
  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  role: Yup.string()
    .oneOf(["admin", "member", "viewer"], "Invalid role selected")
    .required("Role is required"),
});

interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MemberFormModal({ isOpen, onClose }: MemberFormModalProps) {
  const { inviteMember } = useMembers();

  const initialValues: MemberFormValues = {
    name: "",
    email: "",
    role: "member",
  };

  const handleSubmit = (
    values: MemberFormValues,
    { resetForm, setSubmitting }: FormikHelpers<MemberFormValues>
  ) => {
    const success = inviteMember({
      name: values.name.trim(),
      email: values.email.trim(),
      role: values.role,
    });

    setSubmitting(false);
    if (success) {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Invite Team Member"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={memberValidationSchema}
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
            {/* Full Name */}
            <div>
              <label
                htmlFor="member-name"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Full Name <span className="text-rose-500">*</span>
              </label>
              <Input
                id="member-name"
                name="name"
                placeholder="e.g. Sarah Connor"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && errors.name ? errors.name : undefined}
                prefixIcon={<User className="h-4 w-4" />}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="member-email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Email Address <span className="text-rose-500">*</span>
              </label>
              <Input
                id="member-email"
                name="email"
                type="email"
                placeholder="sarah@example.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email ? errors.email : undefined}
                prefixIcon={<Mail className="h-4 w-4" />}
              />
            </div>

            {/* Role Select */}
            <div>
              <label
                htmlFor="member-role"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5"
              >
                <Shield className="h-3.5 w-3.5 text-slate-400" />
                Workspace Role <span className="text-rose-500">*</span>
              </label>
              <select
                id="member-role"
                name="role"
                value={values.role}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 cursor-pointer"
              >
                <option value="member">
                  Member (Can edit tasks and create content)
                </option>
                <option value="admin">
                  Admin (Full workspace access & team management)
                </option>
                <option value="viewer">
                  Viewer (Read-only access to all dashboards)
                </option>
              </select>
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
                Send Invitation
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
