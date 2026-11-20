import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Invitations', href: '#invitations' },
    { label: 'Wishes', href: '#wishes' },
    { label: 'Christmas Extras', href: '#extras' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#D8B56D]/15 bg-[#091725]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark + Star Emblem */}
        <a
          href="#home"
          className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-[#F8F1E5] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8B56D]"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="text-[#D8B56D] shrink-0"
          >
            <path
              d="M12 2L14.3 9.7L22 12L14.3 14.3L12 22L9.7 14.3L2 12L9.7 9.7L12 2Z"
              fill="currentColor"
            />
          </svg>
          <span className="font-display">Santa Studio</span>
        </a>

        {/* Zone 2: Desktop Single-Line Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#F8F1E5]/80"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap shrink-0 transition-colors duration-200 hover:text-[#D8B56D] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8B56D]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="./editor.html?type=invitation&template=invitation-01"
            className="hidden md:inline-flex items-center justify-center rounded-lg bg-[#D8B56D] px-5 py-2.5 text-sm font-semibold text-[#091725] whitespace-nowrap shrink-0 transition-all duration-200 hover:bg-[#E4C788] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8F1E5]"
          >
            Create Your Card
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#D8B56D]/25 text-[#F8F1E5] md:hidden hover:bg-[#143B2C]/50 focus-visible:outline-2 focus-visible:outline-[#D8B56D]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="border-t border-[#D8B56D]/15 bg-[#091725]/95 px-4 pb-5 pt-3 md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-11 items-center rounded-lg px-3 text-base font-medium text-[#F8F1E5]/90 hover:bg-[#143B2C]/50 hover:text-[#D8B56D]"
              >
                {item.label}
              </a>
            ))}
            <a
              href="./editor.html?type=invitation&template=invitation-01"
              className="mt-2 flex min-h-11 items-center justify-center rounded-lg bg-[#D8B56D] px-5 py-2.5 text-sm font-semibold text-[#091725] hover:bg-[#E4C788]"
            >
              Create Your Card
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
