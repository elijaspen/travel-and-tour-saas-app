import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppLogo } from "@/components/shared/app-logo";
import { Button } from "@/components/ui/button";
import { ROUTE_PATHS } from "@/config/routes";
import { TravelPackagesGrid } from "@/components/shared/travel-package-card";
import { PackageSearchBar } from "@/components/shared/package-search-bar";
import { DestinationCardGrid } from "@/components/shared/destination-card-grid";
import { TrustBadgesSection } from "@/components/shared/trust-badges-grid";
import { OfferPromoSection } from "@/components/shared/offer-banner";
import Footer from "@/components/footer/footer";


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

const CURATED_DESTINATIONS = [
  {
    id: 1,
    image: "https://tjgiskidryllvyjannsq.supabase.co/storage/v1/object/public/public%20files/Gemini%20Generated%20Image%20(11).jpeg",
    tours: 130,
    city: "Palawan",
    country: "Philippines"
  },
  {
    id: 2,
    image: "https://tjgiskidryllvyjannsq.supabase.co/storage/v1/object/public/public%20files/Gemini%20Generated%20Image%20(7).jpeg",
    tours: 50,
    city: "Atoll",
    country: "Maldives"
  },
  {
    id: 3,
    image: "https://tjgiskidryllvyjannsq.supabase.co/storage/v1/object/public/public%20files/Gemini%20Generated%20Image%20(9).jpeg",
    tours: 33,
    city: "Misiones",
    country: "Brazil",
  },
];

const BANNER_OFFERS = {
  id: 1,
  image:"https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  badge: "Limited Time Offer",
  title: "Get 20% off your first booking",
  description:
    "Sign up today and receive an exclusive discount on your next adventure. Don't miss out on exploring the world for less.",
  buttonText: "Subscribe",
  disclaimer: "By subscribing you agree to our Terms & Privacy Policy.",
};

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
              Destinations
            </Link>
            <Link href="#agencies" className="text-sm font-medium text-slate-600 transition-colors hover:text-brand">
              Tours
            </Link>
            <Link href={ROUTE_PATHS.PUBLIC.MARKETING.ABOUT} className="text-sm font-medium text-slate-600 transition-colors hover:text-brand">
              Flights
            </Link>
            <Link href={ROUTE_PATHS.PUBLIC.MARKETING.ABOUT} className="text-sm font-medium text-slate-600 transition-colors hover:text-brand">
              Deals
            </Link>
            <Link href={ROUTE_PATHS.PUBLIC.MARKETING.ABOUT} className="text-sm font-medium text-slate-600 transition-colors hover:text-brand">
              Support
            </Link>
          </nav>

          <div className="flex items-center gap-3">
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
        <section className="relative flex min-h-[72vh] items-center justify-center">
          <Image
            src="https://tjgiskidryllvyjannsq.supabase.co/storage/v1/object/public/public%20files/Gemini%20Generated%20Image%20(10).jpeg"
            alt="Travel destination hero"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />

          <div className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover Your Next
              <span className="block"> Adventure.</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-200 sm:text-xl">
              Explore thousands of tours and unique experiences worldwide.
            </p>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 translate-y-1/2 px-4 sm:px-6 lg:px-8">
          <PackageSearchBar />
          </div>
        </section>

        {/* Curated Destinations */}
        <section className="bg-slate-50 py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Trending Destinations</h2>
                <p className="mt-2 text-slate-500">Curated just for you</p>
              </div>
            </div>
            <DestinationCardGrid destinations={CURATED_DESTINATIONS} />
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Featured Tours</h2>
                <p className="mt-2 text-slate-500">Unforgettable experiences hand-picked for you</p>
              </div>
              <Button variant="outline" className="shrink-0 gap-2 border-brand text-brand hover:bg-brand hover:text-brand-foreground" asChild>
                <Link href={ROUTE_PATHS.PUBLIC.MARKETING.TOURS}>
                  View All Tours <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <TravelPackagesGrid packages={FEATURED_PACKAGES} />
          </div>
        </section>

        {/* Trust Badges Section */}
        <TrustBadgesSection />

        {/* Banner Offers */}
        <OfferPromoSection offer={BANNER_OFFERS} />

      </main>

      <Footer/>
    </div>
  );
}
