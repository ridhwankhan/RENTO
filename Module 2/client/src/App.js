import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemForm from './components/ItemForm';
import LocationsMap from './components/LocationsMap';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'view'
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Fetch items when component mounts
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get('/api/items');
      setItems(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Add new location
  const addItem = async (item) => {
    try {
      const res = await axios.post('/api/items', item);
      setItems([...items, res.data]);
      setActiveTab('view'); // Switch to view tab after adding
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  // Handle location selection from sidebar
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  // Handle right-click on sidebar to show all locations
  const handleContextMenu = (e) => {
    e.preventDefault();
    fetchLocations();
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Notun Thikana <span role="img" aria-label="house">🏠</span></h1>
        <p>Search, Save, and Share Your Favorite Locations</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Add Location
        </button>
        <button
          className={`tab ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          View Locations
        </button>
      </div>

      <div className="content-container">
        {activeTab === 'add' ? (
          <ItemForm addItem={addItem} />
        ) : (
          <div className="map-sidebar-container">
            <div className="map-container">
              {loading ? (
                <p>Loading map...</p>
              ) : (
                <LocationsMap
                  items={items}
                  mapId="view-locations-map"
                  selectedLocation={selectedLocation}
                />
              )}
            </div>
            <div
              className="sidebar"
              onContextMenu={handleContextMenu}
            >
              <h3>Saved Locations</h3>
              <p className="sidebar-tip">Right-click to refresh locations</p>
              {loading ? (
                <p>Loading locations...</p>
              ) : items.length === 0 ? (
                <p>No locations found. Add some locations to get started!</p>
              ) : (
                <ul className="location-list">
                  {items.map(item => (
                    <li
                      key={item._id}
                      className={`location-item ${selectedLocation && selectedLocation._id === item._id ? 'active' : ''}`}
                      onClick={() => handleLocationSelect(item)}
                    >
                      <h4>{item.name}</h4>
                      <p className="location-description">{item.description}</p>
                      <p className="location-date">Added: {new Date(item.date).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
