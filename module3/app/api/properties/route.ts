import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Property from '@/models/Property'

export async function GET(request: Request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const radius = searchParams.get('radius') // in kilometers
    
    let query = {}
    
    if (lat && lng && radius) {
      query = {
        coordinates: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: parseInt(radius) * 1000 // Convert km to meters
          }
        }
      }
    }
    
    const properties = await Property.find(query)
      .limit(50)
      .sort({ createdAt: -1 })
    
    return NextResponse.json(properties)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    const property = await Property.create(body)
    return NextResponse.json(property)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}