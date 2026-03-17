import type { Metadata } from "next";
import Link from "next/link";
import { ROUTE_PATHS } from "@/config/routes";
import { ProfileRoles } from "@/features/profile/profile.types";
import { SignupForm } from "./components/signup-form";

export const metadata: Metadata = {
  title: "Sign Up | WorkWanders",
  description: "Create a WorkWanders account.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const defaultTab = type ?? ProfileRoles.CUSTOMER;

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:space-y-6 w-full sm:w-[400px] md:w-[450px]">
      <div className="flex flex-col space-y-2 text-center lg:text-left">
        {/* Mobile Branding Escape Hatch */}
        <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight lg:hidden mb-3 sm:mb-4 hover:opacity-80">
          WorkWanders
        </Link>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Create your account</h2>
        <p className="text-sm text-muted-foreground">
          Join thousands of travelers and agencies on WorkWanders
        </p>
      </div>

      <SignupForm defaultTab={defaultTab} />
      
      <p className="px-4 sm:px-8 text-center text-sm text-muted-foreground mt-4">
        Already have an account?{" "}
        <Link 
          href={ROUTE_PATHS.PUBLIC.AUTH.LOGIN} 
          className="font-semibold text-zinc-900 hover:underline underline-offset-4"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}