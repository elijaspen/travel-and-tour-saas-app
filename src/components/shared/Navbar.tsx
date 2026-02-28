import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white md:px-12 lg:px-24">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold tracking-tight text-black">
        Travel and Tour
      </Link>

      {/* Center Links */}
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-600">
        <Link href="/destinations" className="hover:text-black transition-colors">Destinations</Link>
        <Link href="/tours" className="hover:text-black transition-colors">Tours</Link>
        <Link href="/flights" className="hover:text-black transition-colors">Flights</Link>
        <Link href="/deals" className="hover:text-black transition-colors">Deals</Link>
        <Link href="/support" className="hover:text-black transition-colors">Support</Link>
      </div>

      {/* Auth Actions */}
      <div className="flex items-center space-x-6">
        <Link href="/login" className="text-sm font-medium text-black hover:text-zinc-600 transition-colors">
          Log in
        </Link>
        <Link href="/signup">
        <Button className="bg-[#18181B] text-white hover:bg-[#18181B]/90 rounded-md px-6 py-2">
          Sign Up
        </Button>
        </Link>
      </div>
    </nav>
  );
}