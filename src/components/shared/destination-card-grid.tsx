import Image from "next/image";
import { Card } from "@/components/ui/card";

type DestinationPackage = {
  id: string | number;
  image: string;
  city: string;
  country: string;
  tours: number;
};

type DestinationCardProps = {
  destination: DestinationPackage;
};

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Card className="group gap-0 overflow-hidden rounded-[20px] border-0 bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[16px]">
        <Image
          src={destination.image}
          alt={destination.city}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-black/5" />

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <h3 className="text-[clamp(1.25rem,2vw,1.75rem)] font-semibold leading-tight drop-shadow-md">
            {destination.city}, {destination.country}
          </h3>
             <p className="mt-2 text-sm text-white/80">
               {destination.tours}+ Tours
             </p>
        </div>
      </div>
    </Card>
  );
}

type DestinationCardGridProps = {
  destinations: DestinationPackage[];
  emptyState?: React.ReactNode;
};

export function DestinationCardGrid({ destinations, emptyState }: DestinationCardGridProps) {
  if (!destinations.length) {
    return (
      emptyState ?? (
        <p className="text-center text-sm text-muted-foreground">No curated locations yet.</p>
      )
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {destinations.map((destination) => (
        <DestinationCard key={destination.id} destination={destination} />
      ))}
    </div>
  );
}

