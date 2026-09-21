"use client";

import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { DEMO_PERSONAS } from "@/lib/seedData";
import type { Role, User } from "@/types";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  password: Yup.string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [quickLoggingInRole, setQuickLoggingInRole] = useState<Role | null>(
    null
  );

  const handleQuickLogin = (role: Role) => {
    const persona =
      DEMO_PERSONAS.find((p) => p.role === role) || DEMO_PERSONAS[0];
    setQuickLoggingInRole(role);
    login(persona);
    router.push("/");
  };

  const handleFormSubmit = (
    values: { email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const foundPersona = DEMO_PERSONAS.find(
      (p) => p.email.toLowerCase() === values.email.toLowerCase().trim()
    );

    if (foundPersona) {
      login(foundPersona);
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: values.email.split("@")[0] || "Team Member",
        email: values.email.trim(),
        role: "member",
      };
      login(newUser);
    }

    setSubmitting(false);
    router.push("/");
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 sm:py-10">
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-xl shadow-indigo-500/5 backdrop-blur-xl p-6 sm:p-8 transition-all">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-13 w-13 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25 mb-3.5 transition-transform hover:scale-105">
            <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome to Flowdesk
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Role-based project management workspace for fast-moving product
            teams.
          </p>
        </div>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={LoginSchema}
          onSubmit={handleFormSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              {/* Email field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <Field
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="email"
                    placeholder="name@company.com"
                    className={`w-full rounded-xl border bg-white dark:bg-slate-950/60 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-150 focus:outline-none focus:ring-2 disabled:opacity-50 ${
                      errors.email && touched.email
                        ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                        : "border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 dark:focus:border-indigo-400"
                    }`}
                  />
                </div>
                {errors.email && touched.email && (
                  <p className="mt-1.5 text-xs font-medium text-rose-500 dark:text-rose-400">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Demo: any 4+ chars
                  </span>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className={`w-full rounded-xl border bg-white dark:bg-slate-950/60 pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-150 focus:outline-none focus:ring-2 disabled:opacity-50 ${
                      errors.password && touched.password
                        ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                        : "border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 dark:focus:border-indigo-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="mt-1.5 text-xs font-medium text-rose-500 dark:text-rose-400">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                className="w-full mt-2 font-semibold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30"
              >
                Sign In to Workspace
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Form>
          )}
        </Formik>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 dark:text-slate-500 font-medium tracking-wider">
              Or quick login as
            </span>
          </div>
        </div>

        {/* Quick Login Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => handleQuickLogin("admin")}
            disabled={quickLoggingInRole !== null}
            isLoading={quickLoggingInRole === "admin"}
            className="w-full font-medium hover:border-violet-400 hover:bg-violet-50/50 dark:hover:bg-violet-950/30 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
          >
            <Shield className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
            Admin
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => handleQuickLogin("member")}
            disabled={quickLoggingInRole !== null}
            isLoading={quickLoggingInRole === "member"}
            className="w-full font-medium hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            Member
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => handleQuickLogin("viewer")}
            disabled={quickLoggingInRole !== null}
            isLoading={quickLoggingInRole === "viewer"}
            className="w-full font-medium hover:border-sky-400 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
          >
            <Eye className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
            Viewer
          </Button>
        </div>
      </div>
    </div>
  );
}
