const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  slug:         { type: String, unique: true },
  description:  String,
  shortDesc:    String,
  bedrooms:     { type: Number, default: 1 },
  bathrooms:    { type: Number, default: 1 },
  maxGuests:    { type: Number, default: 2 },
  pricePerNight:{ type: Number, required: true },
  images:       [String],
  amenities:    [String],
  airbnbUrl:    String,
  vrboUrl:      String,
  isActive:     { type: Boolean, default: true },
  order:        { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
