import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, MailCheck, Globe, Apple } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SIGNUP_CTAS } from "@/config/labels";

export function CustomerSignupForm() {
  const [serverError] = useState<string | null>(null);
  const [signupComplete] = useState(false);
  const [submittedEmail] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      type: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // TODO: ADD ACTION HERE
  async function onSubmit(values: unknown) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {serverError}
          </p>
        )}

        {signupComplete && (
          <div className="flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            <MailCheck className="mt-0.5 h-4 w-4 text-emerald-600" />
            <p>
              We&apos;ve sent a confirmation link to{" "}
              <span className="font-semibold">
                {submittedEmail || "your email"}
              </span>
              . Check your inbox and click the link to confirm your account. Once
              confirmed, you can log in.
            </p>
          </div>
        )}

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Juan dela Cruz" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="juan@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Min. 8 characters" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Re-enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
          disabled={form.formState.isSubmitting || signupComplete}
        >
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {SIGNUP_CTAS.customer}
        </Button>

        <div className="relative my-2">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or continue with
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="gap-2 text-sm"
            onClick={() => {
              /* TODO: wire OAuth */
            }}
          >
            <Globe className="h-4 w-4" />
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-2 text-sm"
            onClick={() => {
              /* TODO: wire OAuth */
            }}
          >
            <Apple className="h-4 w-4" />
            Apple
          </Button>
        </div>
      </form>
    </Form>
  );
}

