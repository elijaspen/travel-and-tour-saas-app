import { Button } from "@/components/ui/button";
import { Clock, Star } from "lucide-react";

export default function FeaturedTours() {
  const tours = [
    { id: 1, title: "Kyoto Traditional Tea Ceremony", days: 5, rating: 4.9, reviews: 120, price: 1299, image: "https://placehold.co/600x400" },
    { id: 2, title: "Safari Adventure in Serengeti", days: 7, rating: 4.8, reviews: 85, price: 2450, image: "https://placehold.co/600x400g" },
    { id: 3, title: "Northern Lights in Iceland", days: 6, rating: 5.0, reviews: 200, price: 1899, image: "https://placehold.co/600x400" },
  ];

  return (
    <section id="tours" className="w-full max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight mb-2">Featured Tours</h2>
          <p className="text-zinc-500">Unforgettable experiences hand-picked for you</p>
        </div>
        <Button variant="outline" className="mt-4 md:mt-0 rounded-full px-6">View All Tours</Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tours.map((tour) => (
          <div key={tour.id} className="border border-zinc-200 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow">
            <div className="relative h-56 w-full bg-zinc-200">
              <img src="https://placehold.co/600x400" alt="placeholder" className="w-full h-full object-cover" />
            </div>
            
            <div className="p-6">
              <h3 className="font-bold text-lg mb-3">{tour.title}</h3>
              <div className="flex items-center text-sm text-zinc-600 mb-6 space-x-4">
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {tour.days} Days</span>
                <span className="flex items-center text-amber-500"><Star className="w-4 h-4 mr-1 fill-current" /> {tour.rating} <span className="text-zinc-500 ml-1">({tour.reviews} reviews)</span></span>
              </div>
              
              <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">From</p>
                  <p className="font-bold text-xl">${tour.price.toLocaleString()}</p>
                </div>
                <Button variant="outline" className="rounded-lg">View Details</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}