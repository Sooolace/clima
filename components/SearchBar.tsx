'use client'

import { useState, FormEvent } from 'react'

interface SearchBarProps {
  onSearch: (city: string) => void
  defaultCity?: string
}

export default function SearchBar({ onSearch, defaultCity = '' }: SearchBarProps) {
  const [city, setCity] = useState(defaultCity)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!city.trim()) return
    onSearch(city.trim())
    setCity('') // Optional: clear input after search
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name..."
        className="flex-1 px-4 py-2 rounded-l-full focus:outline-none text-black"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-r-full font-semibold transition-colors"
      >
        Search
      </button>
    </form>
  )
}
