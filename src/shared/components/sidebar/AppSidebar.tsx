import Link from "next/link";
import { APP_ROUTES } from "@/shared/config/constants";

export function AppSidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <span className="text-sm font-semibold text-foreground">App</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        <Link
          href={APP_ROUTES.app.dashboard}
          className="flex items-center rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
        >
          Dashboard
        </Link>
        <Link
          href={APP_ROUTES.app.notifications}
          className="flex items-center rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
        >
          Notifications
        </Link>
        <Link
          href={APP_ROUTES.app.settings}
          className="flex items-center rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
        >
          Settings
        </Link>
      </nav>
    </aside>
  );
}
