import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import api from '../api';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({name:'',email:'',phone:'',checkin:'',checkout:'',guests:'1',message:''});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async e => {
    e.preventDefault(); setLoading(true);
    try { await api.post('/api/leads', {...form, source:'contact-form'}); setDone(true); toast.success('Message sent!'); }
    catch { toast.error('Failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const inp = {width:'100%',padding:'11px 14px',border:'1px solid #E0D8CC',fontSize:13,outline:'none',fontFamily:"'Poppins',sans-serif",borderRadius:4,transition:'border 0.2s'};
  const lbl = {display:'block',fontSize:11,fontWeight:600,color:'#666',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.05em'};

  return (
    <>
      <Navbar /><ScrollToTop />
      <div style={{position:'relative',background:'#0E1729',padding:'80px 0',textAlign:'center',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:`url(https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1400&q=60)`,backgroundSize:'cover',backgroundPosition:'center',opacity:0.15}}/>
        <div className="container" style={{position:'relative',zIndex:1}}>
          <p className="section-label">Get In Touch</p>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(32px,5vw,52px)',fontWeight:700,color:'#fff',marginTop:10}}>Contact Us</h1>
        </div>
      </div>
      <section className="section-pad">
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'start'}}>
            <div>
              <h2 className="section-title" style={{marginBottom:20}}>We'd Love to Hear From You</h2>
              <p style={{fontSize:14,color:'#666',lineHeight:1.8,marginBottom:32}}>Have questions about our property, availability, or services? Reach out to us — we respond within a few hours.</p>
              {[{icon:'📍',label:'Address',val:'119 Riviera Blvd, Ocho Rios, Jamaica'},{icon:'📞',label:'Phone',val:'+1 (876) 268-9319',href:'tel:+18762689319'},{icon:'✉️',label:'Email',val:'info@sunsetretreatja.com',href:'mailto:info@sunsetretreatja.com'},{icon:'💬',label:'WhatsApp',val:'Message us on WhatsApp',href:'https://wa.me/18762689319'},{icon:'📸',label:'Instagram',val:'@sunsetretreatja',href:'https://instagram.com/sunsetretreatja'}].map(c=>(
                <div key={c.label} style={{display:'flex',gap:16,marginBottom:22,alignItems:'flex-start'}}>
                  <span style={{fontSize:22,flexShrink:0}}>{c.icon}</span>
                  <div>
                    <div style={{fontSize:11,fontWeight:600,color:'#888',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:3}}>{c.label}</div>
                    {c.href?<a href={c.href} target={c.href.startsWith('http')?'_blank':'_self'} rel="noreferrer" style={{fontSize:14,color:'#C9933A'}}>{c.val}</a>:<span style={{fontSize:14,color:'#333'}}>{c.val}</span>}
                  </div>
                </div>
              ))}
            </div>
            <div>
              {done?(
                <div style={{textAlign:'center',padding:'48px 0'}}>
                  <div style={{width:64,height:64,background:'#EAF3DE',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}><svg width="30" height="30" fill="none" stroke="#2E7D32" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg></div>
                  <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:24,color:'#1A2540',marginBottom:10}}>Message Sent!</h3>
                  <p style={{fontSize:14,color:'#555',lineHeight:1.7}}>We'll get back to you within a few hours.<br/>You can also reach us on WhatsApp for faster response.</p>
                  <a href="https://wa.me/18762689319" target="_blank" rel="noreferrer" className="btn-gold" style={{display:'inline-flex',marginTop:24}}>Chat on WhatsApp</a>
                </div>
              ):(
                <form onSubmit={submit} style={{background:'#F9F5EE',padding:'32px',borderRadius:6,border:'1px solid #EDE8E0'}}>
                  <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:'#1A2540',marginBottom:24,fontWeight:700}}>Send Us a Message</h3>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                    <div><label style={lbl}>Name *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={inp} onFocus={e=>e.target.style.borderColor='#C9933A'} onBlur={e=>e.target.style.borderColor='#E0D8CC'}/></div>
                    <div><label style={lbl}>Email *</label><input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} style={inp} onFocus={e=>e.target.style.borderColor='#C9933A'} onBlur={e=>e.target.style.borderColor='#E0D8CC'}/></div>
                    <div><label style={lbl}>Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} style={inp} onFocus={e=>e.target.style.borderColor='#C9933A'} onBlur={e=>e.target.style.borderColor='#E0D8CC'}/></div>
                    <div><label style={lbl}>Guests</label><select value={form.guests} onChange={e=>setForm({...form,guests:e.target.value})} style={{...inp,cursor:'pointer'}}>{[1,2,3,4].map(n=><option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}</select></div>
                    <div><label style={lbl}>Check-in</label><input type="date" value={form.checkin} onChange={e=>setForm({...form,checkin:e.target.value})} style={inp}/></div>
                    <div><label style={lbl}>Check-out</label><input type="date" value={form.checkout} onChange={e=>setForm({...form,checkout:e.target.value})} style={inp}/></div>
                    <div style={{gridColumn:'1/-1'}}><label style={lbl}>Message *</label><textarea required value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows={4} placeholder="Tell us what you need..." style={{...inp,resize:'vertical'}} onFocus={e=>e.target.style.borderColor='#C9933A'} onBlur={e=>e.target.style.borderColor='#E0D8CC'}/></div>
                  </div>
                  <button type="submit" disabled={loading} style={{width:'100%',background:'#C9933A',color:'#fff',border:'none',padding:'13px',fontSize:13,fontWeight:700,cursor:loading?'not-allowed':'pointer',letterSpacing:'0.08em',marginTop:16,borderRadius:4,opacity:loading?0.7:1,fontFamily:"'Poppins',sans-serif"}}>
                    {loading?'Sending...':'SEND MESSAGE'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
