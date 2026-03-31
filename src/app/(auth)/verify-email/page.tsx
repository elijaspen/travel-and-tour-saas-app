import type { Metadata } from "next";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROUTE_PATHS } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { createClient } from "@supabase/utils/server";
import { DelayedRedirect } from "@/components/shared/layout/delayed-redirect";

type SearchParams = {
  token_hash?: string;
  type?: string;
  code?: string;
  redirect_to?: string;
};

type VerifyEmailResult = {
  success: boolean;
  message: string;
};

export const metadata: Metadata = {
  title: "Verify Email",
  description: `Confirm your email address to start using ${siteConfig.name}.`,
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { token_hash, type, code } = await searchParams;

  let result: VerifyEmailResult;

  if (!token_hash && !code) {
    result = {
      success: false,
      message:
        "This confirmation link is missing required information or has already been used. Please request a new confirmation email or try logging in.",
    };
  } else {
    const supabase = await createClient();

    // Prefer the token_hash + verifyOtp flow (recommended by Supabase),
    // but keep a fallback for older links that might still be using ?code=...
    if (token_hash) {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash,
        type: (type as "signup" | "email") ?? "signup",
      });

      if (error || !data.session) {
        result = {
          success: false,
          message:
            "We couldn’t confirm your email from this link. It may have expired or already been used. Please request a new confirmation email or try logging in.",
        };
      } else {
        result = {
          success: true,
          message:
            "Your email has been confirmed and you’re now logged in. We’re taking you to your dashboard.",
        };
      }
    } else if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error || !data.session) {
        result = {
          success: false,
          message:
            "We couldn’t confirm your email from this link. It may have expired or already been used. Please request a new confirmation email or try logging in.",
        };
      } else {
        result = {
          success: true,
          message:
            "Your email has been confirmed and you’re now logged in. We’re taking you to your dashboard.",
        };
      }
    } else {
      result = {
        success: false,
        message:
          "This confirmation link is missing required information or has already been used. Please request a new confirmation email or try logging in.",
      };
    }
  }

  const isSuccess = result.success;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-2xl font-bold">
            {isSuccess ? "Email confirmed" : "Trouble confirming your email"}
          </CardTitle>
          <CardDescription>
            {isSuccess
              ? "You’re all set. We’ll redirect you in a moment."
              : "We couldn’t verify this confirmation link."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <p
            className={`rounded-md px-3 py-2 text-sm ${
              isSuccess
                ? "bg-brand/10 text-brand"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {result.message}
          </p>

          {isSuccess ? (
            <>
              <p className="text-sm text-muted-foreground">
                If you&apos;re not redirected automatically, you can continue to your
                dashboard.
              </p>
              <Button
                className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
                asChild
              >
                <Link href={ROUTE_PATHS.AUTHED.SHARED.DASHBOARD}>
                  Go to dashboard
                </Link>
              </Button>
              <DelayedRedirect
                href={ROUTE_PATHS.AUTHED.SHARED.DASHBOARD}
                delayMs={2000}
              />
            </>
          ) : (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="text-center">
                You can try logging in again or request a new confirmation email.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <Link href={ROUTE_PATHS.PUBLIC.AUTH.LOGIN}>Back to login</Link>
                </Button>
                <Button
                  className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
                  asChild
                >
                  <Link href={ROUTE_PATHS.PUBLIC.AUTH.SIGNUP}>
                    Create a new account
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

