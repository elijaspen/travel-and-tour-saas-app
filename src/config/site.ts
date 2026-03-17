
export const siteConfig = {
  name: "WorkWanders",
  description: "A modern travel and tour marketplace connecting travelers with verified agencies.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og.png",
  /** Logo image path (e.g. "/logo.svg"). When set, used in AppLogo; otherwise the default icon is shown. */
  logoImage: undefined as string | undefined,
  links: {
    github: "https://github.com/your-username/travel-and-tour-saas-app",
  },
} as const;

export type SiteConfig = typeof siteConfig;
