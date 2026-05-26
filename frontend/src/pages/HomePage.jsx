import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import AvailabilityChecker from '../components/AvailabilityChecker';
import BookingModal from '../components/BookingModal';
const LOGO = '/logo.png';
const HERO_BG = '/property-gate.jpg';
const HERO_ROOM = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80';

const FEATURES = [
  { title:'Stunning Views', desc:'Breathtaking ocean and sunset views', icon:<svg width="34" height="34" fill="none" stroke="#C9933A" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17.5 6.5L13 19"/><path d="M5 14l7-9 4 5-3 4-5-3z"/><path d="M3 21h18"/></svg> },
  { title:'Island Comfort', desc:'Spacious 1 & 2 bedroom suites', icon:<svg width="34" height="34" fill="none" stroke="#C9933A" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg> },
  { title:'Prime Location', desc:'Conveniently located near beaches, waterfalls, excursions, and local dining', icon:<svg width="34" height="34" fill="none" stroke="#C9933A" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
  { title:'Safe & Secure', desc:'Gated property with 24/7 security', icon:<svg width="34" height="34" fill="none" stroke="#C9933A" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { title:'Free Wi-Fi', desc:'High speed internet throughout', icon:<svg width="34" height="34" fill="none" stroke="#C9933A" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="#C9933A"/></svg> },
  { title:'Guest Support', desc:"We're here for your perfect stay", icon:<svg width="34" height="34" fill="none" stroke="#C9933A" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.97-.97a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
];

const THINGS = [
  { img:'https://i.postimg.cc/W3rZB8VZ/image.png', title:"Dunn's River Falls", desc:'Climb the world-famous waterfalls' },
  { img:'https://images.unsplash.com/photo-1722761478075-720dc58e63d1?q=80', title:'Blue Hole', desc:'Swim & explore natural pools' },
  { img:'https://images.unsplash.com/photo-1466854076813-4aa9ac0fc347?q=80', title:'Mystic Mountain', desc:'Bobsled, zipline & views' },
  { img:'https://images.unsplash.com/photo-1583364493238-248032147fbd?q=80', title:'Snorkeling', desc:'Explore coral reefs' },
  { img:'https://images.unsplash.com/photo-1562701193-2c694bd0fe15?q=80', title:'River Tubing', desc:'Peaceful river adventure' },
  { img:'https://images.unsplash.com/photo-1536869338989-e7ffd2297454?q=80', title:'Beach Day', desc:'White sand beaches' },
];
function Stars({ n=5 }) {
  return <div style={{display:'flex',gap:2}}>{Array(n).fill(0).map((_,i)=><svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#C9933A"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>)}</div>;
}

export default function HomePage() {
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [booking, setBooking] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    api.get('/api/rooms').then(r => setRooms(r.data)).catch(() => {});
    api.get('/api/reviews').then(r => setReviews(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!reviews.length) return;
    const t = setInterval(() => setReviewIdx(i => (i+1) % reviews.length), 4500);
    return () => clearInterval(t);
  }, [reviews.length]);

  const handleBook = (room, data) => { setSelectedRoom(room); setBooking(data); setModalOpen(true); };

  return (
    <>
      <Navbar />
      <ScrollToTop />

      {/* HERO */}
      <section className="hero-section" style={{position:'relative',minHeight:'92vh',overflow:'hidden',display:'flex',alignItems:'center'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:`url(${HERO_BG})`,backgroundSize:'cover',backgroundPosition:'center'}}/>
        <div className="hero-right-img" style={{position:'absolute',right:0,top:0,bottom:0,width:'40%',backgroundImage:`url(${HERO_ROOM})`,backgroundSize:'cover',backgroundPosition:'center',clipPath:'polygon(14% 0,100% 0,100% 100%,0% 100%)'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(10,18,35,0.88) 40%,rgba(10,18,35,0.2) 85%)'}}/>
        <div className="container hero-content" style={{position:'relative',zIndex:2,padding:'80px 20px'}}>
          <div className="hero-grid" style={{display:'grid',gridTemplateColumns:'1fr 310px',gap:28,alignItems:'center'}}>
            <div>
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(32px,5vw,60px)',fontWeight:700,color:'#fff',lineHeight:1.12,marginBottom:10}}>Your Tropical Escape</h1>
              <h2 style={{fontFamily:"'Dancing Script',cursive",fontSize:'clamp(26px,4vw,50px)',color:'#C9933A',marginBottom:20,lineHeight:1.2}}>Near Ocho Rios</h2>
              <p style={{fontSize:15,color:'rgba(255,255,255,0.82)',marginBottom:34,lineHeight:1.75,maxWidth:440}}>A peaceful Caribbean getaway in Tower Isle, just outside Ocho Rios — close to beaches, waterfalls, and everything Jamaica's north coast has to offer.</p>
              <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                <a href="#accommodations" className="btn-gold">BOOK YOUR STAY</a>
                <a href="https://wa.me/18762689319?text=Hi! I'd like to enquire about availability." target="_blank" rel="noreferrer" className="btn-outline-white">WHATSAPP US</a>
              </div>
            </div>
            <div className="hero-calendar">
              <p style={{fontSize:11,fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(255,255,255,0.7)',textAlign:'center',marginBottom:6}}>Live Availability</p>
              <AvailabilityChecker roomId={rooms[0]?._id} pricePerNight={rooms[0]?.pricePerNight} onBook={(d) => handleBook(rooms[0], d)} />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Book Buttons */}
      <div style={{display:'none'}} className="mobile-book-bar">
        <a href="#accommodations" className="btn-gold" style={{flex:1,justifyContent:'center'}}>BOOK YOUR STAY</a>
        <a href="https://wa.me/18762689319" target="_blank" rel="noreferrer" style={{flex:1,background:'#25D366',color:'#fff',padding:'14px',fontSize:13,fontWeight:600,textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>WhatsApp Us</a>
      </div>

      {/* FEATURES */}
      <section style={{background:'#fff',padding:'50px 0',borderBottom:'1px solid #F0EBE0'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:24}}>
            {FEATURES.map(f=>(
              <div key={f.title} style={{textAlign:'center'}}>
                <div style={{display:'flex',justifyContent:'center',marginBottom:12}}>{f.icon}</div>
                <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:14,color:'#1A2540',fontWeight:700,marginBottom:5}}>{f.title}</h4>
                <p style={{fontSize:12,color:'#777',lineHeight:1.6}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCOMMODATIONS */}
      <section id="accommodations" className="section-pad" style={{background:'#FDF8F0'}}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:40}}>
            <p className="section-label">Stay With Us</p>
            <div className="gold-divider center"/>
            <h2 className="section-title">Our Accommodations</h2>
          </div>
          <div className="rooms-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
            {rooms.map(room => (
              <div key={room._id} style={{background:'#fff',border:'1px solid #EDE8E0',borderRadius:8,overflow:'hidden',boxShadow:'0 4px 20px rgba(0,0,0,0.07)',display:'flex',flexDirection:'column'}}>
                <div style={{height:220,overflow:'hidden',position:'relative'}}>
                  <img src={room.images?.[0]||'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80'} alt={room.name} style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.5s'}} onMouseEnter={e=>e.target.style.transform='scale(1.05)'} onMouseLeave={e=>e.target.style.transform='scale(1)'}/>
                  <div style={{position:'absolute',top:14,right:14,background:'#C9933A',color:'#fff',padding:'5px 12px',borderRadius:4,fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700}}>
                    ${room.pricePerNight}<span style={{fontSize:10,fontWeight:400,fontFamily:"'Poppins',sans-serif"}}>/night</span>
                  </div>
                </div>
                <div style={{padding:'18px',flex:1,display:'flex',flexDirection:'column'}}>
                  <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:19,color:'#1A2540',fontWeight:700,marginBottom:6}}>{room.name}</h3>
                  <p style={{fontSize:13,color:'#777',lineHeight:1.7,marginBottom:12}}>{room.shortDesc}</p>
                  <div style={{display:'flex',gap:14,marginBottom:12,flexWrap:'wrap'}}>
                    <span style={{fontSize:12,color:'#555'}}>🛏 {room.bedrooms} Bed{room.bedrooms>1?'s':''}</span>
                    <span style={{fontSize:12,color:'#555'}}>🚿 {room.bathrooms} Bath{room.bathrooms>1?'s':''}</span>
                    <span style={{fontSize:12,color:'#555'}}>👥 {room.maxGuests} Guests</span>
                  </div>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16}}>
                    {(room.amenities||[]).slice(0,4).map(a=><span key={a} style={{background:'#F9F5EE',border:'1px solid #E8DDD0',fontSize:11,padding:'3px 9px',borderRadius:12,color:'#555'}}>{a}</span>)}
                  </div>
                  <div style={{display:'flex',gap:8,marginTop:'auto',flexWrap:'wrap'}}>
                    {room.airbnbUrl&&<a href={room.airbnbUrl} target="_blank" rel="noreferrer" style={{flex:1,minWidth:80,background:'#FF5A3B',color:'#fff',padding:'9px',fontSize:11,fontWeight:600,textDecoration:'none',borderRadius:4,textAlign:'center'}}>Airbnb</a>}
                    {room.vrboUrl&&<a href={room.vrboUrl} target="_blank" rel="noreferrer" style={{flex:1,minWidth:80,background:'#0073E6',color:'#fff',padding:'9px',fontSize:11,fontWeight:600,textDecoration:'none',borderRadius:4,textAlign:'center'}}>VRBO</a>}
                    <a href="https://wa.me/18762689319" target="_blank" rel="noreferrer" style={{flex:1,minWidth:80,background:'#25D366',color:'#fff',padding:'9px',fontSize:11,fontWeight:600,textDecoration:'none',borderRadius:4,textAlign:'center'}}>WhatsApp</a>
                  </div>
                </div>
              </div>
            ))}
            {rooms.length === 0 && <p style={{textAlign:'center',color:'#aaa',padding:40,gridColumn:'1/-1'}}>Loading...</p>}
          </div>
          <div style={{textAlign:'center',marginTop:24}}>
            <a href="https://www.airbnb.com/rooms/51519181" target="_blank" rel="noreferrer" className="btn-navy">VIEW ALL ON AIRBNB</a>
          </div>
        </div>
      </section>

      {/* SERVICES DARK */}
      <section style={{background:'#1A2540',padding:'60px 0'}}>
        <div className="container">
          <div className="services-grid" style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:40,alignItems:'start'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
                <div style={{width:40,height:40,background:'rgba(201,147,58,0.15)',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:4,flexShrink:0}}><svg width="20" height="20" fill="none" stroke="#C9933A" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:'#fff',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.04em'}}>Airbnb Management</h3>
              </div>
              {['Listing Creation & Optimization','Dynamic Pricing & Revenue','Guest Communication 24/7','Booking Management','Housekeeping & Maintenance','Monthly Reports'].map(s=>(
                <div key={s} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}><svg width="12" height="12" viewBox="0 0 24 24" fill="#C9933A"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg><span style={{fontSize:13,color:'rgba(255,255,255,0.7)'}}>{s}</span></div>
              ))}
              <Link to="/manage" className="btn-outline-gold" style={{marginTop:16,fontSize:12}}>LEARN MORE</Link>
            </div>
            <div
  className="services-logo"
  style={{
    width:110,
    height:110,
    borderRadius:'50%',
    background:'#fff',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    padding:10,
    boxShadow:'0 8px 30px rgba(0,0,0,0.3)',
    flexShrink:0,
    marginTop:16,
    overflow:'hidden'
  }}
>
  <img
    src={LOGO}
    alt="Sunset Retreat"
    style={{
      width:'82%',
      height:'82%',
      objectFit:'contain'
    }}
  />
</div>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
                <div style={{width:40,height:40,background:'rgba(201,147,58,0.15)',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:4,flexShrink:0}}><svg width="20" height="20" fill="none" stroke="#C9933A" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 3l18 18M10.5 6.5L6 3 3 6l3.5 3.5M14 10l-4 4M17.5 13.5L21 17l-3 3-3.5-3.5"/></svg></div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:'#fff',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.04em'}}>Cleaning Services</h3>
              </div>
              {['Deep Cleaning & Sanitization','Fresh Laundry & Linens','Restocking Essentials','Pre & Post Guest Cleaning','Damage Documentation'].map(s=>(
                <div key={s} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}><svg width="12" height="12" viewBox="0 0 24 24" fill="#C9933A"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg><span style={{fontSize:13,color:'rgba(255,255,255,0.7)'}}>{s}</span></div>
              ))}
              <Link to="/services" className="btn-outline-gold" style={{marginTop:16,fontSize:12}}>LEARN MORE</Link>
            </div>
          </div>
        </div>
      </section>

      {/* THINGS TO DO */}
      <section className="section-pad" style={{background:'#fff'}}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:32}}>
            <p className="section-label">Explore Jamaica</p>
            <div className="gold-divider center"/>
            <h2 className="section-title">Things To Do In & Around Ocho Rios</h2>
          </div>
          <div className="things-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
            {THINGS.map(t=>(
              <div key={t.title}>
                <div style={{paddingBottom:'75%',position:'relative',overflow:'hidden',borderRadius:6}}>
                  <img src={t.img} alt={t.title} loading="lazy" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.5s'}} onMouseEnter={e=>e.target.style.transform='scale(1.07)'} onMouseLeave={e=>e.target.style.transform='scale(1)'}/>
                </div>
                <p style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,color:'#1A2540',marginTop:8,marginBottom:2}}>{t.title}</p>
                <p style={{fontSize:12,color:'#888',lineHeight:1.4}}>{t.desc}</p>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:24}}>
            <Link to="/attractions" className="btn-gold">VIEW ALL ATTRACTIONS</Link>
          </div>
        </div>
      </section>

      {/* REVIEWS + INSTAGRAM + QR */}
      <section className="section-pad" style={{background:'#FDF8F0'}}>
        <div className="container">
          <div className="bottom-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:40}}>
            {/* Reviews */}
            <div>
              <h2 className="section-title" style={{marginBottom:20}}>What Our Guests Say</h2>
              {reviews.length > 0 ? (<>
                <div style={{fontSize:48,color:'#C9933A',lineHeight:1,marginBottom:4,fontFamily:'serif'}}>"</div>
                <p style={{fontSize:14,color:'#444',lineHeight:1.8,fontStyle:'italic',marginBottom:12}}>{reviews[reviewIdx]?.text}</p>
                <p style={{fontSize:13,fontWeight:600,color:'#1A2540',marginBottom:3}}>— {reviews[reviewIdx]?.name}</p>
                <p style={{fontSize:11,color:'#888',marginBottom:7}}>{reviews[reviewIdx]?.origin}</p>
                <Stars n={reviews[reviewIdx]?.rating || 5}/>
                <div style={{display:'flex',gap:6,marginTop:14}}>{reviews.map((_,i)=><button key={i} onClick={()=>setReviewIdx(i)} style={{width:i===reviewIdx?22:9,height:9,borderRadius:5,background:i===reviewIdx?'#C9933A':'#ddd',border:'none',cursor:'pointer',transition:'all 0.3s',padding:0}}/>)}</div>
              </>) : <p style={{color:'#aaa',fontSize:13}}>Loading reviews...</p>}
            </div>
            {/* Instagram */}
            <div>
              <h2 className="section-title" style={{marginBottom:20}}>Follow Us On Instagram</h2>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:14}}>
                {['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=220&q=70','https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=220&q=70','https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=220&q=70','https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=220&q=70'].map((s,i)=>(
                  <div key={i} style={{paddingBottom:'100%',position:'relative',overflow:'hidden',borderRadius:4}}><img src={s} alt="" loading="lazy" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/></div>
                ))}
              </div>
              <a href="https://instagram.com/sunsetretreatja" target="_blank" rel="noreferrer" className="btn-gold" style={{fontSize:12}}>Follow @sunsetretreatja</a>
            </div>
            {/* QR */}
            <div>
              <h2 className="section-title" style={{marginBottom:10}}>Scan To Book</h2>
              <p style={{fontSize:13,color:'#777',marginBottom:16,lineHeight:1.6}}>Scan to check availability and book instantly!</p>
              <div style={{width:140,height:140,background:'#fff',border:'2px solid #C9933A',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14,borderRadius:4}}>
                <svg viewBox="0 0 100 100" width="120" height="120">
                  <rect width="100" height="100" fill="white"/>
                  <rect x="10" y="10" width="30" height="30" fill="none" stroke="#1A2540" strokeWidth="4"/>
                  <rect x="18" y="18" width="14" height="14" fill="#1A2540"/>
                  <rect x="60" y="10" width="30" height="30" fill="none" stroke="#1A2540" strokeWidth="4"/>
                  <rect x="68" y="18" width="14" height="14" fill="#1A2540"/>
                  <rect x="10" y="60" width="30" height="30" fill="none" stroke="#1A2540" strokeWidth="4"/>
                  <rect x="18" y="68" width="14" height="14" fill="#1A2540"/>
                  {[44,52,60,68,76].map((x,i)=>[44,52,60,68,76].map((y,j)=>(i+j)%2===0?<rect key={`${i}${j}`} x={x} y={y} width="4" height="4" fill="#1A2540"/>:null))}
                </svg>
              </div>
              <a href="https://www.airbnb.com/rooms/51519181" target="_blank" rel="noreferrer" className="btn-gold" style={{fontSize:12}}>BOOK ON AIRBNB</a>
            </div>
          </div>
        </div>
      </section>
  {/* JAMAICAN FOOD & CULTURE */}
      <section className="section-pad" style={{background:'#FDF8F0'}}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:32}}>
            <p className="section-label">Taste Jamaica</p>
            <div className="gold-divider center"/>
            <h2 className="section-title">Local Food & Culture</h2>
            <p style={{fontSize:14,color:'#777',marginTop:12,maxWidth:520,margin:'12px auto 0'}}>Experience the rich flavours and vibrant culture of Jamaica's north coast — from jerk chicken to Blue Mountain coffee.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:14}} className="food-grid">
            {[
              {img:'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80',title:'Ackee & Saltfish'},
              {img:'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80',title:'Jerk Chicken'},
              {img:'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80',title:'Fresh Tropical Fruit'},
              {img:'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80',title:'Blue Mountain Coffee'},
              {img:'https://images.unsplash.com/photo-1559847844-5315695dadae?q=80',title:'Escovitch Fish'},
            ].map(item=>(
              <div key={item.title}>
                <div style={{paddingBottom:'100%',position:'relative',overflow:'hidden',borderRadius:6}}>
                  <img src={item.img} alt={item.title} loading="lazy" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.5s'}} onMouseEnter={e=>e.target.style.transform='scale(1.07)'} onMouseLeave={e=>e.target.style.transform='scale(1)'}/>
                </div>
                <p style={{fontFamily:"'Playfair Display',serif",fontSize:12,fontWeight:700,color:'#1A2540',marginTop:8,textAlign:'center'}}>{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERFECT FOR + WHY GUESTS LOVE IT */}
      <section className="section-pad" style={{background:'#fff'}}>
        <div className="container">
          <div className="perfect-for-grid">
            {/* Perfect For */}
            <div>
              <p className="section-label">Ideal For</p>
              <div className="gold-divider"/>
              <h2 className="section-title" style={{marginBottom:24}}>Perfect For</h2>
              {[
                ['💑','Couples','Looking for a peaceful romantic getaway'],
                ['🧍','Solo Travelers','Wanting a relaxing, comfortable stay'],
                ['👨‍👩‍👧','Small Families','Exploring Jamaica\'s beautiful north coast'],
                ['💻','Remote Workers','Seeking a quiet tropical setting with Wi-Fi'],
                ['🗺️','Adventure Seekers','With easy access to Ocho Rios attractions'],
              ].map(([icon,title,desc])=>(
                <div key={title} style={{display:'flex',alignItems:'flex-start',gap:14,marginBottom:16}}>
                  <span style={{fontSize:22,flexShrink:0}}>{icon}</span>
                  <div>
                    <p style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:'#1A2540',marginBottom:2}}>{title}</p>
                    <p style={{fontSize:13,color:'#777',lineHeight:1.6}}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Why Guests Love It */}
            <div>
              <p className="section-label">Guest Favourites</p>
              <div className="gold-divider"/>
              <h2 className="section-title" style={{marginBottom:24}}>Why Guests Love It</h2>
              {[
                ['🌴','Quiet & peaceful surroundings'],
                ['📍','Comfortable atmosphere after a day of sightseeing'],
                ['🏖️','Convenient location near attractions and beaches'],
                ['🔑','Easy self check-in process'],
                ['💬','Responsive host communication'],
                ['🔒','Safe and relaxing environment'],
              ].map(([icon,text])=>(
                <div key={text} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'1px solid #F0EBE0'}}>
                  <span style={{fontSize:18}}>{icon}</span>
                  <span style={{fontSize:13,color:'#555',lineHeight:1.6}}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRANSPORTATION + LOCAL EXPERIENCE */}
      <section className="section-pad" style={{background:'#1A2540'}}>
        <div className="container">
          <div className="transport-grid">
            {/* Transportation */}
            <div>
              <p className="section-label" style={{color:'#C9933A'}}>Getting Around</p>
              <div className="gold-divider"/>
              <h2 className="section-title" style={{color:'#fff',marginBottom:16}}>Transportation</h2>
              <p style={{fontSize:14,color:'rgba(255,255,255,0.75)',lineHeight:1.8,marginBottom:20}}>
                Airport transfer and local transportation assistance available upon request. We're happy to help you arrange everything for a smooth, stress-free arrival.
              </p>
              <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                <a href="https://wa.me/18762689319?text=Hi! I'd like to enquire about airport transfer." target="_blank" rel="noreferrer" className="btn-outline-gold" style={{fontSize:12}}>ASK ABOUT TRANSFERS</a>
              </div>
            </div>
            {/* Local Experience */}
            <div>
              <p className="section-label" style={{color:'#C9933A'}}>Explore the Island</p>
              <div className="gold-divider"/>
              <h2 className="section-title" style={{color:'#fff',marginBottom:16}}>Local Experience</h2>
              <p style={{fontSize:14,color:'rgba(255,255,255,0.75)',lineHeight:1.8,marginBottom:16}}>
                Enjoy nearby waterfalls, beaches, local cuisine, river adventures, snorkeling, and the laid-back atmosphere of Jamaica's north coast.
              </p>
              {['Dunn\'s River Falls & Blue Hole','White sand beaches nearby','Local restaurants & Jamaican food','River tubing & snorkeling','Mystic Mountain & Dolphin Cove'].map(item=>(
                <div key={item} style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#C9933A"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
                  <span style={{fontSize:13,color:'rgba(255,255,255,0.75)'}}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BookingModal isOpen={modalOpen} onClose={()=>setModalOpen(false)} room={selectedRoom} checkin={booking?.checkin} checkout={booking?.checkout} nights={booking?.nights} total={booking?.total}/>

      <style>{`
        @media(max-width:768px){
          .mobile-book-bar{display:flex !important; position:fixed; bottom:0; left:0; right:0; z-index:999; box-shadow:0 -4px 20px rgba(0,0,0,0.15);}
          body{padding-bottom:60px;}
        }
      `}</style>
    </>
  );
}