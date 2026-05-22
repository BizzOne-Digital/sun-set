const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  origin:   String,
  rating:   { type: Number, min: 1, max: 5, default: 5 },
  text:     { type: String, required: true },
  avatar:   String,
  platform: { type: String, enum: ['google','airbnb','vrbo','direct','tripadvisor'], default: 'direct' },
  approved: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
