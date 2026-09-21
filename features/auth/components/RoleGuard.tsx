"use client";

import React from "react";

import { usePermissions } from "@/features/auth/hooks/usePermissions";
import type { PermissionAction } from "@/types";

interface RoleGuardProps {
  action: PermissionAction;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({
  action,
  children,
  fallback = null,
}: RoleGuardProps) {
  const { checkPermission } = usePermissions();

  if (!checkPermission(action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
