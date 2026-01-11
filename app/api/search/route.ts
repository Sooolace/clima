import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')
  if (!query) return NextResponse.json([], { status: 200 })

  const apiKey = process.env.WEATHER_API_KEY
  const url = `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${encodeURIComponent(query)}`

  const res = await fetch(url)
  const data = await res.json()

  return NextResponse.json(data)
}
