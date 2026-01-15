"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";

type HeaderProps = {
  onSearch: (city: string) => void;
};

export default function Header({ onSearch }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/20 backdrop-blur">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/">
      <img src="/climalogo.png" alt="Clima Logo" className="w-35"/>
      </Link>
        {/* Search triggers Home */}
        <SearchBar onSearch={onSearch} />
        <ul className="hidden md:flex gap-8 text-sm font-medium text-white-900">
          <li>
            <Link href="#about">About</Link>
          </li>
          <li>
            <Link href="https://kentllavado.vercel.app/#contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
