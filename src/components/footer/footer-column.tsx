import Link from "next/link";

type FooterColumnProps = {
    title: string;
    links: {
      label: string;
      href: string;
    }[];
  };
  
export default function FooterColumn({ title, links }: FooterColumnProps) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
  
        <ul className="mt-4 space-y-3 text-sm text-neutral-500">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="hover:text-neutral-900 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }