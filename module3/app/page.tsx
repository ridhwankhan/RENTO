"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, MapPin, DollarSign, Bath, Bed } from 'lucide-react'

const properties = [
  {
    id: 1,
    title: "Luxurious Apartment in Gulshan",
    location: "Gulshan-1, Dhaka",
    price: 45000,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop",
    beds: 3,
    baths: 2,
    sqft: 1800,
    coordinates: {
      coordinates: [90.4152, 23.7925]
    }
  },
  {
    id: 2,
    title: "Modern Flat in Banani",
    location: "Banani, Dhaka",
    price: 35000,
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&auto=format&fit=crop",
    beds: 2,
    baths: 2,
    sqft: 1200,
    coordinates: {
      coordinates: [90.4071, 23.7937]
    }
  },
  {
    id: 3,
    title: "Spacious House in Dhanmondi",
    location: "Dhanmondi, Dhaka",
    price: 55000,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop",
    beds: 4,
    baths: 3,
    sqft: 2500,
    coordinates: {
      coordinates: [90.3742, 23.7461]
    }
  },
  {
    id: 4,
    title: "Cozy Apartment in Mohammadpur",
    location: "Mohammadpur, Dhaka",
    price: 25000,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop",
    beds: 2,
    baths: 1,
    sqft: 1000,
    coordinates: {
      coordinates: [90.3596, 23.7661]
    }
  },
  {
    id: 5,
    title: "Premium Flat in Uttara",
    location: "Uttara, Dhaka",
    price: 30000,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop",
    beds: 3,
    baths: 2,
    sqft: 1500,
    coordinates: {
      coordinates: [90.3983, 23.8759]
    }
  },
  {
    id: 6,
    title: "Elegant Home in Bashundhara",
    location: "Bashundhara R/A, Dhaka",
    price: 40000,
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop",
    beds: 3,
    baths: 2,
    sqft: 1800,
    coordinates: {
      coordinates: [90.4509, 23.8198]
    }
  },
  {
    id: 7,
    title: "Family Apartment in Mirpur",
    location: "Mirpur, Dhaka",
    price: 28000,
    image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&auto=format&fit=crop",
    beds: 3,
    baths: 2,
    sqft: 1400,
    coordinates: {
      coordinates: [90.3668, 23.8223]
    }
  },
  {
    id: 8,
    title: "Riverside View in Keraniganj",
    location: "Keraniganj, Dhaka",
    price: 32000,
    image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop",
    beds: 2,
    baths: 2,
    sqft: 1300,
    coordinates: {
      coordinates: [90.3987, 23.7031]
    }
  },
  {
    id: 9,
    title: "Modern Studio in Tejgaon",
    location: "Tejgaon, Dhaka",
    price: 22000,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop",
    beds: 1,
    baths: 1,
    sqft: 800,
    coordinates: {
      coordinates: [90.3928, 23.7599]
    }
  },
  {
    id: 10,
    title: "Luxury Villa in Baridhara",
    location: "Baridhara, Dhaka",
    price: 85000,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop",
    beds: 5,
    baths: 4,
    sqft: 3500,
    coordinates: {
      coordinates: [90.4229, 23.8028]
    }
  }
];

export default function Home() {
  const router = useRouter()
  const [searchRadius, setSearchRadius] = useState([5]) // radius in kilometers

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Rental Home</h1>
          <p className="text-muted-foreground mb-8">Browse through thousands of properties in your desired location</p>
        </motion.div>

        {/* Search Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
          <Input placeholder="Location" className="w-full" />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Price Range:</span>
            <Slider defaultValue={[25000]} max={100000} step={1000} />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Radius (km):</span>
            <Slider
              value={searchRadius}
              onValueChange={setSearchRadius}
              max={20}
              step={1}
            />
            <span className="text-sm font-medium">{searchRadius}km</span>
          </div>
          <Button>Search</Button>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => router.push(`/property/${property.id}`)}
              className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
            >
              <Card className="overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>{property.title}</CardTitle>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span className="mr-4">{property.beds} beds</span>
                      <Bath className="h-4 w-4 mr-1" />
                      <span>{property.baths} baths</span>
                    </div>
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-1" />
                      <span>{property.sqft} sqft</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-lg font-bold">{property.price}/mo</span>
                  </div>
                  <Button>View Details</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  )
}