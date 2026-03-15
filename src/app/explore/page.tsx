import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore",
  description: "Browse tours and destinations.",
};

export default function ExplorePage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Explore</h1>
        <p className="mt-2 text-slate-600">
          Traveler landing page placeholder. Tour discovery UI can be added here.
        </p>
      </div>
    </div>
  );
}
