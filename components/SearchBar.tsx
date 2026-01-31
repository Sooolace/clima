'use client'

import { useState, useEffect, FormEvent, useRef } from 'react'
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa'

interface SearchBarProps {
  onSearch: (city: string) => void
  defaultCity?: string
}

interface Suggestion {
  name: string
  region: string
  country: string
}

export default function SearchBar({ onSearch, defaultCity = '' }: SearchBarProps) {
  const [city, setCity] = useState(defaultCity)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch suggestions when user types
  useEffect(() => {
    if (!city) {
      setSuggestions([])
      return
    }

    const timeoutId = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${city}`)
      const data = await res.json()
      setSuggestions(data)
      setShowDropdown(true)
    }, 300) // debounce 300ms

    return () => clearTimeout(timeoutId)
  }, [city])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!city.trim()) return
    onSearch(city.trim())
    setShowDropdown(false)
  }

  const handleSelect = (name: string) => {
    setCity(name)
    setShowDropdown(false)
    onSearch(name)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className={`flex w-full items-center overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm border transition-all duration-200 ${
          isFocused ? 'border-white/40 ring-2 ring-white/20' : 'border-white/20 hover:border-white/30'
        }`}
      >
        <span className="pl-4 text-white/60">
          <FaMapMarkerAlt className="h-4 w-4" />
        </span>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search city..."
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-white placeholder-white/50 focus:outline-none text-sm sm:text-base"
        />
        <button
          type="submit"
          className="flex items-center justify-center h-11 w-11 sm:w-12 bg-white/20 hover:bg-white/30 text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <FaSearch className="h-4 w-4" />
        </button>
      </form>

      {/* Suggestions dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-2 rounded-xl overflow-hidden bg-white/95 backdrop-blur-xl border border-white/20 shadow-xl max-h-60 overflow-auto">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className="px-4 py-3 hover:bg-white/80 cursor-pointer text-gray-800 text-sm transition-colors flex items-center gap-2 border-b border-gray-100 last:border-0"
              onClick={() => handleSelect(s.name)}
            >
              <FaMapMarkerAlt className="h-3 w-3 text-sky-500 flex-shrink-0" />
              <span>
                {s.name}
                {s.region && `, ${s.region}`}
                {s.country && ` — ${s.country}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
