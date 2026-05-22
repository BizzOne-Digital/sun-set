import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:'', origin:'', rating:5, text:'', platform:'direct', approved:true, featured:false });

  const fetch = async () => {
    try { const r = await api.get('/api/reviews/all'); setReviews(r.data); } catch {}
  };
  useEffect(() => { fetch(); }, []);

  const update = async (id, data) => {
    try { await api.patch(`/api/reviews/${id}`, data); toast.success('Updated'); fetch(); } catch { toast.error('Failed'); }
  };

  const del = async id => {
    if (!confirm('Delete review?')) return;
    try { await api.delete(`/api/reviews/${id}`); toast.success('Deleted'); fetch(); } catch { toast.error('Failed'); }
  };

  const add = async e => {
    e.preventDefault();
    try { await api.post('/api/reviews', form); toast.success('Review added'); setShowAdd(false); fetch(); } catch { toast.error('Failed'); }
  };

  const filtered = reviews.filter(r => filter === 'all' ? true : filter === 'approved' ? r.approved : !r.approved);
  const inp = { width:'100%', padding:'9px 12px', border:'1px solid #E0D8CC', fontSize:13, outline:'none', borderRadius:4, fontFamily:"'Poppins',sans-serif" };
  const lbl = { display:'block', fontSize:11, fontWeight:600, color:'#888', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.05em' };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, color:'#1A2540', fontWeight:700 }}>Reviews</h1>
        <button onClick={() => setShowAdd(true)} style={{ background:'#C9933A', color:'#fff', border:'none', padding:'10px 22px', fontSize:13, fontWeight:600, cursor:'pointer', borderRadius:4 }}>+ Add Review</button>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {['all','approved','pending'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{ padding:'7px 16px', border:`1px solid ${filter===f?'#C9933A':'#E0D8CC'}`, background:filter===f?'#C9933A':'#fff', color:filter===f?'#fff':'#555', fontSize:12, fontWeight:filter===f?600:400, cursor:'pointer', borderRadius:4, textTransform:'capitalize' }}>{f}</button>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {filtered.map(r => (
          <div key={r._id} style={{ background:'#fff', border:'1px solid #EDE8E0', borderRadius:6, padding:'18px 22px', display:'grid', gridTemplateColumns:'1fr auto', gap:16, alignItems:'center' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                <span style={{ fontWeight:700, color:'#1A2540', fontSize:14 }}>{r.name}</span>
                {r.origin && <span style={{ fontSize:12, color:'#888' }}>· {r.origin}</span>}
                <span style={{ background:'#F0EBE0', color:'#555', fontSize:11, padding:'2px 8px', borderRadius:10 }}>{r.platform}</span>
                {r.featured && <span style={{ background:'#FFF3CD', color:'#856404', fontSize:11, padding:'2px 8px', borderRadius:10 }}>⭐ Featured</span>}
                <span style={{ background:r.approved?'#EAF3DE':'#FCEBEB', color:r.approved?'#2E7D32':'#C62828', fontSize:11, padding:'2px 8px', borderRadius:10, fontWeight:600 }}>{r.approved?'Approved':'Pending'}</span>
              </div>
              <div style={{ display:'flex', gap:2, marginBottom:6 }}>{Array(r.rating||5).fill(0).map((_,i)=><svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#C9933A"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>)}</div>
              <p style={{ fontSize:13, color:'#555', lineHeight:1.6, fontStyle:'italic' }}>"{r.text}"</p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {!r.approved && <button onClick={()=>update(r._id,{approved:true})} style={{ background:'#EAF3DE', color:'#2E7D32', border:'none', padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer', borderRadius:4 }}>✓ Approve</button>}
              {r.approved && <button onClick={()=>update(r._id,{approved:false})} style={{ background:'#F5F0E8', color:'#888', border:'none', padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer', borderRadius:4 }}>Unapprove</button>}
              <button onClick={()=>update(r._id,{featured:!r.featured})} style={{ background:r.featured?'#F5F0E8':'#FFF3CD', color:r.featured?'#888':'#856404', border:'none', padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer', borderRadius:4 }}>{r.featured?'Unfeature':'⭐ Feature'}</button>
              <button onClick={()=>del(r._id)} style={{ background:'#FCEBEB', color:'#C62828', border:'none', padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer', borderRadius:4 }}>Delete</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ background:'#fff', border:'1px solid #EDE8E0', borderRadius:6, padding:'40px', textAlign:'center', color:'#aaa' }}>No reviews found</div>}
      </div>

      {showAdd && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div style={{ background:'#fff', width:'100%', maxWidth:480, borderRadius:6, overflow:'hidden', boxShadow:'0 24px 80px rgba(0,0,0,0.3)' }}>
            <div style={{ background:'#1A2540', padding:'18px 24px', display:'flex', justifyContent:'space-between' }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'#fff', fontWeight:700 }}>Add Review</h3>
              <button onClick={()=>setShowAdd(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.6)', fontSize:22, cursor:'pointer' }}>×</button>
            </div>
            <form onSubmit={add} style={{ padding:24 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label style={lbl}>Guest Name *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={inp}/></div>
                <div><label style={lbl}>Origin (City, Country)</label><input value={form.origin} onChange={e=>setForm({...form,origin:e.target.value})} placeholder="New York, USA" style={inp}/></div>
                <div><label style={lbl}>Rating</label>
                  <select value={form.rating} onChange={e=>setForm({...form,rating:+e.target.value})} style={{ ...inp, cursor:'pointer' }}>
                    {[5,4,3,2,1].map(n=><option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Platform</label>
                  <select value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})} style={{ ...inp, cursor:'pointer' }}>
                    {['direct','airbnb','vrbo','google','tripadvisor'].map(p=><option key={p} value={p} style={{textTransform:'capitalize'}}>{p}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Review Text *</label><textarea required value={form.text} onChange={e=>setForm({...form,text:e.target.value})} rows={4} style={{ ...inp, resize:'vertical' }}/></div>
                <div style={{ display:'flex', gap:16 }}>
                  <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, cursor:'pointer' }}><input type="checkbox" checked={form.approved} onChange={e=>setForm({...form,approved:e.target.checked})}/> Approved</label>
                  <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, cursor:'pointer' }}><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})}/> Featured</label>
                </div>
              </div>
              <div style={{ display:'flex', gap:10, marginTop:20 }}>
                <button type="submit" style={{ flex:1, background:'#C9933A', color:'#fff', border:'none', padding:'12px', fontSize:13, fontWeight:600, cursor:'pointer', borderRadius:4 }}>ADD REVIEW</button>
                <button type="button" onClick={()=>setShowAdd(false)} style={{ flex:1, background:'#F5F0E8', color:'#555', border:'none', padding:'12px', fontSize:13, cursor:'pointer', borderRadius:4 }}>CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
