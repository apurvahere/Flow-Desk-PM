"use client";

import { useMemo } from "react";

import { useWorkspace } from "@/context/WorkspaceContext";
import type { Task } from "@/types";

export function useTasks() {
  const {
    tasks,
    statuses,
    members,
    selectedTaskId,
    setSelectedTaskId,
    createTask,
    updateTask,
    deleteTask,
    moveTaskStatus,
  } = useWorkspace();

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) || null,
    [tasks, selectedTaskId]
  );

  const getTasksByStatus = useMemo(() => {
    return (statusId: string, filteredTasks?: Task[]) => {
      const source = filteredTasks || tasks;
      return source.filter((task) => task.statusId === statusId);
    };
  }, [tasks]);

  const getTaskAssignee = useMemo(() => {
    return (assigneeId?: string) => {
      if (!assigneeId) return undefined;
      return members.find((m) => m.id === assigneeId);
    };
  }, [members]);

  const getTaskStatus = useMemo(() => {
    return (statusId: string) => {
      return statuses.find((s) => s.id === statusId);
    };
  }, [statuses]);

  return {
    tasks,
    statuses,
    members,
    selectedTaskId,
    selectedTask,
    setSelectedTaskId,
    getTasksByStatus,
    getTaskAssignee,
    getTaskStatus,
    createTask,
    updateTask,
    deleteTask,
    moveTaskStatus,
  };
}
