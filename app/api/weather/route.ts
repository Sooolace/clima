import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const city = req.nextUrl.searchParams.get('city')
    const lat = req.nextUrl.searchParams.get('lat')
    const lon = req.nextUrl.searchParams.get('lon')

    if (!city && (!lat || !lon)) {
      return NextResponse.json(
        { message: 'City or latitude/longitude is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.WEATHER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ message: 'API key not found' }, { status: 500 })
    }

    // Build query: city OR lat/lon
    const q = city ? encodeURIComponent(city) : `${lat},${lon}`
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${q}&days=7&aqi=no&alerts=no`

    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.error?.message || 'Failed to fetch weather' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}
