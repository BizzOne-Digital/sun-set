import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import api from '../api';

function Stars({n=5}){return <div style={{display:'flex',gap:2}}>{Array(n).fill(0).map((_,i)=><svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#C9933A"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>)}</div>;}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({name:'',origin:'',rating:5,text:'',platform:'direct'});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { api.get('/api/reviews').then(r=>setReviews(r.data)).catch(()=>{}); }, []);

  const submit = async e => {
    e.preventDefault();
    try { await api.post('/api/reviews', form); setSubmitted(true); } catch {}
  };

  const avg = reviews.length ? (reviews.reduce((s,r)=>s+(r.rating||5),0)/reviews.length).toFixed(1) : '5.0';

  return (
    <>
      <Navbar /><ScrollToTop />
      <div style={{position:'relative',background:'#0E1729',padding:'80px 0',textAlign:'center',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:`url(https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1400&q=60)`,backgroundSize:'cover',backgroundPosition:'center',opacity:0.15}}/>
        <div className="container" style={{position:'relative',zIndex:1}}>
          <p className="section-label">Guest Experiences</p>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(32px,5vw,52px)',fontWeight:700,color:'#fff',marginTop:10}}>Reviews</h1>
          <div style={{display:'flex',gap:24,justifyContent:'center',marginTop:20}}>
            <div style={{textAlign:'center'}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:48,fontWeight:700,color:'#C9933A'}}>{avg}</div><Stars n={5}/><p style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:4}}>{reviews.length} reviews</p></div>
          </div>
        </div>
      </div>
      <section className="section-pad">
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:20,marginBottom:40}}>
            {reviews.map(r=>(
              <div key={r._id} style={{background:'#fff',border:'1px solid #EDE8E0',borderRadius:6,padding:'24px',borderTop:'3px solid #C9933A'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                  <div><p style={{fontWeight:700,color:'#1A2540',fontSize:15}}>{r.name}</p>{r.origin&&<p style={{fontSize:12,color:'#888',marginTop:2}}>{r.origin}</p>}</div>
                  <span style={{background:'#F0EBE0',color:'#555',fontSize:10,padding:'2px 8px',borderRadius:10,textTransform:'capitalize'}}>{r.platform}</span>
                </div>
                <Stars n={r.rating||5}/>
                <p style={{fontSize:13,color:'#555',lineHeight:1.75,marginTop:10,fontStyle:'italic'}}>"{r.text}"</p>
              </div>
            ))}
            {reviews.length===0&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:60,color:'#aaa'}}>No reviews yet. Be the first!</div>}
          </div>
          <div style={{textAlign:'center'}}>
            <button onClick={()=>setShowForm(!showForm)} className="btn-gold">Leave a Review</button>
          </div>
          {showForm&&(
            <div style={{maxWidth:540,margin:'32px auto 0',background:'#F9F5EE',padding:'32px',borderRadius:6,border:'1px solid #EDE8E0'}}>
              {submitted?(
                <div style={{textAlign:'center',padding:'20px 0'}}>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:'#1A2540',fontWeight:700,marginBottom:8}}>Thank You!</p>
                  <p style={{fontSize:13,color:'#666'}}>Your review has been submitted for approval.</p>
                </div>
              ):(
                <form onSubmit={submit}>
                  <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:'#1A2540',marginBottom:20,fontWeight:700}}>Share Your Experience</h3>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
                    <div><label style={{display:'block',fontSize:11,fontWeight:600,color:'#888',marginBottom:4,textTransform:'uppercase'}}>Your Name *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={{width:'100%',padding:'10px 12px',border:'1px solid #E0D8CC',fontSize:13,outline:'none',borderRadius:4,fontFamily:"'Poppins',sans-serif"}}/></div>
                    <div><label style={{display:'block',fontSize:11,fontWeight:600,color:'#888',marginBottom:4,textTransform:'uppercase'}}>Where are you from?</label><input value={form.origin} onChange={e=>setForm({...form,origin:e.target.value})} placeholder="City, Country" style={{width:'100%',padding:'10px 12px',border:'1px solid #E0D8CC',fontSize:13,outline:'none',borderRadius:4,fontFamily:"'Poppins',sans-serif"}}/></div>
                    <div><label style={{display:'block',fontSize:11,fontWeight:600,color:'#888',marginBottom:4,textTransform:'uppercase'}}>Rating</label><select value={form.rating} onChange={e=>setForm({...form,rating:+e.target.value})} style={{width:'100%',padding:'10px 12px',border:'1px solid #E0D8CC',fontSize:13,outline:'none',borderRadius:4,fontFamily:"'Poppins',sans-serif",cursor:'pointer'}}>{[5,4,3,2,1].map(n=><option key={n} value={n}>{n} Stars</option>)}</select></div>
                    <div><label style={{display:'block',fontSize:11,fontWeight:600,color:'#888',marginBottom:4,textTransform:'uppercase'}}>Platform</label><select value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})} style={{width:'100%',padding:'10px 12px',border:'1px solid #E0D8CC',fontSize:13,outline:'none',borderRadius:4,fontFamily:"'Poppins',sans-serif",cursor:'pointer'}}>{['direct','airbnb','vrbo','google'].map(p=><option key={p} value={p} style={{textTransform:'capitalize'}}>{p}</option>)}</select></div>
                    <div style={{gridColumn:'1/-1'}}><label style={{display:'block',fontSize:11,fontWeight:600,color:'#888',marginBottom:4,textTransform:'uppercase'}}>Your Review *</label><textarea required value={form.text} onChange={e=>setForm({...form,text:e.target.value})} rows={4} style={{width:'100%',padding:'10px 12px',border:'1px solid #E0D8CC',fontSize:13,outline:'none',borderRadius:4,fontFamily:"'Poppins',sans-serif",resize:'vertical'}}/></div>
                  </div>
                  <button type="submit" style={{width:'100%',background:'#C9933A',color:'#fff',border:'none',padding:'12px',fontSize:13,fontWeight:700,cursor:'pointer',borderRadius:4,fontFamily:"'Poppins',sans-serif"}}>SUBMIT REVIEW</button>
                </form>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
