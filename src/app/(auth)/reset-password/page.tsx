"use client";

import { useEffect, useState } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ROUTE_PATHS } from "@/config/routes";
import { createClient } from "@supabase/utils/client";
import type { ActionResult } from "@/features/shared/types";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [serverResult, setServerResult] = useState<ActionResult>({ success: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    formState: { errors },
  } = form;

  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (!isMounted) return;

        if (error || !data.user) {
          setServerResult({
            success: false,
            message:
              "Your password reset link is invalid or has expired. Please request a new reset link.",
          });
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    setServerResult({ success: false });

    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        const message =
          error.message?.toLowerCase().includes("expired") ||
          error.message?.toLowerCase().includes("invalid")
            ? "Your password reset link is invalid or has expired. Please request a new reset link."
            : "We couldn't update your password. Please try again, or request a new reset link.";

        setServerResult({
          success: false,
          message,
        });
        return;
      }

      setServerResult({
        success: true,
        message: "Your password has been updated. You can now log in with your new password.",
      });

      setTimeout(() => {
        router.push(ROUTE_PATHS.PUBLIC.AUTH.LOGIN);
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  });

  const isDisabled = isSubmitting || isCheckingSession || !!serverResult.message && !serverResult.success;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-2xl font-bold">Set a new password</CardTitle>
          <CardDescription className="text-slate-500">
            Choose a strong password you haven&apos;t used before on this site.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={onSubmit} className="space-y-4">
            {serverResult.message && (
              <p
                className={`rounded-md px-3 py-2 text-sm ${
                  serverResult.success
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {serverResult.message}
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter a new password"
                autoComplete="new-password"
                disabled={isDisabled}
                {...register("password")}
              />
              <p className="text-sm text-destructive">{errors.password?.message}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your new password"
                autoComplete="new-password"
                disabled={isDisabled}
                {...register("confirmPassword")}
              />
              <p className="text-sm text-destructive">{errors.confirmPassword?.message}</p>
            </div>

            <Button
              type="submit"
              className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
              disabled={isDisabled}
            >
              {(isSubmitting || isCheckingSession) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update password
            </Button>

            <p className="mt-4 text-center text-sm text-slate-500">
              Remembered your password?{" "}
              <Link
                href={ROUTE_PATHS.PUBLIC.AUTH.LOGIN}
                className="font-semibold text-brand hover:underline"
              >
                Go back to login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

