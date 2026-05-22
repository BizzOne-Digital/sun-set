import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import BookingModal from '../components/BookingModal';
import api from '../api';

export default function AccommodationsPage() {
  const [rooms, setRooms] = useState([]);
  const [booking, setBooking] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    api.get('/api/rooms').then(r => setRooms(r.data)).catch(() => {});
  }, []);

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

      {/* 2 cards per row, NO calendar */}
      <section className="section-pad">
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:28 }}>
            {rooms.map(room => (
              <div key={room._id} style={{ background:'#fff', border:'1px solid #EDE8E0', borderRadius:8, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.07)', display:'flex', flexDirection:'column' }}>

                {/* Image */}
                <div style={{ height:260, overflow:'hidden', position:'relative' }}>
                  <img
                    src={room.images?.[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=80'}
                    alt={room.name}
                    style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                  <div style={{ position:'absolute', top:16, right:16, background:'#C9933A', color:'#fff', padding:'6px 14px', borderRadius:4, fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700 }}>
                    ${room.pricePerNight}<span style={{ fontSize:11, fontWeight:400, fontFamily:"'Poppins',sans-serif" }}>/night</span>
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding:'22px', flex:1, display:'flex', flexDirection:'column' }}>
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:'#1A2540', fontWeight:700, marginBottom:8 }}>{room.name}</h2>
                  <p style={{ fontSize:13, color:'#777', lineHeight:1.7, marginBottom:16 }}>{room.description || room.shortDesc}</p>

                  {/* Stats */}
                  <div style={{ display:'flex', gap:20, marginBottom:14 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#555' }}>
                      <svg width="15" height="15" fill="none" stroke="#C9933A" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                      {room.bedrooms} Bedroom{room.bedrooms > 1 ? 's' : ''}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#555' }}>
                      <svg width="15" height="15" fill="none" stroke="#C9933A" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 7.7 7 7h-.01C6.72 7.7 5.43 8.33 4.43 9.06 3.3 9.97 2.82 11.07 2.82 12.25c0 2.22 1.8 4.05 4.18 4.05z"/></svg>
                      {room.bathrooms} Bathroom{room.bathrooms > 1 ? 's' : ''}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#555' }}>
                      <svg width="15" height="15" fill="none" stroke="#C9933A" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                      {room.maxGuests} Guests
                    </div>
                  </div>

                  {/* Amenities */}
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:20 }}>
                    {(room.amenities || []).slice(0, 5).map(a => (
                      <span key={a} style={{ background:'#F9F5EE', border:'1px solid #EDE8E0', fontSize:11, padding:'3px 10px', borderRadius:20, color:'#555' }}>{a}</span>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div style={{ display:'flex', gap:8, marginTop:'auto' }}>
                    {room.airbnbUrl && (
                      <a href={room.airbnbUrl} target="_blank" rel="noreferrer"
                        style={{ flex:1, background:'#FF5A3B', color:'#fff', padding:'11px', fontSize:12, fontWeight:600, textDecoration:'none', borderRadius:4, textAlign:'center' }}>
                        Book on Airbnb
                      </a>
                    )}
                    {room.vrboUrl && (
                      <a href={room.vrboUrl} target="_blank" rel="noreferrer"
                        style={{ flex:1, background:'#0073E6', color:'#fff', padding:'11px', fontSize:12, fontWeight:600, textDecoration:'none', borderRadius:4, textAlign:'center' }}>
                        Book on VRBO
                      </a>
                    )}
                    <a href="https://wa.me/18762689319" target="_blank" rel="noreferrer"
                      style={{ flex:1, background:'#25D366', color:'#fff', padding:'11px', fontSize:12, fontWeight:600, textDecoration:'none', borderRadius:4, textAlign:'center' }}>
                      WhatsApp
                    </a>
                  </div>
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