interface WeatherCardProps {
  data: {
    location: {
      name: string
      country: string
      localtime: string
    }
    current: {
      temp_c: number
      feelslike_c: number
      humidity: number
      wind_kph: number
      condition: {
        text: string
        icon: string
      }
    }
  }
}

export default function WeatherCard({ data }: WeatherCardProps) {
  const { location, current } = data

  return (
    <div className="p-8 max-w-md w-full text-center text-white flex flex-col items-center gap-4">
      
      {/* City */}
      <h2 className="text-3xl md:text-4xl font-bold">{location.name}, {location.country}</h2>
      
      {/* Local Time */}
      <p className="text-sm md:text-base text-white/70">{location.localtime}</p>

      {/* Weather Icon */}
      <img
        src={`https:${current.condition.icon}`}
        alt={current.condition.text}
        className="w-20 h-20 md:w-24 md:h-24 mx-auto"
      />

      {/* Temperature */}
      <p className="text-5xl md:text-6xl font-extrabold mt-2">{Math.round(current.temp_c)}°C</p>

      {/* Condition */}
      <p className="capitalize text-xl md:text-2xl mt-1">{current.condition.text}</p>

      {/* Divider */}
      <div className="w-full h-px bg-white/30 my-4"></div>

      {/* Additional Info */}
      <div className="flex justify-around w-full text-sm md:text-base opacity-90">
        <div className="flex flex-col items-center">
          <p className="uppercase text-xs md:text-sm tracking-wide">Feels Like</p>
          <p className="font-semibold">{Math.round(current.feelslike_c)}°C</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="uppercase text-xs md:text-sm tracking-wide">Humidity</p>
          <p className="font-semibold">{current.humidity}%</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="uppercase text-xs md:text-sm tracking-wide">Wind</p>
          <p className="font-semibold">{current.wind_kph} kph</p>
        </div>
      </div>
    </div>
  )
}
