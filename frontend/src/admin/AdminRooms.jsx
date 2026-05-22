import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const EMPTY = { name:'', slug:'', shortDesc:'', description:'', bedrooms:1, bathrooms:1, maxGuests:2, pricePerNight:175, images:[''], amenities:[], airbnbUrl:'', vrboUrl:'', isActive:true, order:0 };

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');

  const fetch = async () => {
    setLoading(true);
    try { const r = await api.get('/api/rooms/all'); setRooms(r.data); }
    catch { toast.error('Failed to load rooms'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const save = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...editing, images: editing.images.filter(Boolean) };
      if (editing._id) { await api.patch(`/api/rooms/${editing._id}`, data); toast.success('Room updated'); }
      else { await api.post('/api/rooms', data); toast.success('Room added'); }
      setEditing(null);
      fetch();
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const del = async id => {
    if (!confirm('Delete this room?')) return;
    try { await api.delete(`/api/rooms/${id}`); toast.success('Deleted'); fetch(); } catch { toast.error('Failed'); }
  };

  const inp = { width:'100%', padding:'9px 12px', border:'1px solid #E0D8CC', fontSize:13, outline:'none', borderRadius:4, fontFamily:"'Poppins',sans-serif" };
  const lbl = { display:'block', fontSize:11, fontWeight:600, color:'#888', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.05em' };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, color:'#1A2540', fontWeight:700 }}>Rooms & Accommodations</h1>
        <button onClick={() => setEditing({ ...EMPTY })} style={{ background:'#C9933A', color:'#fff', border:'none', padding:'10px 22px', fontSize:13, fontWeight:600, cursor:'pointer', borderRadius:4 }}>+ Add Room</button>
      </div>

      {loading ? <p style={{ color:'#aaa' }}>Loading...</p> : (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {rooms.map(room => (
            <div key={room._id} style={{ background:'#fff', border:'1px solid #EDE8E0', borderRadius:6, padding:'20px 24px', display:'grid', gridTemplateColumns:'80px 1fr auto', gap:20, alignItems:'center' }}>
              <img src={room.images?.[0]||'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&q=60'} alt={room.name} style={{ width:80, height:60, objectFit:'cover', borderRadius:4 }}/>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:'#1A2540', fontWeight:700 }}>{room.name}</h3>
                  <span style={{ background:room.isActive?'#EAF3DE':'#F5F0E8', color:room.isActive?'#2E7D32':'#888', fontSize:11, fontWeight:600, padding:'2px 10px', borderRadius:20 }}>{room.isActive?'Active':'Hidden'}</span>
                </div>
                <p style={{ fontSize:13, color:'#777' }}>{room.bedrooms} bed · {room.bathrooms} bath · max {room.maxGuests} guests · <strong style={{ color:'#C9933A' }}>${room.pricePerNight}/night</strong></p>
                <p style={{ fontSize:12, color:'#aaa', marginTop:2 }}>{room.shortDesc}</p>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => setEditing({ ...room, images: room.images?.length ? room.images : [''] })} style={{ background:'#1A2540', color:'#fff', border:'none', padding:'8px 18px', fontSize:12, fontWeight:600, cursor:'pointer', borderRadius:4 }}>Edit</button>
                <button onClick={() => del(room._id)} style={{ background:'#FCEBEB', color:'#C62828', border:'none', padding:'8px 18px', fontSize:12, fontWeight:600, cursor:'pointer', borderRadius:4 }}>Delete</button>
              </div>
            </div>
          ))}
          {rooms.length === 0 && <div style={{ background:'#fff', border:'1px solid #EDE8E0', borderRadius:6, padding:'40px', textAlign:'center', color:'#aaa' }}>No rooms yet. Add your first room!</div>}
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={e=>e.target===e.currentTarget&&setEditing(null)}>
          <div style={{ background:'#fff', width:'100%', maxWidth:640, maxHeight:'92vh', overflowY:'auto', borderRadius:6, boxShadow:'0 24px 80px rgba(0,0,0,0.3)' }}>
            <div style={{ background:'#1A2540', padding:'18px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:1 }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'#fff', fontWeight:700 }}>{editing._id ? 'Edit Room' : 'Add Room'}</h3>
              <button onClick={() => setEditing(null)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.6)', fontSize:22, cursor:'pointer' }}>×</button>
            </div>
            <form onSubmit={save} style={{ padding:24 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Room Name *</label><input required value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value,slug:e.target.value.toLowerCase().replace(/\s+/g,'-')})} style={inp}/></div>
                <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Short Description</label><input value={editing.shortDesc||''} onChange={e=>setEditing({...editing,shortDesc:e.target.value})} style={inp}/></div>
                <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Full Description</label><textarea value={editing.description||''} onChange={e=>setEditing({...editing,description:e.target.value})} rows={3} style={{ ...inp, resize:'vertical' }}/></div>
                <div><label style={lbl}>Bedrooms</label><input type="number" min="1" value={editing.bedrooms} onChange={e=>setEditing({...editing,bedrooms:+e.target.value})} style={inp}/></div>
                <div><label style={lbl}>Bathrooms</label><input type="number" min="1" value={editing.bathrooms} onChange={e=>setEditing({...editing,bathrooms:+e.target.value})} style={inp}/></div>
                <div><label style={lbl}>Max Guests</label><input type="number" min="1" value={editing.maxGuests} onChange={e=>setEditing({...editing,maxGuests:+e.target.value})} style={inp}/></div>
                <div><label style={lbl}>Price Per Night ($)</label><input type="number" min="0" required value={editing.pricePerNight} onChange={e=>setEditing({...editing,pricePerNight:+e.target.value})} style={inp}/></div>
                <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Airbnb URL</label><input value={editing.airbnbUrl||''} onChange={e=>setEditing({...editing,airbnbUrl:e.target.value})} placeholder="https://airbnb.com/rooms/..." style={inp}/></div>
                <div style={{ gridColumn:'1/-1' }}><label style={lbl}>VRBO URL</label><input value={editing.vrboUrl||''} onChange={e=>setEditing({...editing,vrboUrl:e.target.value})} placeholder="https://vrbo.com/..." style={inp}/></div>
              </div>

              {/* Images */}
              <div style={{ marginTop:16 }}>
                <label style={lbl}>Image URLs</label>
                {(editing.images||['']).map((img,i)=>(
                  <div key={i} style={{ display:'flex', gap:8, marginBottom:8 }}>
                    <input value={img} onChange={e=>{const imgs=[...(editing.images||[])];imgs[i]=e.target.value;setEditing({...editing,images:imgs})}} placeholder="https://..." style={{ ...inp, flex:1 }}/>
                    <button type="button" onClick={()=>{const imgs=(editing.images||[]).filter((_,j)=>j!==i);setEditing({...editing,images:imgs.length?imgs:['']})}} style={{ background:'#FCEBEB', color:'#C62828', border:'none', padding:'9px 12px', cursor:'pointer', borderRadius:4, fontSize:16 }}>×</button>
                  </div>
                ))}
                <button type="button" onClick={()=>setEditing({...editing,images:[...(editing.images||[]),'']})} style={{ fontSize:12, color:'#C9933A', background:'none', border:'1px dashed #C9933A', padding:'6px 14px', cursor:'pointer', borderRadius:4 }}>+ Add Image URL</button>
              </div>

              {/* Amenities */}
              <div style={{ marginTop:16 }}>
                <label style={lbl}>Amenities</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
                  {(editing.amenities||[]).map((a,i)=>(
                    <span key={i} style={{ background:'#F0EBE0', border:'1px solid #E0D8CC', fontSize:12, padding:'4px 10px', borderRadius:20, display:'flex', alignItems:'center', gap:6 }}>
                      {a}
                      <button type="button" onClick={()=>setEditing({...editing,amenities:(editing.amenities||[]).filter((_,j)=>j!==i)})} style={{ background:'none', border:'none', cursor:'pointer', color:'#999', fontSize:14, lineHeight:1, padding:0 }}>×</button>
                    </span>
                  ))}
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <input value={newAmenity} onChange={e=>setNewAmenity(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();if(newAmenity.trim()){setEditing({...editing,amenities:[...(editing.amenities||[]),newAmenity.trim()]});setNewAmenity('')}}}} placeholder="Type amenity and press Enter" style={{ ...inp, flex:1 }}/>
                  <button type="button" onClick={()=>{if(newAmenity.trim()){setEditing({...editing,amenities:[...(editing.amenities||[]),newAmenity.trim()]});setNewAmenity('')}}} style={{ background:'#C9933A', color:'#fff', border:'none', padding:'9px 16px', cursor:'pointer', borderRadius:4, fontSize:13 }}>Add</button>
                </div>
              </div>

              <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:16 }}>
                <input type="checkbox" id="isActive" checked={editing.isActive} onChange={e=>setEditing({...editing,isActive:e.target.checked})} style={{ width:16, height:16, cursor:'pointer' }}/>
                <label htmlFor="isActive" style={{ fontSize:13, color:'#555', cursor:'pointer' }}>Show on website (active)</label>
              </div>

              <div style={{ display:'flex', gap:10, marginTop:24 }}>
                <button type="submit" disabled={saving} style={{ flex:1, background:'#C9933A', color:'#fff', border:'none', padding:'12px', fontSize:13, fontWeight:600, cursor:saving?'not-allowed':'pointer', borderRadius:4, opacity:saving?0.7:1 }}>
                  {saving ? 'Saving...' : editing._id ? 'UPDATE ROOM' : 'ADD ROOM'}
                </button>
                <button type="button" onClick={() => setEditing(null)} style={{ flex:1, background:'#F5F0E8', color:'#555', border:'none', padding:'12px', fontSize:13, fontWeight:600, cursor:'pointer', borderRadius:4 }}>CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
