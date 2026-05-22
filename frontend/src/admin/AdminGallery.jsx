import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const CATS = ['all','exterior','interior','pool','bedroom','dining','view','other'];

export default function AdminGallery() {
  const [photos, setPhotos] = useState([]);
  const [cat, setCat] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ url:'', caption:'', category:'exterior', order:0, isActive:true });

  const fetch = async () => {
    try { const r = await api.get('/api/gallery', { params: { category: cat } }); setPhotos(r.data); } catch {}
  };
  useEffect(() => { fetch(); }, [cat]);

  const add = async e => {
    e.preventDefault();
    try { await api.post('/api/gallery', form); toast.success('Photo added'); setShowAdd(false); setForm({ url:'', caption:'', category:'exterior', order:0, isActive:true }); fetch(); } catch { toast.error('Failed'); }
  };

  const del = async id => {
    if (!confirm('Delete photo?')) return;
    try { await api.delete(`/api/gallery/${id}`); toast.success('Deleted'); fetch(); } catch { toast.error('Failed'); }
  };

  const inp = { width:'100%', padding:'9px 12px', border:'1px solid #E0D8CC', fontSize:13, outline:'none', borderRadius:4, fontFamily:"'Poppins',sans-serif" };
  const lbl = { display:'block', fontSize:11, fontWeight:600, color:'#888', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.05em' };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, color:'#1A2540', fontWeight:700 }}>Gallery</h1>
        <button onClick={()=>setShowAdd(true)} style={{ background:'#C9933A', color:'#fff', border:'none', padding:'10px 22px', fontSize:13, fontWeight:600, cursor:'pointer', borderRadius:4 }}>+ Add Photo</button>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {CATS.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{ padding:'7px 16px', border:`1px solid ${cat===c?'#C9933A':'#E0D8CC'}`, background:cat===c?'#C9933A':'#fff', color:cat===c?'#fff':'#555', fontSize:12, fontWeight:cat===c?600:400, cursor:'pointer', borderRadius:4, textTransform:'capitalize' }}>{c}</button>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:16 }}>
        {photos.map(p=>(
          <div key={p._id} style={{ background:'#fff', border:'1px solid #EDE8E0', borderRadius:6, overflow:'hidden' }}>
            <div style={{ paddingBottom:'75%', position:'relative', overflow:'hidden' }}>
              <img src={p.url} alt={p.caption} loading="lazy" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.src='https://via.placeholder.com/400x300?text=Image'}/>
            </div>
            <div style={{ padding:'12px 14px' }}>
              <p style={{ fontSize:12, fontWeight:600, color:'#1A2540', marginBottom:3 }}>{p.caption||'No caption'}</p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ background:'#F0EBE0', color:'#555', fontSize:10, padding:'2px 8px', borderRadius:10, textTransform:'capitalize' }}>{p.category}</span>
                <button onClick={()=>del(p._id)} style={{ background:'#FCEBEB', color:'#C62828', border:'none', padding:'4px 10px', fontSize:11, cursor:'pointer', borderRadius:3 }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {photos.length === 0 && <div style={{ gridColumn:'1/-1', background:'#fff', border:'1px solid #EDE8E0', borderRadius:6, padding:'40px', textAlign:'center', color:'#aaa' }}>No photos in this category</div>}
      </div>

      {showAdd && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div style={{ background:'#fff', width:'100%', maxWidth:460, borderRadius:6, overflow:'hidden', boxShadow:'0 24px 80px rgba(0,0,0,0.3)' }}>
            <div style={{ background:'#1A2540', padding:'18px 24px', display:'flex', justifyContent:'space-between' }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'#fff', fontWeight:700 }}>Add Photo</h3>
              <button onClick={()=>setShowAdd(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.6)', fontSize:22, cursor:'pointer' }}>×</button>
            </div>
            <form onSubmit={add} style={{ padding:24 }}>
              <div style={{ marginBottom:14 }}><label style={lbl}>Image URL *</label><input required value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://..." style={inp}/></div>
              {form.url && <div style={{ marginBottom:14 }}><img src={form.url} alt="Preview" style={{ width:'100%', height:160, objectFit:'cover', borderRadius:4 }} onError={e=>e.target.style.display='none'}/></div>}
              <div style={{ marginBottom:14 }}><label style={lbl}>Caption</label><input value={form.caption} onChange={e=>setForm({...form,caption:e.target.value})} style={inp}/></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
                <div><label style={lbl}>Category</label>
                  <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{ ...inp, cursor:'pointer' }}>
                    {CATS.filter(c=>c!=='all').map(c=><option key={c} value={c} style={{textTransform:'capitalize'}}>{c}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Order</label><input type="number" value={form.order} onChange={e=>setForm({...form,order:+e.target.value})} style={inp}/></div>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button type="submit" style={{ flex:1, background:'#C9933A', color:'#fff', border:'none', padding:'12px', fontSize:13, fontWeight:600, cursor:'pointer', borderRadius:4 }}>ADD PHOTO</button>
                <button type="button" onClick={()=>setShowAdd(false)} style={{ flex:1, background:'#F5F0E8', color:'#555', border:'none', padding:'12px', fontSize:13, cursor:'pointer', borderRadius:4 }}>CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
