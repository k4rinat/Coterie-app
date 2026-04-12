import Link from "next/link";

const columns = [
  {
    heading: "Platform",
    links: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Pricing",      href: "/pricing"      },
      { label: "Apply",        href: "/apply"         },
      { label: "For Brands",   href: "/brands"        },
      { label: "Book a Demo",  href: "/book-demo"     },
      { label: "FAQ",          href: "/faq"           },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign In",       href: "/sign-in"           },
      { label: "Dashboard",     href: "/app"               },
      { label: "My Profile",    href: "/app/profile"       },
      { label: "Opportunities", href: "/app/opportunities" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy",   href: "/privacy"       },
      { label: "Terms of Service", href: "/terms"         },
      { label: "Cookie Policy",    href: "/cookies"       },
      { label: "Accessibility",    href: "/accessibility" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-c-border bg-c-bg">
      <div className="max-w-8xl mx-auto px-8 lg:px-16 py-20 lg:py-28">

        {/* Top row — brand + columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-16 mb-20">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/home"
              className="font-serif text-2xl text-c-text tracking-[0.16em] hover:opacity-70 transition-opacity duration-200">
              Coterie
            </Link>
            <p className="mt-6 text-c-muted text-xs leading-loose max-w-[220px]">
              A private, verified professional network for senior creatives and luxury brands.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <p className="label-caps mb-6">{col.heading}</p>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}
                      className="text-[11px] text-c-muted hover:text-c-text transition-colors duration-200 tracking-wide">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact row */}
        <div className="mb-20 border-t border-c-border pt-12">
          <p className="label-caps mb-6">Contact</p>
          <div className="flex flex-wrap gap-10">
            {[
              { label: "General Inquiries", email: "hello@coterie.com"   },
              { label: "Press",             email: "press@coterie.com"   },
              { label: "Support",           email: "support@coterie.com" },
            ].map((c) => (
              <div key={c.email}>
                <p className="text-[11px] text-c-muted mb-1 tracking-wide">{c.label}</p>
                <a href={`mailto:${c.email}`}
                  className="text-[11px] text-c-text hover:opacity-60 transition-opacity duration-200 tracking-wide">
                  {c.email}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-c-border pt-12 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-8 max-w-lg">
            <div className="flex-1">
              <p className="label-caps mb-2">Newsletter</p>
              <p className="text-[11px] text-c-muted leading-relaxed">Occasional updates from the Coterie team.</p>
            </div>
            <div className="flex gap-0">
              <input
                type="email"
                placeholder="your@email.com"
                className="bg-transparent border border-c-border text-c-text text-[11px] px-4 py-2.5 w-48 focus:outline-none focus:border-c-muted transition-colors placeholder:text-c-muted/40"
              />
              <button className="btn-primary py-2.5 px-5 text-[9px]">Subscribe</button>
            </div>
          </div>
          <p className="mt-4 text-[10px] text-c-muted/50">
            By subscribing, you confirm you have read our{" "}
            <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-c-border pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[10px] text-c-muted tracking-wide">
            &copy; {new Date().getFullYear()} Coterie. All rights reserved.
          </p>
          <p className="label-caps text-[9px]">Access is reviewed. Membership is limited.</p>
        </div>

      </div>
    </footer>
  );
}
