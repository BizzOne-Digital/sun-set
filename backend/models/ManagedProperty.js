const mongoose = require('mongoose');

const managedPropertySchema = new mongoose.Schema({
  ownerName:    { type: String, required: true },
  propertyName: { type: String, required: true },
  address:      String,
  bedrooms:     Number,
  bathrooms:    Number,
  airbnbUrl:    String,
  vrboUrl:      String,
  images:       [String],
  monthlyRevenue: Number,
  commission:   { type: Number, default: 20 }, // percentage
  isActive:     { type: Boolean, default: true },
  startDate:    Date,
  notes:        String,
}, { timestamps: true });

module.exports = mongoose.model('ManagedProperty', managedPropertySchema);
