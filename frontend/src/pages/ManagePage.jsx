import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import api from '../api';
import toast from 'react-hot-toast';

const BENEFITS = [
  { icon:'📸', title:'Professional Listing', desc:'We create stunning listings with professional photos, compelling descriptions, and SEO-optimized content to maximize your visibility.' },
  { icon:'💰', title:'Dynamic Pricing', desc:'Our pricing experts use real-time market data to ensure your property is always competitively priced for maximum revenue.' },
  { icon:'💬', title:'Guest Communication', desc:'24/7 guest communication, from inquiry to checkout. We handle all messages, questions, and issues so you don\'t have to.' },
  { icon:'🧹', title:'Professional Cleaning', desc:'Thorough cleaning and restocking after every guest. Your property will always be in perfect condition.' },
  { icon:'📊', title:'Monthly Reporting', desc:'Detailed performance reports every month showing revenue, occupancy, guest ratings, and areas for improvement.' },
  { icon:'🔧', title:'Maintenance', desc:'We coordinate all maintenance and repairs quickly, keeping your property in top condition and guests happy.' },
];

const STEPS = [
  { n:'01', title:'Apply Online', desc:'Fill in the form below with your property details. Takes less than 5 minutes.' },
  { n:'02', title:'Free Assessment', desc:'Our team will contact you within 24 hours to assess your property and discuss your goals.' },
  { n:'03', title:'Onboarding', desc:'We handle everything — listing setup, photography, pricing strategy, and legal compliance.' },
  { n:'04', title:'Start Earning', desc:'Sit back and watch your rental income grow. We manage everything while you enjoy the returns.' },
];

const EMPTY = { ownerName:'', email:'', phone:'', propertyName:'', propertyAddress:'', bedrooms:'', bathrooms:'', currentlyListed:false, airbnbUrl:'', vrboUrl:'', monthlyRevenue:'', message:'' };

export default function ManagePage() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handle = e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/management-applications', form);
      setDone(true);
      toast.success('Application submitted!');
    } catch { toast.error('Submission failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const inp = { width:'100%', padding:'11px 14px', border:'1px solid #E0D8CC', fontSize:13, outline:'none', fontFamily:"'Poppins',sans-serif", borderRadius:4, transition:'border 0.2s' };
  const lbl = { display:'block', fontSize:11, fontWeight:600, color:'#666', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.05em' };
  const focus = e => e.target.style.borderColor = '#C9933A';
  const blur = e => e.target.style.borderColor = '#E0D8CC';

  return (
    <>
      <Navbar />
      <ScrollToTop />

      {/* Hero */}
      <div style={{ position:'relative', background:'#0E1729', padding:'80px 0', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:`url(https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1400&q=60)`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.15 }}/>
        <div className="container" style={{ position:'relative', zIndex:1, textAlign:'center' }}>
          <p className="section-label" style={{ marginBottom:12 }}>Property Management</p>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(32px,5vw,56px)', fontWeight:700, color:'#fff', marginBottom:16, lineHeight:1.2 }}>
            Let Us Manage Your<br/>
            <span style={{ color:'#C9933A' }}>Airbnb Property</span>
          </h1>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.7)', maxWidth:560, margin:'0 auto 32px', lineHeight:1.75 }}>
            We handle everything — from listing to cleaning to guest communication — so you can earn passive income without the stress.
          </p>
          <div style={{ display:'flex', gap:24, justifyContent:'center', flexWrap:'wrap' }}>
            {[['20%+', 'Average Commission'],['24/7','Guest Support'],['5★','Avg Rating'],['100%','Transparency']].map(([v,l])=>(
              <div key={l} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, color:'#C9933A' }}>{v}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginTop:3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <section className="section-pad" style={{ background:'#FDF8F0' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <p className="section-label">Why Choose Us</p>
            <div className="gold-divider center"/>
            <h2 className="section-title">Complete Property Management</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24 }}>
            {BENEFITS.map(b=>(
              <div key={b.title} style={{ background:'#fff', padding:'28px 24px', border:'1px solid #EDE8E0', borderRadius:6, borderTop:'3px solid #C9933A', transition:'all 0.3s' }} onMouseEnter={e=>e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.1)'} onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}>
                <div style={{ fontSize:32, marginBottom:14 }}>{b.icon}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'#1A2540', fontWeight:700, marginBottom:8 }}>{b.title}</h3>
                <p style={{ fontSize:13, color:'#777', lineHeight:1.7 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ background:'#1A2540', padding:'70px 0' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <p className="section-label">Simple Process</p>
            <div className="gold-divider center"/>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(26px,3.5vw,38px)', color:'#fff', fontWeight:700 }}>How It Works</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:32, position:'relative' }}>
            {STEPS.map((s,i)=>(
              <div key={s.n} style={{ textAlign:'center', position:'relative' }}>
                <div style={{ width:60, height:60, borderRadius:'50%', background:'rgba(201,147,58,0.15)', border:'2px solid #C9933A', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:'#C9933A' }}>{s.n}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:'#fff', fontWeight:700, marginBottom:8 }}>{s.title}</h3>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="section-pad" style={{ background:'#fff' }}>
        <div className="container">
          <div style={{ maxWidth:700, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:40 }}>
              <p className="section-label">Get Started</p>
              <div className="gold-divider center"/>
              <h2 className="section-title">Apply for Property Management</h2>
              <p style={{ fontSize:14, color:'#777', marginTop:10, lineHeight:1.7 }}>Fill in the form below and our team will contact you within 24 hours.</p>
            </div>

            {done ? (
              <div style={{ textAlign:'center', padding:'48px 0' }}>
                <div style={{ width:72, height:72, background:'#EAF3DE', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                  <svg width="36" height="36" fill="none" stroke="#2E7D32" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>
                </div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:'#1A2540', marginBottom:12 }}>Application Received!</h3>
                <p style={{ fontSize:15, color:'#555', lineHeight:1.7, maxWidth:440, margin:'0 auto 28px' }}>Thank you for applying! Our team will review your application and contact you within 24 hours.</p>
                <a href="https://wa.me/18762689319?text=Hi! I just submitted a property management application." target="_blank" rel="noreferrer" className="btn-gold">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413z"/><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.07-1.35C8.46 21.51 10.19 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
                  Follow Up on WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={submit} style={{ background:'#F9F5EE', padding:'36px', borderRadius:6, border:'1px solid #EDE8E0' }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:'#1A2540', marginBottom:24, fontWeight:700 }}>Your Contact Information</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
                  <div><label style={lbl}>Your Name *</label><input name="ownerName" required value={form.ownerName} onChange={handle} style={inp} onFocus={focus} onBlur={blur}/></div>
                  <div><label style={lbl}>Email *</label><input name="email" type="email" required value={form.email} onChange={handle} style={inp} onFocus={focus} onBlur={blur}/></div>
                  <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Phone / WhatsApp *</label><input name="phone" required value={form.phone} onChange={handle} placeholder="+1 876..." style={inp} onFocus={focus} onBlur={blur}/></div>
                </div>

                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:'#1A2540', marginBottom:18, fontWeight:700 }}>Property Information</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
                  <div><label style={lbl}>Property Name</label><input name="propertyName" value={form.propertyName} onChange={handle} style={inp} onFocus={focus} onBlur={blur}/></div>
                  <div><label style={lbl}>Bedrooms</label>
                    <select name="bedrooms" value={form.bedrooms} onChange={handle} style={{ ...inp, cursor:'pointer' }}>
                      <option value="">Select</option>
                      {[1,2,3,4,5,'6+'].map(n=><option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Property Address *</label><input name="propertyAddress" required value={form.propertyAddress} onChange={handle} placeholder="Street, City, Parish, Jamaica" style={inp} onFocus={focus} onBlur={blur}/></div>
                  <div><label style={lbl}>Bathrooms</label>
                    <select name="bathrooms" value={form.bathrooms} onChange={handle} style={{ ...inp, cursor:'pointer' }}>
                      <option value="">Select</option>
                      {[1,2,3,4,'5+'].map(n=><option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Currently Listed on Airbnb?</label>
                    <select name="currentlyListed" value={form.currentlyListed} onChange={handle} style={{ ...inp, cursor:'pointer' }}>
                      <option value={false}>No, not listed yet</option>
                      <option value={true}>Yes, already listed</option>
                    </select>
                  </div>
                  <div><label style={lbl}>Airbnb URL (if listed)</label><input name="airbnbUrl" value={form.airbnbUrl} onChange={handle} placeholder="https://airbnb.com/rooms/..." style={inp} onFocus={focus} onBlur={blur}/></div>
                  <div><label style={lbl}>VRBO URL (if listed)</label><input name="vrboUrl" value={form.vrboUrl} onChange={handle} placeholder="https://vrbo.com/..." style={inp} onFocus={focus} onBlur={blur}/></div>
                  <div><label style={lbl}>Current Monthly Revenue ($)</label><input name="monthlyRevenue" value={form.monthlyRevenue} onChange={handle} placeholder="Approx. if listed" style={inp} onFocus={focus} onBlur={blur}/></div>
                  <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Message / Additional Info</label><textarea name="message" value={form.message} onChange={handle} rows={4} placeholder="Tell us more about your property, goals, or any questions..." style={{ ...inp, resize:'vertical' }} onFocus={focus} onBlur={blur}/></div>
                </div>
                <button type="submit" disabled={loading} style={{ width:'100%', background:'#C9933A', color:'#fff', border:'none', padding:'14px', fontSize:13, fontWeight:700, cursor:loading?'not-allowed':'pointer', letterSpacing:'0.08em', opacity:loading?0.7:1, fontFamily:"'Poppins',sans-serif", borderRadius:4, transition:'background 0.2s' }} onMouseEnter={e=>{if(!loading)e.target.style.background='#b8821f'}} onMouseLeave={e=>e.target.style.background='#C9933A'}>
                  {loading ? 'Submitting...' : 'SUBMIT APPLICATION'}
                </button>
                <p style={{ fontSize:12, color:'#aaa', textAlign:'center', marginTop:12 }}>We'll contact you within 24 hours · No obligation</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
