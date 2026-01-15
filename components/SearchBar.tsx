'use client'

import { useState, useEffect, FormEvent, useRef } from 'react'
import { FaSearch } from 'react-icons/fa';


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
    <div ref={containerRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex w-full">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          className="flex-1 px-4 py-2 rounded-l-full focus:outline-none text-white"
        />
        <button
          type="submit"
          className="bg-sky-900 hover:bg-sky-950 text-white px-6 py-2 rounded-r-full font-semibold transition-colors"
        >
          <FaSearch />
        </button>
      </form>

      {/* Suggestions dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto text-black">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSelect(s.name)}
            >
              {s.name}, {s.region ? s.region + ', ' : ''}{s.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
