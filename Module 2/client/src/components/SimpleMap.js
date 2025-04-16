import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Create custom marker icon
const markerIcon = L.icon({
  iconUrl: '/icons/marker-icon.svg',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const SimpleMap = ({ onLocationSelect, initialPosition, mapId }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const mapContainerRef = useRef(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default position (Dhaka, Bangladesh)
    const defaultPosition = [23.8103, 90.4125];
    const position = initialPosition ? [initialPosition.lat, initialPosition.lng] : defaultPosition;

    // Create map instance
    const mapInstance = L.map(mapContainerRef.current).setView(position, 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);

    // Add initial marker if position is provided
    let markerInstance = null;
    if (initialPosition) {
      markerInstance = L.marker(position, { icon: markerIcon }).addTo(mapInstance);
    }

    // Handle map click
    mapInstance.on('click', function(e) {
      const { lat, lng } = e.latlng;

      // Remove existing marker
      if (markerInstance) {
        mapInstance.removeLayer(markerInstance);
      }

      // Add new marker
      markerInstance = L.marker([lat, lng], { icon: markerIcon }).addTo(mapInstance);

      // Call callback
      if (onLocationSelect) {
        onLocationSelect({
          lat: lat,
          lng: lng
        });
      }

      setMarker(markerInstance);
    });

    setMap(mapInstance);
    setMarker(markerInstance);

    // Cleanup
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [mapId, initialPosition, onLocationSelect]);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim() || !map) return;

    try {
      // Using Nominatim for geocoding (free and open-source)
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);

        // Remove existing marker
        if (marker) {
          map.removeLayer(marker);
        }

        // Add new marker
        const newMarker = L.marker([lat, lng], { icon: markerIcon }).addTo(map);
        setMarker(newMarker);

        // Center map on search result
        map.setView([lat, lng], 13);

        // Call callback
        if (onLocationSelect) {
          onLocationSelect({
            lat: lat,
            lng: lng
          });
        }
      } else {
        alert("Location not found. Please try a different search term.");
      }
    } catch (error) {
      console.error("Error searching for location:", error);
      alert("Error searching for location. Please try again.");
    }
  };

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '500px', marginTop: '10px' }}
      ></div>
    </div>
  );
};

export default SimpleMap;
