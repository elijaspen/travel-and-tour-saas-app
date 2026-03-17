"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SIGNUP_CTAS } from "@/config/labels";
import type { Profile } from "@/features/profile/profile.types";
import type { ActionResult } from "@/features/shared/types";
import {
  customerSignupFormSchema,
  type CustomerSignupFormValues,
} from "@/features/profile/profile.validation";
import { signUpCustomerAction } from "@/features/profile/profile.actions";
import { SocialAuth } from "@/components/common/social-auth";
import { FormInput } from "@/components/common/form-input";

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

  const { register, formState: { errors } } = form;

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

      <FormInput
        id="fullName"
        label="Full Name"
        placeholder="Juan dela Cruz"
        error={errors.fullName?.message}
        {...register("fullName")}
      />

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
        placeholder="Min. 6 characters"
        error={errors.password?.message}
        {...register("password")}
      />

      <FormInput
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="Re-enter your password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button
        type="submit"
        className="w-full bg-zinc-900 text-white hover:bg-zinc-800"
        disabled={isPending || serverResult.success}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {SIGNUP_CTAS.customer}
      </Button>

      <SocialAuth />
    </form>
  );
}