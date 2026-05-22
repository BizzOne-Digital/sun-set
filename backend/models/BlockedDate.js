const mongoose = require('mongoose');

// Admin manually blocks dates (maintenance, personal use, etc.)
const blockedDateSchema = new mongoose.Schema({
  room:   { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  date:   { type: Date, required: true },
  reason: { type: String, default: 'Blocked' },
}, { timestamps: true });

module.exports = mongoose.model('BlockedDate', blockedDateSchema);
