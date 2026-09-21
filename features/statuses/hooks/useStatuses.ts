"use client";

import { useMemo } from "react";

import { useWorkspace } from "@/context/WorkspaceContext";

export function useStatuses() {
  const {
    statuses,
    tasks,
    createStatus,
    updateStatus,
    reorderStatuses,
    deleteStatus,
  } = useWorkspace();

  const sortedStatuses = useMemo(() => {
    return [...statuses].sort((a, b) => a.order - b.order);
  }, [statuses]);

  const statusTaskCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const status of statuses) {
      counts[status.id] = tasks.filter((t) => t.statusId === status.id).length;
    }
    return counts;
  }, [statuses, tasks]);

  const getTaskCountForStatus = useMemo(() => {
    return (statusId: string) => {
      return tasks.filter((t) => t.statusId === statusId).length;
    };
  }, [tasks]);

  const getStatusById = useMemo(() => {
    return (statusId?: string) => {
      if (!statusId) return undefined;
      return statuses.find((s) => s.id === statusId);
    };
  }, [statuses]);

  const getFallbackStatuses = useMemo(() => {
    return (excludeStatusId: string) => {
      return sortedStatuses.filter((s) => s.id !== excludeStatusId);
    };
  }, [sortedStatuses]);

  const moveStatusUp = (index: number) => {
    if (index <= 0) return;
    const nextStatuses = [...sortedStatuses];
    const temp = nextStatuses[index];
    nextStatuses[index] = nextStatuses[index - 1];
    nextStatuses[index - 1] = temp;
    reorderStatuses(nextStatuses);
  };

  const moveStatusDown = (index: number) => {
    if (index >= sortedStatuses.length - 1) return;
    const nextStatuses = [...sortedStatuses];
    const temp = nextStatuses[index];
    nextStatuses[index] = nextStatuses[index + 1];
    nextStatuses[index + 1] = temp;
    reorderStatuses(nextStatuses);
  };

  return {
    statuses: sortedStatuses,
    statusTaskCounts,
    canDeleteMore: sortedStatuses.length > 1,
    getStatusById,
    getFallbackStatuses,
    getTaskCountForStatus,
    moveStatusUp,
    moveStatusDown,
    createStatus,
    updateStatus,
    reorderStatuses,
    deleteStatus,
  };
}
