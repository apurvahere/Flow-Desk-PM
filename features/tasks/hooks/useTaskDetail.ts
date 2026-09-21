"use client";

import { useMemo } from "react";

import { useWorkspace } from "@/context/WorkspaceContext";
import type { Task } from "@/types";

export function useTaskDetail(taskIdOverride?: string | null) {
  const {
    tasks,
    statuses,
    members,
    activities,
    comments,
    selectedTaskId,
    setSelectedTaskId,
    updateTask,
    deleteTask,
    moveTaskStatus,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    addComment,
  } = useWorkspace();

  const currentTaskId = taskIdOverride ?? selectedTaskId;

  const task = useMemo(() => {
    if (!currentTaskId) return null;
    return tasks.find((t) => t.id === currentTaskId) || null;
  }, [tasks, currentTaskId]);

  const status = useMemo(() => {
    if (!task) return null;
    return statuses.find((s) => s.id === task.statusId) || null;
  }, [task, statuses]);

  const assignee = useMemo(() => {
    if (!task || !task.assigneeId) return null;
    return members.find((m) => m.id === task.assigneeId) || null;
  }, [task, members]);

  const taskActivities = useMemo(() => {
    if (!currentTaskId) return [];
    return activities.filter((a) => a.taskId === currentTaskId);
  }, [activities, currentTaskId]);

  const taskComments = useMemo(() => {
    if (!currentTaskId) return [];
    return comments;
  }, [comments, currentTaskId]);

  const subtaskProgress = useMemo(() => {
    if (!task || task.subtasks.length === 0) {
      return { total: 0, completed: 0, percentage: 0 };
    }
    const completed = task.subtasks.filter((s) => s.completed).length;
    const total = task.subtasks.length;
    return {
      total,
      completed,
      percentage: Math.round((completed / total) * 100),
    };
  }, [task]);

  return {
    task,
    status,
    assignee,
    activities: taskActivities,
    comments: taskComments,
    subtaskProgress,
    isOpen: !!currentTaskId && !!task,
    openTask: (id: string) => setSelectedTaskId(id),
    closeTask: () => setSelectedTaskId(null),
    updateTask: (updates: Partial<Task>) => {
      if (!currentTaskId) return false;
      return updateTask(currentTaskId, updates);
    },
    deleteTask: () => {
      if (!currentTaskId) return false;
      return deleteTask(currentTaskId);
    },
    moveTaskStatus: (newStatusId: string) => {
      if (!currentTaskId) return false;
      return moveTaskStatus(currentTaskId, newStatusId);
    },
    addSubtask: (title: string) => {
      if (!currentTaskId) return false;
      return addSubtask(currentTaskId, title);
    },
    toggleSubtask: (subtaskId: string) => {
      if (!currentTaskId) return false;
      return toggleSubtask(currentTaskId, subtaskId);
    },
    deleteSubtask: (subtaskId: string) => {
      if (!currentTaskId) return false;
      return deleteSubtask(currentTaskId, subtaskId);
    },
    addComment: (content: string) => {
      if (!currentTaskId) return false;
      return addComment(currentTaskId, content);
    },
  };
}
