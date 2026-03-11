import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Dashboard",
  description: "Manage your agency operations.",
};

export default function BusinessDashboardPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Business Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Business owner landing page placeholder. Management modules can be added
          here.
        </p>
      </div>
    </div>
  );
}
