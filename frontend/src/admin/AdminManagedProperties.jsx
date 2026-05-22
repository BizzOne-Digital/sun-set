import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const EMPTY = { ownerName:'', propertyName:'', address:'', bedrooms:1, bathrooms:1, airbnbUrl:'', vrboUrl:'', images:[''], monthlyRevenue:0, commission:20, isActive:true, startDate:'', notes:'' };

export default function AdminManagedProperties() {
  const [props, setProps] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    try { const r = await api.get('/api/managed-properties'); setProps(r.data); } catch {}
  };
  useEffect(() => { fetch(); }, []);

  const save = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...editing, images: (editing.images||[]).filter(Boolean) };
      if (editing._id) await api.patch(`/api/managed-properties/${editing._id}`, data);
      else await api.post('/api/managed-properties', data);
      toast.success(editing._id ? 'Updated' : 'Property added');
      setEditing(null); fetch();
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const del = async id => {
    if (!confirm('Delete?')) return;
    try { await api.delete(`/api/managed-properties/${id}`); toast.success('Deleted'); fetch(); } catch {}
  };

  const inp = { width:'100%', padding:'9px 12px', border:'1px solid #E0D8CC', fontSize:13, outline:'none', borderRadius:4, fontFamily:"'Poppins',sans-serif" };
  const lbl = { display:'block', fontSize:11, fontWeight:600, color:'#888', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.05em' };

  const totalRev = props.filter(p=>p.isActive).reduce((s,p)=>s+(p.monthlyRevenue||0),0);
  const totalComm = props.filter(p=>p.isActive).reduce((s,p)=>s+(p.monthlyRevenue||0)*(p.commission||20)/100,0);

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, color:'#1A2540', fontWeight:700 }}>Managed Properties</h1>
          <p style={{ fontSize:13, color:'#999', marginTop:3 }}>{props.filter(p=>p.isActive).length} active properties</p>
        </div>
        <button onClick={()=>setEditing({...EMPTY})} style={{ background:'#C9933A', color:'#fff', border:'none', padding:'10px 22px', fontSize:13, fontWeight:600, cursor:'pointer', borderRadius:4 }}>+ Add Property</button>
      </div>

      {/* Revenue summary */}
      {props.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:24 }}>
          {[['Active Properties', props.filter(p=>p.isActive).length, '#C9933A'],['Monthly Revenue', `$${totalRev.toLocaleString()}`, '#2E7D32'],['Monthly Commission', `$${totalComm.toLocaleString()}`, '#1565C0']].map(([l,v,c])=>(
            <div key={l} style={{ background:'#fff', border:'1px solid #EDE8E0', borderRadius:6, padding:'18px 22px', borderLeft:`3px solid ${c}` }}>
              <p style={{ fontSize:11, color:'#999', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>{l}</p>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:700, color:'#1A2540' }}>{v}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {props.map(p=>(
          <div key={p._id} style={{ background:'#fff', border:'1px solid #EDE8E0', borderRadius:6, padding:'18px 22px', display:'grid', gridTemplateColumns:'1fr auto', gap:16, alignItems:'center' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                <h3 style={{ fontSize:16, fontWeight:700, color:'#1A2540', fontFamily:"'Playfair Display',serif" }}>{p.propertyName}</h3>
                <span style={{ background:p.isActive?'#EAF3DE':'#F5F0E8', color:p.isActive?'#2E7D32':'#888', fontSize:11, fontWeight:600, padding:'2px 10px', borderRadius:20 }}>{p.isActive?'Active':'Inactive'}</span>
              </div>
              <p style={{ fontSize:13, color:'#555' }}>Owner: <strong>{p.ownerName}</strong> · {p.bedrooms}bed/{p.bathrooms}bath · {p.address||'No address'}</p>
              <p style={{ fontSize:13, color:'#888', marginTop:3 }}>Revenue: <strong style={{ color:'#2E7D32' }}>${(p.monthlyRevenue||0).toLocaleString()}/mo</strong> · Commission: <strong style={{ color:'#1565C0' }}>{p.commission}%</strong> = <strong>${Math.round((p.monthlyRevenue||0)*(p.commission||20)/100).toLocaleString()}/mo</strong></p>
              <div style={{ display:'flex', gap:10, marginTop:6 }}>
                {p.airbnbUrl && <a href={p.airbnbUrl} target="_blank" rel="noreferrer" style={{ fontSize:11, color:'#FF5A3B' }}>Airbnb ↗</a>}
                {p.vrboUrl && <a href={p.vrboUrl} target="_blank" rel="noreferrer" style={{ fontSize:11, color:'#0073E6' }}>VRBO ↗</a>}
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>setEditing({...p, images:p.images?.length?p.images:['']})} style={{ background:'#1A2540', color:'#fff', border:'none', padding:'8px 16px', fontSize:12, fontWeight:600, cursor:'pointer', borderRadius:4 }}>Edit</button>
              <button onClick={()=>del(p._id)} style={{ background:'#FCEBEB', color:'#C62828', border:'none', padding:'8px 16px', fontSize:12, fontWeight:600, cursor:'pointer', borderRadius:4 }}>Delete</button>
            </div>
          </div>
        ))}
        {props.length===0 && <div style={{ background:'#fff', border:'1px solid #EDE8E0', borderRadius:6, padding:'40px', textAlign:'center', color:'#aaa' }}>No managed properties yet. Add properties you manage for other owners.</div>}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={e=>e.target===e.currentTarget&&setEditing(null)}>
          <div style={{ background:'#fff', width:'100%', maxWidth:580, maxHeight:'92vh', overflowY:'auto', borderRadius:6, boxShadow:'0 24px 80px rgba(0,0,0,0.3)' }}>
            <div style={{ background:'#1A2540', padding:'18px 24px', display:'flex', justifyContent:'space-between', position:'sticky', top:0, zIndex:1 }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'#fff', fontWeight:700 }}>{editing._id?'Edit Property':'Add Property'}</h3>
              <button onClick={()=>setEditing(null)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.6)', fontSize:22, cursor:'pointer' }}>×</button>
            </div>
            <form onSubmit={save} style={{ padding:24 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div><label style={lbl}>Owner Name *</label><input required value={editing.ownerName} onChange={e=>setEditing({...editing,ownerName:e.target.value})} style={inp}/></div>
                <div><label style={lbl}>Property Name *</label><input required value={editing.propertyName} onChange={e=>setEditing({...editing,propertyName:e.target.value})} style={inp}/></div>
                <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Address</label><input value={editing.address||''} onChange={e=>setEditing({...editing,address:e.target.value})} style={inp}/></div>
                <div><label style={lbl}>Bedrooms</label><input type="number" min="1" value={editing.bedrooms} onChange={e=>setEditing({...editing,bedrooms:+e.target.value})} style={inp}/></div>
                <div><label style={lbl}>Bathrooms</label><input type="number" min="1" value={editing.bathrooms} onChange={e=>setEditing({...editing,bathrooms:+e.target.value})} style={inp}/></div>
                <div><label style={lbl}>Monthly Revenue ($)</label><input type="number" min="0" value={editing.monthlyRevenue||0} onChange={e=>setEditing({...editing,monthlyRevenue:+e.target.value})} style={inp}/></div>
                <div><label style={lbl}>Commission (%)</label><input type="number" min="0" max="100" value={editing.commission||20} onChange={e=>setEditing({...editing,commission:+e.target.value})} style={inp}/></div>
                <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Airbnb URL</label><input value={editing.airbnbUrl||''} onChange={e=>setEditing({...editing,airbnbUrl:e.target.value})} placeholder="https://airbnb.com/rooms/..." style={inp}/></div>
                <div style={{ gridColumn:'1/-1' }}><label style={lbl}>VRBO URL</label><input value={editing.vrboUrl||''} onChange={e=>setEditing({...editing,vrboUrl:e.target.value})} placeholder="https://vrbo.com/..." style={inp}/></div>
                <div><label style={lbl}>Start Date</label><input type="date" value={editing.startDate?editing.startDate.split('T')[0]:''} onChange={e=>setEditing({...editing,startDate:e.target.value})} style={inp}/></div>
                <div style={{ display:'flex', alignItems:'center', gap:8, paddingTop:20 }}>
                  <input type="checkbox" id="propActive" checked={editing.isActive} onChange={e=>setEditing({...editing,isActive:e.target.checked})} style={{ width:16, height:16 }}/>
                  <label htmlFor="propActive" style={{ fontSize:13, color:'#555', cursor:'pointer' }}>Active</label>
                </div>
                <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Notes</label><textarea value={editing.notes||''} onChange={e=>setEditing({...editing,notes:e.target.value})} rows={2} style={{ ...inp, resize:'vertical' }}/></div>
              </div>
              <div style={{ display:'flex', gap:10, marginTop:20 }}>
                <button type="submit" disabled={saving} style={{ flex:1, background:'#C9933A', color:'#fff', border:'none', padding:'12px', fontSize:13, fontWeight:600, cursor:saving?'not-allowed':'pointer', borderRadius:4, opacity:saving?0.7:1 }}>{saving?'Saving...':editing._id?'UPDATE':'ADD PROPERTY'}</button>
                <button type="button" onClick={()=>setEditing(null)} style={{ flex:1, background:'#F5F0E8', color:'#555', border:'none', padding:'12px', fontSize:13, cursor:'pointer', borderRadius:4 }}>CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
