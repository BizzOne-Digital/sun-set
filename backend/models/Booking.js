const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Guest info
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  phone:   String,
  guests:  { type: Number, default: 1 },

  // Stay details
  room:     { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  roomName: String,
  checkin:  { type: Date, required: true },
  checkout: { type: Date, required: true },
  nights:   Number,

  // Pricing
  pricePerNight: Number,
  totalPrice:    Number,

  // Source
  source: { type: String, enum: ['website','airbnb','vrbo','whatsapp','walkin','admin'], default: 'website' },
  platform_booking_id: String,

  // Status
  status:        { type: String, enum: ['pending','confirmed','cancelled','completed'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid','partial','paid'], default: 'unpaid' },

  // Extra
  specialRequests: String,
  notes: String,
  whatsappSent: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
