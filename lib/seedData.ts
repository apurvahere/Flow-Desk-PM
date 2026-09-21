import type { Activity, Comment, Member, Status, Task, User } from "@/types";

export const DEMO_PERSONAS: User[] = [
  {
    id: "user-admin",
    name: "Alex Rivera",
    email: "alex.rivera@flowdesk.dev",
    role: "admin",
  },
  {
    id: "user-member",
    name: "Sarah Chen",
    email: "sarah.chen@flowdesk.dev",
    role: "member",
  },
  {
    id: "user-viewer",
    name: "David Kim",
    email: "david.kim@flowdesk.dev",
    role: "viewer",
  },
];

export const INITIAL_STATUSES: Status[] = [
  { id: "status-backlog", name: "Backlog", color: "#64748b", order: 0 },
  { id: "status-todo", name: "To Do", color: "#f59e0b", order: 1 },
  { id: "status-in-progress", name: "In Progress", color: "#3b82f6", order: 2 },
  { id: "status-done", name: "Done", color: "#10b981", order: 3 },
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: "user-admin",
    name: "Alex Rivera",
    email: "alex.rivera@flowdesk.dev",
    role: "admin",
    createdAt: "2026-01-10T09:00:00.000Z",
  },
  {
    id: "user-member",
    name: "Sarah Chen",
    email: "sarah.chen@flowdesk.dev",
    role: "member",
    createdAt: "2026-01-15T10:30:00.000Z",
  },
  {
    id: "member-elena",
    name: "Elena Rostova",
    email: "elena.r@flowdesk.dev",
    role: "member",
    createdAt: "2026-02-01T14:15:00.000Z",
  },
  {
    id: "user-viewer",
    name: "David Kim",
    email: "david.kim@flowdesk.dev",
    role: "viewer",
    createdAt: "2026-02-12T11:45:00.000Z",
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Implement OAuth 2.0 & Multi-factor Authentication",
    description:
      "Integrate secure NextAuth SSO with Google and GitHub providers, and enforce optional TOTP-based 2FA for workspace admins.",
    statusId: "status-in-progress",
    priority: "urgent",
    assigneeId: "user-admin",
    dueDate: "2026-09-25",
    tags: ["Auth", "Security", "Backend"],
    subtasks: [
      {
        id: "sub-1-1",
        title: "Setup OAuth provider credentials",
        completed: true,
      },
      {
        id: "sub-1-2",
        title: "Implement JWT session rotation",
        completed: true,
      },
      {
        id: "sub-1-3",
        title: "Add TOTP QR code enrollment modal",
        completed: false,
      },
      {
        id: "sub-1-4",
        title: "Write end-to-end auth test suite",
        completed: false,
      },
    ],
    createdAt: "2026-09-01T08:30:00.000Z",
    updatedAt: "2026-09-17T15:20:00.000Z",
  },
  {
    id: "task-2",
    title: "Design dynamic Kanban Board with Drag & Drop",
    description:
      "Build fluid Kanban board supporting touch gestures on mobile and keyboard navigation on desktop with instant state persistence.",
    statusId: "status-in-progress",
    priority: "high",
    assigneeId: "user-member",
    dueDate: "2026-09-22",
    tags: ["UI/UX", "Kanban", "Frontend"],
    subtasks: [
      {
        id: "sub-2-1",
        title: "Design column shell and header stats",
        completed: true,
      },
      {
        id: "sub-2-2",
        title: "Create responsive card with priority pill",
        completed: true,
      },
      {
        id: "sub-2-3",
        title: "Implement touch-friendly status action menu",
        completed: true,
      },
    ],
    createdAt: "2026-09-03T10:00:00.000Z",
    updatedAt: "2026-09-16T12:10:00.000Z",
  },
  {
    id: "task-3",
    title: "Real-time activity log & audit stream",
    description:
      "Record every mutation (status changes, assignee changes, comment creation) into an immutable audit stream for compliance.",
    statusId: "status-todo",
    priority: "medium",
    assigneeId: "member-elena",
    dueDate: "2026-09-28",
    tags: ["Activity", "Audit", "Database"],
    subtasks: [
      {
        id: "sub-3-1",
        title: "Define structured activity event schema",
        completed: true,
      },
      {
        id: "sub-3-2",
        title: "Create chronological activity timeline component",
        completed: false,
      },
    ],
    createdAt: "2026-09-05T11:20:00.000Z",
    updatedAt: "2026-09-14T09:40:00.000Z",
  },
  {
    id: "task-4",
    title: "Dark mode color palette refinement",
    description:
      "Calibrate deep zinc neutrals, contrast ratios (WCAG AAA), and glowing subtle borders for elevated nighttime productivity.",
    statusId: "status-done",
    priority: "low",
    assigneeId: "user-member",
    dueDate: "2026-09-15",
    tags: ["Design System", "Theme", "CSS"],
    subtasks: [
      {
        id: "sub-4-1",
        title: "Audit Tailwind v4 custom tokens",
        completed: true,
      },
      {
        id: "sub-4-2",
        title: "Test badge contrast ratios across themes",
        completed: true,
      },
    ],
    createdAt: "2026-09-02T14:00:00.000Z",
    updatedAt: "2026-09-15T17:00:00.000Z",
  },
  {
    id: "task-5",
    title: "Optimistic updates for task state mutations",
    description:
      "Eliminate perceived latency by updating local client state immediately and rollback gracefully if an unexpected network error occurs.",
    statusId: "status-todo",
    priority: "high",
    assigneeId: "user-admin",
    dueDate: "2026-09-24",
    tags: ["State", "Performance", "React"],
    subtasks: [
      {
        id: "sub-5-1",
        title: "Refactor custom workspace context hook",
        completed: true,
      },
      {
        id: "sub-5-2",
        title: "Add rollback handler on failed storage write",
        completed: false,
      },
    ],
    createdAt: "2026-09-08T09:15:00.000Z",
    updatedAt: "2026-09-15T11:30:00.000Z",
  },
  {
    id: "task-6",
    title: "Export workspace data to CSV / JSON",
    description:
      "Allow admins to export filtered tasks, member rosters, and status configs into structured formats for external reporting.",
    statusId: "status-backlog",
    priority: "low",
    assigneeId: undefined,
    dueDate: "2026-10-05",
    tags: ["Export", "Admin", "Data"],
    subtasks: [
      {
        id: "sub-6-1",
        title: "Format task collection into standard CSV rows",
        completed: false,
      },
      {
        id: "sub-6-2",
        title: "Implement client-side Blob file download",
        completed: false,
      },
    ],
    createdAt: "2026-09-10T16:00:00.000Z",
    updatedAt: "2026-09-10T16:00:00.000Z",
  },
  {
    id: "task-7",
    title: "Mobile Bottom Sheet modal drawer",
    description:
      "Transform desktop centered modals into seamless bottom sheets on small viewports with swipe-down to dismiss gesture support.",
    statusId: "status-done",
    priority: "medium",
    assigneeId: "user-member",
    dueDate: "2026-09-16",
    tags: ["Mobile", "UI/UX", "Drawer"],
    subtasks: [
      { id: "sub-7-1", title: "Build touch drag handle", completed: true },
      {
        id: "sub-7-2",
        title: "Add backdrop blur and transition animations",
        completed: true,
      },
    ],
    createdAt: "2026-09-04T13:40:00.000Z",
    updatedAt: "2026-09-16T16:45:00.000Z",
  },
  {
    id: "task-8",
    title: "Keyboard shortcuts cheat sheet (Cmd+K palette)",
    description:
      "Implement universal hotkeys for fast navigation: 'C' for create task, '/' to focus search, 'B' for board view, 'L' for list view.",
    statusId: "status-backlog",
    priority: "medium",
    assigneeId: "member-elena",
    dueDate: "2026-10-01",
    tags: ["Accessibility", "Hotkeys", "UX"],
    subtasks: [
      {
        id: "sub-8-1",
        title: "Register global keydown event listener",
        completed: false,
      },
      {
        id: "sub-8-2",
        title: "Create shortcut helper modal (Shift+?)",
        completed: false,
      },
    ],
    createdAt: "2026-09-11T10:00:00.000Z",
    updatedAt: "2026-09-11T10:00:00.000Z",
  },
  {
    id: "task-9",
    title: "Automated status migration modal on deletion",
    description:
      "Ensure data integrity when a workflow status is removed by forcing the admin to reassign existing tasks to a valid destination status.",
    statusId: "status-done",
    priority: "urgent",
    assigneeId: "user-admin",
    dueDate: "2026-09-14",
    tags: ["Settings", "Admin", "Data Integrity"],
    subtasks: [
      {
        id: "sub-9-1",
        title: "Detect dependent tasks count before delete",
        completed: true,
      },
      {
        id: "sub-9-2",
        title: "Validate destination status selection",
        completed: true,
      },
      {
        id: "sub-9-3",
        title: "Batch reassign tasks atomically",
        completed: true,
      },
    ],
    createdAt: "2026-09-06T15:00:00.000Z",
    updatedAt: "2026-09-14T18:20:00.000Z",
  },
  {
    id: "task-10",
    title: "Markdown parsing for task descriptions and comments",
    description:
      "Support clean rich text with bullet points, inline code blocks, bold text, and clickable URLs in descriptions.",
    statusId: "status-todo",
    priority: "low",
    assigneeId: "member-elena",
    dueDate: "2026-09-30",
    tags: ["Editor", "Markdown", "Comments"],
    subtasks: [
      {
        id: "sub-10-1",
        title: "Add lightweight safe markdown renderer",
        completed: false,
      },
      {
        id: "sub-10-2",
        title: "Style inline code pills and blockquotes",
        completed: false,
      },
    ],
    createdAt: "2026-09-12T11:00:00.000Z",
    updatedAt: "2026-09-12T11:00:00.000Z",
  },
  {
    id: "task-11",
    title: "Cross-tab state synchronization via BroadcastChannel",
    description:
      "Instantly sync workspace changes across multiple open tabs without requiring a manual browser refresh.",
    statusId: "status-todo",
    priority: "medium",
    assigneeId: "user-admin",
    dueDate: "2026-09-27",
    tags: ["Sync", "Storage", "Architecture"],
    subtasks: [
      {
        id: "sub-11-1",
        title: "Implement useLocalStorage custom hook",
        completed: true,
      },
      {
        id: "sub-11-2",
        title: "Broadcast state delta on task updates",
        completed: false,
      },
    ],
    createdAt: "2026-09-09T14:30:00.000Z",
    updatedAt: "2026-09-15T09:00:00.000Z",
  },
  {
    id: "task-12",
    title: "Responsive table view with column sorting",
    description:
      "Create high-density data table supporting sorting by title, priority, due date, status, and assignee with multi-select actions.",
    statusId: "status-in-progress",
    priority: "high",
    assigneeId: "user-member",
    dueDate: "2026-09-23",
    tags: ["Table", "Views", "Frontend"],
    subtasks: [
      {
        id: "sub-12-1",
        title: "Implement sort header indicators",
        completed: true,
      },
      {
        id: "sub-12-2",
        title: "Add mobile card fallback view",
        completed: true,
      },
      {
        id: "sub-12-3",
        title: "Add quick status changer dropdown in rows",
        completed: false,
      },
    ],
    createdAt: "2026-09-07T08:00:00.000Z",
    updatedAt: "2026-09-17T11:00:00.000Z",
  },
  {
    id: "task-13",
    title: "Role-Based Access Control banner alerts",
    description:
      "Display informative helper messages when viewers or members hover over restricted action triggers explaining permission levels.",
    statusId: "status-done",
    priority: "low",
    assigneeId: "member-elena",
    dueDate: "2026-09-13",
    tags: ["RBAC", "Security", "UX"],
    subtasks: [
      {
        id: "sub-13-1",
        title: "Create permission tooltip wrapper",
        completed: true,
      },
      {
        id: "sub-13-2",
        title: "Add visual disabled state styling",
        completed: true,
      },
    ],
    createdAt: "2026-09-01T12:00:00.000Z",
    updatedAt: "2026-09-13T16:00:00.000Z",
  },
  {
    id: "task-14",
    title: "API rate limiting and payload validation",
    description:
      "Protect endpoints with sliding window token bucket rate limiter and strict Zod runtime schema validation.",
    statusId: "status-backlog",
    priority: "urgent",
    assigneeId: "user-admin",
    dueDate: "2026-10-08",
    tags: ["Security", "API", "Backend"],
    subtasks: [
      {
        id: "sub-14-1",
        title: "Define schema validators for task creation",
        completed: false,
      },
      {
        id: "sub-14-2",
        title: "Configure Redis token bucket middleware",
        completed: false,
      },
    ],
    createdAt: "2026-09-14T10:00:00.000Z",
    updatedAt: "2026-09-14T10:00:00.000Z",
  },
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: "comment-1",
    authorId: "user-admin",
    content:
      "Initial provider integrations for Google & GitHub are ready in the dev sandbox. Testing token refresh next.",
    createdAt: "2026-09-16T10:15:00.000Z",
  },
  {
    id: "comment-2",
    authorId: "user-member",
    content:
      "The UI looks very crisp! Make sure the QR code enrollment modal works well on mobile screens.",
    createdAt: "2026-09-17T09:30:00.000Z",
  },
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    taskId: "task-1",
    authorId: "user-admin",
    action: "created",
    description: "created this task",
    timestamp: "2026-09-01T08:30:00.000Z",
  },
  {
    id: "act-2",
    taskId: "task-1",
    authorId: "user-admin",
    action: "status_changed",
    description: "moved to In Progress",
    timestamp: "2026-09-10T14:20:00.000Z",
  },
  {
    id: "act-3",
    taskId: "task-1",
    authorId: "user-member",
    action: "comment_added",
    description: "commented on this task",
    timestamp: "2026-09-17T09:30:00.000Z",
  },
  {
    id: "act-4",
    taskId: "task-2",
    authorId: "user-member",
    action: "created",
    description: "created this task",
    timestamp: "2026-09-03T10:00:00.000Z",
  },
  {
    id: "act-5",
    taskId: "task-2",
    authorId: "user-member",
    action: "status_changed",
    description: "moved to In Progress",
    timestamp: "2026-09-12T11:00:00.000Z",
  },
];
