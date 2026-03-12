"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema, type ForgotPasswordPayload } from "@/features/profile/profile.validation";
import type { ActionResult } from "@/features/shared/types";
import { requestPasswordResetAction } from "@/features/profile/profile.actions";

export function ForgotPasswordForm() {
  const [serverResult, setServerResult] = useState<ActionResult>({ success: false });
  const [isPending, startTransition] = useTransition();

  const form = useForm<ForgotPasswordPayload>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    register,
    formState: { errors },
  } = form;

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await requestPasswordResetAction(values);
      setServerResult(result);
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          form.setError(field as keyof ForgotPasswordPayload, { message: messages[0] });
        });
      }
    });
  });

  return (
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
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
        />
        <p className="text-sm text-destructive">{errors.email?.message}</p>
      </div>

      <Button
        type="submit"
        className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
        disabled={isPending}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send reset link
      </Button>
    </form>
  );
}

