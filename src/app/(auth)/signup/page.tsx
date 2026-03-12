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
import { ProfileRole, ProfileRoles } from "@/features/profile/profile.types";
import { SignupForm } from "./components/signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a WorkWanders account — for travelers and travel agencies.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const defaultTab: ProfileRole =
    type === ProfileRoles.BUSINESS_OWNER ? ProfileRoles.BUSINESS_OWNER : ProfileRoles.CUSTOMER;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-xl border-0 shadow-xl">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
          <CardDescription className="text-slate-500">
            Join thousands of travelers and agencies on WorkWanders
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <SignupForm defaultTab={defaultTab} />
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href={ROUTE_PATHS.PUBLIC.AUTH.LOGIN} className="font-semibold text-brand hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
