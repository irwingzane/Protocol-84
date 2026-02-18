# Protocol84 Employee Performance Platform

A corporate employee performance and resilience platform built with **Next.js** and **React**. One website: marketing landing + app. The main site **Login** button gives access to the app (simulated login, no real authentication).

## Features

- **Marketing homepage** (/) with hero, how it works, programme, pricing, about, contact. Header **Login** links to the app.
- **Role selection** (/platform): Employee View or Manager View (no login required)
- **Employee app**: Dashboard, 12-week plan, workouts, nutrition, mental health, metrics, profile
- **Manager dashboard**: Organisation overview, employee list with progress and filters
- **Sidebar navigation**: Always visible on desktop, collapsible on mobile
- **Dynamic progress**: Mark weeks complete; progress bar and metrics update (state persisted in localStorage)
- **Mock data**: Employees, workouts, nutrition plans, mental health resources

## Tech stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

## Run locally

```bash
cd platform
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

1. Use the main site (scroll, nav links). Click **Login** in the header or hero to enter the app.
2. On /platform, choose **Employee View** or **Manager View**
3. Navigate via the sidebar

**Logo:** To show the Protocol84 logo in the header, copy `logo.PNG` from the project root into `platform/public/logo.PNG`.

## Project structure

```
platform/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (Header, Auth, Progress)
│   │   ├── page.tsx            # Homepage – Enter Platform
│   │   ├── platform/
│   │   │   ├── page.tsx        # Role selection (Employee / Manager)
│   │   │   ├── employee/
│   │   │   │   ├── layout.tsx  # Employee layout + sidebar
│   │   │   │   ├── dashboard/
│   │   │   │   ├── 12-week-plan/
│   │   │   │   ├── workouts/
│   │   │   │   ├── nutrition/
│   │   │   │   ├── mental-health/
│   │   │   │   ├── metrics/
│   │   │   │   └── profile/
│   │   │   └── manager/
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx    # Manager overview
│   │   │       └── employees/
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/   Header, Sidebar
│   │   └── ui/       Card, Button, ProgressBar
│   ├── lib/
│   │   ├── context/  auth-context, progress-context
│   │   ├── mock-data/  employees, workouts, nutrition, etc.
│   │   └── metrics.ts
│   └── types/
├── package.json
├── tailwind.config.ts
└── next.config.js
```

## Adding real authentication later

- **Auth context** (`src/lib/context/auth-context.tsx`) currently uses `localStorage` and mock role/employee. Replace with real auth (e.g. NextAuth, JWT, SSO) and set `role` and `employee` from the session.
- **Progress context** is keyed by `employee.id`; keep the same interface and feed a real user id from auth.
- Role selection can become a post-login step or be removed when users are identified by your IdP.

## Build for production

```bash
npm run build
npm start
```
