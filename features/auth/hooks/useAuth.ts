"use client";

import { useWorkspace } from "@/context/WorkspaceContext";

export function useAuth() {
  const { currentUser, activeRole, login, logout, switchUser } = useWorkspace();

  return {
    currentUser,
    activeRole,
    isAuthenticated: currentUser !== null,
    login,
    logout,
    switchUser,
  };
}
