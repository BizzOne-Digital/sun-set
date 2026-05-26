import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import api from '../api';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', checkin:'', checkout:'', guests:'1', message:'' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      await api.post('/api/leads', { ...form, source:'contact-form' });
      setDone(true); toast.success('Message sent!');
    } catch { toast.error('Failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const inp = { width:'100%', padding:'11px 14px', border:'1px solid #E0D8CC', fontSize:13, outline:'none', fontFamily:"'Poppins',sans-serif", borderRadius:4, transition:'border 0.2s', background:'#fff' };

  return (
    <>
      <Navbar /><ScrollToTop />

      {/* Hero */}
      <div style={{ position:'relative', background:'#0E1729', padding:'70px 0', textAlign:'center', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:`url(https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1400&q=60)`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.15 }}/>
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <p className="section-label">Get In Touch</p>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(28px,5vw,50px)', fontWeight:700, color:'#fff', marginTop:10 }}>Contact Us</h1>
        </div>
      </div>

      <section className="section-pad">
        <div className="container">
          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:52, alignItems:'start' }}>

            {/* Left — Info */}
            <div>
              <h2 className="section-title" style={{ marginBottom:16 }}>We'd Love to Hear From You</h2>
              <p style={{ fontSize:14, color:'#666', lineHeight:1.8, marginBottom:32 }}>Have questions about our property, availability, or services? Reach out and we'll respond within a few hours.</p>

              {[
                { icon:'📍', label:'Address', val:'Tower Isle, St. Mary, Jamaica | Near Ocho Rios', href:null },
                { icon:'📞', label:'Phone', val:'+1 (876) 268-9319', href:'tel:+18762689319' },
                { icon:'✉️', label:'Email', val:'info@sunsetretreatja.com', href:'mailto:info@sunsetretreatja.com' },
                { icon:'💬', label:'WhatsApp', val:'Message us directly', href:'https://wa.me/18762689319' },
                { icon:'📸', label:'Instagram', val:'@sunsetretreatja', href:'https://instagram.com/sunsetretreatja' },
              ].map(c => (
                <div key={c.label} style={{ display:'flex', gap:16, marginBottom:22, alignItems:'flex-start' }}>
                  <span style={{ fontSize:24, flexShrink:0, lineHeight:1 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontSize:11, fontWeight:600, color:'#888', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:3 }}>{c.label}</div>
                    {c.href
                      ? <a href={c.href} target={c.href.startsWith('http')?'_blank':'_self'} rel="noreferrer" style={{ fontSize:14, color:'#C9933A', textDecoration:'none' }}>{c.val}</a>
                      : <span style={{ fontSize:14, color:'#333' }}>{c.val}</span>}
                  </div>
                </div>
              ))}

              {/* WhatsApp CTA */}
              <a href="https://wa.me/18762689319?text=Hi! I'd like to enquire about Sunset Retreat JA." target="_blank" rel="noreferrer"
                style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#25D366', color:'#fff', padding:'12px 24px', fontSize:13, fontWeight:600, borderRadius:4, textDecoration:'none', marginTop:8 }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413z"/><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.07-1.35C8.46 21.51 10.19 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
                Chat on WhatsApp
              </a>
            </div>

            {/* Right — Form */}
            <div>
              {done ? (
                <div style={{ textAlign:'center', padding:'48px 20px', background:'#F9F5EE', borderRadius:8, border:'1px solid #EDE8E0' }}>
                  <div style={{ width:64, height:64, background:'#EAF3DE', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                    <svg width="30" height="30" fill="none" stroke="#2E7D32" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>
                  </div>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:'#1A2540', marginBottom:10 }}>Message Sent!</h3>
                  <p style={{ fontSize:14, color:'#555', lineHeight:1.7, marginBottom:20 }}>We'll get back to you within a few hours.</p>
                  <a href="https://wa.me/18762689319" target="_blank" rel="noreferrer" className="btn-gold">Follow Up on WhatsApp</a>
                </div>
              ) : (
                <form onSubmit={submit} style={{ background:'#F9F5EE', padding:'32px', borderRadius:8, border:'1px solid #EDE8E0' }}>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'#1A2540', marginBottom:24, fontWeight:700 }}>Send Us a Message</h3>
                  <div className="form-two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                    <div>
                      <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#666', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.05em' }}>Name *</label>
                      <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={inp} onFocus={e=>e.target.style.borderColor='#C9933A'} onBlur={e=>e.target.style.borderColor='#E0D8CC'}/>
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#666', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.05em' }}>Email *</label>
                      <input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} style={inp} onFocus={e=>e.target.style.borderColor='#C9933A'} onBlur={e=>e.target.style.borderColor='#E0D8CC'}/>
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#666', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.05em' }}>Phone</label>
                      <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} style={inp} onFocus={e=>e.target.style.borderColor='#C9933A'} onBlur={e=>e.target.style.borderColor='#E0D8CC'}/>
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#666', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.05em' }}>Guests</label>
                      <select value={form.guests} onChange={e=>setForm({...form,guests:e.target.value})} style={{ ...inp, cursor:'pointer' }}>
                        {[1,2,3,4].map(n=><option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#666', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.05em' }}>Check-in</label>
                      <input type="date" value={form.checkin} onChange={e=>setForm({...form,checkin:e.target.value})} style={inp}/>
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#666', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.05em' }}>Check-out</label>
                      <input type="date" value={form.checkout} onChange={e=>setForm({...form,checkout:e.target.value})} style={inp}/>
                    </div>
                    <div style={{ gridColumn:'1/-1' }}>
                      <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#666', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.05em' }}>Message *</label>
                      <textarea required value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows={4} placeholder="Tell us what you need..." style={{ ...inp, resize:'vertical' }} onFocus={e=>e.target.style.borderColor='#C9933A'} onBlur={e=>e.target.style.borderColor='#E0D8CC'}/>
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    style={{ width:'100%', background:'#C9933A', color:'#fff', border:'none', padding:'13px', fontSize:13, fontWeight:700, cursor:loading?'not-allowed':'pointer', letterSpacing:'0.08em', marginTop:16, borderRadius:4, opacity:loading?0.7:1, fontFamily:"'Poppins',sans-serif", transition:'background 0.2s' }}
                    onMouseEnter={e=>{if(!loading)e.target.style.background='#b8821f'}} onMouseLeave={e=>e.target.style.background='#C9933A'}>
                    {loading ? 'Sending...' : 'SEND MESSAGE'}
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