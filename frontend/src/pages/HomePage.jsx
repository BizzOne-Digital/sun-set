import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import AvailabilityChecker from '../components/AvailabilityChecker';
import BookingModal from '../components/BookingModal';

const HERO_BG = 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1800&q=85';
const HERO_ROOM = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80';

const FEATURES = [
  { title:'Stunning Views', desc:'Breathtaking ocean and sunset views', icon:<svg width="34" height="34" fill="none" stroke="#C9933A" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17.5 6.5L13 19"/><path d="M5 14l7-9 4 5-3 4-5-3z"/><path d="M3 21h18"/></svg> },
  { title:'Luxury Comfort', desc:'Spacious 1 & 2 bedroom suites', icon:<svg width="34" height="34" fill="none" stroke="#C9933A" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg> },
  { title:'Prime Location', desc:'Minutes from beaches & attractions', icon:<svg width="34" height="34" fill="none" stroke="#C9933A" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
  { title:'Safe & Secure', desc:'Gated property with 24/7 security', icon:<svg width="34" height="34" fill="none" stroke="#C9933A" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { title:'Free Wi-Fi', desc:'High speed internet throughout', icon:<svg width="34" height="34" fill="none" stroke="#C9933A" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="#C9933A"/></svg> },
  { title:'Guest Support', desc:"We're here for your perfect stay", icon:<svg width="34" height="34" fill="none" stroke="#C9933A" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.97-.97a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
];

const THINGS = [
  { img:'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&q=75', title:"Dunn's River Falls", desc:'Climb the world-famous waterfalls' },
  { img:'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=300&q=75', title:'Blue Hole', desc:'Swim, jump & explore natural pools' },
  { img:'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=300&q=75', title:'Mystic Mountain', desc:'Bobsled, zipline & amazing views' },
  { img:'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&q=75', title:'Snorkeling & Diving', desc:'Explore vibrant coral reefs' },
  { img:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=75', title:'River Tubing', desc:'Peaceful river adventure' },
  { img:'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=300&q=75', title:'Beach Day', desc:'Beautiful white sand beaches' },
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
      <section style={{position:'relative',minHeight:'92vh',overflow:'hidden',display:'flex',alignItems:'center'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:`url(${HERO_BG})`,backgroundSize:'cover',backgroundPosition:'center'}}/>
        <div style={{position:'absolute',right:0,top:0,bottom:0,width:'40%',backgroundImage:`url(${HERO_ROOM})`,backgroundSize:'cover',backgroundPosition:'center',clipPath:'polygon(14% 0,100% 0,100% 100%,0% 100%)'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(10,18,35,0.88) 40%,rgba(10,18,35,0.2) 85%)'}}/>
        <div className="container" style={{position:'relative',zIndex:2,display:'grid',gridTemplateColumns:'1fr 310px',gap:28,alignItems:'center',padding:'80px 20px'}}>
          <div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(36px,5vw,60px)',fontWeight:700,color:'#fff',lineHeight:1.12,marginBottom:10}}>Your Luxury Escape</h1>
            <h2 style={{fontFamily:"'Dancing Script',cursive",fontSize:'clamp(28px,4vw,50px)',color:'#C9933A',marginBottom:20,lineHeight:1.2}}>in Ocho Rios</h2>
            <p style={{fontSize:15,color:'rgba(255,255,255,0.82)',marginBottom:34,lineHeight:1.75,maxWidth:440}}>Experience comfort, relaxation and unforgettable sunsets at Sunset Retreat JA.</p>
            <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
              <a href="#accommodations" className="btn-gold">BOOK YOUR STAY</a>
              <a href="https://wa.me/18762689319?text=Hi! I'd like to enquire about availability." target="_blank" rel="noreferrer" className="btn-outline-white">WHATSAPP US</a>
            </div>
          </div>
          <div>
            <p style={{fontSize:11,fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(255,255,255,0.7)',textAlign:'center',marginBottom:6}}>Live Availability</p>
            <AvailabilityChecker roomId={rooms[0]?._id} pricePerNight={rooms[0]?.pricePerNight} onBook={(d) => handleBook(rooms[0], d)} />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{background:'#fff',padding:'50px 0',borderBottom:'1px solid #F0EBE0'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:28}}>
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

      {/* ACCOMMODATIONS — dynamic from DB */}
      <section id="accommodations" className="section-pad" style={{background:'#FDF8F0'}}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:44}}>
            <p className="section-label">Stay With Us</p>
            <div className="gold-divider center"/>
            <h2 className="section-title">Our Accommodations</h2>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:24}}>
            {rooms.map(room => (
              <div key={room._id} style={{background:'#fff',display:'grid',gridTemplateColumns:'260px 1fr 290px',boxShadow:'0 4px 20px rgba(0,0,0,0.08)',overflow:'hidden',border:'1px solid #F0EBE0'}}>
                <div style={{overflow:'hidden'}}>
                  <img src={room.images?.[0]||'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80'} alt={room.name} style={{width:'100%',height:'100%',objectFit:'cover',minHeight:240,transition:'transform 0.5s'}} onMouseEnter={e=>e.target.style.transform='scale(1.06)'} onMouseLeave={e=>e.target.style.transform='scale(1)'}/>
                </div>
                <div style={{padding:'24px 20px'}}>
                  <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:'#1A2540',fontWeight:700,marginBottom:7}}>{room.name}</h3>
                  <p style={{fontSize:13,color:'#777',lineHeight:1.7,marginBottom:14}}>{room.shortDesc}</p>
                  <div style={{display:'flex',gap:18,marginBottom:14,flexWrap:'wrap'}}>
                    <div style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'#555'}}><svg width="13" height="13" fill="none" stroke="#C9933A" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>{room.bedrooms} Bed{room.bedrooms>1?'s':''}</div>
                    <div style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'#555'}}><svg width="13" height="13" fill="none" stroke="#C9933A" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 7.7 7 7h-.01C6.72 7.7 5.43 8.33 4.43 9.06 3.3 9.97 2.82 11.07 2.82 12.25c0 2.22 1.8 4.05 4.18 4.05z"/></svg>{room.bathrooms} Bath{room.bathrooms>1?'s':''}</div>
                    <div style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'#555'}}><svg width="13" height="13" fill="none" stroke="#C9933A" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>{room.maxGuests} Guests</div>
                  </div>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16}}>
                    {(room.amenities||[]).slice(0,5).map(a=><span key={a} style={{background:'#F9F5EE',border:'1px solid #E8DDD0',fontSize:11,padding:'3px 9px',borderRadius:12,color:'#555'}}>{a}</span>)}
                  </div>
                  <div style={{fontSize:19,fontFamily:"'Playfair Display',serif",fontWeight:700,color:'#C9933A',marginBottom:14}}>${room.pricePerNight}<span style={{fontSize:12,color:'#888',fontFamily:"'Poppins',sans-serif",fontWeight:400}}>/night</span></div>
                  <div style={{display:'flex',gap:8}}>
                    {room.airbnbUrl&&<a href={room.airbnbUrl} target="_blank" rel="noreferrer" style={{background:'#FF5A3B',color:'#fff',padding:'7px 14px',fontSize:11,fontWeight:600,textDecoration:'none',borderRadius:3,transition:'opacity 0.2s'}} onMouseEnter={e=>e.currentTarget.style.opacity=0.8} onMouseLeave={e=>e.currentTarget.style.opacity=1}>Airbnb</a>}
                    {room.vrboUrl&&<a href={room.vrboUrl} target="_blank" rel="noreferrer" style={{background:'#0073E6',color:'#fff',padding:'7px 14px',fontSize:11,fontWeight:600,textDecoration:'none',borderRadius:3,transition:'opacity 0.2s'}} onMouseEnter={e=>e.currentTarget.style.opacity=0.8} onMouseLeave={e=>e.currentTarget.style.opacity=1}>VRBO</a>}
                  </div>
                </div>
                <div style={{padding:'20px 16px',borderLeft:'1px solid #F0EBE0',background:'#FDFAF6'}}>
                  <p style={{fontSize:11,fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'#888',marginBottom:8,textAlign:'center'}}>Check Availability</p>
                  <AvailabilityChecker roomId={room._id} pricePerNight={room.pricePerNight} onBook={(d)=>handleBook(room,d)} />
                </div>
              </div>
            ))}
            {rooms.length === 0 && <p style={{textAlign:'center',color:'#aaa',padding:40}}>Loading accommodations...</p>}
          </div>
          <div style={{textAlign:'center',marginTop:28}}>
            <a href="https://www.airbnb.com/rooms/51519181" target="_blank" rel="noreferrer" className="btn-navy">VIEW ALL ON AIRBNB</a>
          </div>
        </div>
      </section>

      {/* DARK SERVICES SECTION */}
      <section style={{background:'#1A2540',padding:'70px 0'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:40,alignItems:'start'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                <div style={{width:42,height:42,background:'rgba(201,147,58,0.15)',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:4}}><svg width="22" height="22" fill="none" stroke="#C9933A" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:'#fff',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.04em'}}>Airbnb Management Services</h3>
              </div>
              <p style={{fontSize:13,color:'rgba(255,255,255,0.58)',marginBottom:16,lineHeight:1.7}}>We help property owners maximize their rental income while we handle everything.</p>
              {['Listing Creation & Optimization','Dynamic Pricing & Revenue Management','Guest Communication & Support','Booking Management','Housekeeping & Maintenance','Monthly Reports & Performance Tracking'].map(s=>(
                <div key={s} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}><svg width="14" height="14" viewBox="0 0 24 24" fill="#C9933A"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg><span style={{fontSize:13,color:'rgba(255,255,255,0.7)'}}>{s}</span></div>
              ))}
              <Link to="/manage" className="btn-outline-gold" style={{marginTop:18,fontSize:12}}>LEARN MORE</Link>
            </div>
            <div style={{width:120,height:120,borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',padding:8,boxShadow:'0 8px 30px rgba(0,0,0,0.3)',flexShrink:0,marginTop:20}}>
              <div style={{textAlign:'center',fontFamily:"'Playfair Display',serif",fontSize:11,color:'#1A2540',fontWeight:700,lineHeight:1.4}}>SUNSET<br/>RETREAT<br/><span style={{color:'#C9933A'}}>JA</span></div>
            </div>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                <div style={{width:42,height:42,background:'rgba(201,147,58,0.15)',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:4}}><svg width="22" height="22" fill="none" stroke="#C9933A" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 3l18 18M10.5 6.5L6 3 3 6l3.5 3.5M14 10l-4 4M17.5 13.5L21 17l-3 3-3.5-3.5"/></svg></div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:'#fff',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.04em'}}>Cleaning Services</h3>
              </div>
              <p style={{fontSize:13,color:'rgba(255,255,255,0.58)',marginBottom:16,lineHeight:1.7}}>Professional cleaning for a 5-star experience every time.</p>
              {['Thorough Cleaning & Sanitization','Laundry & Linens','Restocking Essentials','Pre & Post Guest Cleaning','Deep Cleaning Services'].map(s=>(
                <div key={s} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}><svg width="14" height="14" viewBox="0 0 24 24" fill="#C9933A"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg><span style={{fontSize:13,color:'rgba(255,255,255,0.7)'}}>{s}</span></div>
              ))}
              <Link to="/services" className="btn-outline-gold" style={{marginTop:18,fontSize:12}}>LEARN MORE</Link>
            </div>
          </div>
        </div>
      </section>

      {/* THINGS TO DO */}
      <section className="section-pad" style={{background:'#fff'}}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:36}}>
            <p className="section-label">Explore Jamaica</p>
            <div className="gold-divider center"/>
            <h2 className="section-title">Things To Do In & Around Ocho Rios</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr) 100px',gap:10}}>
            {THINGS.map(t=>(
              <div key={t.title} onMouseEnter={e=>e.currentTarget.querySelector('img').style.transform='scale(1.07)'} onMouseLeave={e=>e.currentTarget.querySelector('img').style.transform='scale(1)'}>
                <div style={{paddingBottom:'85%',position:'relative',overflow:'hidden',borderRadius:3}}>
                  <img src={t.img} alt={t.title} loading="lazy" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.5s'}}/>
                </div>
                <p style={{fontFamily:"'Playfair Display',serif",fontSize:12,fontWeight:700,color:'#1A2540',marginTop:7,marginBottom:2}}>{t.title}</p>
                <p style={{fontSize:11,color:'#888',lineHeight:1.4}}>{t.desc}</p>
              </div>
            ))}
            <Link to="/attractions" style={{background:'#C9933A',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:12,borderRadius:3,textDecoration:'none',transition:'background 0.2s'}} onMouseEnter={e=>e.currentTarget.style.background='#b8821f'} onMouseLeave={e=>e.currentTarget.style.background='#C9933A'}>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:11,color:'#fff',fontWeight:700,textAlign:'center',lineHeight:1.4,marginBottom:8}}>VIEW ALL</p>
              <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12,8 16,12 12,16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* REVIEWS + INSTAGRAM + QR */}
      <section className="section-pad" style={{background:'#FDF8F0'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:44}}>
            <div>
              <h2 className="section-title" style={{marginBottom:22}}>What Our Guests Say</h2>
              {reviews.length > 0 ? (<>
                <div style={{fontSize:50,color:'#C9933A',lineHeight:1,marginBottom:4,fontFamily:'serif'}}>"</div>
                <p style={{fontSize:14,color:'#444',lineHeight:1.8,fontStyle:'italic',marginBottom:12}}>{reviews[reviewIdx]?.text}</p>
                <p style={{fontSize:13,fontWeight:600,color:'#1A2540',marginBottom:3}}>— {reviews[reviewIdx]?.name}</p>
                <p style={{fontSize:11,color:'#888',marginBottom:7}}>{reviews[reviewIdx]?.origin}</p>
                <Stars n={reviews[reviewIdx]?.rating || 5}/>
                <div style={{display:'flex',gap:6,marginTop:14}}>{reviews.map((_,i)=><button key={i} onClick={()=>setReviewIdx(i)} style={{width:i===reviewIdx?22:9,height:9,borderRadius:5,background:i===reviewIdx?'#C9933A':'#ddd',border:'none',cursor:'pointer',transition:'all 0.3s',padding:0}}/>)}</div>
              </>) : <p style={{color:'#aaa',fontSize:13}}>Loading reviews...</p>}
            </div>
            <div>
              <h2 className="section-title" style={{marginBottom:22}}>Follow Us On Instagram</h2>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,marginBottom:12}}>
                {['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=220&q=70','https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=220&q=70','https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=220&q=70','https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=220&q=70'].map((s,i)=>(
                  <div key={i} style={{paddingBottom:'100%',position:'relative',overflow:'hidden',borderRadius:3}}><img src={s} alt="" loading="lazy" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/></div>
                ))}
              </div>
              <a href="https://instagram.com/sunsetretreatja" target="_blank" rel="noreferrer" className="btn-gold" style={{fontSize:12}}>Follow @sunsetretreatja</a>
            </div>
            <div>
              <h2 className="section-title" style={{marginBottom:10}}>Scan To Book</h2>
              <p style={{fontSize:13,color:'#777',marginBottom:16,lineHeight:1.6}}>Scan to check availability and book instantly!</p>
              <div style={{width:150,height:150,background:'#fff',border:'2px solid #C9933A',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12,borderRadius:4}}>
                <svg viewBox="0 0 100 100" width="130" height="130">
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
              <a href="https://www.airbnb.com/rooms/51519181" target="_blank" rel="noreferrer" className="btn-gold" style={{fontSize:12}}>SCAN ME</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <BookingModal isOpen={modalOpen} onClose={()=>setModalOpen(false)} room={selectedRoom} checkin={booking?.checkin} checkout={booking?.checkout} nights={booking?.nights} total={booking?.total}/>
    </>
  );
}
