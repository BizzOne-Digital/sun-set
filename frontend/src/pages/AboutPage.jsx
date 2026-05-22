import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <div style={{position:'relative',background:'#0E1729',padding:'80px 0',textAlign:'center',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:`url(https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1400&q=60)`,backgroundSize:'cover',backgroundPosition:'center',opacity:0.15}}/>
        <div className="container" style={{position:'relative',zIndex:1}}>
          <p className="section-label">Our Story</p>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(32px,5vw,52px)',fontWeight:700,color:'#fff',marginTop:10}}>About Sunset Retreat JA</h1>
        </div>
      </div>
      <section className="section-pad">
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'center'}}>
            <div>
              <p className="section-label">Who We Are</p>
              <div className="gold-divider"/>
              <h2 className="section-title" style={{marginBottom:20}}>A Luxury Retreat in the Heart of Ocho Rios</h2>
              <p style={{fontSize:14,color:'#666',lineHeight:1.85,marginBottom:16}}>Sunset Retreat JA is a premier luxury vacation rental located at 119 Riviera Blvd, Ocho Rios, Jamaica. We offer beautifully appointed 1 and 2-bedroom suites that combine modern comfort with the natural beauty of Jamaica.</p>
              <p style={{fontSize:14,color:'#666',lineHeight:1.85,marginBottom:16}}>Our property is designed to give you the perfect balance of privacy, luxury, and access to everything Ocho Rios has to offer — from world-famous attractions like Dunn's River Falls to pristine beaches just minutes away.</p>
              <p style={{fontSize:14,color:'#666',lineHeight:1.85}}>Whether you're a couple seeking a romantic escape or a family looking for a comfortable home base to explore Jamaica, Sunset Retreat JA is your perfect home away from home.</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&q=80','https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80','https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80','https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&q=80'].map((s,i)=>(
                <div key={i} style={{paddingBottom:'100%',position:'relative',overflow:'hidden',borderRadius:4}}>
                  <img src={s} alt="" loading="lazy" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section style={{background:'#1A2540',padding:'60px 0'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:32,textAlign:'center'}}>
            {[['5★','Avg Rating'],['500+','Happy Guests'],['2','Luxury Suites'],['119','Riviera Blvd']].map(([v,l])=>(
              <div key={l}><div style={{fontFamily:"'Playfair Display',serif",fontSize:40,fontWeight:700,color:'#C9933A'}}>{v}</div><div style={{fontSize:13,color:'rgba(255,255,255,0.6)',marginTop:6}}>{l}</div></div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
