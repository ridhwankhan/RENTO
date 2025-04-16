import React, { useState } from 'react';
import SimpleMap from './SimpleMap';

const ItemForm = ({ addItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: {
      lat: null,
      lng: null
    }
  });

  const { name, description, location } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onLocationSelect = (location) => {
    setFormData({ ...formData, location });
  };

  const onSubmit = e => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter a name');
      return;
    }

    if (!location.lat || !location.lng) {
      alert('Please select a location on the map');
      return;
    }

    addItem(formData);

    // Clear form
    setFormData({
      name: '',
      description: '',
      location: {
        lat: null,
        lng: null
      }
    });
  };

  return (
    <div className="item-form">
      <h2>Add New Location</h2>
      <form onSubmit={onSubmit}>
        <div className="form-control">
          <label htmlFor="name">Location Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={onChange}
            placeholder="Enter location name"
          />
        </div>
        <div className="form-control">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            value={description}
            onChange={onChange}
            placeholder="Enter location description"
          ></textarea>
        </div>

        <div className="form-control">
          <label>Search or click on the map to select a location</label>
          <SimpleMap
            onLocationSelect={onLocationSelect}
            initialPosition={location.lat && location.lng ? location : null}
          />
        </div>

        {location.lat && location.lng && (
          <div className="location-details">
            <p><strong>Selected Coordinates:</strong> {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
          </div>
        )}

        <button type="submit" className="btn">Save Location</button>
      </form>
    </div>
  );
};

export default ItemForm;
