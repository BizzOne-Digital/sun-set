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

  useEffect(() => { api.get('/api/rooms').then(r => setRooms(r.data)).catch(() => {}); }, []);

  return (
    <>
      <Navbar /><ScrollToTop />
      <div style={{position:'relative',background:'#0E1729',padding:'70px 0',textAlign:'center',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:`url(https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400&q=60)`,backgroundSize:'cover',backgroundPosition:'center',opacity:0.2}}/>
        <div className="container" style={{position:'relative',zIndex:1}}>
          <p className="section-label">Stay With Us</p>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(28px,5vw,52px)',fontWeight:700,color:'#fff',marginTop:10}}>Our Accommodations</h1>
          <p style={{fontSize:14,color:'rgba(255,255,255,0.7)',marginTop:10}}>Comfortable 1 & 2 bedroom suites in Tower Isle, near Ocho Rios, Jamaica</p>
        </div>
      </div>
      <section className="section-pad">
        <div className="container">
          <div className="accom-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
            {rooms.map(room => (
              <div key={room._id} style={{background:'#fff',border:'1px solid #EDE8E0',borderRadius:8,overflow:'hidden',boxShadow:'0 4px 20px rgba(0,0,0,0.07)',display:'flex',flexDirection:'column'}}>
                <div style={{height:220,overflow:'hidden',position:'relative'}}>
                  <img src={room.images?.[0]||'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80'} alt={room.name} style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.5s'}} onMouseEnter={e=>e.target.style.transform='scale(1.05)'} onMouseLeave={e=>e.target.style.transform='scale(1)'}/>
                  <div style={{position:'absolute',top:14,right:14,background:'#C9933A',color:'#fff',padding:'5px 12px',borderRadius:4,fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700}}>
                    ${room.pricePerNight}<span style={{fontSize:10,fontWeight:400,fontFamily:"'Poppins',sans-serif"}}>/night</span>
                  </div>
                </div>
                <div style={{padding:'18px',flex:1,display:'flex',flexDirection:'column'}}>
                  <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:'#1A2540',fontWeight:700,marginBottom:6}}>{room.name}</h2>
                  <p style={{fontSize:13,color:'#777',lineHeight:1.7,marginBottom:12}}>{room.description||room.shortDesc}</p>
                  <div style={{display:'flex',gap:14,marginBottom:12,flexWrap:'wrap'}}>
                    <span style={{fontSize:12,color:'#555'}}>🛏 {room.bedrooms} Bed{room.bedrooms>1?'s':''}</span>
                    <span style={{fontSize:12,color:'#555'}}>🚿 {room.bathrooms} Bath{room.bathrooms>1?'s':''}</span>
                    <span style={{fontSize:12,color:'#555'}}>👥 {room.maxGuests} Guests</span>
                  </div>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16}}>
                    {(room.amenities||[]).map(a=><span key={a} style={{background:'#F9F5EE',border:'1px solid #EDE8E0',fontSize:11,padding:'3px 10px',borderRadius:20,color:'#555'}}>{a}</span>)}
                  </div>
                  <div style={{display:'flex',gap:8,marginTop:'auto',flexWrap:'wrap'}}>
                    {room.airbnbUrl&&<a href={room.airbnbUrl} target="_blank" rel="noreferrer" style={{flex:1,minWidth:80,background:'#FF5A3B',color:'#fff',padding:'10px',fontSize:12,fontWeight:600,textDecoration:'none',borderRadius:4,textAlign:'center'}}>Airbnb</a>}
                    {room.vrboUrl&&<a href={room.vrboUrl} target="_blank" rel="noreferrer" style={{flex:1,minWidth:80,background:'#0073E6',color:'#fff',padding:'10px',fontSize:12,fontWeight:600,textDecoration:'none',borderRadius:4,textAlign:'center'}}>VRBO</a>}
                    <a href="https://wa.me/18762689319" target="_blank" rel="noreferrer" style={{flex:1,minWidth:80,background:'#25D366',color:'#fff',padding:'10px',fontSize:12,fontWeight:600,textDecoration:'none',borderRadius:4,textAlign:'center'}}>WhatsApp</a>
                  </div>
                </div>
              </div>
            ))}
            {rooms.length===0&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:60,color:'#aaa'}}>Loading...</div>}
          </div>
        </div>
      </section>
      <Footer />
      <BookingModal isOpen={modalOpen} onClose={()=>setModalOpen(false)} room={selectedRoom} checkin={booking?.checkin} checkout={booking?.checkout} nights={booking?.nights} total={booking?.total}/>
    </>
  );
}