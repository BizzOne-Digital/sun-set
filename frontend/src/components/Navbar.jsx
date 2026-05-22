import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { label:'Home', to:'/' },
  { label:'About Us', to:'/about' },
  { label:'Accommodations', to:'/accommodations' },
  { label:'Things To Do', to:'/things-to-do' },
  { label:'Attractions', to:'/attractions' },
  { label:'Services', to:'/services', sub:[{label:'Airbnb Management',to:'/manage'},{label:'Cleaning Services',to:'/services'}] },
  { label:'Gallery', to:'/gallery' },
  { label:'Reviews', to:'/reviews' },
  { label:'Contact', to:'/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(null);
  const loc = useLocation();

  useEffect(() => { const fn=()=>setScrolled(window.scrollY>80); window.addEventListener('scroll',fn); return ()=>window.removeEventListener('scroll',fn); }, []);
  useEffect(() => { setOpen(false); setDrop(null); }, [loc]);

  return (
    <>
      {/* Top bar */}
      <div style={{position:'fixed',top:0,left:0,right:0,zIndex:1001,background:'#0E1729',padding:'7px 0',fontSize:12,color:'rgba(255,255,255,0.78)'}}>
        <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
          <div style={{display:'flex',gap:22,flexWrap:'wrap'}}>
            <span style={{display:'flex',alignItems:'center',gap:5}}><svg width="11" height="11" fill="#C9933A" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>119 Riviera Blvd, Ocho Rios, Jamaica</span>
            <a href="tel:+18762689319" style={{display:'flex',alignItems:'center',gap:5,color:'rgba(255,255,255,0.78)',transition:'color 0.2s'}} onMouseEnter={e=>e.currentTarget.style.color='#C9933A'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.78)'}><svg width="11" height="11" fill="#C9933A" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>+1 (876) 268-9319</a>
            <a href="mailto:info@sunsetretreatja.com" style={{display:'flex',alignItems:'center',gap:5,color:'rgba(255,255,255,0.78)',transition:'color 0.2s'}} onMouseEnter={e=>e.currentTarget.style.color='#C9933A'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.78)'}><svg width="11" height="11" fill="#C9933A" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>info@sunsetretreatja.com</a>
          </div>
          <div style={{display:'flex',gap:14}}>
            {[{href:'https://facebook.com',svg:<svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>},{href:'https://instagram.com/sunsetretreatja',svg:<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>},{href:'https://wa.me/18762689319',svg:<svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413z"/><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.07-1.35C8.46 21.51 10.19 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>}].map((s,i)=>(
              <a key={i} href={s.href} target="_blank" rel="noreferrer" style={{color:'rgba(255,255,255,0.6)',transition:'color 0.2s'}} onMouseEnter={e=>e.currentTarget.style.color='#C9933A'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.6)'}>{s.svg}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div style={{position:'fixed',top:34,left:0,right:0,zIndex:1000}}>
        <div style={{background:scrolled?'rgba(255,255,255,0.98)':'rgba(255,255,255,0.97)',backdropFilter:'blur(10px)',boxShadow:scrolled?'0 2px 20px rgba(0,0,0,0.1)':'0 1px 0 rgba(0,0,0,0.05)',transition:'all 0.3s'}}>
          <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:68}}>
            <Link to="/" style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:16,color:'#1A2540',letterSpacing:'0.05em',lineHeight:1.2}}>SUNSET<br/><span style={{color:'#C9933A',fontSize:14}}>RETREAT JA</span></div>
            </Link>
            <nav style={{display:'flex',alignItems:'center',gap:2}} className="main-nav">
              {NAV.map(link=>(
                <div key={link.label} style={{position:'relative'}} onMouseEnter={()=>link.sub&&setDrop(link.label)} onMouseLeave={()=>setDrop(null)}>
                  <Link to={link.to} style={{display:'flex',alignItems:'center',gap:2,padding:'8px 9px',fontSize:12,fontWeight:500,color:loc.pathname===link.to?'#C9933A':'#1A2540',borderBottom:loc.pathname===link.to?'2px solid #C9933A':'2px solid transparent',transition:'all 0.2s',whiteSpace:'nowrap'}} onMouseEnter={e=>{if(loc.pathname!==link.to)e.currentTarget.style.color='#C9933A'}} onMouseLeave={e=>{if(loc.pathname!==link.to)e.currentTarget.style.color='#1A2540'}}>
                    {link.label}{link.sub&&<svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6,9 12,15 18,9"/></svg>}
                  </Link>
                  {link.sub&&drop===link.label&&(
                    <div style={{position:'absolute',top:'100%',left:0,background:'#fff',boxShadow:'0 8px 24px rgba(0,0,0,0.12)',minWidth:190,zIndex:100,borderTop:'2px solid #C9933A'}}>
                      {link.sub.map(d=><Link key={d.label} to={d.to} style={{display:'block',padding:'10px 16px',fontSize:12,color:'#1A2540',borderBottom:'1px solid #f0f0f0',transition:'all 0.2s'}} onMouseEnter={e=>{e.currentTarget.style.background='#FDF8F0';e.currentTarget.style.color='#C9933A'}} onMouseLeave={e=>{e.currentTarget.style.background='';e.currentTarget.style.color='#1A2540'}}>{d.label}</Link>)}
                    </div>
                  )}
                </div>
              ))}
              <a href="https://www.airbnb.com/rooms/51519181" target="_blank" rel="noreferrer" style={{marginLeft:8,background:'#C9933A',color:'#fff',padding:'9px 18px',fontSize:12,fontWeight:600,fontFamily:"'Poppins',sans-serif",display:'inline-flex',alignItems:'center',gap:6,textDecoration:'none',whiteSpace:'nowrap',transition:'background 0.2s'}} onMouseEnter={e=>e.currentTarget.style.background='#b8821f'} onMouseLeave={e=>e.currentTarget.style.background='#C9933A'}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                BOOK NOW
              </a>
            </nav>
            <button onClick={()=>setOpen(!open)} className="hamburger" style={{display:'none',background:'none',border:'none',cursor:'pointer',padding:4,flexDirection:'column',gap:5}}>
              {[0,1,2].map(i=><span key={i} style={{display:'block',width:22,height:2,background:'#1A2540',transition:'all 0.3s'}}/>)}
            </button>
          </div>
        </div>
        {open&&(
          <div style={{background:'#fff',borderTop:'1px solid #eee',padding:'12px 20px',boxShadow:'0 8px 20px rgba(0,0,0,0.08)'}}>
            {NAV.map(l=><Link key={l.label} to={l.to} style={{display:'block',padding:'9px 0',fontSize:13,color:'#1A2540',borderBottom:'1px solid #f5f5f5',fontWeight:500}}>{l.label}</Link>)}
            <a href="https://www.airbnb.com/rooms/51519181" target="_blank" rel="noreferrer" style={{display:'block',marginTop:12,background:'#C9933A',color:'#fff',padding:'12px',textAlign:'center',fontSize:13,fontWeight:600,textDecoration:'none'}}>BOOK NOW</a>
          </div>
        )}
      </div>
      <div style={{height:102}}/>
      <style>{`@media(max-width:1100px){.main-nav{display:none!important}.hamburger{display:flex!important}}`}</style>
    </>
  );
}
