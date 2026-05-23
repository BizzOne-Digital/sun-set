import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{background:'#0E1729',color:'#fff'}}>
      <div className="container" style={{padding:'50px 20px 24px'}}>
        <div className="footer-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:32,marginBottom:40}}>
          <div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,marginBottom:6}}>SUNSET RETREAT JA</h3>
            <p style={{fontSize:12,color:'rgba(255,255,255,0.5)',lineHeight:1.8,marginBottom:16}}>Your home away from home in beautiful Ocho Rios, Jamaica.</p>
            <div style={{display:'flex',gap:12}}>
              {[{h:'https://facebook.com',s:<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>},{h:'https://instagram.com/sunsetretreatja',s:<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>},{h:'https://wa.me/18762689319',s:<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413z"/><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.07-1.35C8.46 21.51 10.19 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>}].map((s,i)=>(
                <a key={i} href={s.h} target="_blank" rel="noreferrer" style={{color:'rgba(255,255,255,0.5)',transition:'color 0.2s'}} onMouseEnter={e=>e.currentTarget.style.color='#C9933A'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.5)'}>{s.s}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,marginBottom:14,textTransform:'uppercase',letterSpacing:'0.08em'}}>Quick Links</h4>
            {[['Home','/'],['Accommodations','/accommodations'],['Gallery','/gallery'],['Reviews','/reviews'],['Services','/services'],['Contact','/contact'],['Manage Property','/manage'],['Attractions','/attractions']].map(([l,t])=>(
              <Link key={l} to={t} style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:'rgba(255,255,255,0.5)',padding:'3px 0',transition:'color 0.2s',textDecoration:'none'}} onMouseEnter={e=>e.currentTarget.style.color='#C9933A'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.5)'}>
                <svg width="7" height="7" fill="none" stroke="#C9933A" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6"/></svg>{l}
              </Link>
            ))}
          </div>
          <div>
            <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,marginBottom:14,textTransform:'uppercase',letterSpacing:'0.08em'}}>Contact</h4>
            {[{t:'119 Riviera Blvd, Ocho Rios, Jamaica',h:null},{t:'+1 (876) 268-9319',h:'tel:+18762689319'},{t:'info@sunsetretreatja.com',h:'mailto:info@sunsetretreatja.com'}].map((c,i)=>(
              <div key={i} style={{display:'flex',gap:8,marginBottom:10,alignItems:'flex-start'}}>
                <svg width="12" height="12" fill="#C9933A" viewBox="0 0 24 24" style={{marginTop:2,flexShrink:0}}>{i===0?<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>:i===1?<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>:<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>}</svg>
                {c.h?<a href={c.h} style={{fontSize:12,color:'rgba(255,255,255,0.55)',lineHeight:1.5,textDecoration:'none'}}>{c.t}</a>:<span style={{fontSize:12,color:'rgba(255,255,255,0.55)',lineHeight:1.5}}>{c.t}</span>}
              </div>
            ))}
          </div>
          <div>
            <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,marginBottom:14,textTransform:'uppercase',letterSpacing:'0.08em'}}>We Accept</h4>
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16}}>
              {['VISA','MC','AMEX','PayPal'].map(p=><div key={p} style={{background:'#fff',borderRadius:3,padding:'3px 8px',fontSize:11,fontWeight:700,color:'#1A2540'}}>{p}</div>)}
            </div>
            <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',padding:'10px 12px',borderRadius:4,display:'flex',alignItems:'center',gap:8}}>
              <svg width="14" height="14" fill="#C9933A" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <div><div style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.8)'}}>Stripe Secure</div><div style={{fontSize:10,color:'rgba(255,255,255,0.35)'}}>SSL encrypted</div></div>
            </div>
          </div>
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:20,textAlign:'center'}}>
          <p style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>© {new Date().getFullYear()} Sunset Retreat JA. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}