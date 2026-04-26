# Next.js 16 Template

A feature-sliced Next.js 16 App Router template with enforced dependency boundaries, Tailwind v4 CSS token theming, and shadcn/ui. Includes a working dashboard with a Server Component data fetch and a notifications stub. Auth, SWR, and form patterns are intentionally omitted — see [Extending the Template](#9-extending-the-template).

---

## 1. Folder Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout: fonts, global styles
│   ├── page.tsx                # Redirects to /dashboard
│   ├── globals.css             # Tailwind v4 + CSS variable tokens
│   └── (home)/                 # Route group: app shell with sidebar
│       ├── layout.tsx          # AppSidebar + <main>
│       ├── dashboard/page.tsx
│       └── notifications/page.tsx
├── features/
│   ├── dashboard/
│   │   ├── types/index.ts
│   │   └── views/DashboardView.tsx
│   └── notifications/
│       ├── types/index.ts
│       ├── components/NotificationCard.tsx
│       └── views/NotificationsView.tsx
└── shared/
    ├── components/
    │   ├── ui/                 # shadcn/ui: button, card, skeleton, badge, input, label
    │   └── sidebar/AppSidebar.tsx
    ├── config/
    │   └── constants.ts        # APP_ROUTES
    └── lib/
        └── utils.ts            # cn()
```

**Import direction (one-way only, enforced by ESLint):**

| Layer | Can import from |
|---|---|
| `app/` | `features/`, `shared/`, `shared/config/` |
| `features/` | `shared/`, `shared/config/` |
| `shared/` | `shared/config/` |
| `shared/config/` | nothing |

Always use `@/` absolute imports. Never use relative paths across layers.

---

## 2. Feature Structure

Every feature follows the same internal layout. Create directories as needed — not all are required for every feature:

```
features/{name}/
├── views/        # Page-level components. The only export consumed by app/.
├── components/   # Feature-scoped UI components
├── hooks/        # SWR data hooks, business logic
├── actions/      # Server Actions ("use server")
├── schemas/      # Zod schemas (shared by forms + actions)
├── types/        # Feature-specific TypeScript interfaces
└── store/        # Zustand store (only for complex client state)
```

**Rules:**
1. No cross-feature imports. If two features share code, promote it to `shared/`.
2. Pages in `app/` import views only — not individual components or hooks.
3. Deleting a feature folder should not break any other feature.
4. Schemas are shared between the client form (validation) and the Server Action (safety net).

**Thin page pattern:**

```tsx
// src/app/(home)/dashboard/page.tsx
import type { Metadata } from "next";
import { DashboardView } from "@/features/dashboard/views/DashboardView";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <DashboardView />;
}
```

---

## 3. Data Fetching

### Server Components (default)

Fetch data directly in `async` Server Components. No hooks, no loading state wiring — Next.js handles suspension automatically.

```tsx
// src/features/dashboard/views/DashboardView.tsx
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import type { Post } from "../types";

async function DashboardView() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts: Post[] = await res.json();

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <p className="text-xs text-muted-foreground">#{post.id}</p>
              <h2 className="line-clamp-2 text-sm font-medium capitalize text-foreground">
                {post.title}
              </h2>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-sm text-muted-foreground">{post.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export { DashboardView };
```

Add `loading.tsx` next to the page file for a skeleton fallback. Next.js will use it automatically.

### Client data fetching (SWR)

When a component needs live data with revalidation, pagination, or optimistic updates, use `swr` (already installed). Create a hook in `features/{name}/hooks/` that wraps `useSWR`. See [Extending the Template](#9-extending-the-template).

### Mutations (Server Actions)

For form submissions and data writes, use Server Actions (`"use server"`). Pair with `zod` for validation and `react-hook-form` for the form UI — both are already installed. See [Extending the Template](#9-extending-the-template).

---

## 4. Component Conventions

**Function declarations** — not arrow functions:

```tsx
// ✅
function NotificationCard({ notification }: NotificationCardProps) { ... }

// ❌
const NotificationCard = ({ notification }: NotificationCardProps) => { ... };
```

**Named props interfaces:**

```tsx
interface NotificationCardProps {
  notification: Notification;
  onMarkedRead?: () => void;
}
```

**Server vs Client:**

| Use `"use client"` when... | Keep as Server Component when... |
|---|---|
| Using React hooks (`useState`, `useEffect`, `useSWR`) | Fetching data with `async/await` |
| Attaching event handlers (`onClick`, `onChange`) | Rendering static or server-fetched content |
| Accessing browser APIs (`window`, `localStorage`) | Composing other Server Components |
| Using Next.js client hooks (`useRouter`, `usePathname`) | Importing server-only modules |

**Class merging with `cn()`** — always use it for conditional classes:

```tsx
import { cn } from "@/shared/lib/utils";

<Card className={cn("transition-colors", !notification.read && "border-primary/30 bg-primary/5")} />
```

---

## 5. Styling

Tailwind v4 with a **two-layer CSS variable token system** defined in `src/app/globals.css`.

**Layer 1 — Palette** (`@theme inline`): raw color values (blue, slate, etc.)

**Layer 2 — Semantic tokens** (`:root` / `.dark`): intent-based names that remap in dark mode automatically:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: var(--color-primary-600);    /* ← swap primary palette to rebrand */
  --muted-foreground: oklch(0.556 0 0);
  /* ... */
}
```

**Always use semantic tokens.** Never use raw Tailwind color utilities or `dark:` modifiers:

```tsx
// ✅
<div className="bg-background text-foreground border-border" />
<button className="bg-primary text-primary-foreground" />

// ❌
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
```

**Rebranding:** swap the four `--color-primary-*` values in `globals.css` to change the entire brand color:

```css
/* Blue → Violet */
--color-primary-50: #f5f3ff;
--color-primary-500: #8b5cf6;
--color-primary-600: #7c3aed;
--color-primary-700: #6d28d9;
```

**Icons:** use `lucide-react` (already installed):

```tsx
import { Bell, LayoutDashboard } from "lucide-react";
<Bell className="size-4" />
```

---

## 6. Tooling

**ESLint** (`eslint.config.mjs`):

| Rule | Level | Purpose |
|---|---|---|
| `boundaries/dependencies` | error | Enforces one-way layer imports |
| `unused-imports/no-unused-imports` | error | Blocks unused imports |
| `react-hooks/exhaustive-deps` | error | Prevents stale closures |
| `jsx-a11y/*` (6 rules) | error | Blocks a11y violations |

**Prettier** (`prettier.config.mjs`): `prettier-plugin-tailwindcss` sorts Tailwind classes automatically on save.

```bash
yarn lint          # Check ESLint
yarn format        # Auto-fix with Prettier
yarn format:check  # CI check
yarn type-check    # tsc --noEmit
```

---

## 7. Adding a Feature

1. Create `src/features/{name}/types/index.ts` — define TypeScript interfaces
2. Create `src/features/{name}/views/{Name}View.tsx` — build the page view
3. Create `src/app/(home)/{name}/page.tsx` — thin shell that imports the view
4. Add route to `APP_ROUTES` in `src/shared/config/constants.ts`
5. Add nav link to `src/shared/components/sidebar/AppSidebar.tsx`
6. Add feature-specific components under `src/features/{name}/components/` as needed

Run `yarn lint` after to confirm no boundary violations.

---

## 8. Extending the Template

These patterns are intentionally omitted from the template but all required packages are installed.

**Client data fetching (SWR)**
Add `src/shared/lib/fetcher.ts` (FetchError class + `fetcher<T>()`), then create hooks in `features/{name}/hooks/` using `useSWR` or `useSWRInfinite`. Wrap the app in `SWRConfig` in the root layout.

**Forms + validation**
Add a Zod schema in `features/{name}/schemas/`, wire it to `react-hook-form` in a client component, and add a Server Action in `features/{name}/actions/` that re-validates with the same schema before calling the backend.

**Complex UI state (Zustand)**
Add a store in `features/{name}/store/` using `create()` with the `immer` middleware for safe nested mutations. Use `persist` middleware for state that should survive page refresh.

**Auth + route protection**
Add `src/proxy.ts` (Next.js 16: export named `proxy()`, not `middleware()`). Handle three cases: inject `Authorization` header on `/proxy/*` routes, redirect authenticated users away from auth pages, redirect unauthenticated users to login. Add `src/shared/lib/session.ts` for cookie management using `await cookies()` from `next/headers`.

**Route handlers**
Use `src/app/api/` route handlers when you need server-side logic the proxy layer can't provide: setting HttpOnly cookies (auth login/logout), aggregating multiple backend calls, or streaming NDJSON/SSE responses.
