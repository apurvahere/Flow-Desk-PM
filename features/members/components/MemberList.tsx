"use client";

import React, { useState } from "react";
import { Mail, Plus, Trash2 } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { useMembers } from "@/features/members/hooks/useMembers";
import { formatDate } from "@/lib/utils";
import type { Member } from "@/types";

import { MemberFormModal } from "./MemberFormModal";
import { MemberRoleSelect } from "./MemberRoleSelect";

export function MemberList() {
  const { members, memberTaskCounts, removeMember, adminCount, activeMember } =
    useMembers();
  const { canInviteMember, canRemoveMember } = usePermissions();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Team Members
            </h1>
            <span className="flex h-5 items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {members.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your workspace roster, team roles, and assignees.
          </p>
        </div>

        {canInviteMember && (
          <Button
            size="sm"
            onClick={() => setIsInviteOpen(true)}
            className="gap-1.5 text-xs self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Invite Member</span>
          </Button>
        )}
      </div>

      {/* Members Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
                <th className="px-5 py-3">Member</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Assigned Tasks</th>
                <th className="px-4 py-3">Joined Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs dark:divide-slate-800/80">
              {members.map((member) => {
                const assignedCount = memberTaskCounts[member.id] || 0;
                const isCurrentUser = member.id === activeMember?.id;
                const isLastAdmin = member.role === "admin" && adminCount <= 1;

                return (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50/70 transition-colors dark:hover:bg-slate-800/40"
                  >
                    {/* Name & Email */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={member.name}
                          src={member.avatar}
                          size="md"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100">
                            <span>{member.name}</span>
                            {isCurrentUser && (
                              <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                You
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                            <Mail className="h-3 w-3" />
                            <span>{member.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role Select */}
                    <td className="px-4 py-3.5">
                      <MemberRoleSelect member={member} />
                    </td>

                    {/* Assigned Tasks */}
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {assignedCount}
                      </span>{" "}
                      <span className="text-slate-400">tasks</span>
                    </td>

                    {/* Joined Date */}
                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">
                      {formatDate(member.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      {canRemoveMember && (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isCurrentUser || isLastAdmin}
                          onClick={() => setMemberToRemove(member)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 rounded-lg disabled:opacity-20"
                          title={
                            isCurrentUser
                              ? "Cannot remove yourself"
                              : isLastAdmin
                                ? "Cannot remove the only admin"
                                : "Remove member"
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {members.map((member) => {
            const assignedCount = memberTaskCounts[member.id] || 0;
            const isCurrentUser = member.id === activeMember?.id;
            const isLastAdmin = member.role === "admin" && adminCount <= 1;

            return (
              <div key={member.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={member.name} src={member.avatar} size="md" />
                    <div>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        <span>{member.name}</span>
                        {isCurrentUser && (
                          <span className="rounded bg-indigo-50 px-1 py-0.2 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{member.email}</p>
                    </div>
                  </div>

                  {canRemoveMember && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isCurrentUser || isLastAdmin}
                      onClick={() => setMemberToRemove(member)}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 rounded-lg disabled:opacity-20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <MemberRoleSelect member={member} />
                  <span className="text-slate-500">
                    {assignedCount} assigned tasks
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <MemberFormModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />

      <ConfirmDialog
        isOpen={memberToRemove !== null}
        onClose={() => setMemberToRemove(null)}
        onConfirm={() => {
          if (memberToRemove) {
            removeMember(memberToRemove.id);
            setMemberToRemove(null);
          }
        }}
        title="Remove Team Member"
        description={`Are you sure you want to remove "${memberToRemove?.name}" from this workspace? Their assigned tasks will remain unassigned.`}
        confirmText="Remove Member"
        variant="danger"
      />
    </div>
  );
}
