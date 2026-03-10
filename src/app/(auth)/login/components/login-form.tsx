"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Globe, Apple } from "lucide-react";
import Link from "next/link";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ROUTE_PATHS } from "@/config/routes";

export function LoginForm() {
  const [serverError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: "", password: "" },
  });

  // TODO: ADD ACTION HERE
  async function onSubmit(values: unknown) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>
        )}

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
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link
                  href={ROUTE_PATHS.PUBLIC.AUTH.FORGOT_PASSWORD}
                  className="text-xs font-medium text-brand hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <label htmlFor="remember" className="cursor-pointer text-sm text-slate-600 select-none">
            Remember me for 30 days
          </label>
        </div>

        <Button
          type="submit"
          className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Log In
        </Button>

        <div className="relative my-2">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or continue with
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="outline" className="gap-2 text-sm" onClick={() => { /* TODO: wire OAuth */ }}>
            <Globe className="h-4 w-4" />
            Google
          </Button>
          <Button type="button" variant="outline" className="gap-2 text-sm" onClick={() => { /* TODO: wire OAuth */ }}>
            <Apple className="h-4 w-4" />
            Apple
          </Button>
        </div>
      </form>
    </Form>
  );
}
