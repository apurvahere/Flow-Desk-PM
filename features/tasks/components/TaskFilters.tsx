"use client";

import React, { useState } from "react";
import { Filter, Search, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useMembers } from "@/features/members/hooks/useMembers";
import { useStatuses } from "@/features/statuses/hooks/useStatuses";
import type { FilterState, Priority } from "@/types";

interface TaskFiltersProps {
  filters: FilterState;
  onSearchChange: (search: string) => void;
  onPriorityChange: (priority: Priority | "all") => void;
  onAssigneeChange: (assigneeId: string | "all") => void;
  onStatusChange: (statusId: string | "all") => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

export function TaskFilters({
  filters,
  onSearchChange,
  onPriorityChange,
  onAssigneeChange,
  onStatusChange,
  onClearFilters,
  hasActiveFilters,
  activeFilterCount,
}: TaskFiltersProps) {
  const { statuses } = useStatuses();
  const { members } = useMembers();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search tasks, descriptions, #tags..."
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            prefixIcon={<Search className="h-4 w-4" />}
            suffixIcon={
              filters.search ? (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null
            }
            className="h-10 text-xs sm:text-sm"
          />
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Priority */}
          <Select
            value={filters.priority}
            onChange={(e) =>
              onPriorityChange(e.target.value as Priority | "all")
            }
            className="h-10 text-xs w-36"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>

          {/* Assignee */}
          <Select
            value={filters.assigneeId}
            onChange={(e) => onAssigneeChange(e.target.value)}
            className="h-10 text-xs w-36"
          >
            <option value="all">All Assignees</option>
            <option value="unassigned">Unassigned</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </Select>

          {/* Status */}
          <Select
            value={filters.statusId}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-10 text-xs w-36"
          >
            <option value="all">All Statuses</option>
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="flex whitespace-nowrap text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 h-10 px-3"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Reset ({activeFilterCount})
            </Button>
          )}
        </div>

        {/* Mobile Filter Button */}
        <div className="flex lg:hidden items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="w-full flex items-center justify-center gap-2 h-10 text-xs font-medium"
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs text-rose-600 dark:text-rose-400 shrink-0 h-10"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Filters Collapsible */}
      {isMobileFiltersOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-4 rounded-xl border border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/80 lg:hidden animate-in fade-in-0 duration-150">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              Priority
            </label>
            <Select
              value={filters.priority}
              onChange={(e) =>
                onPriorityChange(e.target.value as Priority | "all")
              }
              className="w-full text-xs h-9"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              Assignee
            </label>
            <Select
              value={filters.assigneeId}
              onChange={(e) => onAssigneeChange(e.target.value)}
              className="w-full text-xs h-9"
            >
              <option value="all">All Assignees</option>
              <option value="unassigned">Unassigned</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              Status
            </label>
            <Select
              value={filters.statusId}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full text-xs h-9"
            >
              <option value="all">All Statuses</option>
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
