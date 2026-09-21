import type { Metadata } from "next";

import { MemberList } from "@/features/members/components/MemberList";

export const metadata: Metadata = {
  title: "Team Members — Flowdesk",
  description: "Manage workspace members and role assignments.",
};

export default function MembersPage() {
  return (
    <div className="py-2">
      <MemberList />
    </div>
  );
}
