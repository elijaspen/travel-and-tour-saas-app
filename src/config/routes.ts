
export const ROUTE_PATHS = {
  PUBLIC: {
    MARKETING: {
      HOME: "/",
      EXPLORE: "/explore",
      TOURS: "/tours",
      ABOUT: "/about",
      FAQ: "/faq",
    },

    AUTH: {
      LOGIN: "/login",
      SIGNUP: "/signup",
      VERIFY_EMAIL: "/verify-email",
      FORGOT_PASSWORD: "/forgot-password",
      RESET_PASSWORD: "/reset-password",
    },
  },

  AUTHED: {
    SHARED: {
      DASHBOARD: "/dashboard",
      PROFILE: "/profile",
      SAVED: "/saved",
    },

    TRAVELER: {
      TRIPS: "/trips",
      REVIEWS: "/reviews",
    },

    AGENCY: {
      ROOT: "/agency",
      TOURS: "/agency/tours",
      BOOKINGS: "/agency/bookings",
      REVIEWS: "/agency/reviews",
      SETTINGS: "/agency/settings",
      ANALYTICS: "/agency/analytics",
      BILLING: "/agency/billing",
    },

    ADMIN: {
      ROOT: "/admin",
      BUSINESSES: "/admin/businesses",
      BUSINESS_DETAIL: (id: string) => `/admin/businesses/${id}`,
    },
  },
} as const;

export const PUBLIC_ROUTES = Object.values(ROUTE_PATHS.PUBLIC).flatMap((group) =>
  Object.values(group)
) as string[];

export const AUTHED_ROUTES = Object.values(ROUTE_PATHS.AUTHED).flatMap((group) =>
  Object.values(group)
) as string[];

export const isPublicRoute = (path: string): boolean =>
  PUBLIC_ROUTES.includes(path);

export const isProtectedRoute = (path: string): boolean =>
  AUTHED_ROUTES.includes(path);
