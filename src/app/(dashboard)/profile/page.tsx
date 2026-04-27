import type { Metadata } from "next";

import { ProfileForm } from "@/app/(dashboard)/profile/components/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/layout/page-header";
import { siteConfig } from "@/config/site";
import { requireRole } from "@/modules/profile/profile.guard";
import { ProfileRoles } from "@/modules/profile/profile.types";

import { createClient } from "@supabase/utils/server";

export const metadata: Metadata = {
  title: "Profile",
  description: `Manage your ${siteConfig.name} profile details.`,
};

export default async function ProfilePage() {
  const { profile } = await requireRole([ProfileRoles.CUSTOMER]);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Profile"
        description="Keep your contact and emergency details up to date for smoother trips."
      />

      <Card>
        <CardHeader>
          <CardTitle>Personal details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm initialProfile={profile} userEmail={user?.email || profile.email || ""} />
        </CardContent>
      </Card>
    </div>
  );
}
