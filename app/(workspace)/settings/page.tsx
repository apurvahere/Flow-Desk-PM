import type { Metadata } from "next";

import { StatusList } from "@/features/statuses/components/StatusList";

export const metadata: Metadata = {
  title: "Workflow Statuses & Settings — Flowdesk",
  description: "Configure custom workflow columns and workspace settings.",
};

export default function SettingsPage() {
  return (
    <div className="py-2">
      <StatusList />
    </div>
  );
}
