"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type {
  FilterState,
  Priority,
  SortDirection,
  SortField,
  Task,
} from "@/types";

export function useTaskFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: FilterState = useMemo(() => {
    const search = searchParams.get("search") || "";
    const priority =
      (searchParams.get("priority") as Priority | "all") || "all";
    const assigneeId = searchParams.get("assignee") || "all";
    const statusId = searchParams.get("status") || "all";
    const sort = (searchParams.get("sort") as SortField) || "createdAt";
    const sortDir = (searchParams.get("sortDir") as SortDirection) || "desc";

    return {
      search,
      priority,
      assigneeId,
      statusId,
      sort,
      sortDir,
    };
  }, [searchParams]);

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname, searchParams]
  );

  const setSearch = useCallback(
    (search: string) => updateParam("search", search),
    [updateParam]
  );

  const setPriority = useCallback(
    (priority: Priority | "all") => updateParam("priority", priority),
    [updateParam]
  );

  const setAssigneeId = useCallback(
    (assigneeId: string | "all") => updateParam("assignee", assigneeId),
    [updateParam]
  );

  const setStatusId = useCallback(
    (statusId: string | "all") => updateParam("status", statusId),
    [updateParam]
  );

  const setSort = useCallback(
    (sort: SortField, dir?: SortDirection) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sort", sort);
      if (dir) {
        params.set("sortDir", dir);
      } else if (filters.sort === sort) {
        params.set("sortDir", filters.sortDir === "asc" ? "desc" : "asc");
      }
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname, searchParams, filters.sort, filters.sortDir]
  );

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("priority");
    params.delete("assignee");
    params.delete("status");
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }, [router, pathname, searchParams]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.priority !== "all") count++;
    if (filters.assigneeId !== "all") count++;
    if (filters.statusId !== "all") count++;
    return count;
  }, [filters]);

  const hasActiveFilters = activeFilterCount > 0;

  const filterAndSortTasks = useCallback(
    (tasks: Task[]) => {
      return tasks
        .filter((task) => {
          if (filters.search) {
            const query = filters.search.toLowerCase();
            const matchTitle = task.title.toLowerCase().includes(query);
            const matchDesc = task.description.toLowerCase().includes(query);
            const matchTag = task.tags?.some((tag) =>
              tag.toLowerCase().includes(query)
            );
            if (!matchTitle && !matchDesc && !matchTag) return false;
          }

          if (
            filters.priority !== "all" &&
            task.priority !== filters.priority
          ) {
            return false;
          }

          if (
            filters.assigneeId !== "all" &&
            task.assigneeId !== filters.assigneeId
          ) {
            return false;
          }

          if (
            filters.statusId !== "all" &&
            task.statusId !== filters.statusId
          ) {
            return false;
          }

          return true;
        })
        .sort((a, b) => {
          let cmp = 0;
          if (filters.sort === "title") {
            cmp = a.title.localeCompare(b.title);
          } else if (filters.sort === "dueDate") {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            cmp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          } else if (filters.sort === "priority") {
            const priorityWeight: Record<Priority, number> = {
              urgent: 4,
              high: 3,
              medium: 2,
              low: 1,
            };
            cmp = priorityWeight[b.priority] - priorityWeight[a.priority];
          } else {
            cmp =
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return filters.sortDir === "asc" ? cmp : -cmp;
        });
    },
    [filters]
  );

  return {
    filters,
    setSearch,
    setPriority,
    setAssigneeId,
    setStatusId,
    setSort,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
    filterAndSortTasks,
  };
}
