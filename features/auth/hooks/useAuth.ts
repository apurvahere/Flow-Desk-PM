"use client";

import { useWorkspace } from "@/context/WorkspaceContext";

export function useAuth() {
  const { currentUser, activeRole, login, logout, switchPersona } =
    useWorkspace();

  return {
    currentUser,
    activeRole,
    isAuthenticated: currentUser !== null,
    login,
    logout,
    switchPersona,
  };
}
