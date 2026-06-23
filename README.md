# Task Manager — PRITECH React Native Technical Task

A clean, real-world task manager built with **React Native (Expo SDK 54)** and **TypeScript**. It lets a user create, view, complete, and delete personal tasks, with search, filtering, local persistence, and sample data fetched from a public API.

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
- **Dark mode** — light / dark theme with a one-tap toggle, persisted to the device and respecting the system default.
- **Internationalization (i18n)** — English and Albanian, with automatic device-language detection.
- **Drag-to-reorder** — long-press a card to reorder tasks (powered by Reanimated); order is persisted.
- **Completion progress bar** — a live "X of Y completed" indicator at the top of the list.
- **Task activity history** — a per-task timeline of create / edit / complete / reopen events.
- **Local reminders** — schedules a notification on a task's due date (see note below).
- **Swipe-to-delete** gesture on task cards.
- **Haptic feedback** on key actions (complete, delete, create, import).
- **Smooth animations** — card entrance, animated list add/remove (LayoutAnimation).
- **Pull-to-refresh** and **skeleton loading** while importing sample data.
- **Unit tests** for store logic and utilities (Jest).
- **ESLint + Prettier** for consistent code quality.

> **Note on reminders:** local notifications are scheduled best-effort. In **Expo Go** (SDK 53+) notification support is limited, so for a reliable demo run a [development build](https://docs.expo.dev/develop/development-builds/introduction/). The app degrades gracefully if notifications are unavailable.

---

## Tech stack

| Concern            | Choice                                         |
| ------------------ | ---------------------------------------------- |
| Framework          | Expo SDK 54, React Native 0.81, React 19       |
| Language           | TypeScript (strict mode)                       |
| Navigation         | Expo Router (file-based)                       |
| Local state        | Zustand + AsyncStorage (persisted)             |
| Server state       | TanStack Query v5                              |
| Forms & validation | React Hook Form + Zod                          |
| i18n               | i18next / react-i18next + expo-localization    |
| Animations/gestures| Reanimated, gesture-handler, draggable-flatlist |
| Notifications      | expo-notifications                             |
| Haptics            | expo-haptics                                   |
| Dates              | date-fns                                       |
| Testing            | Jest + jest-expo                               |
| Tooling            | ESLint (eslint-config-expo) + Prettier         |

---

## Getting started

### Prerequisites

- Node.js 18+ and npm
- [Expo Go](https://expo.dev/go) on a physical device (recommended for quick testing), or an iOS Simulator / Android Emulator

### Testing on a physical device (Expo Go)

This project targets **Expo SDK 54** so it can be opened on a real phone with **Expo Go** via QR scan.

The app was originally scaffolded on **Expo SDK 56**, but the public **Expo Go** app on iPhone/Android does not yet support SDK 56. For that reason the project was **downgraded to SDK 54** — a deliberate trade-off so reviewers and testers can run the app on a device without a development build.

**Steps:**

1. Install or update **Expo Go** from the App Store / Play Store (it must support **SDK 54**).
2. Make sure your phone and computer are on the **same Wi‑Fi**.
3. Run `npm start` and scan the QR code with the Camera app (iOS) or Expo Go (Android).

If you still see *"Project is incompatible with this version of Expo Go"*, update Expo Go to the latest version. If your Expo Go build is older than SDK 54, use a simulator/emulator or a [development build](https://docs.expo.dev/develop/development-builds/introduction/).

### Install

```bash
npm install
```

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
| `history`     | `TaskHistoryEntry[]`                | Activity log (created/edited/etc.)     |

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
- **Expo SDK 54 vs 56** — SDK 56 is the latest scaffold, but Expo Go on devices lags behind new SDK releases. SDK 54 was chosen so the app opens with a simple QR scan during demos and PRITECH review. All features (dark mode, drag-to-reorder, i18n, etc.) work the same; only the underlying Expo/RN versions differ.
- **i18n** — all user-facing strings (including validation messages) are translated; language auto-detects from the device and can be switched in-app.
