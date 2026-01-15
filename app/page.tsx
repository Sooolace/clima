'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar'
import WeatherCard from '@/components/WeatherCard'
import Header from '@/components/Navbar';
import { getWeatherBg } from './utils/getWeatherBg';

export default function Home() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastCondition, setLastCondition] = useState('')
  const condition =
  weather?.current?.condition?.text || lastCondition
  const isNight = weather
  ? (() => {
      const hour = parseInt(weather.location.localtime.split(' ')[1].split(':')[0])
      return hour >= 19 || hour < 6
    })()
  : false

const bgClass = getWeatherBg(condition, isNight)

console.log('condition:', condition, 'isNight:', isNight, 'bgClass:', bgClass)

const showClouds =
  condition.toLowerCase().includes('cloud') ||
  condition.toLowerCase().includes('cloudy') ||
  condition.toLowerCase().includes('overcast')
const showRain =
  condition.toLowerCase().includes('rain') ||
  condition.toLowerCase().includes('drizzle') ||
  condition.toLowerCase().includes('shower')


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
      setLastCondition(data.current.condition.text)
      setCity(cityName)
    } catch (err: any) {
      setError(err.message)
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  // Check if geolocation is supported
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          setLoading(true);
          setError('');

          // Fetch weather using lat/lon
          const res = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || 'Failed to fetch weather');
          }

          setWeather(data);
          setLastCondition(data.current.condition.text);
          setCity(data.location.name); // display city name from API
        } catch (err: any) {
          setError(err.message);
          setWeather(null);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        // fallback to default city if geolocation fails
        fetchWeather('Manila'); 
      }
    );
  } else {
    // fallback if browser doesn't support geolocation
    fetchWeather('Manila');
  }
}, []);

  const weekday = (dt: number) =>
    new Date(dt * 1000).toLocaleDateString(undefined, { weekday: 'short' })

  return (
<main
  className="relative min-h-screen 
    flex flex-col items-center justify-center px-4 text-white overflow-hidden"
>
  <div
    className={`absolute inset-0 -z-10 transition-all duration-700 ${bgClass} 
      ${showClouds ? 'clouds' : ''} 
      ${showRain ? 'rain' : ''}`
    }
    aria-hidden
  />  

  {/* CONTENT */}
  <Header onSearch={fetchWeather} />

<div className="relative z-10 w-full max-w-6xl mx-auto mt-8 flex flex-col lg:flex-row gap-8 items-stretch px-4">

    {/* left container (current weather) */}
  <div className="w-full lg:w-1/2 h-full backdrop-blur-md bg-white/20 rounded-2xl p-6 shadow-xl">
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
<div className="w-full lg:w-1/2 h-full backdrop-blur-md bg-white/20 rounded-2xl p-6 shadow-xl">
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
