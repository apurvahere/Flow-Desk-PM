"use client";

import React from "react";

import { Badge } from "@/components/ui/Badge";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { useMembers } from "@/features/members/hooks/useMembers";
import type { Member, Role } from "@/types";

interface MemberRoleSelectProps {
  member: Member;
}

export function MemberRoleSelect({ member }: MemberRoleSelectProps) {
  const { updateMemberRole, adminCount } = useMembers();
  const { canChangeMemberRole } = usePermissions();

  if (!canChangeMemberRole) {
    return <Badge variant="role" role={member.role} />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as Role;
    if (newRole !== member.role) {
      updateMemberRole(member.id, newRole);
    }
  };

  return (
    <select
      value={member.role}
      onChange={handleChange}
      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
    >
      <option value="admin">Admin</option>
      <option
        value="member"
        disabled={member.role === "admin" && adminCount <= 1}
      >
        Member{" "}
        {member.role === "admin" && adminCount <= 1 ? "(Last Admin)" : ""}
      </option>
      <option
        value="viewer"
        disabled={member.role === "admin" && adminCount <= 1}
      >
        Viewer{" "}
        {member.role === "admin" && adminCount <= 1 ? "(Last Admin)" : ""}
      </option>
    </select>
  );
}
