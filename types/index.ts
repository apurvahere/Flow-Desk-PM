export type Role = "admin" | "member" | "viewer";

export type Priority = "low" | "medium" | "high" | "urgent";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Status {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  createdAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export type ActivityAction =
  | "created"
  | "updated"
  | "status_changed"
  | "subtask_toggled"
  | "subtask_added"
  | "subtask_deleted"
  | "comment_added"
  | "assigned";

export interface Activity {
  id: string;
  taskId: string;
  authorId: string;
  action: ActivityAction;
  description: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  statusId: string;
  priority: Priority;
  assigneeId?: string;
  dueDate?: string;
  subtasks: Subtask[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type SortField = "dueDate" | "priority" | "createdAt" | "title";
export type SortDirection = "asc" | "desc";

export interface FilterState {
  search: string;
  priority: Priority | "all";
  assigneeId: string | "all";
  statusId: string | "all";
  sort: SortField;
  sortDir: SortDirection;
}

export type ViewMode = "board" | "list";

export type PermissionAction =
  | "create_task"
  | "edit_task"
  | "delete_task"
  | "move_task"
  | "manage_subtask"
  | "add_comment"
  | "manage_statuses"
  | "delete_status"
  | "invite_member"
  | "change_member_role"
  | "remove_member";

export interface PermissionsState {
  canCreateTask: boolean;
  canEditTask: boolean;
  canDeleteTask: boolean;
  canMoveTask: boolean;
  canManageSubtasks: boolean;
  canAddComment: boolean;
  canManageStatuses: boolean;
  canDeleteStatus: boolean;
  canInviteMember: boolean;
  canChangeMemberRole: boolean;
  canRemoveMember: boolean;
}
