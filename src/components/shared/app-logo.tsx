import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

type AppLogoProps = {
  href?: string;
  /** Optional: hide the text, show only the icon. */
  iconOnly?: boolean;
  /** Size of the icon container. */
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Optional: override text color (e.g. "text-white" for dark backgrounds). */
  textClassName?: string;
};

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function AppLogo({
  href,
  iconOnly = false,
  size = "md",
  className,
  textClassName,
}: AppLogoProps) {
  const logoSrc = siteConfig.logoImage;
  const content = (
    <>
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand text-brand-foreground",
          sizeClasses[size]
        )}
      >
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt=""
            width={size === "sm" ? 24 : size === "md" ? 32 : 40}
            height={size === "sm" ? 24 : size === "md" ? 32 : 40}
            className="object-contain"
            aria-hidden
          />
        ) : (
          <MapPin className={cn(iconSizes[size])} aria-hidden />
        )}
      </div>
      {!iconOnly && (
        <span
          className={cn(
            "font-bold tracking-tight text-foreground",
            size === "sm" && "text-base",
            size === "md" && "text-lg",
            size === "lg" && "text-xl",
            textClassName
          )}
        >
          {siteConfig.name}
        </span>
      )}
    </>
  );

  const wrapperClassName = cn("flex items-center gap-2", className);

  if (href) {
    return (
      <Link href={href} className={wrapperClassName}>
        {content}
      </Link>
    );
  }

  return <div className={wrapperClassName}>{content}</div>;
}
