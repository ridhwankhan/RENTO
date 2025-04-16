import React from 'react';
import LocationsMap from './LocationsMap';

const ItemList = ({ items }) => {
  if (items.length === 0) {
    return <p>No locations found. Add some locations to get started!</p>;
  }

  return (
    <div>
      <h2>Saved Locations</h2>

      <div className="map-container">
        <LocationsMap
          items={items}
          mapId="locations-map"
        />
      </div>

      <div className="location-list-container" style={{ marginTop: '20px' }}>
        <h3>Location List</h3>
        <ul className="item-list">
          {items.map(item => (
            <li
              key={item._id}
              className="item"
              style={{ cursor: 'pointer' }}
            >
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              {item.location && (
                <p>
                  <strong>Coordinates:</strong> {item.location.lat.toFixed(6)}, {item.location.lng.toFixed(6)}
                </p>
              )}
              <p>Added on: {new Date(item.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ItemList;
