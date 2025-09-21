import { MainLayout } from "@/components/layout/main-layout";
import { AnalyticsClient } from "./analytics-client";

export default function AnalyticsPage() {
  return (
    <MainLayout>
      <AnalyticsClient />
    </MainLayout>
  );
}
