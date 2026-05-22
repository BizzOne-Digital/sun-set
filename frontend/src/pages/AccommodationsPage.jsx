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

  useEffect(() => { api.get('/api/rooms').then(r => setRooms(r.data)).catch(() => {}); }, []);

  const handleBook = (room, data) => { setSelectedRoom(room); setBooking(data); setModalOpen(true); };

  return (
    <>
      <Navbar />
      <ScrollToTop />
      <div style={{position:'relative',background:'#0E1729',padding:'80px 0',textAlign:'center',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:`url(https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400&q=60)`,backgroundSize:'cover',backgroundPosition:'center',opacity:0.2}}/>
        <div className="container" style={{position:'relative',zIndex:1}}>
          <p className="section-label">Stay With Us</p>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(32px,5vw,52px)',fontWeight:700,color:'#fff',marginTop:10}}>Our Accommodations</h1>
          <p style={{fontSize:15,color:'rgba(255,255,255,0.7)',marginTop:12,maxWidth:500,margin:'12px auto 0'}}>Luxury 1 & 2 bedroom suites in the heart of Ocho Rios, Jamaica</p>
        </div>
      </div>
      <section className="section-pad">
        <div className="container">
          <div style={{display:'flex',flexDirection:'column',gap:32}}>
            {rooms.map(room => (
              <div key={room._id} style={{background:'#fff',border:'1px solid #EDE8E0',borderRadius:6,overflow:'hidden',boxShadow:'0 4px 20px rgba(0,0,0,0.06)'}}>
                <div style={{display:'grid',gridTemplateColumns:'340px 1fr'}}>
                  <div style={{overflow:'hidden'}}>
                    <img src={room.images?.[0]||'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80'} alt={room.name} style={{width:'100%',height:'100%',minHeight:300,objectFit:'cover',transition:'transform 0.5s'}} onMouseEnter={e=>e.target.style.transform='scale(1.05)'} onMouseLeave={e=>e.target.style.transform='scale(1)'}/>
                  </div>
                  <div style={{padding:'32px 28px',display:'flex',gap:24}}>
                    <div style={{flex:1}}>
                      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:'#1A2540',fontWeight:700,marginBottom:8}}>{room.name}</h2>
                      <p style={{fontSize:13,color:'#777',lineHeight:1.75,marginBottom:20}}>{room.description||room.shortDesc}</p>
                      <div style={{display:'flex',gap:24,marginBottom:20,flexWrap:'wrap'}}>
                        {[[room.bedrooms+' Bedroom(s)'],[room.bathrooms+' Bathroom(s)'],[room.maxGuests+' Guests Max']].map(([t],i)=>(
                          <div key={i} style={{fontSize:13,color:'#555',display:'flex',alignItems:'center',gap:6}}>
                            <span style={{width:8,height:8,background:'#C9933A',borderRadius:'50%',flexShrink:0}}/>
                            {t}
                          </div>
                        ))}
                      </div>
                      <div style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:20}}>
                        {(room.amenities||[]).map(a=><span key={a} style={{background:'#F9F5EE',border:'1px solid #EDE8E0',fontSize:12,padding:'4px 12px',borderRadius:20,color:'#555'}}>{a}</span>)}
                      </div>
                      <div style={{fontSize:22,fontFamily:"'Playfair Display',serif",fontWeight:700,color:'#C9933A',marginBottom:16}}>${room.pricePerNight}<span style={{fontSize:13,color:'#888',fontFamily:"'Poppins',sans-serif",fontWeight:400}}>/night</span></div>
                      <div style={{display:'flex',gap:10}}>
                        {room.airbnbUrl&&<a href={room.airbnbUrl} target="_blank" rel="noreferrer" style={{background:'#FF5A3B',color:'#fff',padding:'9px 18px',fontSize:12,fontWeight:600,textDecoration:'none',borderRadius:4}}>Book on Airbnb</a>}
                        {room.vrboUrl&&<a href={room.vrboUrl} target="_blank" rel="noreferrer" style={{background:'#0073E6',color:'#fff',padding:'9px 18px',fontSize:12,fontWeight:600,textDecoration:'none',borderRadius:4}}>Book on VRBO</a>}
                      </div>
                    </div>
                    <div style={{width:290,flexShrink:0}}>
                      <p style={{fontSize:11,fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'#888',marginBottom:8,textAlign:'center'}}>Check Availability</p>
                      <AvailabilityChecker roomId={room._id} pricePerNight={room.pricePerNight} onBook={d=>handleBook(room,d)}/>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {rooms.length===0&&<div style={{textAlign:'center',padding:60,color:'#aaa'}}>Loading accommodations...</div>}
          </div>
        </div>
      </section>
      <Footer />
      <BookingModal isOpen={modalOpen} onClose={()=>setModalOpen(false)} room={selectedRoom} checkin={booking?.checkin} checkout={booking?.checkout} nights={booking?.nights} total={booking?.total}/>
    </>
  );
}
