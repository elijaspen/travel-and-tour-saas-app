import type { LucideIcon } from "lucide-react";
import {
  BarChart2,
  Building2,
  Calendar,
  LayoutDashboard,
  Map,
  Package,
  Settings,
  Shield,
  Star,
  Tag,
  User,
  Users,
} from "lucide-react";

import type { ProfileRole } from "@/modules/profile/profile.types";
import { ProfileRoles } from "@/modules/profile/profile.types";
import { ROUTE_PATHS } from "@/config/routes";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  comingSoon?: boolean;
  /** When true, only highlight on exact path match; prevents parent from highlighting when on child route */
  exact?: boolean;
};

export type NavGroup = {
  label: string;
  icon: LucideIcon;
  children: NavItem[];
};

export type RoleNavConfig = {
  home: string;
  navItems: (NavItem | NavGroup)[];
  bottomNavItems: NavItem[];
};

const NAV_CONFIG: Record<ProfileRole, RoleNavConfig> = {
  [ProfileRoles.CUSTOMER]: {
    home: ROUTE_PATHS.AUTHED.SHARED.DASHBOARD,
    navItems: [
      {
        label: "Dashboard",
        href: ROUTE_PATHS.AUTHED.SHARED.DASHBOARD,
        icon: LayoutDashboard,
      },
      { label: "Trips", href: "#", icon: Map, comingSoon: true },
      { label: "Reviews", href: "#", icon: Star, comingSoon: true },
      { label: "Profile", href: "#", icon: User, comingSoon: true },
    ],
    bottomNavItems: [],
  },
  [ProfileRoles.BUSINESS_OWNER]: {
    home: ROUTE_PATHS.AUTHED.AGENCY.ROOT,
    navItems: [
      {
        label: "Overview",
        href: ROUTE_PATHS.AUTHED.AGENCY.ROOT,
        icon: LayoutDashboard,
        exact: true,
      },
      { label: "Tours", href: ROUTE_PATHS.AUTHED.AGENCY.TOURS, icon: Package },
      { label: "Bookings", href: "#", icon: Calendar, comingSoon: true },
      { label: "Promos", href: "#", icon: Tag, comingSoon: true },
      { label: "Customers", href: "#", icon: Users, comingSoon: true },
      { label: "Analytics", href: "#", icon: BarChart2, comingSoon: true },
    ],
    bottomNavItems: [
      { label: "Settings", href: "#", icon: Settings, comingSoon: true },
    ],
  },
  [ProfileRoles.AGENT]: {
    home: ROUTE_PATHS.AUTHED.AGENCY.ROOT,
    navItems: [
      {
        label: "Overview",
        href: ROUTE_PATHS.AUTHED.AGENCY.ROOT,
        icon: LayoutDashboard,
        exact: true,
      },
      { label: "Tours", href: ROUTE_PATHS.AUTHED.AGENCY.TOURS, icon: Package },
      { label: "Bookings", href: "#", icon: Calendar, comingSoon: true },
      { label: "Promos", href: "#", icon: Tag, comingSoon: true },
      { label: "Customers", href: "#", icon: Users, comingSoon: true },
      { label: "Analytics", href: "#", icon: BarChart2, comingSoon: true },
    ],
    bottomNavItems: [
      { label: "Settings", href: "#", icon: Settings, comingSoon: true },
    ],
  },
  [ProfileRoles.ADMIN]: {
    home: ROUTE_PATHS.AUTHED.ADMIN.ROOT,
    navItems: [
      {
        label: "Admin",
        icon: Shield,
        children: [
          {
            label: "Overview",
            href: ROUTE_PATHS.AUTHED.ADMIN.ROOT,
            icon: LayoutDashboard,
            exact: true,
          },
          {
            label: "Businesses",
            href: ROUTE_PATHS.AUTHED.ADMIN.BUSINESSES,
            icon: Building2,
          },
        ],
      },
      {
        label: "Profile",
        href: ROUTE_PATHS.AUTHED.SHARED.PROFILE,
        icon: User,
      },
    ],
    bottomNavItems: [],
  },
};

export function getNavConfig(role: ProfileRole): RoleNavConfig {
  return NAV_CONFIG[role];
}

export function isNavGroup(item: NavItem | NavGroup): item is NavGroup {
  return "children" in item && Array.isArray(item.children);
}
