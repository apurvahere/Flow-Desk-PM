"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

import { hasPermission } from "@/features/auth/utils/permissions";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  DEMO_USERS,
  INITIAL_ACTIVITIES,
  INITIAL_COMMENTS,
  INITIAL_MEMBERS,
  INITIAL_STATUSES,
  INITIAL_TASKS,
} from "@/lib/seedData";
import { generateId } from "@/lib/utils";
import type {
  Activity,
  Comment,
  Member,
  Priority,
  Role,
  Status,
  Subtask,
  Task,
  User,
  ViewMode,
} from "@/types";

interface WorkspaceContextType {
  // Auth Session State
  currentUser: User | null;
  activeRole: Role;
  login: (user: User) => void;
  logout: () => void;
  switchUser: (role: Role) => void;

  // Workspace State
  tasks: Task[];
  statuses: Status[];
  members: Member[];
  activities: Activity[];
  comments: Comment[];
  viewMode: ViewMode;
  selectedTaskId: string | null;
  isMobileNavOpen: boolean;
  isHydrated: boolean;

  // Setters
  setViewMode: (mode: ViewMode) => void;
  setSelectedTaskId: (id: string | null) => void;
  setIsMobileNavOpen: (isOpen: boolean) => void;

  // Task Mutations
  createTask: (data: {
    title: string;
    description: string;
    statusId: string;
    priority: Priority;
    assigneeId?: string;
    dueDate?: string;
    tags?: string[];
  }) => boolean;
  updateTask: (taskId: string, updates: Partial<Task>) => boolean;
  deleteTask: (taskId: string) => boolean;
  moveTaskStatus: (taskId: string, newStatusId: string) => boolean;

  // Status Mutations
  createStatus: (data: { name: string; color: string }) => boolean;
  updateStatus: (
    statusId: string,
    updates: { name?: string; color?: string; order?: number }
  ) => boolean;
  reorderStatuses: (newStatuses: Status[]) => boolean;
  deleteStatus: (statusId: string, fallbackStatusId: string) => boolean;

  // Member Mutations
  inviteMember: (data: { name: string; email: string; role: Role }) => boolean;
  updateMemberRole: (memberId: string, role: Role) => boolean;
  removeMember: (memberId: string) => boolean;

  // Subtask & Comment Mutations
  addSubtask: (taskId: string, title: string) => boolean;
  toggleSubtask: (taskId: string, subtaskId: string) => boolean;
  deleteSubtask: (taskId: string, subtaskId: string) => boolean;
  addComment: (taskId: string, content: string) => boolean;

  // Demo Reset
  resetToSampleData: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  // Session User
  const [currentUser, setCurrentUser, userHydrated] =
    useLocalStorage<User | null>("flowdesk_auth_user_v2", DEMO_USERS[0]);

  // Tasks, Statuses, Members, Activities, Comments
  const [tasks, setTasks, tasksHydrated] = useLocalStorage<Task[]>(
    "flowdesk_tasks_v2",
    INITIAL_TASKS
  );
  const [statuses, setStatuses, statusesHydrated] = useLocalStorage<Status[]>(
    "flowdesk_statuses_v2",
    INITIAL_STATUSES
  );
  const [members, setMembers, membersHydrated] = useLocalStorage<Member[]>(
    "flowdesk_members_v2",
    INITIAL_MEMBERS
  );
  const [activities, setActivities, activitiesHydrated] = useLocalStorage<
    Activity[]
  >("flowdesk_activities_v2", INITIAL_ACTIVITIES);
  const [comments, setComments, commentsHydrated] = useLocalStorage<Comment[]>(
    "flowdesk_comments_v2",
    INITIAL_COMMENTS
  );

  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const isHydrated =
    userHydrated &&
    tasksHydrated &&
    statusesHydrated &&
    membersHydrated &&
    activitiesHydrated &&
    commentsHydrated;

  const activeRole: Role = currentUser?.role || "viewer";

  // Auth actions
  const login = useCallback(
    (user: User) => {
      setCurrentUser(user);
      setMembers((prevMembers) => {
        const existingIndex = prevMembers.findIndex(
          (m) =>
            m.id === user.id ||
            m.email.toLowerCase() === user.email.toLowerCase()
        );
        if (existingIndex >= 0) {
          const updated = [...prevMembers];
          updated[existingIndex] = {
            ...updated[existingIndex],
            name: user.name,
            role: user.role,
            email: user.email,
          };
          return updated;
        } else {
          const newMember: Member = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: new Date().toISOString(),
          };
          return [...prevMembers, newMember];
        }
      });
      toast.success(`Logged in as ${user.name} (${user.role.toUpperCase()})`);
    },
    [setCurrentUser, setMembers]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    toast.success("Logged out successfully");
  }, [setCurrentUser]);

  const switchUser = useCallback(
    (role: Role) => {
      const targetUser =
        DEMO_USERS.find((p) => p.role === role) || DEMO_USERS[0];
      login(targetUser);
    },
    [login]
  );

  useEffect(() => {
    if (isHydrated && currentUser) {
      setMembers((prevMembers) => {
        const existingIndex = prevMembers.findIndex(
          (m) =>
            m.id === currentUser.id ||
            m.email.toLowerCase() === currentUser.email.toLowerCase()
        );
        if (existingIndex < 0) {
          const newMember: Member = {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role,
            createdAt: new Date().toISOString(),
          };
          return [...prevMembers, newMember];
        }
        return prevMembers;
      });
    }
  }, [isHydrated, currentUser, setMembers]);

  const logActivity = useCallback(
    (taskId: string, action: Activity["action"], description: string): void => {
      const authorId = currentUser?.id || "user-admin";
      const newActivity: Activity = {
        id: generateId(),
        taskId,
        authorId,
        action,
        description,
        timestamp: new Date().toISOString(),
      };
      setActivities((prev) => [newActivity, ...prev]);
    },
    [currentUser?.id, setActivities]
  );

  // Task Mutations
  const createTask = useCallback(
    (data: {
      title: string;
      description: string;
      statusId: string;
      priority: Priority;
      assigneeId?: string;
      dueDate?: string;
      tags?: string[];
    }): boolean => {
      if (!hasPermission(activeRole, "create_task")) {
        toast.error("Permission Denied: Your role cannot create tasks.");
        return false;
      }

      const now = new Date().toISOString();
      const newTask: Task = {
        id: `task-${generateId()}`,
        title: data.title.trim(),
        description: data.description.trim(),
        statusId: data.statusId,
        priority: data.priority,
        assigneeId: data.assigneeId || undefined,
        dueDate: data.dueDate || undefined,
        tags: data.tags || [],
        subtasks: [],
        createdAt: now,
        updatedAt: now,
      };

      setTasks((prev) => [newTask, ...prev]);
      logActivity(newTask.id, "created", "created this task");
      toast.success(`Task "${newTask.title}" created!`);
      return true;
    },
    [activeRole, setTasks, logActivity]
  );

  const updateTask = useCallback(
    (taskId: string, updates: Partial<Task>): boolean => {
      if (!hasPermission(activeRole, "edit_task")) {
        toast.error("Permission Denied: Your role cannot edit tasks.");
        return false;
      }

      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              ...updates,
              updatedAt: new Date().toISOString(),
            };
          }
          return t;
        })
      );

      logActivity(taskId, "updated", "updated task details");
      toast.success("Task updated successfully");
      return true;
    },
    [activeRole, setTasks, logActivity]
  );

  const deleteTask = useCallback(
    (taskId: string): boolean => {
      if (!hasPermission(activeRole, "delete_task")) {
        toast.error("Permission Denied: Only Admins can delete tasks.");
        return false;
      }

      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (selectedTaskId === taskId) {
        setSelectedTaskId(null);
      }
      toast.success("Task permanently deleted");
      return true;
    },
    [activeRole, setTasks, selectedTaskId]
  );

  const moveTaskStatus = useCallback(
    (taskId: string, newStatusId: string): boolean => {
      if (!hasPermission(activeRole, "move_task")) {
        toast.error("Permission Denied: Your role cannot move tasks.");
        return false;
      }

      const targetStatus = statuses.find((s) => s.id === newStatusId);
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              statusId: newStatusId,
              updatedAt: new Date().toISOString(),
            };
          }
          return t;
        })
      );

      if (targetStatus) {
        logActivity(
          taskId,
          "status_changed",
          `moved to "${targetStatus.name}"`
        );
        toast.success(`Moved to ${targetStatus.name}`);
      }
      return true;
    },
    [activeRole, statuses, setTasks, logActivity]
  );

  // Status Mutations
  const createStatus = useCallback(
    (data: { name: string; color: string }): boolean => {
      if (!hasPermission(activeRole, "manage_statuses")) {
        toast.error(
          "Permission Denied: Only Admins can create workflow statuses."
        );
        return false;
      }

      setStatuses((prev) => {
        const newStatus: Status = {
          id: `status-${generateId()}`,
          name: data.name.trim(),
          color: data.color,
          order: prev.length,
        };
        return [...prev, newStatus];
      });

      toast.success(`Status "${data.name.trim()}" created!`);
      return true;
    },
    [activeRole, setStatuses]
  );

  const updateStatus = useCallback(
    (
      statusId: string,
      updates: { name?: string; color?: string; order?: number }
    ): boolean => {
      if (!hasPermission(activeRole, "manage_statuses")) {
        toast.error("Permission Denied: Only Admins can modify statuses.");
        return false;
      }

      setStatuses((prev) =>
        prev.map((s) => (s.id === statusId ? { ...s, ...updates } : s))
      );
      toast.success("Workflow status updated");
      return true;
    },
    [activeRole, setStatuses]
  );

  const reorderStatuses = useCallback(
    (newStatuses: Status[]): boolean => {
      if (!hasPermission(activeRole, "manage_statuses")) {
        toast.error("Permission Denied: Only Admins can reorder statuses.");
        return false;
      }

      const updated = newStatuses.map((s, index) => ({ ...s, order: index }));
      setStatuses(updated);
      return true;
    },
    [activeRole, setStatuses]
  );

  const deleteStatus = useCallback(
    (statusId: string, fallbackStatusId: string): boolean => {
      if (!hasPermission(activeRole, "delete_status")) {
        toast.error("Permission Denied: Only Admins can delete statuses.");
        return false;
      }

      if (statuses.length <= 1) {
        toast.error("Cannot delete: Workspace must have at least one status.");
        return false;
      }

      setTasks((prev) =>
        prev.map((t) =>
          t.statusId === statusId ? { ...t, statusId: fallbackStatusId } : t
        )
      );

      setStatuses((prev) => {
        const filtered = prev.filter((s) => s.id !== statusId);
        return filtered.map((s, idx) => ({ ...s, order: idx }));
      });

      toast.success("Status deleted and associated tasks migrated safely.");
      return true;
    },
    [activeRole, statuses.length, setTasks, setStatuses]
  );

  // Member Mutations
  const inviteMember = useCallback(
    (data: { name: string; email: string; role: Role }): boolean => {
      if (!hasPermission(activeRole, "invite_member")) {
        toast.error("Permission Denied: Only Admins can invite team members.");
        return false;
      }

      const existing = members.find(
        (m) => m.email.toLowerCase() === data.email.toLowerCase().trim()
      );
      if (existing) {
        toast.error("A member with this email already exists.");
        return false;
      }

      const newMember: Member = {
        id: `member-${generateId()}`,
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        role: data.role,
        createdAt: new Date().toISOString(),
      };

      setMembers((prev) => [...prev, newMember]);
      toast.success(
        `Invited ${newMember.name} as ${newMember.role.toUpperCase()}`
      );
      return true;
    },
    [activeRole, members, setMembers]
  );

  const updateMemberRole = useCallback(
    (memberId: string, newRole: Role): boolean => {
      if (!hasPermission(activeRole, "change_member_role")) {
        toast.error("Permission Denied: Only Admins can change member roles.");
        return false;
      }

      const targetMember = members.find((m) => m.id === memberId);
      if (targetMember?.role === "admin" && newRole !== "admin") {
        const adminCount = members.filter((m) => m.role === "admin").length;
        if (adminCount <= 1) {
          toast.error("Cannot demote the only workspace Admin.");
          return false;
        }
      }

      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
      );

      if (
        currentUser &&
        (currentUser.id === memberId ||
          (targetMember &&
            currentUser.email.toLowerCase() ===
              targetMember.email.toLowerCase()))
      ) {
        setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : prev));
      }

      toast.success("Member role updated");
      return true;
    },
    [activeRole, members, setMembers, currentUser, setCurrentUser]
  );

  const removeMember = useCallback(
    (memberId: string): boolean => {
      if (!hasPermission(activeRole, "remove_member")) {
        toast.error("Permission Denied: Only Admins can remove members.");
        return false;
      }

      const targetMember = members.find((m) => m.id === memberId);
      if (targetMember?.role === "admin") {
        const adminCount = members.filter((m) => m.role === "admin").length;
        if (adminCount <= 1) {
          toast.error("Cannot remove the last Admin in the workspace.");
          return false;
        }
      }

      if (
        currentUser &&
        (currentUser.id === memberId ||
          (targetMember &&
            currentUser.email.toLowerCase() ===
              targetMember.email.toLowerCase()))
      ) {
        toast.error("Cannot remove your active account while logged in.");
        return false;
      }

      setTasks((prev) =>
        prev.map((t) =>
          t.assigneeId === memberId ? { ...t, assigneeId: undefined } : t
        )
      );

      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      toast.success("Member removed and unassigned from tasks.");
      return true;
    },
    [activeRole, members, setTasks, setMembers, currentUser]
  );

  // Subtask & Comment Mutations
  const addSubtask = useCallback(
    (taskId: string, title: string): boolean => {
      if (!hasPermission(activeRole, "manage_subtask")) {
        toast.error("Permission Denied: Your role cannot add subtasks.");
        return false;
      }

      const newSubtask: Subtask = {
        id: `sub-${generateId()}`,
        title: title.trim(),
        completed: false,
      };

      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              subtasks: [...t.subtasks, newSubtask],
              updatedAt: new Date().toISOString(),
            };
          }
          return t;
        })
      );

      logActivity(
        taskId,
        "subtask_added",
        `added subtask: "${newSubtask.title}"`
      );
      return true;
    },
    [activeRole, setTasks, logActivity]
  );

  const toggleSubtask = useCallback(
    (taskId: string, subtaskId: string): boolean => {
      if (!hasPermission(activeRole, "manage_subtask")) {
        toast.error("Permission Denied: Your role cannot toggle subtasks.");
        return false;
      }

      let subtaskTitle = "";
      let nowCompleted = false;

      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            const updated = t.subtasks.map((st) => {
              if (st.id === subtaskId) {
                subtaskTitle = st.title;
                nowCompleted = !st.completed;
                return { ...st, completed: !st.completed };
              }
              return st;
            });
            return {
              ...t,
              subtasks: updated,
              updatedAt: new Date().toISOString(),
            };
          }
          return t;
        })
      );

      logActivity(
        taskId,
        "subtask_toggled",
        `marked subtask "${subtaskTitle}" as ${nowCompleted ? "completed" : "incomplete"}`
      );
      return true;
    },
    [activeRole, setTasks, logActivity]
  );

  const deleteSubtask = useCallback(
    (taskId: string, subtaskId: string): boolean => {
      if (!hasPermission(activeRole, "manage_subtask")) {
        toast.error("Permission Denied: Your role cannot delete subtasks.");
        return false;
      }

      let subtaskTitle = "";
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            const match = t.subtasks.find((s) => s.id === subtaskId);
            if (match) subtaskTitle = match.title;
            return {
              ...t,
              subtasks: t.subtasks.filter((st) => st.id !== subtaskId),
              updatedAt: new Date().toISOString(),
            };
          }
          return t;
        })
      );

      logActivity(
        taskId,
        "subtask_deleted",
        `deleted subtask "${subtaskTitle}"`
      );
      return true;
    },
    [activeRole, setTasks, logActivity]
  );

  const addComment = useCallback(
    (taskId: string, content: string): boolean => {
      if (!hasPermission(activeRole, "add_comment")) {
        toast.error("Permission Denied: Viewers cannot comment.");
        return false;
      }

      const newComment: Comment = {
        id: `comment-${generateId()}`,
        authorId: currentUser?.id || "user-member",
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };

      setComments((prev) => [newComment, ...prev]);
      logActivity(taskId, "comment_added", "commented on this task");
      toast.success("Comment posted!");
      return true;
    },
    [activeRole, currentUser?.id, setComments, logActivity]
  );

  const resetToSampleData = useCallback(() => {
    setTasks(INITIAL_TASKS);
    setStatuses(INITIAL_STATUSES);
    setMembers(INITIAL_MEMBERS);
    setActivities(INITIAL_ACTIVITIES);
    setComments(INITIAL_COMMENTS);
    setCurrentUser(DEMO_USERS[0]);
    toast.success("Workspace reset to demo sample data!");
  }, [
    setTasks,
    setStatuses,
    setMembers,
    setActivities,
    setComments,
    setCurrentUser,
  ]);

  const value = useMemo(
    () => ({
      currentUser,
      activeRole,
      login,
      logout,
      switchUser,
      tasks,
      statuses,
      members,
      activities,
      comments,
      viewMode,
      selectedTaskId,
      isMobileNavOpen,
      isHydrated,
      setViewMode,
      setSelectedTaskId,
      setIsMobileNavOpen,
      createTask,
      updateTask,
      deleteTask,
      moveTaskStatus,
      createStatus,
      updateStatus,
      reorderStatuses,
      deleteStatus,
      inviteMember,
      updateMemberRole,
      removeMember,
      addSubtask,
      toggleSubtask,
      deleteSubtask,
      addComment,
      resetToSampleData,
    }),
    [
      currentUser,
      activeRole,
      login,
      logout,
      switchUser,
      tasks,
      statuses,
      members,
      activities,
      comments,
      viewMode,
      selectedTaskId,
      isMobileNavOpen,
      isHydrated,
      createTask,
      updateTask,
      deleteTask,
      moveTaskStatus,
      createStatus,
      updateStatus,
      reorderStatuses,
      deleteStatus,
      inviteMember,
      updateMemberRole,
      removeMember,
      addSubtask,
      toggleSubtask,
      deleteSubtask,
      addComment,
      resetToSampleData,
    ]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
