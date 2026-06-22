# Task Manager — PRITECH React Native Technical Task

A clean, real-world task manager built with **React Native (Expo SDK 56)** and **TypeScript**. It lets a user create, view, complete, and delete personal tasks, with search, filtering, local persistence, and sample data fetched from a public API.

> Built for the PRITECH React Native technical task. The focus is clean architecture, reusable components, clear UI, and solid logic — without unnecessary complexity.

---

## Features

### Core requirements

- **Task list screen** — all tasks with status, priority, due date, and tags at a glance.
- **Add new task** — title, description, priority, due date, and optional tags.
- **Mark completed / not completed** — tap the checkbox on a card or use the detail screen.
- **Delete task** — swipe a card left, or delete from the detail screen (with confirmation).
- **Task details view** — full information for a single task.
- **Input validation** — powered by Zod + React Hook Form with inline error messages.
- **Clean, simple UI** — consistent design tokens (colors, spacing, typography, radius, shadows).
- **Public API integration** — imports sample tasks from the [DummyJSON Todos API](https://dummyjson.com/todos).

### Bonus requirements

- **Search** tasks by title, description, or tag.
- **Filter** tasks by status (All / Pending / Overdue / Completed) with live counts.
- **Local persistence** with AsyncStorage (tasks survive app restarts).
- **Navigation** between screens via Expo Router (file-based routing).

### Extra polish (beyond the brief)

- **Real-world task behavior** — automatic **Overdue** status, **green** badge for completed, **red** accent/border for high priority.
- **Internationalization (i18n)** — English and Albanian, with automatic device-language detection.
- **Swipe-to-delete** gesture on task cards.
- **Haptic feedback** on key actions (complete, delete, create, import).
- **Smooth animations** — card entrance, animated list add/remove (LayoutAnimation).
- **Pull-to-refresh** and **skeleton loading** while importing sample data.
- **Unit tests** for store logic and utilities (Jest).
- **ESLint + Prettier** for consistent code quality.

---

## Tech stack

| Concern            | Choice                                         |
| ------------------ | ---------------------------------------------- |
| Framework          | Expo SDK 56, React Native 0.85, React 19       |
| Language           | TypeScript (strict mode)                       |
| Navigation         | Expo Router (file-based)                       |
| Local state        | Zustand + AsyncStorage (persisted)             |
| Server state       | TanStack Query v5                              |
| Forms & validation | React Hook Form + Zod                          |
| i18n               | i18next / react-i18next + expo-localization    |
| Dates              | date-fns                                       |
| Testing            | Jest + jest-expo                               |
| Tooling            | ESLint (eslint-config-expo) + Prettier         |

---

## Getting started

### Prerequisites

- Node.js 18+ and npm
- [Expo Go](https://expo.dev/go) on a physical device, or an iOS Simulator / Android Emulator

### Install

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is used because of strict React 19 peer ranges in some transitive dependencies.

### Run

```bash
npm start          # start the Expo dev server
npm run ios        # open in iOS Simulator
npm run android    # open in Android Emulator
npm run web        # run in the browser
```

Scan the QR code with Expo Go, or press `i` / `a` in the terminal.

### Quality checks

```bash
npm run typecheck  # TypeScript, no emit
npm run lint       # ESLint
npm run format     # Prettier (write)
npm test           # Jest unit tests
```

---

## Project structure

```
app/                          # Expo Router routes (screens)
  _layout.tsx                 # Root layout + providers + navigation
  index.tsx                   # Task list screen
  task/create.tsx             # Create task
  task/[id].tsx               # Task details
  task/edit/[id].tsx          # Edit task

src/
  components/ui/              # Reusable UI primitives (Button, TextField, Badge, ...)
  features/tasks/
    api/                      # DummyJSON API client
    components/               # Task-specific components (TaskCard, TaskFilters, ...)
    hooks/                    # Query + filter hooks
    schemas/                  # Zod schemas
    store/                    # Zustand store (CRUD, search, filter) + tests
    types/                    # Domain types
    utils/                    # Status logic, API mapping + tests
  features/settings/          # Language switcher + settings store
  i18n/                       # i18next config + en/sq locales
  lib/                        # Storage, query client, haptics
  providers/                  # App-wide providers
  theme/                      # Design tokens
```

---

## Data model

Each task has the following fields:

| Field         | Type                                | Notes                                  |
| ------------- | ----------------------------------- | -------------------------------------- |
| `id`          | `string`                            | UUID                                   |
| `title`       | `string`                            | Required                               |
| `description` | `string`                            | Optional                               |
| `status`      | `'pending' \| 'completed'`          | Defaults to `pending`                  |
| `priority`    | `'low' \| 'medium' \| 'high'`       |                                        |
| `dueDate`     | `string \| null`                    | ISO date; drives the **Overdue** state |
| `tags`        | `('work' \| 'personal' \| 'study')[]` | Optional                             |
| `createdAt`   | `string`                            | ISO timestamp, set automatically       |

The **display status** is derived: a pending task whose `dueDate` is in the past becomes **Overdue**.

---

## Public API

Sample tasks are fetched from the DummyJSON Todos API:

```
GET https://dummyjson.com/todos?limit=12
```

The raw todos are mapped to the app's richer `Task` model (adding priority, due date, tags, and descriptions) in `src/features/tasks/utils/mapApiTodoToTask.ts`, then imported into the local store via TanStack Query.

---

## Testing

Unit tests cover the most important logic:

- `taskStatus` — overdue detection and display-status derivation
- `mapApiTodoToTask` — API-to-domain mapping
- `taskStore` — add / toggle / update / delete and filtering/search

```bash
npm test
```

---

## Screenshots / demo

> Add screenshots or a short screen recording here.

| Task list | Task details | Create task |
| --------- | ------------ | ----------- |
| _add image_ | _add image_ | _add image_ |

---

## Notes & decisions

- **Zustand vs Redux** — Zustand keeps local state simple and ergonomic for a small app, with built-in persistence middleware.
- **TanStack Query** — used for the API import to demonstrate proper server-state handling (loading/error/refetch).
- **Derived status** — overdue is computed, not stored, so it's always correct without background jobs.
- **i18n** — all user-facing strings (including validation messages) are translated; language auto-detects from the device and can be switched in-app.
