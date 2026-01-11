'use client';

import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import WeatherCard from '@/components/WeatherCard'

export default function Home() {
  const [city, setCity] = useState('Digos City')
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchWeather = async (cityName: string) => {
    try {
      setLoading(true)
      setError('')

      const res = await fetch(`/api/weather?city=${cityName}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch weather')
      }

      setWeather(data)
      setCity(cityName)
    } catch (err: any) {
      setError(err.message)
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 to-sky-600 flex flex-col items-center justify-center px-4 text-white">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        Clima 🌤️
      </h1>

      <p className="text-sm opacity-80 mb-6">
        Check real-time weather updates
      </p>

      {/* Search */}
      <SearchBar onSearch={fetchWeather} defaultCity={city} />

      {/* Status */}
      {loading && (
        <p className="mt-6 animate-pulse">Loading weather...</p>
      )}

      {error && (
        <p className="mt-6 text-red-300">{error}</p>
      )}

      {/* Weather Display */}
      {weather && !loading && (
        <WeatherCard data={weather} />
      )}

      {/* Footer */}
      <footer className="mt-10 text-xs opacity-70">
        Built with Next.js & WeatherAPI
      </footer>
    </main>
  )
}
