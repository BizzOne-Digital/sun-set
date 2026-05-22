import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const STATUS_COLORS = { new:['#E6F1FB','#0C447C'], contacted:['#FFF8EC','#C9933A'], booked:['#EAF3DE','#2E7D32'], closed:['#F5F0E8','#888'] };

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');

  const fetch = async () => {
    try { const r = await api.get('/api/leads', { params: filter !== 'all' ? { status: filter } : {} }); setLeads(r.data); } catch {}
  };
  useEffect(() => { fetch(); }, [filter]);

  const update = async (id, data) => {
    try { await api.patch(`/api/leads/${id}`, data); toast.success('Updated'); fetch(); if (selected?._id === id) setSelected({ ...selected, ...data }); } catch { toast.error('Failed'); }
  };

  const del = async id => {
    if (!confirm('Delete lead?')) return;
    try { await api.delete(`/api/leads/${id}`); toast.success('Deleted'); fetch(); setSelected(null); } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, color:'#1A2540', fontWeight:700 }}>Leads & Inquiries</h1>
        <p style={{ fontSize:13, color:'#999', marginTop:3 }}>{leads.length} lead{leads.length!==1?'s':''}</p>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {['all','new','contacted','booked','closed'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{ padding:'7px 16px', border:`1px solid ${filter===f?'#C9933A':'#E0D8CC'}`, background:filter===f?'#C9933A':'#fff', color:filter===f?'#fff':'#555', fontSize:12, fontWeight:filter===f?600:400, cursor:'pointer', borderRadius:4, textTransform:'capitalize' }}>{f}</button>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap:20 }}>
        <div style={{ background:'#fff', border:'1px solid #EDE8E0', borderRadius:6, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ background:'#F9F5EE', borderBottom:'2px solid #EDE8E0' }}>
                {['Name','Email / Phone','Dates','Guests','Source','Status','Actions'].map(h=>(
                  <th key={h} style={{ padding:'11px 14px', textAlign:'left', fontSize:11, fontWeight:600, color:'#888', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.length === 0
                ? <tr><td colSpan={7} style={{ padding:'40px', textAlign:'center', color:'#aaa' }}>No leads found</td></tr>
                : leads.map(l=>(
                  <tr key={l._id} style={{ borderBottom:'1px solid #F5F0E8', cursor:'pointer', background:selected?._id===l._id?'#FFFDF5':'' }} onClick={()=>{setSelected(l);setNotes(l.notes||'')}} onMouseEnter={e=>e.currentTarget.style.background='#FFFDF9'} onMouseLeave={e=>e.currentTarget.style.background=selected?._id===l._id?'#FFFDF5':''}>
                    <td style={{ padding:'12px 14px', fontWeight:600, color:'#1A2540' }}>{l.name}</td>
                    <td style={{ padding:'12px 14px' }}><div style={{ fontSize:13, color:'#555' }}>{l.email}</div><div style={{ fontSize:11, color:'#999' }}>{l.phone||'—'}</div></td>
                    <td style={{ padding:'12px 14px', color:'#555', fontSize:12 }}>{l.checkin?new Date(l.checkin).toLocaleDateString('en-GB',{day:'numeric',month:'short'}):'—'} → {l.checkout?new Date(l.checkout).toLocaleDateString('en-GB',{day:'numeric',month:'short'}):'—'}</td>
                    <td style={{ padding:'12px 14px', color:'#555', textAlign:'center' }}>{l.guests||'—'}</td>
                    <td style={{ padding:'12px 14px' }}><span style={{ background:'#F0EBE0', color:'#555', fontSize:11, padding:'2px 8px', borderRadius:10 }}>{l.source}</span></td>
                    <td style={{ padding:'12px 14px' }}>
                      <select value={l.status} onChange={e=>{e.stopPropagation();update(l._id,{status:e.target.value})}} style={{ border:`1px solid ${(STATUS_COLORS[l.status]||[])[1]||'#ddd'}`, background:(STATUS_COLORS[l.status]||[])[0]||'#fff', color:(STATUS_COLORS[l.status]||[])[1]||'#333', padding:'3px 8px', fontSize:11, fontWeight:600, borderRadius:20, cursor:'pointer', outline:'none', fontFamily:"'Poppins',sans-serif" }}>
                        {['new','contacted','booked','closed'].map(s=><option key={s} value={s} style={{textTransform:'capitalize'}}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ padding:'12px 14px' }}>
                      <div style={{ display:'flex', gap:5 }}>
                        <a href={`mailto:${l.email}`} style={{ background:'#1A2540', color:'#fff', padding:'5px 10px', fontSize:11, borderRadius:3, textDecoration:'none' }}>Email</a>
                        {l.phone && <a href={`https://wa.me/${l.phone.replace(/\D/g,'')}?text=Hi ${l.name}! Thanks for your inquiry about Sunset Retreat JA.`} target="_blank" rel="noreferrer" style={{ background:'#25D366', color:'#fff', padding:'5px 10px', fontSize:11, borderRadius:3, textDecoration:'none' }}>WA</a>}
                        <button onClick={e=>{e.stopPropagation();del(l._id)}} style={{ background:'#FCEBEB', color:'#C62828', border:'none', padding:'5px 10px', fontSize:11, cursor:'pointer', borderRadius:3 }}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        {/* Detail panel */}
        {selected && (
          <div style={{ background:'#fff', border:'1px solid #EDE8E0', borderRadius:6, padding:20, position:'sticky', top:20, maxHeight:'80vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:'#1A2540', fontWeight:700 }}>{selected.name}</h3>
              <button onClick={()=>setSelected(null)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#999' }}>×</button>
            </div>
            {[['Email',selected.email],['Phone',selected.phone||'—'],['Guests',selected.guests||'—'],['Check-in',selected.checkin?new Date(selected.checkin).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}):'—'],['Check-out',selected.checkout?new Date(selected.checkout).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}):'—'],['Message',selected.message||'—'],['Submitted',new Date(selected.createdAt).toLocaleString()]].map(([l,v])=>(
              <div key={l} style={{ marginBottom:10 }}>
                <div style={{ fontSize:11, fontWeight:600, color:'#888', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:2 }}>{l}</div>
                <div style={{ fontSize:13, color:'#333', lineHeight:1.5, wordBreak:'break-word' }}>{v}</div>
              </div>
            ))}
            <div style={{ marginTop:16 }}>
              <div style={{ fontSize:11, fontWeight:600, color:'#888', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6 }}>Internal Notes</div>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} style={{ width:'100%', padding:'9px 12px', border:'1px solid #E0D8CC', fontSize:13, outline:'none', borderRadius:4, fontFamily:"'Poppins',sans-serif", resize:'vertical' }} placeholder="Add notes..."/>
              <button onClick={()=>update(selected._id,{notes})} style={{ marginTop:8, background:'#1A2540', color:'#fff', border:'none', padding:'8px 18px', fontSize:12, fontWeight:600, cursor:'pointer', borderRadius:4, width:'100%' }}>Save Notes</button>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:14 }}>
              <a href={`mailto:${selected.email}`} className="btn-gold" style={{ flex:1, padding:'9px', fontSize:12, fontWeight:600, textAlign:'center', textDecoration:'none', display:'block' }}>Email Guest</a>
              {selected.phone && <a href={`https://wa.me/${selected.phone.replace(/\D/g,'')}?text=Hi ${selected.name}! Thanks for your enquiry about Sunset Retreat JA.`} target="_blank" rel="noreferrer" style={{ flex:1, background:'#25D366', color:'#fff', padding:'9px', fontSize:12, fontWeight:600, textAlign:'center', textDecoration:'none', borderRadius:4 }}>WhatsApp</a>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
