import type { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign In — Flowdesk",
  description: "Sign in to Flowdesk project management platform.",
};

export default function LoginPage() {
  return (
    <main className="w-full flex-1 min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-100 dark:from-[#090d16] dark:via-[#0f172a] dark:to-[#090d16]">
      <LoginForm />
    </main>
  );
}
