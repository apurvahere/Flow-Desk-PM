"use client";

import { useMemo } from "react";

import { useWorkspace } from "@/context/WorkspaceContext";

export function useMembers() {
  const {
    members,
    tasks,
    currentUser,
    inviteMember,
    updateMemberRole,
    removeMember,
  } = useWorkspace();

  const adminCount = useMemo(() => {
    return members.filter((m) => m.role === "admin").length;
  }, [members]);

  const memberTaskCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const member of members) {
      counts[member.id] = tasks.filter(
        (t) => t.assigneeId === member.id
      ).length;
    }
    return counts;
  }, [members, tasks]);

  const getMemberById = useMemo(() => {
    return (memberId?: string) => {
      if (!memberId) return undefined;
      return members.find((m) => m.id === memberId);
    };
  }, [members]);

  const getAssignedTasksCount = useMemo(() => {
    return (memberId: string) => {
      return tasks.filter((t) => t.assigneeId === memberId).length;
    };
  }, [tasks]);

  return {
    members,
    adminCount,
    memberTaskCounts,
    activeMember: currentUser,
    getMemberById,
    getAssignedTasksCount,
    inviteMember,
    updateMemberRole,
    removeMember,
  };
}
