import { ExplorePackageCard, type ExplorePackage } from "@/components/shared/explore/explore-package-card";

interface ExplorePackagesGridProps {
  packages: ExplorePackage[];
}

export function ExplorePackagesGrid({ packages }: ExplorePackagesGridProps) {
  if (!packages.length) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center text-sm text-slate-500">
        No results found.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {packages.map((pkg) => (
        <ExplorePackageCard key={pkg.id} pkg={pkg} />
      ))}
    </div>
  );
}