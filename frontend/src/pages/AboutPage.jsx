import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { Link } from 'react-router-dom';

const STATS = [
  { val:'5★', label:'Average Rating' },
  { val:'500+', label:'Happy Guests' },
  { val:'2', label:'Luxury Suites' },
  { val:'24/7', label:'Guest Support' },
];

const TEAM_VALUES = [
  { icon:'🌴', title:'Genuine Hospitality', desc:'We treat every guest like family. Your comfort and happiness is our top priority from arrival to checkout.' },
  { icon:'✨', title:'Attention to Detail', desc:'Every suite is meticulously cleaned and prepared to ensure a flawless 5-star experience every time.' },
  { icon:'📍', title:'Local Expertise', desc:'As locals, we know Ocho Rios inside out. We share the best spots, restaurants, and hidden gems with every guest.' },
  { icon:'💚', title:'Sustainable Tourism', desc:'We are committed to responsible tourism that benefits the local community and preserves Jamaica\'s natural beauty.' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar /><ScrollToTop />

      {/* Hero */}
      <div style={{ position:'relative', background:'#0E1729', padding:'70px 0', textAlign:'center', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:`url(https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1400&q=60)`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.2 }}/>
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <p className="section-label">Our Story</p>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(28px,5vw,50px)', fontWeight:700, color:'#fff', marginTop:10 }}>About Sunset Retreat JA</h1>
        </div>
      </div>

      {/* Story Section */}
      <section className="section-pad">
        <div className="container">
          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:56, alignItems:'center' }}>
            <div>
              <p className="section-label">Who We Are</p>
              <div className="gold-divider"/>
              <h2 className="section-title" style={{ marginBottom:20 }}>A Peaceful Tropical Retreat Near Ocho Rios</h2>
              <p style={{ fontSize:14, color:'#555', lineHeight:1.85, marginBottom:16 }}>
                Sunset Retreat JA is a comfortable vacation rental located in the peaceful Tower Isle area, just outside Ocho Rios, Jamaica. We offer well-appointed 1 and 2-bedroom suites that combine modern comfort with the natural beauty of the Caribbean.
              </p>
              <p style={{ fontSize:14, color:'#555', lineHeight:1.85, marginBottom:16 }}>
                Located in a quiet residential area, our property gives you the perfect balance of privacy, relaxation, and easy access to everything the north coast has to offer — from world-famous Dunn's River Falls to pristine beaches just a short drive away.
              </p>
              <p style={{ fontSize:14, color:'#555', lineHeight:1.85, marginBottom:28 }}>
                Whether you're a couple seeking a romantic escape, a solo traveler wanting to unwind, or a small family looking for a comfortable base to explore Jamaica, Sunset Retreat JA is your home away from home.
              </p>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                <Link to="/accommodations" className="btn-gold">View Rooms</Link>
                <Link to="/contact" className="btn-navy">Contact Us</Link>
              </div>
            </div>
            {/* Photo grid */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[
                '/property-exterior2.jpg',
                '/property-gate.jpg',
                '/property-night.jpg',
                '/property-building.jpg',
              ].map((src, i) => (
                <div key={i} style={{ paddingBottom:'100%', position:'relative', overflow:'hidden', borderRadius:6 }}>
                  <img src={src} alt="" loading="lazy" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s' }}
                    onMouseEnter={e=>e.target.style.transform='scale(1.06)'} onMouseLeave={e=>e.target.style.transform='scale(1)'}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background:'#1A2540', padding:'56px 0' }}>
        <div className="container">
          <div className="four-col" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, textAlign:'center' }}>
            {STATS.map(s => (
              <div key={s.label}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(32px,5vw,48px)', fontWeight:700, color:'#C9933A' }}>{s.val}</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginTop:6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad" style={{ background:'#FDF8F0' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:44 }}>
            <p className="section-label">Our Values</p>
            <div className="gold-divider center"/>
            <h2 className="section-title">Why Choose Sunset Retreat JA</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:24 }}>
            {TEAM_VALUES.map(v => (
              <div key={v.title} style={{ background:'#fff', padding:'28px 24px', borderRadius:8, border:'1px solid #EDE8E0', borderTop:'3px solid #C9933A', transition:'all 0.3s' }}
                onMouseEnter={e=>e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.1)'}
                onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}>
                <div style={{ fontSize:36, marginBottom:14 }}>{v.icon}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'#1A2540', fontWeight:700, marginBottom:10 }}>{v.title}</h3>
                <p style={{ fontSize:13, color:'#666', lineHeight:1.75 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section-pad">
        <div className="container">
          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center' }}>
            <div>
              <p className="section-label">Find Us</p>
              <div className="gold-divider"/>
              <h2 className="section-title" style={{ marginBottom:16 }}>Located in Tower Isle, Near Ocho Rios</h2>
              <p style={{ fontSize:14, color:'#555', lineHeight:1.8, marginBottom:24 }}>
                Located in the peaceful Tower Isle area, just outside Ocho Rios, we are a short drive from Jamaica's most popular attractions, beaches, restaurants, and entertainment. Airport transfer assistance is available upon request.
              </p>
              {[
                ['Dunn\'s River Falls', '5 min drive'],
                ['Local Beaches', '5 min drive'],
                ['Mystic Mountain', '10 min drive'],
                ['Ocho Rios Town', '8 min drive'],
                ['Blue Hole', '20 min drive'],
              ].map(([place, dist]) => (
                <div key={place} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #F0EBE0', fontSize:14 }}>
                  <span style={{ color:'#333', fontWeight:500 }}>{place}</span>
                  <span style={{ color:'#C9933A', fontWeight:600 }}>{dist}</span>
                </div>
              ))}
            </div>
            <div style={{ background:'#F9F5EE', borderRadius:8, overflow:'hidden', border:'1px solid #EDE8E0' }}>
              <iframe
                src="https://maps.google.com/maps?q=119+Riviera+Blvd+Ocho+Rios+Jamaica&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%" height="380" style={{ border:0, display:'block' }} allowFullScreen loading="lazy"
                title="Sunset Retreat JA Location"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}