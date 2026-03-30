"use client";

import { LogOut } from "lucide-react";

import { AppLogo } from "@/components/shared/layout/app-logo";
import { Button } from "@/components/ui/button";
import { SidebarNavGroup } from "@/components/shared/layout/sidebar-nav-group";
import { SidebarNavLink } from "@/components/shared/layout/sidebar-nav-link";
import { getNavConfig, isNavGroup } from "@/config/navigation";
import { logoutAction } from "@/features/profile/profile.actions";
import { getRoleLabel, getUserInitials } from "@/features/profile/profile.utils";
import type { Profile } from "@/features/profile/profile.types";

type DashboardSidebarProps = {
  profile: Profile;
};

export function DashboardSidebar({ profile }: DashboardSidebarProps) {
  const navConfig = getNavConfig(profile.role);
  const initials = getUserInitials(profile.full_name);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r bg-background">
      <div className="flex h-14 items-center px-5 border-b">
        <AppLogo href={navConfig.home} size="md" />
      </div>

      <div className="flex flex-col items-center gap-2 px-5 py-5 border-b">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-base font-semibold text-muted-foreground">
          {initials}
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold leading-tight">
            {profile.full_name ?? "User"}
          </p>
          <p className="text-xs text-muted-foreground">
            {getRoleLabel(profile.role)}
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-0.5">
          {navConfig.navItems.map((item) => (
            <li key={item.label}>
              {isNavGroup(item) ? (
                <SidebarNavGroup group={item} />
              ) : (
                <SidebarNavLink
                  href={item.href}
                  label={item.label}
                  icon={<item.icon className="h-4 w-4 shrink-0" />}
                  comingSoon={item.comingSoon}
                  exact={item.exact}
                />
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t px-3 py-3">
        {navConfig.bottomNavItems.map((item) => (
          <SidebarNavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={<item.icon className="h-4 w-4 shrink-0" />}
            comingSoon={item.comingSoon}
            exact={item.exact}
          />
        ))}
        <form action={logoutAction} className="mt-1">
          <Button
            variant="ghost"
            size="sm"
            type="submit"
            className="w-full justify-start gap-3 px-3 font-medium text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Log Out
          </Button>
        </form>
      </div>
    </aside>
  );
}
