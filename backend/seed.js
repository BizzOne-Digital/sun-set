const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Room = require('./models/Room');
const Review = require('./models/Review');
const Gallery = require('./models/Gallery');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  // Admin user — HAMESHA delete karke fresh banao
  await User.deleteMany({ email: 'admin@sunsetretreatja.com' });
  const user = new User({ name: 'Carl', email: 'admin@sunsetretreatja.com', password: 'sunset2026' });
  await user.save(); // pre-save hook → hash hoga SIRF EK BAAR
  console.log('✅ Admin created: admin@sunsetretreatja.com / sunset2026');

  // Test karo — hash match honi chahiye
  const saved = await User.findOne({ email: 'admin@sunsetretreatja.com' });
  const match = await bcrypt.compare('sunset2026', saved.password);
  console.log('✅ Password test:', match ? 'PASS ✓' : 'FAIL ✗ — PROBLEM HAI!');

  // Rooms
  const roomCount = await Room.countDocuments();
  if (roomCount === 0) {
    await Room.insertMany([
      {
        name: 'One-Bedroom Suite', slug: 'one-bedroom-suite',
        shortDesc: 'Perfect for couples seeking a romantic getaway.',
        description: 'Our beautifully appointed one-bedroom suite offers a private sanctuary with stunning views.',
        bedrooms: 1, bathrooms: 1, maxGuests: 2, pricePerNight: 175,
        amenities: ['King Bed','Ocean View','En-Suite Bathroom','AC','Free WiFi','Smart TV','Mini Kitchen','Private Balcony'],
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'],
        airbnbUrl: 'https://www.airbnb.com/rooms/51519181',
        vrboUrl: 'https://www.vrbo.com/4984182',
        isActive: true, order: 1,
      },
      {
        name: 'Two-Bedroom Suite', slug: 'two-bedroom-suite',
        shortDesc: 'Ideal for families or groups looking for extra space.',
        description: 'Spacious two-bedroom suite perfect for families or friends travelling together.',
        bedrooms: 2, bathrooms: 2, maxGuests: 4, pricePerNight: 275,
        amenities: ['2 King Beds','Ocean View','2 Bathrooms','AC','Free WiFi','Smart TV','Full Kitchen','Large Balcony'],
        images: ['https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80'],
        airbnbUrl: 'https://www.airbnb.com/rooms/51519181',
        vrboUrl: 'https://www.vrbo.com/5128961',
        isActive: true, order: 2,
      },
    ]);
    console.log('✅ Rooms seeded');
  }

  // Reviews
  const reviewCount = await Review.countDocuments();
  if (reviewCount === 0) {
    await Review.insertMany([
      { name: 'Jessica M.', origin: 'New York, USA', rating: 5, platform: 'airbnb', approved: true, featured: true, text: 'Sunset Retreat JA was absolutely amazing! The view, the comfort, and the hospitality were beyond our expectations.' },
      { name: 'Michael R.', origin: 'Toronto, Canada', rating: 5, platform: 'vrbo', approved: true, featured: true, text: 'Best vacation rental we have ever stayed in. Clean, luxurious, and the sunset views are simply magical.' },
      { name: 'Sarah & Tom', origin: 'London, UK', rating: 5, platform: 'google', approved: true, featured: true, text: 'From the moment we arrived we felt at home. Beautiful, private, and perfectly located.' },
    ]);
    console.log('✅ Reviews seeded');
  }

  console.log('\n🌴 Done! Login with:');
  console.log('   Email:    admin@sunsetretreatja.com');
  console.log('   Password: sunset2026\n');

  await mongoose.disconnect();
}

seed().catch(err => { console.error('❌ Error:', err); process.exit(1); });