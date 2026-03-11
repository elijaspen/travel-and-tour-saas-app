import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROLE_LABELS } from "@/config/labels";
import { ProfileRoles } from "@/features/profile/profile.types";

import { CustomerSignupForm } from "./customer-form";
import { AgencySignupForm } from "./agency-form";

interface SignupFormProps {
  defaultTab: string;
}

export function SignupForm({ defaultTab }: SignupFormProps) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="mb-6 grid w-full grid-cols-2">
        <TabsTrigger value={ProfileRoles.CUSTOMER}>{ROLE_LABELS.customer}</TabsTrigger>
        <TabsTrigger value={ProfileRoles.BUSINESS_OWNER}>{ROLE_LABELS.business_owner}</TabsTrigger>
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
