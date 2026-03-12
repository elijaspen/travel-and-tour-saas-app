import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Onboarding",
  description: "Set up your company profile.",
};

export default function BusinessOnboardingPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center px-4">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Welcome, business owner</h1>
        <p className="text-slate-600">
          Your account has been created. Next, you&apos;ll set up your company profile so
          travelers can discover and book your tours.
        </p>
        <p className="text-sm text-slate-500">
          Company details such as agency name, branding, and contact information will be
          configured here in a future step.
        </p>
      </div>
    </div>
  );
}

