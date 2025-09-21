import { MainLayout } from "@/components/layout/main-layout";
import { DashboardClient } from "./dashboard-client";

export default function Home() {
  return (
    <MainLayout>
      <DashboardClient />
    </MainLayout>
  );
}
