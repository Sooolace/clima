
export function getWeatherBg(condition?: string) {
  // Handle missing/empty condition.
  if (!condition) return 'bg-default'

  const c = condition.toLowerCase()

  // Match common substrings so phrases like "partly cloudy" or "light rain" map correctly.
  if (c.includes('clear') || c.includes('sunny')) return 'bg-clear'
  if (c.includes('cloud') || c.includes('overcast')) return 'bg-cloudy'
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return 'bg-rainy'
  if (c.includes('thunder') || c.includes('storm')) return 'bg-storm'
  if (c.includes('snow') || c.includes('sleet') || c.includes('blizzard')) return 'bg-snow'

  return 'bg-default'
}
