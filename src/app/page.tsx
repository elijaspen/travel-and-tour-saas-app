import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ArrowRight, Facebook, Instagram, Twitter } from "lucide-react";
import { AppLogo } from "@/components/shared/app-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ROUTE_PATHS } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { TravelPackagesGrid } from "@/components/common/travel-package-card";
import { PackageSearchBar } from "@/components/common/package-search-bar";


// TODO: Replace with actual data from the database.
const FEATURED_PACKAGES = [
  {
    id: 1,
    image: "https://tjgiskidryllvyjannsq.supabase.co/storage/v1/object/public/public%20files/Gemini%20Generated%20Image%20(11).jpeg",
    title: "Bali Serenity Retreat",
    agency: "Island Escapes Co.",
    duration: "5 Days, 4 Nights",
    price: "₱18,500",
    rating: 4.9,
    reviews: 124,
  },
  {
    id: 2,
    image: "https://tjgiskidryllvyjannsq.supabase.co/storage/v1/object/public/public%20files/Gemini%20Generated%20Image%20(7).jpeg",
    title: "Palawan Island Hopping",
    agency: "PH Adventure Tours",
    duration: "3 Days, 2 Nights",
    price: "₱12,000",
    rating: 4.8,
    reviews: 89,
  },
  {
    id: 3,
    image: "https://tjgiskidryllvyjannsq.supabase.co/storage/v1/object/public/public%20files/Gemini%20Generated%20Image%20(9).jpeg",
    title: "Boracay Summer Package",
    agency: "Sun & Sea Travels",
    duration: "4 Days, 3 Nights",
    price: "₱15,800",
    rating: 4.7,
    reviews: 203,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <AppLogo
            href={ROUTE_PATHS.PUBLIC.MARKETING.HOME}
            size="md"
            className="text-xl"
            textClassName="text-slate-900"
          />

          <nav className="hidden items-center gap-8 md:flex">
            <Link href={ROUTE_PATHS.PUBLIC.MARKETING.TOURS} className="text-sm font-medium text-slate-600 transition-colors hover:text-brand">
              Browse Packages
            </Link>
            <Link href="#agencies" className="text-sm font-medium text-slate-600 transition-colors hover:text-brand">
              Top Agencies
            </Link>
            <Link href={ROUTE_PATHS.PUBLIC.MARKETING.ABOUT} className="text-sm font-medium text-slate-600 transition-colors hover:text-brand">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden border-brand text-brand hover:bg-brand hover:text-brand-foreground sm:flex" asChild>
              <Link href={`${ROUTE_PATHS.PUBLIC.AUTH.SIGNUP}?type=business_owner`}>List Your Agency</Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-brand" asChild>
              <Link href={ROUTE_PATHS.PUBLIC.AUTH.LOGIN}>Login</Link>
            </Button>
            <Button size="sm" className="bg-brand text-brand-foreground hover:bg-brand/90" asChild>
              <Link href={ROUTE_PATHS.PUBLIC.AUTH.SIGNUP}>Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
          <Image
            src="https://tjgiskidryllvyjannsq.supabase.co/storage/v1/object/public/public%20files/Gemini%20Generated%20Image%20(10).jpeg"
            alt="Travel destination hero"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />

          <div className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <Badge className="mb-6 bg-brand/20 text-brand-foreground border-brand/30 px-4 py-1 text-sm">
              100+ Verified Travel Agencies
            </Badge>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover Your Next
              <span className="block text-brand"> Adventure.</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-200 sm:text-xl">
              Book exclusive travel packages from top-rated local agencies. Trusted by thousands of travelers.
            </p>

            {/* Search Bar */}
            <PackageSearchBar />

            <p className="mt-4 text-sm text-slate-300">
              Popular: <span className="font-medium text-white">Palawan · Bali · Boracay · Cebu · Siargao</span>
            </p>
          </div>
        </section>

        {/* Featured Packages */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-brand">Hand-picked for you</p>
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Featured Travel Packages</h2>
                <p className="mt-2 text-slate-500">Curated packages from our highest-rated partner agencies.</p>
              </div>
              <Button variant="outline" className="shrink-0 gap-2 border-brand text-brand hover:bg-brand hover:text-brand-foreground" asChild>
                <Link href={ROUTE_PATHS.PUBLIC.MARKETING.TOURS}>
                  View All Packages <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <TravelPackagesGrid packages={FEATURED_PACKAGES} />
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-y border-slate-200 bg-white py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              {[
                { value: "12,000+", label: "Happy Travelers" },
                { value: "200+", label: "Travel Packages" },
                { value: "100+", label: "Partner Agencies" },
                { value: "4.9★", label: "Average Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-extrabold text-brand">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Agency CTA Banner */}
        <section id="agencies" className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand/80 to-slate-900 py-24">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-brand blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-brand blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <Badge className="mb-6 bg-brand/20 text-white border-white/20 px-4 py-1">For Travel Agencies</Badge>
            <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Are you a travel agency?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
              Join hundreds of agencies already growing their business on {siteConfig.name}. Reach thousands of travelers, manage bookings effortlessly, and scale your revenue.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="gap-2 bg-white px-8 font-semibold text-brand hover:bg-slate-100" asChild>
                <Link href={`${ROUTE_PATHS.PUBLIC.AUTH.SIGNUP}?type=business_owner`}>
                  Become a Partner <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 hover:text-white" asChild>
                <Link href={ROUTE_PATHS.PUBLIC.MARKETING.ABOUT}>Learn More</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-300">
              {["Free to list", "No hidden fees", "Real-time analytics", "Dedicated support"].map((f) => (
                <span key={f} className="flex items-center gap-1.5">
                  <BadgeCheck className="h-4 w-4 text-brand" />
                  {f}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-1">
              <AppLogo
                href={ROUTE_PATHS.PUBLIC.MARKETING.HOME}
                size="md"
                textClassName="text-white"
              />
              <p className="mt-4 max-w-xs text-sm leading-relaxed">
                The premier marketplace connecting travelers with top-rated local travel agencies.
              </p>
              <div className="mt-6 flex items-center gap-4">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* For Travelers */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">For Travelers</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { label: "Browse Packages", href: ROUTE_PATHS.PUBLIC.MARKETING.TOURS },
                  { label: "Top Destinations", href: ROUTE_PATHS.PUBLIC.MARKETING.TOURS },
                  { label: "Travel Guides", href: "#" },
                  { label: "My Bookings", href: ROUTE_PATHS.AUTHED.TRAVELER.TRIPS },
                  { label: "Reviews", href: "#" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Agencies */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">For Agencies</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { label: "Become a Partner", href: `${ROUTE_PATHS.PUBLIC.AUTH.SIGNUP}?type=business_owner` },
                  { label: "Agency Dashboard", href: ROUTE_PATHS.AUTHED.AGENCY.ROOT },
                  { label: "Manage Packages", href: ROUTE_PATHS.AUTHED.AGENCY.TOURS },
                  { label: "Analytics", href: ROUTE_PATHS.AUTHED.AGENCY.ANALYTICS },
                  { label: "Subscription Plans", href: ROUTE_PATHS.AUTHED.AGENCY.BILLING },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Company</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { label: "About Us", href: ROUTE_PATHS.PUBLIC.MARKETING.ABOUT },
                  { label: "FAQ", href: ROUTE_PATHS.PUBLIC.MARKETING.FAQ },
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms of Service", href: "#" },
                  { label: "Contact Us", href: "#" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="my-10 bg-white/10" />
          <div className="flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
            <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with
              <span className="mx-1 text-brand">♥</span>
              for adventurers everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
