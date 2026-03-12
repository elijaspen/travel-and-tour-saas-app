 "use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type DelayedRedirectProps = {
  href: string;
  delayMs?: number;
};

export function DelayedRedirect({ href, delayMs = 2000 }: DelayedRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(href);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [router, href, delayMs]);

  return null;
}

