import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-zinc-200 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-bold tracking-tight text-black block mb-4">
              Travel and Tour
            </Link>
            <p className="text-zinc-500 text-sm mb-6">
              Crafting unforgettable journeys for travelers worldwide. Experience the world with confidence and style.
            </p>
            <div className="flex space-x-4 text-zinc-400">
              <Link href="#" className="hover:text-black transition-colors"><Facebook className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-black transition-colors"><Instagram className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-black transition-colors"><Twitter className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-black transition-colors"><Linkedin className="w-5 h-5" /></Link>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold text-black mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><Link href="#" className="hover:text-black transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Press</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-black mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><Link href="#" className="hover:text-black transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-black mb-4">Work with us</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><Link href="#" className="hover:text-black transition-colors">Become a Partner</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Affiliate Program</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Partner Support</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Supplier Portal</Link></li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Copyright Row */}
        <div className="border-t border-zinc-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500">
          <p>© 2026 Travel and Tour Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-black transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-black transition-colors">Terms</Link>
            <Link href="#" className="hover:text-black transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}