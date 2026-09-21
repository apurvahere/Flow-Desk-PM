import type { PermissionAction, PermissionsState, Role } from "@/types";

const ROLE_PERMISSIONS: Record<Role, Record<PermissionAction, boolean>> = {
  admin: {
    create_task: true,
    edit_task: true,
    delete_task: true,
    move_task: true,
    manage_subtask: true,
    add_comment: true,
    manage_statuses: true,
    delete_status: true,
    invite_member: true,
    change_member_role: true,
    remove_member: true,
  },
  member: {
    create_task: true,
    edit_task: true,
    delete_task: false,
    move_task: true,
    manage_subtask: true,
    add_comment: true,
    manage_statuses: false,
    delete_status: false,
    invite_member: false,
    change_member_role: false,
    remove_member: false,
  },
  viewer: {
    create_task: false,
    edit_task: false,
    delete_task: false,
    move_task: false,
    manage_subtask: false,
    add_comment: false,
    manage_statuses: false,
    delete_status: false,
    invite_member: false,
    change_member_role: false,
    remove_member: false,
  },
};

export function hasPermission(role: Role, action: PermissionAction): boolean {
  return ROLE_PERMISSIONS[role]?.[action] ?? false;
}

export function getRolePermissions(role: Role): PermissionsState {
  return {
    canCreateTask: hasPermission(role, "create_task"),
    canEditTask: hasPermission(role, "edit_task"),
    canDeleteTask: hasPermission(role, "delete_task"),
    canMoveTask: hasPermission(role, "move_task"),
    canManageSubtasks: hasPermission(role, "manage_subtask"),
    canAddComment: hasPermission(role, "add_comment"),
    canManageStatuses: hasPermission(role, "manage_statuses"),
    canDeleteStatus: hasPermission(role, "delete_status"),
    canInviteMember: hasPermission(role, "invite_member"),
    canChangeMemberRole: hasPermission(role, "change_member_role"),
    canRemoveMember: hasPermission(role, "remove_member"),
  };
}
