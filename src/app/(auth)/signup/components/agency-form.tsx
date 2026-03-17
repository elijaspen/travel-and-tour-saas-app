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
  agencySignupFormSchema,
  type AgencySignupFormValues,
} from "@/features/profile/profile.validation";
import { signUpAgencyAction } from "@/features/profile/profile.actions";
import { FormInput } from "@/components/common/form-input";

export function AgencySignupForm() {
  const [serverResult, setServerResult] = useState<ActionResult<Profile>>({ success: false });
  const [isPending, startTransition] = useTransition();

  const form = useForm<AgencySignupFormValues>({
    resolver: zodResolver(agencySignupFormSchema),
    defaultValues: {
      agencyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { register, formState: { errors } } = form;

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await signUpAgencyAction(values);
      setServerResult(result);
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          form.setError(field as keyof AgencySignupFormValues, { message: messages[0] });
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput
          id="agencyName"
          label="Agency Name"
          placeholder="Island Escapes Co."
          error={errors.agencyName?.message}
          {...register("agencyName")}
        />

        <FormInput
          id="contactPerson"
          label="Contact Person"
          placeholder="Maria Santos"
          error={errors.contactPerson?.message}
          {...register("contactPerson")}
        />
      </div>

      <FormInput
        id="email"
        label="Business Email"
        type="email"
        placeholder="hello@youragency.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <FormInput
        id="phone"
        label="Phone Number"
        type="tel"
        placeholder="+63 917 000 0000"
        error={errors.phone?.message}
        {...register("phone")}
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
        {SIGNUP_CTAS.business_owner}
      </Button>
    </form>
  );
}