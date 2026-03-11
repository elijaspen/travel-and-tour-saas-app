"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck, Globe, Apple } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { SIGNUP_CTAS } from "@/config/labels";
import type { Profile } from "@/features/profile/profile.types";
import type { ActionResult } from "@/features/shared/types";
import {
  customerSignupFormSchema,
  type CustomerSignupFormValues,
} from "@/features/profile/profile.validation";
import { signUpCustomerAction } from "@/features/profile/profile.actions";

export function CustomerSignupForm() {
  const [serverResult, setServerResult] = useState<ActionResult<Profile>>({ success: false });
  const [isPending, startTransition] = useTransition();

  const form = useForm<CustomerSignupFormValues>({
    resolver: zodResolver(customerSignupFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    formState: { errors },
  } = form;

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await signUpCustomerAction(values);
      setServerResult(result);
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          form.setError(field as keyof CustomerSignupFormValues, { message: messages[0] });
        });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {serverResult.message && !serverResult.success && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverResult.message}
        </p>
      )}

      {serverResult.success && (
        <div className="flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          <MailCheck className="mt-0.5 h-4 w-4 text-emerald-600" />
          <p>
            We&apos;ve sent a confirmation link to your email. Check your inbox and click the
            link to confirm your account. Once confirmed, you can log in.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          placeholder="Juan dela Cruz"
          {...register("fullName")}
        />
        <p className="text-sm text-destructive">
          {errors.fullName?.message}
        </p>
      </div>

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
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Min. 6 characters"
          {...register("password")}
        />
        <p className="text-sm text-destructive">
          {errors.password?.message}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          {...register("confirmPassword")}
        />
        <p className="text-sm text-destructive">
          {errors.confirmPassword?.message}
        </p>
      </div>

      <Button
        type="submit"
        className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
        disabled={isPending || serverResult.success}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {SIGNUP_CTAS.customer}
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
