"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { MobileNav } from "@/components/layout/MobileNav";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { TaskFormModal } from "@/features/tasks/components/TaskFormModal";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { isHydrated } = useWorkspace();
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  useEffect(() => {
    if (isHydrated && !currentUser) {
      router.push("/login");
    }
  }, [isHydrated, currentUser, router]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#090d16]">
      {/* Mobile Drawer Navigation */}
      <MobileNav />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onOpenCreateTask={() => setIsCreateTaskOpen(true)} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto w-full">{children}</div>
          </main>
        </div>
      </div>

      {/* Global Quick Task Creation Modal */}
      <TaskFormModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
      />
    </div>
  );
}
