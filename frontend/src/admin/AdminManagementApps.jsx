import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const STATUS_COLORS = { new:['#E6F1FB','#0C447C'], reviewing:['#FFF8EC','#C9933A'], approved:['#EAF3DE','#2E7D32'], rejected:['#FCEBEB','#C62828'] };

export default function AdminManagementApps() {
  const [apps, setApps] = useState([]);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');

  const fetch = async () => {
    try { const r = await api.get('/api/management-applications'); setApps(r.data); } catch {}
  };
  useEffect(() => { fetch(); }, []);

  const update = async (id, data) => {
    try { await api.patch(`/api/management-applications/${id}`, data); toast.success('Updated'); fetch(); if (selected?._id===id) setSelected({...selected,...data}); } catch { toast.error('Failed'); }
  };
  const del = async id => {
    if (!confirm('Delete?')) return;
    try { await api.delete(`/api/management-applications/${id}`); toast.success('Deleted'); fetch(); setSelected(null); } catch {}
  };

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, color:'#1A2540', fontWeight:700 }}>Management Applications</h1>
        <p style={{ fontSize:13, color:'#999', marginTop:3 }}>Property owners who applied for management services</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap:20 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {apps.length === 0
            ? <div style={{ background:'#fff', border:'1px solid #EDE8E0', borderRadius:6, padding:'40px', textAlign:'center', color:'#aaa' }}>No applications yet</div>
            : apps.map(a=>(
              <div key={a._id} onClick={()=>{setSelected(a);setNotes(a.notes||'')}} style={{ background:'#fff', border:`1px solid ${selected?._id===a._id?'#C9933A':'#EDE8E0'}`, borderRadius:6, padding:'18px 22px', cursor:'pointer', display:'grid', gridTemplateColumns:'1fr auto', gap:16, alignItems:'center', transition:'all 0.2s' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                    <h3 style={{ fontSize:15, fontWeight:700, color:'#1A2540' }}>{a.ownerName}</h3>
                    <span style={{ background:(STATUS_COLORS[a.status]||[])[0], color:(STATUS_COLORS[a.status]||[])[1], fontSize:11, fontWeight:600, padding:'2px 10px', borderRadius:20, textTransform:'capitalize' }}>{a.status}</span>
                  </div>
                  <p style={{ fontSize:13, color:'#555' }}>{a.propertyAddress||'Property address not provided'}</p>
                  <p style={{ fontSize:12, color:'#999', marginTop:2 }}>{a.email} · {a.phone} · {a.bedrooms||'?'} bed · {a.bathrooms||'?'} bath</p>
                  {a.airbnbUrl && <a href={a.airbnbUrl} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{ fontSize:11, color:'#C9933A' }}>View on Airbnb →</a>}
                </div>
                <div style={{ fontSize:11, color:'#aaa', textAlign:'right', whiteSpace:'nowrap' }}>{new Date(a.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</div>
              </div>
            ))
          }
        </div>

        {selected && (
          <div style={{ background:'#fff', border:'1px solid #EDE8E0', borderRadius:6, padding:22, position:'sticky', top:20, maxHeight:'80vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:'#1A2540', fontWeight:700 }}>{selected.ownerName}</h3>
              <button onClick={()=>setSelected(null)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#999' }}>×</button>
            </div>
            {[['Email',selected.email],['Phone',selected.phone],['Property',selected.propertyName||'—'],['Address',selected.propertyAddress||'—'],['Bedrooms',selected.bedrooms||'—'],['Bathrooms',selected.bathrooms||'—'],['Currently Listed?',selected.currentlyListed?'Yes':'No'],['Airbnb URL',selected.airbnbUrl||'—'],['VRBO URL',selected.vrboUrl||'—'],['Monthly Revenue',selected.monthlyRevenue||'—'],['Message',selected.message||'—']].map(([l,v])=>(
              <div key={l} style={{ marginBottom:9 }}>
                <div style={{ fontSize:10, fontWeight:600, color:'#aaa', textTransform:'uppercase', letterSpacing:'0.05em' }}>{l}</div>
                <div style={{ fontSize:13, color:'#333', lineHeight:1.5, wordBreak:'break-word' }}>{v}</div>
              </div>
            ))}
            <div style={{ marginTop:14 }}>
              <div style={{ fontSize:11, fontWeight:600, color:'#888', textTransform:'uppercase', marginBottom:6 }}>Update Status</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                {['new','reviewing','approved','rejected'].map(s=>(
                  <button key={s} onClick={()=>update(selected._id,{status:s})} style={{ padding:'7px', border:`1px solid ${(STATUS_COLORS[s]||[])[1]||'#ddd'}`, background:selected.status===s?(STATUS_COLORS[s]||[])[0]:'#fff', color:(STATUS_COLORS[s]||[])[1]||'#333', fontSize:11, fontWeight:600, cursor:'pointer', borderRadius:4, textTransform:'capitalize' }}>{s}</button>
                ))}
              </div>
            </div>
            <div style={{ marginTop:14 }}>
              <div style={{ fontSize:11, fontWeight:600, color:'#888', textTransform:'uppercase', marginBottom:6 }}>Notes</div>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} style={{ width:'100%', padding:'9px', border:'1px solid #E0D8CC', fontSize:13, outline:'none', borderRadius:4, fontFamily:"'Poppins',sans-serif", resize:'vertical' }}/>
              <button onClick={()=>update(selected._id,{notes})} style={{ marginTop:6, background:'#1A2540', color:'#fff', border:'none', padding:'8px', fontSize:12, fontWeight:600, cursor:'pointer', borderRadius:4, width:'100%' }}>Save Notes</button>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              <a href={`mailto:${selected.email}`} style={{ flex:1, background:'#C9933A', color:'#fff', padding:'9px', fontSize:12, fontWeight:600, textAlign:'center', textDecoration:'none', borderRadius:4 }}>Email Owner</a>
              <a href={`https://wa.me/${selected.phone?.replace(/\D/g,'')}?text=Hi ${selected.ownerName}! We reviewed your property management application.`} target="_blank" rel="noreferrer" style={{ flex:1, background:'#25D366', color:'#fff', padding:'9px', fontSize:12, fontWeight:600, textAlign:'center', textDecoration:'none', borderRadius:4 }}>WhatsApp</a>
              <button onClick={()=>del(selected._id)} style={{ background:'#FCEBEB', color:'#C62828', border:'none', padding:'9px 14px', fontSize:12, cursor:'pointer', borderRadius:4 }}>Del</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
