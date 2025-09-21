import { Metadata } from "next";
import { MainLayout } from "@/components/layout/main-layout";
import IntegrationsClient from "./integrations-client";

export const metadata: Metadata = {
  title: "Platform Integrations | Gemini",
  description:
    "Connect your art with popular platforms and track your analytics",
};

export default function IntegrationsPage() {
  return (
    <MainLayout>
      <IntegrationsClient />
    </MainLayout>
  );
}
