const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const BlockedDate = require('../models/BlockedDate');
const { protect } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Helper: get all booked dates for a room between range
async function getBookedDates(roomId, start, end) {
  const query = { status: { $ne: 'cancelled' } };
  if (roomId && roomId !== 'all') query.room = roomId;
  
  const bookings = await Booking.find(query);
  const blockedDocs = await BlockedDate.find(roomId && roomId !== 'all' ? { room: roomId } : {});
  
  const dates = new Set();
  
  bookings.forEach(b => {
    const d = new Date(b.checkin);
    while (d < new Date(b.checkout)) {
      dates.add(d.toISOString().split('T')[0]);
      d.setDate(d.getDate() + 1);
    }
  });
  
  blockedDocs.forEach(b => {
    dates.add(new Date(b.date).toISOString().split('T')[0]);
  });
  
  return [...dates];
}

// PUBLIC: Get unavailable dates for a room (for calendar)
router.get('/unavailable-dates', async (req, res) => {
  try {
    const { roomId } = req.query;
    const dates = await getBookedDates(roomId || 'all');
    res.json({ dates });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUBLIC: Check if specific dates are available
router.post('/check-availability', async (req, res) => {
  const { checkin, checkout, roomId } = req.body;
  try {
    if (!checkin || !checkout) return res.status(400).json({ message: 'checkin and checkout required' });
    
    const checkIn = new Date(checkin);
    const checkOut = new Date(checkout);
    
    const query = {
      status: { $ne: 'cancelled' },
      $or: [
        { checkin: { $lt: checkOut }, checkout: { $gt: checkIn } }
      ]
    };
    if (roomId) query.room = roomId;
    
    const conflict = await Booking.findOne(query);
    
    // Also check blocked dates
    const blocked = await BlockedDate.findOne({
      ...(roomId ? { room: roomId } : {}),
      date: { $gte: checkIn, $lt: checkOut }
    });
    
    const available = !conflict && !blocked;
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    res.json({ available, nights, conflict: conflict ? 'Dates are taken' : null });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUBLIC: Create booking (from website)
router.post('/', async (req, res) => {
  try {
    const { checkin, checkout, roomId, ...rest } = req.body;
    
    // Double-check availability
    const checkIn = new Date(checkin);
    const checkOut = new Date(checkout);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    const conflict = await Booking.findOne({
      ...(roomId ? { room: roomId } : {}),
      status: { $ne: 'cancelled' },
      $or: [{ checkin: { $lt: checkOut }, checkout: { $gt: checkIn } }]
    });
    
    if (conflict) return res.status(409).json({ message: 'These dates are no longer available. Please choose different dates.' });
    
    const booking = await Booking.create({ ...rest, checkin: checkIn, checkout: checkOut, room: roomId, nights });
    
    // Send confirmation email
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: [rest.email, 'info@sunsetretreatja.com'],
        subject: `Booking Request — ${rest.name} | Sunset Retreat JA`,
        html: `
          <h2>New Booking Request</h2>
          <p><b>Name:</b> ${rest.name}</p>
          <p><b>Email:</b> ${rest.email}</p>
          <p><b>Phone:</b> ${rest.phone || 'N/A'}</p>
          <p><b>Check-in:</b> ${checkin}</p>
          <p><b>Check-out:</b> ${checkout}</p>
          <p><b>Nights:</b> ${nights}</p>
          <p><b>Guests:</b> ${rest.guests}</p>
          <p><b>Room:</b> ${rest.roomName || 'N/A'}</p>
          <p><b>Special Requests:</b> ${rest.specialRequests || 'None'}</p>
          <p><b>Status:</b> Pending Confirmation</p>
          <hr/>
          <p>Login to admin panel to confirm: <a href="https://your-site.vercel.app/admin">Admin Panel</a></p>
        `
      });
    } catch(e) { console.log('Email failed:', e.message); }
    
    res.status(201).json({ message: 'Booking request received! We will confirm within 24 hours.', booking });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ADMIN: Get all bookings
router.get('/', protect, async (req, res) => {
  try {
    const { status, month, year } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      query.checkin = { $gte: start, $lt: end };
    }
    const bookings = await Booking.find(query).populate('room', 'name').sort({ checkin: 1 });
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ADMIN: Stats
router.get('/stats', protect, async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const confirmed = await Booking.countDocuments({ status: 'confirmed' });
    const pending = await Booking.countDocuments({ status: 'pending' });
    const revenue = await Booking.aggregate([
      { $match: { status: 'confirmed', paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    res.json({ total, confirmed, pending, revenue: revenue[0]?.total || 0 });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ADMIN: Update booking
router.patch('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(booking);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ADMIN: Delete booking
router.delete('/:id', protect, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
