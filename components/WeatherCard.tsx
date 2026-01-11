interface WeatherCardProps {
  data: {
    location: { name: string; country: string }
    current: {
      temp_c: number
      feelslike_c: number
      humidity: number
      wind_kph: number
      time: number
      condition: { text: string; icon: string }
    }
  }
}

export default function WeatherCard({ data }: WeatherCardProps) {
  const { location, current } = data

  return (
    <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md w-full shadow-lg text-center text-white">
      {/* City */}
      <h2 className="text-2xl md:text-3xl font-bold">
        {location.name}, {location.country}
      </h2>

      {/* Weather Icon */}
      <img
        src={`https:${current.condition.icon}`}
        alt={current.condition.text}
        className="mx-auto"
      />

      {/* Temperature */}
      <p className="text-4xl md:text-5xl font-bold mt-2">
        {Math.round(current.temp_c)}°C
      </p>

      {/* Description */}
      <p className="capitalize mt-1 text-lg">{current.condition.text}</p>

      {/* Additional Info */}
      <div className="flex justify-around mt-4 text-sm md:text-base opacity-90">
        <div>
          <p>Feels like</p>
          <p className="font-semibold">{Math.round(current.feelslike_c)}°C</p>
        </div>
        <div>
          <p>Humidity</p>
          <p className="font-semibold">{current.humidity}%</p>
        </div>
        <div>
          <p>Wind</p>
          <p className="font-semibold">{current.wind_kph} kph</p>
        </div>
      </div>
    </div>
  )
}
