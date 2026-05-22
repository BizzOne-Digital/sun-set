const mongoose = require('mongoose');

const managementApplicationSchema = new mongoose.Schema({
  // Owner info
  ownerName:    { type: String, required: true },
  email:        { type: String, required: true },
  phone:        { type: String, required: true },
  
  // Property info
  propertyName: String,
  propertyAddress: String,
  bedrooms:     Number,
  bathrooms:    Number,
  currentlyListed: Boolean,
  airbnbUrl:    String,
  vrboUrl:      String,
  monthlyRevenue: String,
  
  // Additional
  message:      String,
  status:       { type: String, enum: ['new','reviewing','approved','rejected'], default: 'new' },
  notes:        String,
}, { timestamps: true });

module.exports = mongoose.model('ManagementApplication', managementApplicationSchema);
