const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  phone:   String,
  checkin: Date,
  checkout:Date,
  guests:  { type: Number, default: 1 },
  message: String,
  source:  { type: String, default: 'contact-form' },
  status:  { type: String, enum: ['new','contacted','booked','closed'], default: 'new' },
  notes:   String,
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
