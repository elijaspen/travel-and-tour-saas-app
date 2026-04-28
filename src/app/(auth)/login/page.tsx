import type { Metadata } from "next";
import Link from "next/link";
import { ROUTE_PATHS } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { LoginForm } from "@/app/(auth)/login/components/login-form";

export const metadata: Metadata = {
  title: "Log In | WorkWanders",
  description: "Log in to your WorkWanders account.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Log in to continue your adventure</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <LoginForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTE_PATHS.PUBLIC.AUTH.SIGNUP}
              className="font-semibold text-brand hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
