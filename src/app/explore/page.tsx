import { Suspense } from "react";
import type { Metadata } from "next";

import { CenteredPageLoading } from "@/components/shared/layout/centered-page-loading";

import ExplorePageClient from "./page-client";

export const metadata: Metadata = {
  title: "Explore",
  description: "Browse tours and destinations.",
};

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen">
          <CenteredPageLoading className="min-h-screen" />
        </div>
      }
    >
      <ExplorePageClient />
    </Suspense>
  );
}
