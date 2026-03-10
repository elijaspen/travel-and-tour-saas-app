\"use client\";

import { useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROLE_LABELS } from "@/config/labels";
import { AUTH_ROLES } from "@/features/auth/types";

import { CustomerSignupForm } from "./customer-form";
import { AgencySignupForm } from "./agency-form";

export function SignupForm() {
  // TODO: USE ENUM CONSTANTS HERE
  const searchParams = useSearchParams();
  const defaultTab =
    searchParams.get("type") === "business_owner"
      ? "business_owner"
      : "customer";

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="mb-6 grid w-full grid-cols-2">
        <TabsTrigger value={AUTH_ROLES.CUSTOMER}>{ROLE_LABELS.customer}</TabsTrigger>
        <TabsTrigger value={AUTH_ROLES.BUSINESS_OWNER}>{ROLE_LABELS.business_owner}</TabsTrigger>
      </TabsList>
      <TabsContent value="customer">
        <CustomerSignupForm />
      </TabsContent>
      <TabsContent value="business_owner">
        <AgencySignupForm />
      </TabsContent>
    </Tabs>
  );
}

