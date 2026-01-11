import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const city = req.nextUrl.searchParams.get('city')
    if (!city) {
      return NextResponse.json({ message: 'City is required' }, { status: 400 })
    }

    const apiKey = process.env.WEATHER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ message: 'API key not found' }, { status: 500 })
    }

    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(
      city
    )}&aqi=no`

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
