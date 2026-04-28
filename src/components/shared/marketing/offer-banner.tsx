import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Offer = {
  id: string | number;
  image: string;
  badge: string;
  title: string;
  description: string;
  buttonText?: string;
  disclaimer?: string;
};

type OfferPromoSectionProps = {
  offer: Offer;
  variant?: "default" | "explore" | "landing";
};

export function OfferPromoSection({ offer, variant = "default" }: OfferPromoSectionProps) {
  const isExplore = variant === "explore";

  return (
    <section className={cn(isExplore ? "bg-[#0b0d12] py-16" : "py-20")}>
      <div className={cn("mx-auto px-6", isExplore ? "max-w-7xl" : "max-w-6xl")}>
        <div
          className={cn(
            "overflow-hidden",
            isExplore
              ? "rounded-none border-0 bg-transparent"
              : "rounded-[24px] border border-neutral-200 bg-white",
          )}
        >
          {isExplore ? (
            <div className="grid gap-10 py-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,460px)] lg:items-center">
              <div className="max-w-2xl">
                <Badge className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white hover:bg-white/10">
                  {offer.badge}
                </Badge>

                <h2 className="mt-6 max-w-xl text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
                  {offer.title}
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
                  {offer.description}
                </p>
              </div>

              <div className="w-full">
                <form className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="h-12 rounded-xl border-white/10 bg-white/10 text-base text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-white/20"
                  />
                  <Button className="h-12 min-w-[130px] rounded-xl bg-white px-6 text-black hover:bg-white/90">
                    {offer.buttonText ?? "Subscribe"}
                  </Button>
                </form>

                <p className="mt-4 text-sm text-white/40">
                  {offer.disclaimer ?? "No spam, ever. Unsubscribe anytime."}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid min-h-[480px] md:grid-cols-2">
              <div className="relative min-h-[320px]">
                <Image src={offer.image} alt={offer.title} fill className="object-cover" priority />
              </div>

              <div className="flex items-center">
                <div className="w-full px-8 py-10 md:px-14 md:py-14">
                  <Badge className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white hover:bg-neutral-900">
                    {offer.badge}
                  </Badge>

                  <h2 className="mt-6 max-w-sm text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl">
                    {offer.title}
                  </h2>

                  <p className="mt-5 max-w-[32rem] text-[17px] leading-8 text-neutral-500">
                    {offer.description}
                  </p>

                  <form className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="h-12 rounded-xl border-neutral-200 text-base"
                    />
                    <Button className="h-12 min-w-[120px] rounded-xl bg-neutral-900 px-6 text-white hover:bg-neutral-800">
                      {offer.buttonText ?? "Subscribe"}
                    </Button>
                  </form>

                  <p className="mt-4 text-sm text-neutral-400">
                    {offer.disclaimer ?? "By subscribing you agree to our Terms & Privacy Policy."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
