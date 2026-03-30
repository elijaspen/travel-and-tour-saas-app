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
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
      <div className="flex flex-col space-y-2 text-center lg:text-left">
        {/* Branding Escape Hatch */}
        <Link href="/" className="text-2xl font-bold tracking-tight lg:hidden mb-4 hover:opacity-80">
          WorkWanders
        </Link>
        <h2 className="text-3xl font-semibold tracking-tight">Welcome back</h2>
        <p className="text-sm text-muted-foreground">
          Log in to continue your adventure
        </p>
      </div>

      <LoginForm />
      
      <p className="px-8 text-center text-sm text-muted-foreground mt-4">
        Don&apos;t have an account?{" "}
        <Link 
          href={ROUTE_PATHS.PUBLIC.AUTH.SIGNUP} 
          className="font-semibold text-zinc-900 hover:underline underline-offset-4"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}