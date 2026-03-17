"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SidebarNavLinkProps = {
  href: string;
  label: string;
  icon: ReactNode;
  comingSoon?: boolean;
};

export function SidebarNavLink({ href, label, icon, comingSoon }: SidebarNavLinkProps) {
  const pathname = usePathname();
  const isActive = !comingSoon && (pathname === href || (href !== "/" && pathname.startsWith(href)));

  const baseClass = cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
    isActive
      ? "bg-brand/10 font-semibold text-brand"
      : "font-medium text-muted-foreground hover:bg-accent hover:text-foreground",
    comingSoon && "cursor-default opacity-50 hover:bg-transparent hover:text-muted-foreground"
  );

  const content = (
    <>
      {icon}
      <span className="flex-1">{label}</span>
      {comingSoon && (
        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium leading-none text-muted-foreground">
          Soon
        </span>
      )}
    </>
  );

  if (comingSoon) {
    return (
      <span className={baseClass} aria-disabled="true">
        {content}
      </span>
    );
  }

  return (
    <Link href={href} className={baseClass}>
      {content}
    </Link>
  );
}
