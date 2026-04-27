"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  profileUpdateSchema,
  type ProfileUpdatePayload,
} from "@/modules/profile/profile.validation";
import type { ActionResult } from "@/modules/shared/types";
import { updateProfileAction } from "@/modules/profile/profile.actions";
import type { Profile } from "@/modules/profile/profile.types";
import { cn } from "@/lib/utils";
import { getUserInitials } from "@/modules/profile/profile.utils";

interface ProfileFormProps {
  initialProfile: Profile;
  userEmail: string;
}

export function ProfileForm({ initialProfile, userEmail }: ProfileFormProps) {
  const router = useRouter();
  const [serverResult, setServerResult] = useState<ActionResult<Profile>>({ success: false });
  const [isPending, startTransition] = useTransition();

  const initials = getUserInitials(initialProfile.full_name);

  const maskedEmail = useMemo(() => {
    const email = userEmail || initialProfile?.email;
    if (!email) return "";

    const [local, domain] = email.split("@");
    if (!local || !domain) return email;

    return local.length > 3 ? `${local.substring(0, 3)}***@${domain}` : `${local}***@${domain}`;
  }, [userEmail, initialProfile?.email]);

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

      if (result.success) {
        form.reset(values);
        router.refresh();
      } else if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          form.setError(field as keyof ProfileUpdatePayload, { message: messages[0] });
        });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {serverResult.message && (
        <p
          className={cn(
            "rounded-md px-3 py-2 text-sm",
            serverResult.success
              ? "bg-emerald-50 text-emerald-800"
              : "bg-destructive/10 text-destructive",
          )}
        >
          {serverResult.message}
        </p>
      )}

      <div className="w-full space-y-8">
        <div className="flex items-center gap-6 pb-6 border-b border-border">
          <Avatar className="h-16 w-16 text-lg">
            <AvatarFallback className="bg-muted text-muted-foreground font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <Button type="button" variant="outline">
            Change photo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" autoComplete="name" {...register("fullName")} />
            <p className="text-sm text-destructive">{errors.fullName?.message}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="email">Email address</Label>
              <Badge
                variant="secondary"
                className="h-5 px-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none rounded-full text-[11px] font-semibold"
              >
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
            <Input id="email" value={maskedEmail} disabled />
            <p className="text-sm text-muted-foreground">Login email cannot be changed here.</p>
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
            <Input id="emergencyContact" placeholder="Optional" {...register("emergencyContact")} />
            <p className="text-sm text-destructive">{errors.emergencyContact?.message}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-border mt-4">
        <Button
          type="submit"
          className="bg-brand text-brand-foreground hover:bg-brand/90 min-w-[120px]"
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save changes
        </Button>
      </div>
    </form>
  );
}
