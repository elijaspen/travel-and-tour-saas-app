import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, MailCheck } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SIGNUP_CTAS } from "@/config/labels";

export function AgencySignupForm() {
  const [serverError] = useState<string | null>(null);
  const [signupComplete] = useState(false);
  const [submittedEmail] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      type: "",
      agencyName: "",
      contactPerson: "",
      email: "",
      phone: undefined,
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="agencyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agency Name</FormLabel>
                <FormControl>
                  <Input placeholder="Island Escapes Co." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person</FormLabel>
                <FormControl>
                  <Input placeholder="Maria Santos" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="hello@youragency.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+63 917 000 0000" {...field} />
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
          {SIGNUP_CTAS.business_owner}
        </Button>
      </form>
    </Form>
  );
}

