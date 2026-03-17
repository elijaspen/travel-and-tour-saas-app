"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  AlignLeft,
  Mail,
  Phone,
  MapPin,
  Loader2,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppLogo } from "@/components/shared/layout/app-logo";
import { createCompanyAction } from "@/modules/company/company.actions";
import {
  companyOnboardingSchema,
  type CompanyOnboardingPayload,
} from "@/features/company/company.validation";
import { COMPANY_PERMIT_ALLOWED_MIME_TYPES } from "@/features/company/company.constants";
import type { ActionResult } from "@/features/shared/types";
import type { Company } from "@/features/company/company.types";

export function BusinessOnboardingModal() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverResult, setServerResult] = useState<ActionResult<Company> | null>(null);
  const [done, setDone] = useState(false);
  const [permitFile, setPermitFile] = useState<File | null>(null);
  const [permitError, setPermitError] = useState<string | null>(null);

  const form = useForm<CompanyOnboardingPayload>({
    resolver: zodResolver(companyOnboardingSchema),
    defaultValues: {
      name: "",
      description: "",
      contact_email: "",
      contact_phone: "",
      location: "",
    },
  });

  const {
    register,
    formState: { errors },
  } = form;

  const onSubmit = form.handleSubmit((values) => {
    if (!permitFile) {
      setPermitError("Business permit is required.");
      return;
    }

    startTransition(async () => {
      setPermitError(null);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description ?? "");
      formData.append("contact_email", values.contact_email ?? "");
      formData.append("contact_phone", values.contact_phone ?? "");
      formData.append("location", values.location ?? "");
      formData.append("permit_file", permitFile);

      const result = await createCompanyAction(formData);
      setServerResult(result);

      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          if (field === "permit_url") {
            setPermitError(messages[0] || "Permit upload is required.");
            return;
          }
          form.setError(field as keyof CompanyOnboardingPayload, { message: messages[0] });
        });
        return;
      }

      if (result.success) {
        setDone(true);
        setTimeout(() => router.refresh(), 800);
      }
    });
  });

  return (
    <Dialog open={true} modal={true}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="max-w-lg gap-0 overflow-hidden rounded-2xl p-0"
      >
        {done ? (
          <div className="flex flex-col items-center gap-4 px-8 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-7 w-7 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-semibold">You&apos;re all set!</DialogTitle>
            <DialogDescription>Taking you to your dashboard…</DialogDescription>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col">
            {/* Header */}
            <DialogHeader className="items-center border-b border-border bg-muted/40 px-8 py-6 text-center sm:text-center">
              <AppLogo size="md" />
              <DialogTitle className="text-xl font-semibold">
                Welcome! Let&apos;s set up your business
              </DialogTitle>
              <DialogDescription>
                Tell us a bit about your company to get started. You can always update these later.
              </DialogDescription>
            </DialogHeader>

            {/* Form body */}
            <div className="flex flex-col gap-5 px-8 py-6">
              {serverResult && !serverResult.success && serverResult.message && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {serverResult.message}
                </p>
              )}

              {/* Business Identity */}
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Business Identity
                </p>

                <div className="space-y-1.5">
                  <Label htmlFor="name">
                    Business Name <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="e.g. Sunset Travel Co."
                      className="pl-9"
                      {...register("name")}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description">About Your Business</Label>
                  <div className="relative">
                    <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="description"
                      placeholder="A short description of what your business does…"
                      className="min-h-[80px] resize-none pl-9"
                      maxLength={500}
                      {...register("description")}
                    />
                  </div>
                  {errors.description && (
                    <p className="text-xs text-destructive">{errors.description.message}</p>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Contact Info
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact_email">Business Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="contact_email"
                        type="email"
                        placeholder="hello@yourbiz.com"
                        className="pl-9"
                        {...register("contact_email")}
                      />
                    </div>
                    {errors.contact_email && (
                      <p className="text-xs text-destructive">{errors.contact_email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact_phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="contact_phone"
                        type="tel"
                        placeholder="+63 917 000 0000"
                        className="pl-9"
                        {...register("contact_phone")}
                      />
                    </div>
                    {errors.contact_phone && (
                      <p className="text-xs text-destructive">{errors.contact_phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="e.g. Cebu City, Philippines"
                      className="pl-9"
                      {...register("location")}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-xs text-destructive">{errors.location.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="permit_file">
                  Business Permit <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="permit_file"
                    type="file"
                    className="pl-9"
                    accept={COMPANY_PERMIT_ALLOWED_MIME_TYPES.join(",")}
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setPermitFile(file);
                      setPermitError(null);
                    }}
                  />
                </div>
                {permitError && <p className="text-xs text-destructive">{permitError}</p>}
                <p className="text-xs text-muted-foreground">Upload PDF, PNG, or JPG up to 2MB.</p>
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="flex-col gap-3 border-t border-border bg-muted/40 px-8 py-5 sm:flex-col">
              <Button
                type="submit"
                className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up your business…
                  </>
                ) : (
                  "Complete Setup"
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Your account will be reviewed before going live. We&apos;ll notify you once
                approved.
              </p>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
