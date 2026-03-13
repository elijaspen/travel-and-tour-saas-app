import type { Metadata } from "next";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTE_PATHS } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { ForgotPasswordForm } from "./components/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: `Reset access to your ${siteConfig.name} account.`,
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-2xl font-bold">Forgot your password?</CardTitle>
          <CardDescription className="text-slate-500">
            Enter your email and we&apos;ll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <ForgotPasswordForm />
          <p className="mt-6 text-center text-sm text-slate-500">
            Remembered it?{" "}
            <Link
              href={ROUTE_PATHS.PUBLIC.AUTH.LOGIN}
              className="font-semibold text-brand hover:underline"
            >
              Go back to login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

