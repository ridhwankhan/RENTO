const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/locationapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Define location schema and model
const LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Location = mongoose.model('Location', LocationSchema);

// Routes
app.get('/', (req, res) => {
  res.send('Location Finder API is running...');
});

// Get all locations
app.get('/api/items', async (req, res) => {
  try {
    const locations = await Location.find().sort({ date: -1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new location
app.post('/api/items', async (req, res) => {
  const { name, description, location } = req.body;

  // Validate location data
  if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    return res.status(400).json({ message: 'Valid location coordinates are required' });
  }

  const newLocation = new Location({
    name,
    description,
    location
  });

  try {
    const savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get location by ID
app.get('/api/items/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search locations by proximity
app.get('/api/search', async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query; // radius in kilometers

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // Convert to numbers
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusInKm = parseFloat(radius);

    // Get all locations and filter by distance
    const locations = await Location.find();

    // Simple distance calculation (not perfect but works for demo)
    const nearbyLocations = locations.filter(location => {
      const distance = calculateDistance(
        latitude,
        longitude,
        location.location.lat,
        location.location.lng
      );
      return distance <= radiusInKm;
    });

    res.json(nearbyLocations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
