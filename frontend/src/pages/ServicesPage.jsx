import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

const SERVICES = [
  {
    id:'airbnb', emoji:'🏠', title:'Airbnb Property Management',
    desc:'We help Jamaican property owners maximize their Airbnb rental income while handling every aspect of the rental process — so you earn more with zero stress.',
    items:['Professional listing creation & photography','Dynamic pricing strategy & revenue management','24/7 guest communication & support','Booking management & calendar control','Housekeeping & maintenance coordination','Monthly revenue reports & performance tracking'],
    cta:'Apply for Management', href:'/manage',
  },
  {
    id:'cleaning', emoji:'✨', title:'Professional Cleaning Services',
    desc:'Our professional cleaning team ensures every property is immaculate and guest-ready after every stay, maintaining the highest 5-star standards.',
    items:['Deep cleaning & sanitization after every guest','Fresh linens, towels & restocking essentials','Pre & post guest inspection report','Damage documentation & reporting','Flexible scheduling — same day available','Eco-friendly cleaning products'],
    cta:'Contact Us', href:'/contact',
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar /><ScrollToTop />

      {/* Hero */}
      <div style={{ position:'relative', background:'#0E1729', padding:'70px 0', textAlign:'center', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:`url(https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1400&q=60)`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.15 }}/>
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <p className="section-label">What We Offer</p>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(28px,5vw,50px)', fontWeight:700, color:'#fff', marginTop:10 }}>Our Services</h1>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.7)', marginTop:10, maxWidth:500, margin:'10px auto 0' }}>Professional Airbnb management & cleaning services in Ocho Rios, Jamaica</p>
        </div>
      </div>

      {/* Services */}
      <section className="section-pad">
        <div className="container">
          <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
            {SERVICES.map(s => (
              <div key={s.id} id={s.id} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, alignItems:'start', background:'#fff', border:'1px solid #EDE8E0', borderRadius:8, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }} className="two-col">
                {/* Left */}
                <div style={{ padding:'36px', borderRight:'1px solid #EDE8E0', background:'#FDF8F0', height:'100%' }}>
                  <div style={{ fontSize:48, marginBottom:16 }}>{s.emoji}</div>
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(20px,3vw,26px)', color:'#1A2540', fontWeight:700, marginBottom:14 }}>{s.title}</h2>
                  <p style={{ fontSize:14, color:'#666', lineHeight:1.8, marginBottom:24 }}>{s.desc}</p>
                  <Link to={s.href} className="btn-gold" style={{ fontSize:13 }}>{s.cta} →</Link>
                </div>
                {/* Right — list */}
                <div style={{ padding:'36px' }}>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:'#1A2540', fontWeight:700, marginBottom:20 }}>What's Included</h3>
                  {s.items.map(item => (
                    <div key={item} style={{ display:'flex', gap:12, marginBottom:14, alignItems:'flex-start' }}>
                      <div style={{ width:22, height:22, background:'rgba(201,147,58,0.12)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="#C9933A"><path d="M20 6L9 17l-5-5"/></svg>
                      </div>
                      <span style={{ fontSize:14, color:'#444', lineHeight:1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background:'#C9933A', padding:'60px 0', textAlign:'center' }}>
        <div className="container">
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(22px,4vw,36px)', color:'#fff', fontWeight:700, marginBottom:12 }}>
            Ready to Maximize Your Property's Potential?
          </h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.88)', marginBottom:28 }}>Apply now and our team will contact you within 24 hours.</p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/manage" style={{ background:'#fff', color:'#C9933A', padding:'13px 30px', fontSize:13, fontWeight:700, borderRadius:4, textDecoration:'none', letterSpacing:'0.05em' }}>APPLY FOR MANAGEMENT</Link>
            <a href="https://wa.me/18762689319" target="_blank" rel="noreferrer" style={{ background:'#25D366', color:'#fff', padding:'13px 30px', fontSize:13, fontWeight:700, borderRadius:4, textDecoration:'none', letterSpacing:'0.05em' }}>WhatsApp Us</a>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media(max-width:768px){
          #airbnb, #cleaning { grid-template-columns:1fr !important; }
          #airbnb > div:first-child, #cleaning > div:first-child { border-right:none !important; border-bottom:1px solid #EDE8E0; }
        }
      `}</style>
    </>
  );
}