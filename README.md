# FlowDesk PM - Project Management Web Application

FlowDesk PM is a modern, high-performance Project Management application built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4. It features interactive Kanban boards, list views, subtask tracking, activity logs, task filtering, member management, and customizable task statuses.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local development machine:

- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher (or `yarn` / `pnpm`)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/apurvahere/Flow-Desk-PM.git
   cd Flow-Desk-PM
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or yarn install / pnpm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   # or yarn dev / pnpm dev
   ```

4. **View in Browser:**
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the live application.
   You can start editing pages by modifying files under the `app/` directory. The application auto-updates as you make changes.

---

## 🛠️ Build & Scripts

- `npm run dev` — Starts the local development server.
- `npm run build` — Builds the app for production to the `.next` directory. It optimizes React in production mode for optimal performance.
- `npm run start` — Starts the production server after building.
- `npm run lint` — Runs ESLint to identify code quality issues.
- `npm run lint:fix` — Automatically fixes fixable ESLint errors.
- `npm run format` — Formats codebase using Prettier.
- `npm run format:check` — Verifies code formatting against Prettier rules.
- `npm run fix` — Executes both lint fixes and Prettier formatting.

---

## ✨ Features

- **Interactive Task Board (Kanban):** Organize and move tasks seamlessly across status columns.
- **Structured Task List View:** Tabular view with sorting and filtering options for high-density task management.
- **Task Detail Drawer:** Inspect task details, manage subtasks, add comments, and track history.
- **Subtasks & Activity Log:** Breakdown complex deliverables into subtask checklists and audit chronological changes.
- **Advanced Task Filtering:** Search and filter by status, priority, due date, assignee, and keywords.
- **Member Management:** Manage team members, workspace access, and role assignments.
- **Custom Workflow Statuses:** Flexible status pipeline configured for your project lifecycle.
- **Validated Forms & Toast Notifications:** User-friendly form inputs powered by Formik + Yup and React Hot Toast.
- **Automated Code Quality:** Git pre-commit hooks via Husky and lint-staged for consistent code style.

---

## 📁 Project Structure

```
flowdesk-pm/
├── app/                        # Next.js App Router pages & layouts
│   ├── (auth)/                 # Authentication pages (login, register)
│   ├── (workspace)/            # Workspace dashboard, task board, members, settings
│   ├── globals.css             # Global styles and Tailwind v4 theme setup
│   └── layout.tsx              # Root HTML & provider layout
├── components/                 # Shared UI & layout components
│   ├── layout/                 # Header, Sidebar, and Shell layouts
│   └── ui/                     # Primitive reusable UI elements (Button, Modal, Input, etc.)
├── context/                    # React Context providers for global application state
├── features/                   # Feature-based modular architecture
│   ├── auth/                   # Authentication forms and handlers
│   ├── members/                # Workspace member management
│   ├── statuses/               # Task status definitions and column management
│   └── tasks/                  # Core task management feature module
│       ├── components/         # TaskBoardView, TaskListView, TaskDetailDrawer, TaskFormModal, etc.
│       ├── hooks/              # Task state management hooks
│       └── types/              # TypeScript interface definitions for tasks
├── hooks/                      # Custom global React hooks
├── lib/                        # Shared utility functions and helpers
├── types/                      # Application-wide TypeScript types
├── eslint.config.mjs           # ESLint configuration
├── postcss.config.mjs          # PostCSS configuration
├── tsconfig.json               # TypeScript compiler options
└── package.json                # Project metadata, dependencies, and scripts
```

---

## 💻 Tech Stack

- **[React JS](https://reactjs.org/)** (v19) — UI Library
- **[Next.js](https://nextjs.org/)** (v16) — React Framework (App Router)
- **[TypeScript](https://www.typescriptlang.org/)** — Strongly typed programming language
- **[Tailwind CSS](https://tailwindcss.com/)** (v4) — Utility-first CSS framework
- **[Lucide Icons](https://lucide.dev/)** — Clean icons for React UI
- **[React Hot Toast](https://react-hot-toast.com/)** — Toast notification system

---

## 📦 Third-Party Libraries & Tools

- **[next](https://nextjs.org/):** React Framework with Server Side Rendering and App Router support.
- **[react](https://reactjs.org/) & [react-dom](https://reactjs.org/docs/react-dom.html):** Foundation for building user interfaces.
- **[lucide-react](https://lucide.dev/):** Scalable icon components for React.
- **[formik](https://formik.org/):** Flexible form state and submission handling.
- **[yup](https://github.com/jquense/yup):** Schema-based object validation.
- **[react-hot-toast](https://react-hot-toast.com/):** Lightweight notifications for user actions.
- **[clsx](https://github.com/lukeed/clsx) & [tailwind-merge](https://github.com/dcastil/tailwind-merge):** Utility functions for combining CSS classes dynamically.
- **[eslint](https://eslint.org/):** Linter for maintaining high code quality.
- **[prettier](https://prettier.io/):** Code formatter for consistent formatting across the codebase.
- **[husky](https://typicode.github.io/husky/) & [lint-staged](https://github.com/lint-staged/lint-staged):** Pre-commit git hooks ensuring clean commits.
