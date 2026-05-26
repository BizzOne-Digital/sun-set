import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

const ATTRACTIONS = [
  {img:'https://images.unsplash.com/photo-1558031096-21eb8c643d39?q=80',title:"Dunn's River Falls",dist:'5 min drive',desc:'One of Jamaica\'s most iconic natural attractions. Climb the terraced waterfalls or simply enjoy the breathtaking scenery.',tags:['Nature','Adventure','Swimming']},
  {img:'https://images.unsplash.com/photo-1758812775438-5e0d7325088b?q=80',title:'Blue Hole Secret Falls',dist:'20 min drive',desc:'A hidden gem featuring stunning natural pools and waterfalls where you can swim, jump, and rope swing.',tags:['Nature','Swimming','Adventure']},
  {img:'https://images.unsplash.com/photo-1466854076813-4aa9ac0fc347?q=80',title:'Mystic Mountain',dist:'10 min drive',desc:'Enjoy the famous bobsled ride, zipline through the rainforest canopy, and take in panoramic views of Ocho Rios.',tags:['Adventure','Views','Family']},
  {img:'https://images.unsplash.com/photo-1664922114319-4700c0ef74b1?q=80',title:'Snorkeling & Diving',dist:'15 min drive',desc:'Explore the vibrant coral reefs and rich marine life of the Caribbean Sea with professional guides.',tags:['Water Sports','Nature']},
  {img:'https://images.unsplash.com/photo-1562701193-2c694bd0fe15?q=80',title:'River Tubing',dist:'25 min drive',desc:'Float down a scenic river on an inner tube, surrounded by lush tropical vegetation.',tags:['Nature','Relaxation']},
  {img:'https://images.unsplash.com/photo-1536869338989-e7ffd2297454?q=80',title:'Beach Day',dist:'5 min drive',desc:'Relax on the beautiful white sand beaches of Ocho Rios, swim in the crystal clear Caribbean water.',tags:['Beach','Relaxation','Swimming']},
  {img:'https://images.unsplash.com/photo-1712960258915-7ab4eb27d24f?q=80',title:'Island Village',dist:'5 min drive',desc:'A vibrant entertainment complex with shopping, dining, beach, casino, and live music.',tags:['Shopping','Dining','Entertainment']},
  {img:'https://images.unsplash.com/photo-1554663565-f60b88adfa08?q=80',title:'Shaw Park Gardens',dist:'8 min drive',desc:'Beautiful botanical gardens with cascading waterfalls, exotic plants, and stunning views.',tags:['Nature','Photography']},
];

export default function AttractionsPage() {
  return (
    <>
      <Navbar /><ScrollToTop />
      <div style={{position:'relative',background:'#0E1729',padding:'80px 0',textAlign:'center',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:`url(https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1400&q=60)`,backgroundSize:'cover',backgroundPosition:'center',opacity:0.2}}/>
        <div className="container" style={{position:'relative',zIndex:1}}>
          <p className="section-label">Explore Ocho Rios</p>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(32px,5vw,52px)',fontWeight:700,color:'#fff',marginTop:10}}>Local Attractions</h1>
          <p style={{fontSize:15,color:'rgba(255,255,255,0.7)',marginTop:12,maxWidth:500,margin:'12px auto 0'}}>Everything you need for an unforgettable Jamaica experience, right on your doorstep.</p>
        </div>
      </div>
      <section className="section-pad">
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:24}}>
            {ATTRACTIONS.map(a=>(
              <div key={a.title} style={{background:'#fff',border:'1px solid #EDE8E0',borderRadius:6,overflow:'hidden',transition:'all 0.3s'}} onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.12)';e.currentTarget.style.transform='translateY(-4px)'}} onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)'}}>
                <div style={{height:200,overflow:'hidden'}}>
                  <img src={a.img} alt={a.title} loading="lazy" style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.5s'}} onMouseEnter={e=>e.target.style.transform='scale(1.06)'} onMouseLeave={e=>e.target.style.transform='scale(1)'}/>
                </div>
                <div style={{padding:'20px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                    <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:'#1A2540',fontWeight:700}}>{a.title}</h3>
                    <span style={{background:'#F9F5EE',color:'#C9933A',fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:20,whiteSpace:'nowrap',marginLeft:8}}>📍 {a.dist}</span>
                  </div>
                  <p style={{fontSize:13,color:'#666',lineHeight:1.7,marginBottom:12}}>{a.desc}</p>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    {a.tags.map(t=><span key={t} style={{background:'#FDF8F0',border:'1px solid #EDE8E0',fontSize:11,padding:'2px 10px',borderRadius:20,color:'#888'}}>{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
