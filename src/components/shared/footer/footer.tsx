import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import FooterColumn from "@/components/shared/footer/footer-column";

const footerLinks = {
  company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Blog", href: "#" },
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
  work: [
    { label: "Become a Partner", href: "#" },
    { label: "Affiliate Program", href: "#" },
    { label: "Partner Support", href: "#" },
    { label: "Supplier Portal", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <div className="mx-auto max-w-7xl px-6 py-16">

        {/* Top Grid */}
        <div className="grid gap-12 md:grid-cols-4">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Work Wanders.</h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-500">
              Crafting unforgettable journeys for travelers worldwide.
              Experience the world with confidence and style.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex gap-4 text-neutral-500">
              <Facebook size={18} className="hover:text-neutral-900 transition-colors cursor-pointer" />
              <Instagram size={18} className="hover:text-neutral-900 transition-colors cursor-pointer" />
              <Twitter size={18} className="hover:text-neutral-900 transition-colors cursor-pointer"/>
              <Linkedin size={18} className="hover:text-neutral-900 transition-colors cursor-pointer"/>
            </div>
          </div>

          {/* Company */}
          <FooterColumn title="Company" links={footerLinks.company} />

          {/* Support */}
          <FooterColumn title="Support" links={footerLinks.support} />

          {/* Work */}
          <FooterColumn title="Work with us" links={footerLinks.work} />

        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} WorkWanders. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Sitemap</Link>
          </div>

        </div>
      </div>
    </footer>
  );
}