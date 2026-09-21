"use client";

import { useWorkspace } from "@/context/WorkspaceContext";
import {
  getRolePermissions,
  hasPermission,
} from "@/features/auth/utils/permissions";
import type { PermissionAction } from "@/types";

export function usePermissions() {
  const { activeRole } = useWorkspace();

  const permissions = getRolePermissions(activeRole);

  const checkPermission = (action: PermissionAction) => {
    return hasPermission(activeRole, action);
  };

  return {
    ...permissions,
    role: activeRole,
    checkPermission,
  };
}
