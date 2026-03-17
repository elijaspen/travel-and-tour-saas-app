"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Globe, Apple } from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { ROUTE_PATHS } from "@/config/routes";
import { loginAction } from "@/features/profile/profile.actions";
import { profileLoginSchema, type LoginPayload } from "@/features/profile/profile.validation";
import type { ActionResult } from "@/features/shared/types";

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

  const {
    register,
    formState: { errors },
  } = form;

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

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="juan@example.com"
          {...register("email")}
        />
        <p className="text-sm text-destructive">
          {errors.email?.message}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href={ROUTE_PATHS.PUBLIC.AUTH.FORGOT_PASSWORD}
            className="text-xs font-medium text-brand hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          {...register("password")}
        />
        <p className="text-sm text-destructive">
          {errors.password?.message}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="remember" name="remember" />
        <label htmlFor="remember" className="cursor-pointer select-none text-sm text-muted-foreground">
          Remember me for 30 days
        </label>
      </div>

      <Button
        type="submit"
        className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
        disabled={isPending}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Log In
      </Button>

      <div className="relative my-2">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
          or continue with
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button type="button" variant="outline" className="gap-2 text-sm">
          <Globe className="h-4 w-4" />
          Google
        </Button>
        <Button type="button" variant="outline" className="gap-2 text-sm">
          <Apple className="h-4 w-4" />
          Apple
        </Button>
      </div>
    </form>
  );
}
