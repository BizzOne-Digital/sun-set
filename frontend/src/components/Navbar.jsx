import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { label:'Home', to:'/' },
  { label:'About', to:'/about' },
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

  useEffect(() => { const fn=()=>setScrolled(window.scrollY>60); window.addEventListener('scroll',fn); return ()=>window.removeEventListener('scroll',fn); }, []);
  useEffect(() => { setOpen(false); setDrop(null); }, [loc]);

  return (
    <>
      {/* Top bar — hidden on mobile */}
      <div style={{position:'fixed',top:0,left:0,right:0,zIndex:1001,background:'#0E1729',padding:'6px 0',fontSize:11,color:'rgba(255,255,255,0.78)'}}>
        <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
          <div style={{display:'flex',gap:16,flexWrap:'wrap',overflow:'hidden'}}>
            <span style={{display:'flex',alignItems:'center',gap:4,whiteSpace:'nowrap'}}>
              <svg width="10" height="10" fill="#C9933A" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              <span className="topbar-address">119 Riviera Blvd, Ocho Rios, Jamaica</span>
            </span>
            <a href="tel:+18762689319" style={{display:'flex',alignItems:'center',gap:4,color:'rgba(255,255,255,0.78)',whiteSpace:'nowrap'}}>
              <svg width="10" height="10" fill="#C9933A" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              +1 (876) 268-9319
            </a>
          </div>
          <div style={{display:'flex',gap:12,flexShrink:0}}>
            {[{href:'https://facebook.com',s:<svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>},{href:'https://instagram.com/sunsetretreatja',s:<svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>},{href:'https://wa.me/18762689319',s:<svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413z"/><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.07-1.35C8.46 21.51 10.19 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>}].map((s,i)=>(
              <a key={i} href={s.href} target="_blank" rel="noreferrer" style={{color:'rgba(255,255,255,0.6)',transition:'color 0.2s'}} onMouseEnter={e=>e.currentTarget.style.color='#C9933A'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.6)'}>{s.s}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div style={{position:'fixed',top:30,left:0,right:0,zIndex:1000}}>
        <div style={{background:scrolled?'rgba(255,255,255,0.98)':'rgba(255,255,255,0.97)',backdropFilter:'blur(10px)',boxShadow:scrolled?'0 2px 20px rgba(0,0,0,0.1)':'0 1px 0 rgba(0,0,0,0.05)',transition:'all 0.3s'}}>
          <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:62}}>
            <Link to="/" style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:'#1A2540',letterSpacing:'0.05em',lineHeight:1.2,textDecoration:'none'}}>
              SUNSET<br/><span style={{color:'#C9933A',fontSize:13}}>RETREAT JA</span>
            </Link>

            {/* Desktop Nav */}
            <nav style={{display:'flex',alignItems:'center',gap:2}} className="desktop-nav">
              {NAV.map(link=>(
                <div key={link.label} style={{position:'relative'}} onMouseEnter={()=>link.sub&&setDrop(link.label)} onMouseLeave={()=>setDrop(null)}>
                  <Link to={link.to} style={{display:'flex',alignItems:'center',gap:2,padding:'7px 8px',fontSize:11.5,fontWeight:500,color:loc.pathname===link.to?'#C9933A':'#1A2540',borderBottom:loc.pathname===link.to?'2px solid #C9933A':'2px solid transparent',transition:'all 0.2s',whiteSpace:'nowrap',textDecoration:'none'}}
                    onMouseEnter={e=>{if(loc.pathname!==link.to)e.currentTarget.style.color='#C9933A'}} onMouseLeave={e=>{if(loc.pathname!==link.to)e.currentTarget.style.color='#1A2540'}}>
                    {link.label}{link.sub&&<svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6,9 12,15 18,9"/></svg>}
                  </Link>
                  {link.sub&&drop===link.label&&(
                    <div style={{position:'absolute',top:'100%',left:0,background:'#fff',boxShadow:'0 8px 24px rgba(0,0,0,0.12)',minWidth:180,zIndex:100,borderTop:'2px solid #C9933A'}}>
                      {link.sub.map(d=><Link key={d.label} to={d.to} style={{display:'block',padding:'9px 14px',fontSize:12,color:'#1A2540',borderBottom:'1px solid #f0f0f0',transition:'all 0.2s',textDecoration:'none'}} onMouseEnter={e=>{e.currentTarget.style.background='#FDF8F0';e.currentTarget.style.color='#C9933A'}} onMouseLeave={e=>{e.currentTarget.style.background='';e.currentTarget.style.color='#1A2540'}}>{d.label}</Link>)}
                    </div>
                  )}
                </div>
              ))}
              <a href="https://www.airbnb.com/rooms/51519181" target="_blank" rel="noreferrer"
                style={{marginLeft:6,background:'#C9933A',color:'#fff',padding:'8px 16px',fontSize:11.5,fontWeight:600,display:'inline-flex',alignItems:'center',gap:5,textDecoration:'none',transition:'background 0.2s',whiteSpace:'nowrap'}}
                onMouseEnter={e=>e.currentTarget.style.background='#b8821f'} onMouseLeave={e=>e.currentTarget.style.background='#C9933A'}>
                📅 BOOK NOW
              </a>
            </nav>

            {/* Hamburger */}
            <button onClick={()=>setOpen(!open)} className="hamburger-btn" style={{display:'none',background:'none',border:'none',cursor:'pointer',padding:6,flexDirection:'column',gap:5}}>
              <span style={{display:'block',width:22,height:2,background:'#1A2540',transition:'all 0.3s',transform:open?'rotate(45deg) translate(5px,5px)':''}}/>
              <span style={{display:'block',width:22,height:2,background:'#1A2540',opacity:open?0:1}}/>
              <span style={{display:'block',width:22,height:2,background:'#1A2540',transition:'all 0.3s',transform:open?'rotate(-45deg) translate(5px,-5px)':''}}/>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open&&(
          <div style={{background:'#fff',borderTop:'1px solid #eee',padding:'10px 0',boxShadow:'0 8px 20px rgba(0,0,0,0.1)',maxHeight:'80vh',overflowY:'auto'}}>
            {NAV.map(l=>(
              <div key={l.label}>
                <Link to={l.to} style={{display:'block',padding:'12px 20px',fontSize:14,color:'#1A2540',borderBottom:'1px solid #f5f5f5',fontWeight:500,textDecoration:'none'}}>{l.label}</Link>
                {l.sub&&l.sub.map(s=><Link key={s.label} to={s.to} style={{display:'block',padding:'10px 32px',fontSize:13,color:'#888',borderBottom:'1px solid #f5f5f5',textDecoration:'none'}}>→ {s.label}</Link>)}
              </div>
            ))}
            <a href="https://www.airbnb.com/rooms/51519181" target="_blank" rel="noreferrer" style={{display:'block',margin:'12px 20px',background:'#C9933A',color:'#fff',padding:'13px',textAlign:'center',fontSize:13,fontWeight:600,textDecoration:'none',borderRadius:4}}>📅 BOOK NOW ON AIRBNB</a>
            <a href="https://wa.me/18762689319" target="_blank" rel="noreferrer" style={{display:'block',margin:'0 20px 12px',background:'#25D366',color:'#fff',padding:'13px',textAlign:'center',fontSize:13,fontWeight:600,textDecoration:'none',borderRadius:4}}>💬 WHATSAPP US</a>
          </div>
        )}
      </div>

      <div style={{height:92}}/>

      <style>{`
        @media(max-width:1050px){.desktop-nav{display:none!important}.hamburger-btn{display:flex!important}}
        @media(max-width:480px){.topbar-address{display:none!important}}
      `}</style>
    </>
  );
}