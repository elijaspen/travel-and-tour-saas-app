import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
};

export function OfferPromoSection({ offer }: OfferPromoSectionProps) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white">
          <div className="grid min-h-[480px] md:grid-cols-2">
            <div className="relative min-h-[320px]">
              <Image
                src={offer.image}
                alt={offer.title}
                fill
                className="object-cover"
                priority
              />
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
                  {offer.disclaimer ??
                    "By subscribing you agree to our Terms & Privacy Policy."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}