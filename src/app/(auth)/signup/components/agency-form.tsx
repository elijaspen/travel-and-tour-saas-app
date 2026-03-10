"use client";

import { useActionState } from "react";
import { Loader2, MailCheck } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SIGNUP_CTAS } from "@/config/labels";
import type { Profile } from "@/features/profile/profile.service";
import { signUpAgencyAction } from "@/features/profile/actions";
import type { ActionResult } from "@/features/shared/types";

const initialState: ActionResult<Profile> = { success: false };

export function AgencySignupForm() {
  const [state, action, isPending] = useActionState(signUpAgencyAction, initialState);

  return (
    <form action={action} className="space-y-4">
      {state.message && !state.success && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      )}

      {state.success && (
        <div className="flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          <MailCheck className="mt-0.5 h-4 w-4 text-emerald-600" />
          <p>
            We&apos;ve sent a confirmation link to your email. Check your inbox and click the
            link to confirm your account. Once confirmed, you can log in.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="agencyName">Agency Name</Label>
          <Input
            id="agencyName"
            name="agencyName"
            placeholder="Island Escapes Co."
            required
          />
          {state.fieldErrors?.agencyName && (
            <p className="text-sm text-destructive">{state.fieldErrors.agencyName[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input
            id="contactPerson"
            name="contactPerson"
            placeholder="Maria Santos"
            required
          />
          {state.fieldErrors?.contactPerson && (
            <p className="text-sm text-destructive">{state.fieldErrors.contactPerson[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Business Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="hello@youragency.com"
          required
        />
        {state.fieldErrors?.email && (
          <p className="text-sm text-destructive">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+63 917 000 0000"
        />
        {state.fieldErrors?.phone && (
          <p className="text-sm text-destructive">{state.fieldErrors.phone[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Min. 6 characters"
          required
          minLength={6}
        />
        {state.fieldErrors?.password && (
          <p className="text-sm text-destructive">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          required
        />
        {state.fieldErrors?.confirmPassword && (
          <p className="text-sm text-destructive">{state.fieldErrors.confirmPassword[0]}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
        disabled={isPending || state.success}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {SIGNUP_CTAS.business_owner}
      </Button>
    </form>
  );
}
