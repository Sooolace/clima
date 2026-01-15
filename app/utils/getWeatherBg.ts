
export function getWeatherBg(condition?: string, isNight: boolean = false) {
  // Handle missing/empty condition.
  if (!condition) return isNight ? 'bg-night-default' : 'bg-default'

  const c = condition.toLowerCase()

  // Match common substrings so phrases like "partly cloudy" or "light rain" map correctly.
  if (c.includes('clear') || c.includes('sunny')) return isNight ? 'bg-night-clear' : 'bg-clear'
  if (c.includes('cloud') || c.includes('overcast')) return isNight ? 'bg-night-cloudy' : 'bg-cloudy'
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return isNight ? 'bg-night-rainy' : 'bg-rainy'
  if (c.includes('thunder') || c.includes('storm')) return isNight ? 'bg-night-storm' : 'bg-storm'
  if (c.includes('snow') || c.includes('sleet') || c.includes('blizzard')) return isNight ? 'bg-night-snow' : 'bg-snow'

  return isNight ? 'bg-night-default' : 'bg-default' 
}
