import { MainLayout } from "@/components/layout/main-layout";
import { MarketplaceClient } from "./marketplace-client";

export default function MarketplacePage() {
  return (
    <MainLayout>
      <MarketplaceClient />
    </MainLayout>
  );
}
