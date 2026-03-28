import type { Metadata } from "next";

import ExplorePageClient from "./page-client";

export const metadata: Metadata = {
  title: "Explore",
  description: "Browse tours and destinations.",
};

export default function ExplorePage() {
  return <ExplorePageClient />;
}
