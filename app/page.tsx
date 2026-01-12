'use client';

import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import WeatherCard from '@/components/WeatherCard'
import Header from '@/components/Navbar';


export default function Home() {
  const [city, setCity] = useState('')
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

  const weekday = (dt: number) =>
    new Date(dt * 1000).toLocaleDateString(undefined, { weekday: 'short' })

  return (
    
<main className="min-h-screen bg-gradient-to-b from-blue-900 to-sky-600 flex flex-col items-center justify-center px-4 text-white">
  <Header onSearch={fetchWeather} />

  <div className="w-full max-w-6xl mx-auto mt-8 flex flex-col lg:flex-row gap-8 items-start">
    {/* left container */}
    <div className="w-full lg:w-1/2 backdrop-blur-md bg-white/20 rounded-2xl p-6 shadow-xl">
      {/* center messages and avoid extra borders/background */}
      {loading && (
        <div className="mt-3 w-full flex items-center justify-center">
          <p className="animate-pulse text-center text-sm opacity-90">Loading weather...</p>
        </div>
      )}

      {error && (
        <div className="mt-3 w-full flex items-center justify-center">
          <p className="text-center text-red-300">{error}</p>
        </div>
      )}

      {weather && !loading ? (
        <div className="w-full flex items-center justify-center">
          <WeatherCard data={weather} />
        </div>
      ) : (
        !loading && (
          <div className="mt-3 w-full flex items-center justify-center">
            <p className="text-sm text-center opacity-80">Search for a city to see current weather.</p>
          </div>
        )
      )}
    </div>

    {/* right container (forecast) */}
    <div className="w-full lg:w-1/2 backdrop-blur-md bg-white/20 rounded-2xl p-6 shadow-xl">
      <h3 className="mb-4 text-lg font-semibold">7-Day Forecast</h3>

      {!weather && !loading && <p className="text-sm opacity-80">Forecast will appear here after a search.</p>}

{weather && weather.forecast?.forecastday && (
  <div className="grid grid-cols-7 gap-4 text-center text-white">
    {weather.forecast.forecastday.map((day: any) => {
      const date = new Date(day.date)
      const weekday = date.toLocaleDateString(undefined, { weekday: 'short' })

      return (
        <div key={day.date} className="flex flex-col items-center">
          <span className="text-xs">{weekday}</span>

          <img
            src={`https:${day.day.condition.icon}`}
            alt={day.day.condition.text}
            className="w-8 h-8"
          />

          <span className="font-semibold">
            {Math.round(day.day.maxtemp_c)}°C
          </span>

          <span className="text-xs opacity-70">
            {Math.round(day.day.maxtemp_c)}° / {Math.round(day.day.mintemp_c)}°
          </span>
        </div>
      )
    })}
  </div>
)}
    </div>
  </div>

</main>
  )
}
