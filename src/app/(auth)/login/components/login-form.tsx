"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ROUTE_PATHS } from "@/config/routes";
import { loginAction } from "@/features/profile/profile.actions";
import { profileLoginSchema, type LoginPayload } from "@/features/profile/profile.validation";
import type { ActionResult } from "@/features/shared/types";
import { SocialAuth } from "@/components/common/social-auth";

import { FormInput } from "@/components/common/form-input";

export function LoginForm() {
  const [serverResult, setServerResult] = useState<ActionResult>({ success: false });
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginPayload>({
    resolver: zodResolver(profileLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { register, formState: { errors } } = form;

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await loginAction(values);
      setServerResult(result);
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          form.setError(field as keyof LoginPayload, { message: messages[0] });
        });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {serverResult.message && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverResult.message}
        </p>
      )}

      <FormInput
        id="email"
        label="Email Address"
        type="email"
        placeholder="juan@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <FormInput
        id="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        error={errors.password?.message}
        rightElement={
          <Link
            href={ROUTE_PATHS.PUBLIC.AUTH.FORGOT_PASSWORD}
            className="text-xs font-medium text-zinc-900 hover:underline"
          >
            Forgot password?
          </Link>
        }
        {...register("password")}
      />

      <div className="flex items-center gap-2">
        <Checkbox id="remember" name="remember" />
        <label htmlFor="remember" className="cursor-pointer select-none text-sm text-slate-600">
          Remember me for 30 days
        </label>
      </div>

      <Button
        type="submit"
        className="w-full bg-zinc-900 text-white hover:bg-zinc-800"
        disabled={isPending}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Log In
      </Button>

      <SocialAuth />
    </form>
  );
}