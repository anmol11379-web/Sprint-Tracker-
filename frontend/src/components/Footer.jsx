import { ExternalLink } from 'lucide-react';

const CLUB_LINKS = [
  { label: 'Website', href: 'https://androidclub.tech' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/android-club-vit-bhopal/',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/androidclub.vitb/',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@androidclub-vitb-wi4qe',
  },
];

export function Footer() {
  return (
    <footer className="w-full shrink-0 border-t border-neutral-500/35 bg-[#171717]/85 backdrop-blur-sm">
      <div className="flex w-full flex-col items-center justify-between gap-3 px-4 py-2.5 sm:flex-row sm:px-8">
        {/* Signature Android Club corner-bracket frame around official Logo.png */}
        <div className="flex items-center gap-3">
          <div className="relative px-2.5 py-1.5">
            <div
              aria-hidden="true"
              className="absolute left-0 top-0 h-0.5 w-3.5 bg-white"
            />
            <div
              aria-hidden="true"
              className="absolute left-0 top-0 h-5 w-0.5 bg-white"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-0 right-0 h-0.5 w-5 bg-white"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-0 right-0 h-4 w-0.5 bg-white"
            />
            <img
              src="/Logo.png"
              alt="Android Club VIT Bhopal"
              className="h-6 w-auto"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
              <span className="h-1 w-1 rounded-full bg-white" />
              <span className="h-1 w-1 rounded-full bg-orange-500" />
              <span>Android Club • VIT Bhopal</span>
            </div>
            <p className="text-xs font-semibold text-white">
              Built for the Community
            </p>
          </div>
        </div>

        <nav
          aria-label="Android Club social links"
          className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-end"
        >
          {CLUB_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring btn-smooth group inline-flex min-h-[32px] items-center gap-1 rounded border border-neutral-500/35 bg-[#0A090F] px-2.5 py-1 text-[11px] font-medium text-neutral-300 hover:border-[#ff7300]/70 hover:text-[#ff7300]"
              >
                <span>{link.label}</span>
                <ExternalLink
                  className="h-3 w-3 opacity-70 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

