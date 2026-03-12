import type { Metadata } from "next";

import { ProfileForm } from "./components/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { requireRole } from "@/features/profile/profile.guard";
import { ProfileRoles } from "@/features/profile/profile.types";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your WorkWanders profile details.",
};

export default async function ProfilePage() {
  const { profile } = await requireRole([ProfileRoles.CUSTOMER]);

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
          <ProfileForm initialProfile={profile} />
        </CardContent>
      </Card>
    </div>
  );
}

