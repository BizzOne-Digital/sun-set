import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import api from '../api';

const CATS = ['all','exterior','interior','bedroom','pool','dining','view','other'];

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [cat, setCat] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => { api.get('/api/gallery', { params: { category: cat } }).then(r => setPhotos(r.data)).catch(() => {}); }, [cat]);

  return (
    <>
      <Navbar /><ScrollToTop />
      <div style={{position:'relative',background:'#0E1729',padding:'80px 0',textAlign:'center',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:`url(https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1400&q=60)`,backgroundSize:'cover',backgroundPosition:'center',opacity:0.2}}/>
        <div className="container" style={{position:'relative',zIndex:1}}>
          <p className="section-label">Photo Gallery</p>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(32px,5vw,52px)',fontWeight:700,color:'#fff',marginTop:10}}>Gallery</h1>
        </div>
      </div>
      <section className="section-pad">
        <div className="container">
          <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap',marginBottom:36}}>
            {CATS.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:'8px 18px',border:`1px solid ${cat===c?'#C9933A':'#E0D8CC'}`,background:cat===c?'#C9933A':'#fff',color:cat===c?'#fff':'#555',fontSize:12,fontWeight:cat===c?600:400,cursor:'pointer',borderRadius:4,textTransform:'capitalize',transition:'all 0.2s'}}>{c}</button>)}
          </div>
          <div style={{columns:'4 200px',gap:12}}>
            {photos.map(p=>(
              <div key={p._id} style={{breakInside:'avoid',marginBottom:12,overflow:'hidden',borderRadius:4,cursor:'pointer'}} onClick={()=>setLightbox(p)}>
                <img src={p.url} alt={p.caption} loading="lazy" style={{width:'100%',display:'block',transition:'transform 0.4s'}} onMouseEnter={e=>e.target.style.transform='scale(1.05)'} onMouseLeave={e=>e.target.style.transform='scale(1)'} onError={e=>e.target.style.display='none'}/>
              </div>
            ))}
            {photos.length===0&&<div style={{textAlign:'center',padding:'60px 0',color:'#aaa',gridColumn:'1/-1'}}>No photos in this category yet.</div>}
          </div>
        </div>
      </section>
      {lightbox&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:3000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={()=>setLightbox(null)}>
          <div style={{maxWidth:900,width:'100%',textAlign:'center'}} onClick={e=>e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.caption} style={{maxWidth:'100%',maxHeight:'80vh',objectFit:'contain',borderRadius:4}}/>
            {lightbox.caption&&<p style={{color:'rgba(255,255,255,0.7)',marginTop:12,fontSize:13}}>{lightbox.caption}</p>}
            <button onClick={()=>setLightbox(null)} style={{position:'fixed',top:20,right:24,background:'none',border:'none',color:'#fff',fontSize:32,cursor:'pointer'}}>×</button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
