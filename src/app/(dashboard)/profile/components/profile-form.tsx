"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { profileUpdateSchema, type ProfileUpdatePayload } from "@/modules/profile/profile.validation";
import type { ActionResult } from "@/modules/shared/types";
import { updateProfileAction } from "@/modules/profile/profile.actions";
import type { Profile } from "@/modules/profile/profile.types";

interface ProfileFormProps {
  initialProfile: Profile;
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [serverResult, setServerResult] = useState<ActionResult<Profile>>({ success: false });
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProfileUpdatePayload>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: initialProfile.full_name,
      phone: initialProfile.phone ?? "",
      emergencyContact: initialProfile.emergency_contact ?? "",
    },
  });

  const {
    register,
    formState: { errors },
  } = form;

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await updateProfileAction(values);
      setServerResult(result);
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          form.setError(field as keyof ProfileUpdatePayload, { message: messages[0] });
        });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-xl">
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
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          autoComplete="name"
          {...register("fullName")}
        />
        <p className="text-sm text-destructive">{errors.fullName?.message}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Contact number</Label>
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="Optional"
          {...register("phone")}
        />
        <p className="text-sm text-destructive">{errors.phone?.message}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="emergencyContact">Emergency contact</Label>
        <Input
          id="emergencyContact"
          placeholder="Optional"
          {...register("emergencyContact")}
        />
        <p className="text-sm text-destructive">{errors.emergencyContact?.message}</p>
      </div>

      <Button
        type="submit"
        className="bg-brand text-brand-foreground hover:bg-brand/90"
        disabled={isPending}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save changes
      </Button>
    </form>
  );
}

