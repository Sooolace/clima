"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";

type HeaderProps = {
  onSearch: (city: string) => void;
};

export default function Header({ onSearch }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <Link
          href="/"
          className="flex-shrink-0 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/30 rounded-lg"
        >
          <img src="/climalogo.png" alt="Clima Logo" className="h-9 sm:h-10 w-auto" />
        </Link>

        <div className="flex-1 min-w-0 max-w-xl mx-4">
          <SearchBar onSearch={onSearch} />
        </div>

        <ul className="hidden md:flex items-center gap-1 flex-shrink-0">
          <li>
            <Link
              href="#about"
              className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="https://kentllavado.vercel.app/#contact"
              className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
