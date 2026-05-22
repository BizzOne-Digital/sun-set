const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  url:      { type: String, required: true },
  caption:  String,
  category: { type: String, enum: ['exterior','interior','pool','bedroom','dining','view','other'], default: 'other' },
  order:    { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
