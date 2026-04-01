"use client";

import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

import { SidebarNavLink } from "@/components/shared/layout/sidebar-nav-link";
import type { NavGroup } from "@/config/navigation";

type SidebarNavGroupProps = {
  group: NavGroup;
};

export function SidebarNavGroup({ group }: SidebarNavGroupProps) {
  const pathname = usePathname();
  const hasActiveChild = group.children.some((child) => {
    const isExact = child.exact ?? false;
    return (
      pathname === child.href ||
      (!isExact && child.href !== "/" && pathname.startsWith(child.href + "/"))
    );
  });
  const defaultOpen = hasActiveChild;

  return (
    <Collapsible defaultOpen={defaultOpen} className="group">
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          "text-muted-foreground hover:bg-accent hover:text-foreground",
          hasActiveChild && "text-foreground"
        )}
      >
        <group.icon className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-border pl-3">
          {group.children.map((child) => (
            <li key={child.href}>
              <SidebarNavLink
                href={child.href}
                label={child.label}
                icon={<child.icon className="h-4 w-4 shrink-0" />}
                comingSoon={child.comingSoon}
                exact={child.exact}
              />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
