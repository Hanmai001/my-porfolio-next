import type { Metadata } from "next";
import { NotificationsView } from "@/features/notifications/views/NotificationsView";

export const metadata: Metadata = { title: "Notifications" };

export default function NotificationsPage() {
  return <NotificationsView />;
}
