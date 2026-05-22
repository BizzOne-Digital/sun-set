import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

export default function ServicesPage() {
  return (
    <>
      <Navbar /><ScrollToTop />
      <div style={{position:'relative',background:'#0E1729',padding:'80px 0',textAlign:'center',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:`url(https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1400&q=60)`,backgroundSize:'cover',backgroundPosition:'center',opacity:0.15}}/>
        <div className="container" style={{position:'relative',zIndex:1}}>
          <p className="section-label">What We Offer</p>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(32px,5vw,52px)',fontWeight:700,color:'#fff',marginTop:10}}>Our Services</h1>
        </div>
      </div>
      <section className="section-pad">
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32}}>
            {[{id:'airbnb',title:'Airbnb Property Management',emoji:'🏠',desc:'We help Jamaican property owners maximize their Airbnb rental income while handling every aspect of the rental process.',items:['Professional listing creation & photography','Dynamic pricing strategy','24/7 guest communication','Booking management & calendar control','Housekeeping & maintenance coordination','Monthly revenue reports']},{id:'cleaning',title:'Professional Cleaning Services',emoji:'✨',desc:'Our professional cleaning team ensures every property is guest-ready after every stay, maintaining the highest standards.',items:['Deep cleaning after every guest','Fresh linens & towels','Restocking of essentials & toiletries','Property inspection report','Damage documentation','Flexible scheduling']}].map(s=>(
              <div key={s.id} id={s.id} style={{background:'#fff',border:'1px solid #EDE8E0',borderRadius:6,padding:'32px',borderTop:'4px solid #C9933A'}}>
                <div style={{fontSize:40,marginBottom:16}}>{s.emoji}</div>
                <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:'#1A2540',fontWeight:700,marginBottom:12}}>{s.title}</h2>
                <p style={{fontSize:13,color:'#777',lineHeight:1.75,marginBottom:20}}>{s.desc}</p>
                {s.items.map(item=>(
                  <div key={item} style={{display:'flex',gap:10,marginBottom:10,alignItems:'flex-start'}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#C9933A" style={{flexShrink:0,marginTop:1}}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                    <span style={{fontSize:13,color:'#555'}}>{item}</span>
                  </div>
                ))}
                <Link to="/manage" className="btn-gold" style={{display:'inline-flex',marginTop:20,fontSize:12}}>Get Started →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{background:'#C9933A',padding:'60px 0',textAlign:'center'}}>
        <div className="container">
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(24px,4vw,38px)',color:'#fff',fontWeight:700,marginBottom:12}}>Ready to Maximize Your Property's Potential?</h2>
          <p style={{fontSize:15,color:'rgba(255,255,255,0.85)',marginBottom:28}}>Apply now and our team will contact you within 24 hours.</p>
          <Link to="/manage" style={{display:'inline-block',background:'#fff',color:'#C9933A',padding:'13px 32px',fontSize:13,fontWeight:700,borderRadius:4,textDecoration:'none',letterSpacing:'0.05em'}}>APPLY FOR MANAGEMENT</Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
