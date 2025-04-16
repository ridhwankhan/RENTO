"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Map, { Marker } from 'react-map-gl'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Building2, MapPin, DollarSign, Bath, Bed, Home, Calendar } from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'

// This would typically come from your environment variables
const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN'

interface Property {
  id: string
  title: string
  description: string
  location: string
  coordinates: {
    coordinates: [number, number]
  }
  price: number
  propertyType: string
  bedrooms: number
  bathrooms: number
  squareFeet: number
  images: string[]
  amenities: string[]
  createdAt: string
}

export default function PropertyDetails() {
  const params = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [viewState, setViewState] = useState({
    longitude: 90.4125,
    latitude: 23.8103,
    zoom: 12
  })

  useEffect(() => {
    // In a real app, fetch from your API
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${params.id}`)
        const data = await response.json()
        setProperty(data)
        if (data.coordinates) {
          setViewState(prev => ({
            ...prev,
            longitude: data.coordinates.coordinates[0],
            latitude: data.coordinates.coordinates[1]
          }))
        }
      } catch (error) {
        console.error('Error fetching property:', error)
      }
    }

    if (params.id) {
      fetchProperty()
    }
  }, [params.id])

  if (!property) {
    return <div>Loading...</div>
  }

  return (
    <main className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Property Images */}
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {property.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${property.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.location}
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <Bed className="h-6 w-6 mx-auto mb-2" />
                      <div className="font-semibold">{property.bedrooms}</div>
                      <div className="text-sm text-muted-foreground">Bedrooms</div>
                    </div>
                    <div className="text-center">
                      <Bath className="h-6 w-6 mx-auto mb-2" />
                      <div className="font-semibold">{property.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">Bathrooms</div>
                    </div>
                    <div className="text-center">
                      <Building2 className="h-6 w-6 mx-auto mb-2" />
                      <div className="font-semibold">{property.squareFeet}</div>
                      <div className="text-sm text-muted-foreground">Sq Ft</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{property.description}</p>
              </div>

              <Separator />

              <div>
                <h2 className="text-xl font-semibold mb-4">Location</h2>
                <div className="h-[300px] rounded-lg overflow-hidden">
                  <Map
                    {...viewState}
                    onMove={evt => setViewState(evt.viewState)}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    mapboxAccessToken={MAPBOX_TOKEN}
                  >
                    <Marker
                      longitude={property.coordinates.coordinates[0]}
                      latitude={property.coordinates.coordinates[1]}
                    >
                      <Home className="h-6 w-6 text-primary" />
                    </Marker>
                  </Map>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <DollarSign className="h-6 w-6" />
                  <span className="text-2xl font-bold">{property.price}/mo</span>
                </div>
                <Button size="lg">Contact Owner</Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}