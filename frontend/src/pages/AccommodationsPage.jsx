import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import AvailabilityChecker from '../components/AvailabilityChecker';
import BookingModal from '../components/BookingModal';
import api from '../api';

export default function AccommodationsPage() {
  const [rooms, setRooms] = useState([]);
  const [booking, setBooking] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [checkerRoom, setCheckerRoom] = useState(null); // which room's checker is open

  useEffect(() => {
    api.get('/api/rooms').then(r => setRooms(r.data)).catch(() => {});
  }, []);

  const handleBook = (room, data) => {
    setSelectedRoom(room);
    setBooking(data);
    setModalOpen(true);
  };

  return (
    <>
      <Navbar />
      <ScrollToTop />

      {/* Hero */}
      <div style={{ position:'relative', background:'#0E1729', padding:'80px 0', textAlign:'center', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:`url(https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400&q=60)`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.2 }}/>
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <p className="section-label">Stay With Us</p>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(32px,5vw,52px)', fontWeight:700, color:'#fff', marginTop:10 }}>Our Accommodations</h1>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.7)', marginTop:12 }}>Luxury 1 & 2 bedroom suites in the heart of Ocho Rios, Jamaica</p>
        </div>
      </div>

      {/* Rooms Grid — 2 per row, no calendar inside card */}
      <section className="section-pad">
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:28 }}>
            {rooms.map(room => (
              <div key={room._id} style={{ background:'#fff', border:'1px solid #EDE8E0', borderRadius:8, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.07)', display:'flex', flexDirection:'column' }}>

                {/* Image */}
                <div style={{ height:240, overflow:'hidden', position:'relative' }}>
                  <img
                    src={room.images?.[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=80'}
                    alt={room.name}
                    style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                  {/* Price badge */}
                  <div style={{ position:'absolute', top:16, right:16, background:'#C9933A', color:'#fff', padding:'6px 14px', borderRadius:4, fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700 }}>
                    ${room.pricePerNight}<span style={{ fontSize:11, fontWeight:400, fontFamily:"'Poppins',sans-serif" }}>/night</span>
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding:'22px 22px 0' }}>
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:'#1A2540', fontWeight:700, marginBottom:8 }}>{room.name}</h2>
                  <p style={{ fontSize:13, color:'#777', lineHeight:1.7, marginBottom:14 }}>{room.shortDesc}</p>

                  {/* Stats */}
                  <div style={{ display:'flex', gap:20, marginBottom:14 }}>
                    {[
                      ['🛏', `${room.bedrooms} Bed${room.bedrooms > 1 ? 's' : ''}`],
                      ['🚿', `${room.bathrooms} Bath${room.bathrooms > 1 ? 's' : ''}`],
                      ['👥', `${room.maxGuests} Guests`],
                    ].map(([icon, text]) => (
                      <div key={text} style={{ fontSize:13, color:'#555', display:'flex', alignItems:'center', gap:5 }}>
                        <span>{icon}</span> {text}
                      </div>
                    ))}
                  </div>

                  {/* Amenities */}
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:18 }}>
                    {(room.amenities || []).slice(0, 5).map(a => (
                      <span key={a} style={{ background:'#F9F5EE', border:'1px solid #EDE8E0', fontSize:11, padding:'3px 10px', borderRadius:20, color:'#555' }}>{a}</span>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div style={{ padding:'0 22px 22px', marginTop:'auto' }}>
                  <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                    {room.airbnbUrl && (
                      <a href={room.airbnbUrl} target="_blank" rel="noreferrer"
                        style={{ flex:1, background:'#FF5A3B', color:'#fff', padding:'10px', fontSize:12, fontWeight:600, textDecoration:'none', borderRadius:4, textAlign:'center', transition:'opacity 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
                        onMouseLeave={e => e.currentTarget.style.opacity = 1}>
                        🏠 Book on Airbnb
                      </a>
                    )}
                    {room.vrboUrl && (
                      <a href={room.vrboUrl} target="_blank" rel="noreferrer"
                        style={{ flex:1, background:'#0073E6', color:'#fff', padding:'10px', fontSize:12, fontWeight:600, textDecoration:'none', borderRadius:4, textAlign:'center', transition:'opacity 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
                        onMouseLeave={e => e.currentTarget.style.opacity = 1}>
                        🏠 Book on VRBO
                      </a>
                    )}
                  </div>

                  {/* Check Availability toggle */}
                  <button
                    onClick={() => setCheckerRoom(checkerRoom === room._id ? null : room._id)}
                    style={{ width:'100%', background: checkerRoom === room._id ? '#1A2540' : '#F9F5EE', color: checkerRoom === room._id ? '#fff' : '#1A2540', border:'1px solid #E0D8CC', padding:'10px', fontSize:12, fontWeight:600, cursor:'pointer', borderRadius:4, transition:'all 0.2s', fontFamily:"'Poppins',sans-serif", letterSpacing:'0.05em' }}>
                    {checkerRoom === room._id ? '▲ HIDE CALENDAR' : '📅 CHECK AVAILABILITY'}
                  </button>

                  {/* Calendar — only show for selected room */}
                  {checkerRoom === room._id && (
                    <div style={{ marginTop:14 }}>
                      <AvailabilityChecker
                        roomId={room._id}
                        pricePerNight={room.pricePerNight}
                        onBook={d => handleBook(room, d)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {rooms.length === 0 && (
              <div style={{ gridColumn:'1/-1', textAlign:'center', padding:60, color:'#aaa' }}>Loading accommodations...</div>
            )}
          </div>
        </div>
      </section>

      <Footer />

      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        room={selectedRoom}
        checkin={booking?.checkin}
        checkout={booking?.checkout}
        nights={booking?.nights}
        total={booking?.total}
      />
    </>
  );
}