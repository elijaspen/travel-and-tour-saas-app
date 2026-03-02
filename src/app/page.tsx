import Image from "next/image";
import { Button } from "@/components/ui/button";
import TrendingDestinations from "@/components/shared/TrendingDestinations";
import FeaturedTours from "@/components/shared/FeaturedTours";
import PromoSection from "@/components/shared/PromoSection";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full h-150 flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="Hero Background"
            fill
            priority
            className="object-cover"
            quality={75}
          />
          <div className="absolute inset-0 bg-black/30 z-10" /> {/* Dark overlay */}
        </div>

        {/* Hero Text */}
        <div className="relative z-20 text-center text-white px-4 mt-12.5">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Discover Your Next<br />Adventure
          </h1>
          <p className="text-lg md:text-xl font-medium">
            Explore thousands of tours and unique experiences worldwide.
          </p>
        </div>

        {/* Floating Search Bar */}
        <div className="absolute -bottom-10 w-11/12 max-w-5xl bg-white rounded-xl shadow-xl flex flex-col md:flex-row items-center p-2 z-30">
          
          <div className="flex-1 w-full border-b md:border-b-0 md:border-r border-gray-200 px-6 py-3">
            <p className="text-[11px] font-bold text-black uppercase tracking-wider">Where To?</p>
            <input type="text" placeholder="Search destinations" className="w-full text-sm outline-none text-zinc-500 mt-1 placeholder:text-zinc-400" />
          </div>

          <div className="flex-1 w-full border-b md:border-b-0 md:border-r border-gray-200 px-6 py-3">
            <p className="text-[11px] font-bold text-black uppercase tracking-wider">Date</p>
            <input type="text" placeholder="Add dates" className="w-full text-sm outline-none text-zinc-500 mt-1 placeholder:text-zinc-400" />
          </div>

          <div className="flex-1 w-full px-6 py-3">
            <p className="text-[11px] font-bold text-black uppercase tracking-wider">Guests</p>
            <input type="text" placeholder="Add guests" className="w-full text-sm outline-none text-zinc-500 mt-1 placeholder:text-zinc-400" />
          </div>

          <Button className="w-full md:w-auto bg-[#18181B] text-white px-8 py-6 rounded-lg ml-2 hover:bg-[#18181B]/90 transition-colors">
            Search
          </Button>

        </div>
      </section>

      {/* Spacer */}
      <div className="h-24 w-full bg-zinc-50/50"></div>
      
      <TrendingDestinations />
      <FeaturedTours />
      <PromoSection />
    </main>
  );
}