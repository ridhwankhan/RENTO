import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Create custom house icon
const houseIcon = L.icon({
  iconUrl: '/icons/house-icon.svg',
  iconSize: [32, 37],
  iconAnchor: [16, 37],
  popupAnchor: [0, -37],
});

// Create highlighted house icon
const highlightedHouseIcon = L.icon({
  iconUrl: '/icons/selected-house-icon.svg',
  iconSize: [32, 37],
  iconAnchor: [16, 37],
  popupAnchor: [0, -37],
});

// Create custom marker icon
const markerIcon = L.icon({
  iconUrl: '/icons/marker-icon.svg',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Create highlighted marker icon
const highlightedMarkerIcon = L.icon({
  iconUrl: '/icons/selected-marker-icon.svg',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const LocationsMap = ({ items, selectedLocation }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Default position (Dhaka, Bangladesh)
    const defaultPosition = [23.8103, 90.4125];

    // Calculate center based on items
    let center = defaultPosition;
    let zoom = 10;

    if (items && items.length > 0 && items[0].location) {
      if (items.length === 1) {
        center = [items[0].location.lat, items[0].location.lng];
        zoom = 13;
      } else {
        // Calculate average of all locations
        const sumLat = items.reduce((sum, item) => sum + (item.location ? item.location.lat : 0), 0);
        const sumLng = items.reduce((sum, item) => sum + (item.location ? item.location.lng : 0), 0);
        center = [sumLat / items.length, sumLng / items.length];
      }
    }

    // Create map instance
    const map = L.map(mapRef.current).setView(center, zoom);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add markers for each item
    if (items && items.length > 0) {
      items.forEach(item => {
        if (item.location && item.location.lat && item.location.lng) {
          // Use house icon for markers
          const marker = L.marker([item.location.lat, item.location.lng], {
            icon: houseIcon
          }).addTo(map);

          // Store marker reference with item ID
          markersRef.current[item._id] = marker;

          // Add popup with item details
          marker.bindPopup(`
            <div>
              <h3>${item.name}</h3>
              <p>${item.description}</p>
              <p>Added on: ${new Date(item.date).toLocaleDateString()}</p>
              <p><strong>Coordinates:</strong> ${item.location.lat.toFixed(6)}, ${item.location.lng.toFixed(6)}</p>
            </div>
          `);
        }
      });
    }

    // Cleanup
    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = {};
    };
  }, [items]);

  // Handle selected location change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedLocation || !selectedLocation._id) return;

    // Reset all markers to house icon and remove selected class
    Object.values(markersRef.current).forEach(marker => {
      marker.setIcon(houseIcon);

      // Remove selected class from all markers
      const markerElement = marker.getElement();
      if (markerElement) {
        markerElement.classList.remove('selected');
      }
    });

    // Highlight the selected marker
    const marker = markersRef.current[selectedLocation._id];
    if (marker) {
      marker.setIcon(highlightedHouseIcon);

      // Add selected class for animation
      const markerElement = marker.getElement();
      if (markerElement) {
        markerElement.classList.add('selected');
      }

      marker.openPopup();

      // Center map on selected location
      if (selectedLocation.location) {
        map.setView([selectedLocation.location.lat, selectedLocation.location.lng], 15);
      }
    }
  }, [selectedLocation]);

  return <div ref={mapRef} style={{ width: '100%', height: '500px' }}></div>;
};

export default LocationsMap;
