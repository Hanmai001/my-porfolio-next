import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/shared/config/constants";

export default function RootPage() {
  redirect(APP_ROUTES.app.dashboard);
}
