import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  location: {
    type: String,
    required: [true, 'Please provide a location']
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    }
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price']
  },
  propertyType: {
    type: String,
    required: [true, 'Please provide a property type'],
    enum: ['apartment', 'house', 'condo']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Please provide number of bedrooms']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Please provide number of bathrooms']
  },
  squareFeet: {
    type: Number,
    required: [true, 'Please provide square footage']
  },
  images: [{
    type: String,
    required: [true, 'Please provide at least one image']
  }],
  amenities: [{
    type: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide property owner']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a 2dsphere index for location-based queries
PropertySchema.index({ coordinates: '2dsphere' });

export default mongoose.models.Property || mongoose.model('Property', PropertySchema);