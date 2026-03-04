import { Button } from "@/components/ui/button";
import { ShieldCheck, Globe, Award } from "lucide-react";

export default function PromoSection() {
  return (
    <section className="w-full bg-zinc-50/50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mb-24">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white border border-zinc-200 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <ShieldCheck className="w-8 h-8 text-black" strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-lg mb-2 text-black">Secure Booking</h3>
            <p className="text-zinc-500 text-sm max-w-xs">We guarantee the best prices and secure payment processing for every trip.</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white border border-zinc-200 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Globe className="w-8 h-8 text-black" strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-lg mb-2 text-black">Global Support</h3>
            <p className="text-zinc-500 text-sm max-w-xs">24/7 customer support in over 30 languages to help you anywhere.</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white border border-zinc-200 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Award className="w-8 h-8 text-black" strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-lg mb-2 text-black">Best Quality</h3>
            <p className="text-zinc-500 text-sm max-w-xs">Hand-picked tours ensuring top-notch experiences and memories.</p>
          </div>
        </div>

        {/* Promo / Newsletter Box */}
        <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-sm">

          <div className="md:w-1/2 h-64 md:h-auto bg-zinc-200 bg-cover bg-center" style={{ backgroundImage: "url('/promo-resort.jpg')" }} />
          
          {/* Right Side Content */}
          <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center items-start">
            <span className="bg-black text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-full mb-6 tracking-wider">
              Limited Time Offer
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-black">Get 20% off your first booking</h2>
            <p className="text-zinc-500 mb-8 text-sm md:text-base">
              `Sign up today and receive an exclusive discount on your next adventure. Don`&apos`t miss out on exploring the world for less.`
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <input 
                type="email" 
                placeholder="Enter your email"
                aria-label="Enter your email"
                className="flex-1 px-4 py-3 border border-zinc-200 rounded-lg outline-none focus:border-black text-sm placeholder:text-zinc-400" 
              />
              <Button className="bg-black text-white px-8 py-6 rounded-lg hover:bg-black/90">
                Subscribe
              </Button>
            </div>
            <p className="text-[11px] text-zinc-400 mt-4">By subscribing you agree to our Terms & Privacy Policy.</p>
          </div>
        </div>
      </div>
    </section>
  );
}