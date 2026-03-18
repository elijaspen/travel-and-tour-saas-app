import { ShieldCheck, Globe, BadgeCheck } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Booking",
    description:
      "We guarantee the best prices and secure payment processing for every trip.",
  },
  {
    icon: Globe,
    title: "Global Support",
    description:
      "24/7 customer support in over 30 languages to help you anywhere.",
  },
  {
    icon: BadgeCheck,
    title: "Best Quality",
    description:
      "Hand-picked tours ensuring top-notch experiences and memories.",
  },
];

export function TrustBadgesSection() {
  return (
    <section className="bg-gray-100 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm">
                  <Icon className="h-7 w-7 text-neutral-900" strokeWidth={1.8} />
                </div>

                <h3 className="text-2xl font-semibold tracking-tight text-neutral-900">
                  {feature.title}
                </h3>

                <p className="mt-4 max-w-sm text-lg leading-8 text-neutral-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}