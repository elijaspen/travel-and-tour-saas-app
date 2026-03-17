/**
 * I converted `proxy.ts` back to `middleware.ts` coz OpenNext Cloudflare doesn't support Node.js proxy file
 * 
 */

import { type NextRequest, NextResponse } from "next/server";
import { isProtectedRoute, isPublicRoute, ROUTE_PATHS } from "@/config/routes";
import { createServerClient } from "@supabase/ssr";
import { Database } from "@supabase/types";
import type { User } from "@supabase/supabase-js";

async function updateSessionAndGetUser(
  request: NextRequest
): Promise<{ response: NextResponse; user: User | null }> {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createServerClient<Database>(url!, anonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Do not run code between Supabase client creation and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response: supabaseResponse, user };
}

function copyCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach(({ name, value, ...options }) => {
    target.cookies.set(name, value, options);
  });
}

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSessionAndGetUser(request);
  const { pathname } = request.nextUrl;

  if (!isProtectedRoute(pathname) && !isPublicRoute(pathname)) {
    return response;
  }

  if (!user && isProtectedRoute(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = ROUTE_PATHS.PUBLIC.AUTH.LOGIN;
    const redirectResponse = NextResponse.redirect(loginUrl);
    copyCookies(response, redirectResponse);
    return redirectResponse;
  }

  if (user && isPublicRoute(pathname)) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = ROUTE_PATHS.AUTHED.SHARED.DASHBOARD;
    const redirectResponse = NextResponse.redirect(dashboardUrl);
    copyCookies(response, redirectResponse);
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

// Edge runtime configuration for OpenNext Cloudflare compatibility
export const runtime = "experimental-edge";
