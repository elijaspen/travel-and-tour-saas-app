export default function TrendingDestinations() {
  const destinations = [
    { id: 1, name: "Paris, France", tours: "320+ Tours", image: "https://placehold.co/600x400" },
    { id: 2, name: "Tokyo, Japan", tours: "150+ Tours", image: "https://placehold.co/600x400" },
    { id: 3, name: "New York, USA", tours: "210+ Tours", image: "https://placehold.co/600x400" },
    { id: 4, name: "Bali, Indonesia", tours: "180+ Tours", image: "https://placehold.co/600x400" },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight mb-2">
          Trending Destinations
        </h2>
        <p className="text-zinc-500">Curated just for you</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map((dest) => (
          <div key={dest.id} className="relative h-80 w-full rounded-2xl overflow-hidden group cursor-pointer">
            <img src="https://placehold.co/600x400" alt="placeholder" className="w-full h-full object-cover" />
            
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Text */}
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h3 className="text-xl font-bold mb-1">{dest.name}</h3>
              <p className="text-sm text-gray-200">{dest.tours}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}