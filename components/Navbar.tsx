"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";

type HeaderProps = {
  onSearch: (city: string) => void;
};

export default function Header({ onSearch }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur border-b">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-blue-900">
          Clima 🌤️
        </Link>

        {/* Search triggers Home */}
        <SearchBar onSearch={onSearch} />

        <ul className="hidden md:flex gap-8 text-sm font-medium text-blue-900">
          <li>
            <Link href="#about">About</Link>
          </li>
          <li>
            <Link href="#contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
