'use client';

import { useState, useEffect, useRef } from 'react';
import SearchBar from '@/components/SearchBar'
import WeatherCard from '@/components/WeatherCard'
import Header from '@/components/Navbar';
import { getWeatherBg } from './utils/getWeatherBg';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type BgState = { bg: string; clouds: boolean; rain: boolean };

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
  const showClouds =
    condition.toLowerCase().includes('cloud') ||
    condition.toLowerCase().includes('cloudy') ||
    condition.toLowerCase().includes('overcast')
  const showRain =
    condition.toLowerCase().includes('rain') ||
    condition.toLowerCase().includes('drizzle') ||
    condition.toLowerCase().includes('shower')

  const [currBg, setCurrBg] = useState<BgState>(() => ({ bg: bgClass, clouds: showClouds, rain: showRain }))
  const [prevBg, setPrevBg] = useState<BgState | null>(null)
  const lastAppliedRef = useRef<BgState>({ bg: bgClass, clouds: showClouds, rain: showRain })

  useEffect(() => {
    const next: BgState = { bg: bgClass, clouds: showClouds, rain: showRain }
    if (
      lastAppliedRef.current.bg !== next.bg ||
      lastAppliedRef.current.clouds !== next.clouds ||
      lastAppliedRef.current.rain !== next.rain
    ) {
      setPrevBg(lastAppliedRef.current)
      setCurrBg(next)
      lastAppliedRef.current = next
      const id = setTimeout(() => setPrevBg(null), 550)
      return () => clearTimeout(id)
    }
  }, [bgClass, showClouds, showRain])


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
  <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
    {/* Current background (fades in when it changes) */}
    <div
      key={`${currBg.bg}-${currBg.clouds}-${currBg.rain}`}
      className={`absolute inset-0 bg-transition-enter background-layer ${currBg.bg} ${currBg.clouds ? 'clouds' : ''} ${currBg.rain ? 'rain' : ''}`}
    />
    {/* Previous background (top layer, cross-fades out with blur) */}
    {prevBg && (
      <div
        className={`absolute inset-0 bg-transition-exit background-layer ${prevBg.bg} ${prevBg.clouds ? 'clouds' : ''} ${prevBg.rain ? 'rain' : ''}`}
      />
    )}
  </div>  

  {/* CONTENT */}
  <Header onSearch={fetchWeather} />

<div className="relative z-10 w-full max-w-6xl mx-auto mt-8 flex flex-col lg:flex-row gap-8 items-stretch px-4">

    {/* left container (current weather) */}
  <div className="w-full lg:w-1/2 h- backdrop-blur-md bg-white/20 rounded-2xl p-6 shadow-xl">
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

    {/* right container */}
<div className="w-full lg:w-1/2 flex flex-col gap-4">
  {/* forecast half */}
  <div className="flex-1 backdrop-blur-md bg-white/20 rounded-2xl p-6 shadow-xl">
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
{/* graph half */}
<div className="flex-1 backdrop-blur-md bg-white/20 rounded-2xl p-6 shadow-xl">
  <h3 className="mb-4 text-lg font-semibold text-white">Temperature Trend</h3>

  {weather && weather.forecast?.forecastday && (
    <Line
      data={{
        labels: weather.forecast.forecastday.map((day: any) =>
          new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })
        ),
        datasets: [
          {
            label: 'Max Temp (°C)',
            data: weather.forecast.forecastday.map((day: any) => day.day.maxtemp_c),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.3, // smooth curves
          },
          {
            label: 'Min Temp (°C)',
            data: weather.forecast.forecastday.map((day: any) => day.day.mintemp_c),
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            tension: 0.3,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
            labels: {
              color: '#ffffff', // white legend text
            },
          },
          title: {
            display: true,
            text: '7-Day Temperature Forecast',
            color: '#ffffff', // white title
            font: { size: 16, weight: 'bold' },
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)', // dark tooltip
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
          },
        },
        scales: {
          x: {
            ticks: { color: '#ffffff' }, // X-axis labels
            grid: { color: 'rgba(255,255,255,0.2)' },
          },
          y: {
            ticks: { color: '#ffffff' }, // Y-axis labels
            grid: { color: 'rgba(255,255,255,0.2)' },
          },
        },
      }}
    />
  )}
</div>
</div>
</div>


{/* Footer */}
<footer className="w-full text-center py-4 text-sm text-white opacity-70 mt-6">
  © Kent Llavado — made with <span className="font-semibold">Next.js</span>, <span className="font-semibold">Tailwind CSS</span>, <span className="font-semibold">Chart.js</span>
</footer> 
</main>
  )
}
