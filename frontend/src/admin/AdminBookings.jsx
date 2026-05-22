import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const STATUS_COLORS = { pending:['#FFF8EC','#C9933A'], confirmed:['#EAF3DE','#2E7D32'], cancelled:['#FCEBEB','#C62828'], completed:['#E6F1FB','#1565C0'] };

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [newBooking, setNewBooking] = useState({ name:'', email:'', phone:'', checkin:'', checkout:'', guests:1, room:'', source:'admin', status:'confirmed', paymentStatus:'unpaid', notes:'' });

  const fetch = async () => {
    setLoading(true);
    try {
      const [b, r] = await Promise.all([
        api.get('/api/bookings', { params: filter !== 'all' ? { status: filter } : {} }),
        api.get('/api/rooms/all'),
      ]);
      setBookings(b.data);
      setRooms(r.data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/api/bookings/${id}`, { status });
      toast.success('Updated');
      fetch();
      setSelected(null);
    } catch { toast.error('Failed'); }
  };

  const deleteBooking = async id => {
    if (!confirm('Delete this booking?')) return;
    try { await api.delete(`/api/bookings/${id}`); toast.success('Deleted'); fetch(); setSelected(null); } catch { toast.error('Failed'); }
  };

  const addBooking = async e => {
    e.preventDefault();
    try {
      const room = rooms.find(r => r._id === newBooking.room);
      const nights = Math.ceil((new Date(newBooking.checkout) - new Date(newBooking.checkin)) / 86400000);
      await api.post('/api/bookings', { ...newBooking, nights, roomName: room?.name, pricePerNight: room?.pricePerNight, totalPrice: nights * (room?.pricePerNight || 0) });
      toast.success('Booking added');
      setShowAdd(false);
      setNewBooking({ name:'', email:'', phone:'', checkin:'', checkout:'', guests:1, room:'', source:'admin', status:'confirmed', paymentStatus:'unpaid', notes:'' });
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const inp = { width:'100%', padding:'9px 12px', border:'1px solid #E0D8CC', fontSize:13, outline:'none', borderRadius:4, fontFamily:"'Poppins',sans-serif" };
  const lbl = { display:'block', fontSize:11, fontWeight:600, color:'#888', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.05em' };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, color:'#1A2540', fontWeight:700 }}>Bookings</h1>
          <p style={{ fontSize:13, color:'#999', marginTop:3 }}>{bookings.length} booking{bookings.length!==1?'s':''}</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ background:'#C9933A', color:'#fff', border:'none', padding:'10px 22px', fontSize:13, fontWeight:600, cursor:'pointer', borderRadius:4, display:'flex', alignItems:'center', gap:6 }}>
          + Add Booking
        </button>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {['all','pending','confirmed','completed','cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding:'7px 16px', border:`1px solid ${filter===s?'#C9933A':'#E0D8CC'}`, background:filter===s?'#C9933A':'#fff', color:filter===s?'#fff':'#555', fontSize:12, fontWeight:filter===s?600:400, cursor:'pointer', borderRadius:4, textTransform:'capitalize', transition:'all 0.2s' }}>
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:'#fff', border:'1px solid #EDE8E0', borderRadius:6, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ background:'#F9F5EE', borderBottom:'2px solid #EDE8E0' }}>
              {['Guest','Room','Check-in','Check-out','Nights','Total','Source','Status','Payment','Actions'].map(h => (
                <th key={h} style={{ padding:'11px 14px', textAlign:'left', fontSize:11, fontWeight:600, color:'#888', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} style={{ padding:'40px', textAlign:'center', color:'#aaa' }}>Loading...</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan={10} style={{ padding:'40px', textAlign:'center', color:'#aaa' }}>No bookings found</td></tr>
            ) : bookings.map(b => (
              <tr key={b._id} style={{ borderBottom:'1px solid #F5F0E8', transition:'background 0.15s' }} onMouseEnter={e=>e.currentTarget.style.background='#FFFDF9'} onMouseLeave={e=>e.currentTarget.style.background=''}>
                <td style={{ padding:'12px 14px' }}>
                  <div style={{ fontWeight:600, color:'#1A2540' }}>{b.name}</div>
                  <div style={{ fontSize:11, color:'#999' }}>{b.email}</div>
                  {b.phone && <div style={{ fontSize:11, color:'#999' }}>{b.phone}</div>}
                </td>
                <td style={{ padding:'12px 14px', color:'#555' }}>{b.roomName || b.room?.name || '—'}</td>
                <td style={{ padding:'12px 14px', color:'#555', whiteSpace:'nowrap' }}>{b.checkin ? new Date(b.checkin).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'2-digit'}) : '—'}</td>
                <td style={{ padding:'12px 14px', color:'#555', whiteSpace:'nowrap' }}>{b.checkout ? new Date(b.checkout).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'2-digit'}) : '—'}</td>
                <td style={{ padding:'12px 14px', color:'#555', textAlign:'center' }}>{b.nights || '—'}</td>
                <td style={{ padding:'12px 14px', fontWeight:600, color:'#1A2540' }}>{b.totalPrice ? `$${b.totalPrice.toLocaleString()}` : '—'}</td>
                <td style={{ padding:'12px 14px' }}>
                  <span style={{ background:'#F0EBE0', color:'#555', fontSize:11, padding:'2px 8px', borderRadius:10, textTransform:'capitalize' }}>{b.source}</span>
                </td>
                <td style={{ padding:'12px 14px' }}>
                  <select value={b.status} onChange={e => updateStatus(b._id, e.target.value)}
                    style={{ border:`1px solid ${(STATUS_COLORS[b.status]||[])[1]||'#ddd'}`, background:(STATUS_COLORS[b.status]||[])[0]||'#fff', color:(STATUS_COLORS[b.status]||[])[1]||'#333', padding:'4px 8px', fontSize:11, fontWeight:600, borderRadius:20, cursor:'pointer', outline:'none', fontFamily:"'Poppins',sans-serif" }}>
                    {['pending','confirmed','completed','cancelled'].map(s=><option key={s} value={s} style={{textTransform:'capitalize'}}>{s}</option>)}
                  </select>
                </td>
                <td style={{ padding:'12px 14px' }}>
                  <select value={b.paymentStatus} onChange={e => api.patch(`/api/bookings/${b._id}`,{paymentStatus:e.target.value}).then(fetch)}
                    style={{ border:'1px solid #E0D8CC', padding:'4px 8px', fontSize:11, borderRadius:20, cursor:'pointer', outline:'none', fontFamily:"'Poppins',sans-serif" }}>
                    {['unpaid','partial','paid'].map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td style={{ padding:'12px 14px' }}>
                  <div style={{ display:'flex', gap:6 }}>
                    <button onClick={() => setSelected(b)} style={{ background:'#1A2540', color:'#fff', border:'none', padding:'5px 10px', fontSize:11, cursor:'pointer', borderRadius:3 }}>View</button>
                    <a href={`https://wa.me/${b.phone?.replace(/\D/g,'')}?text=Hello ${b.name}! Your booking at Sunset Retreat JA from ${b.checkin?new Date(b.checkin).toLocaleDateString():'—'} is confirmed.`} target="_blank" rel="noreferrer"
                      style={{ background:'#25D366', color:'#fff', border:'none', padding:'5px 10px', fontSize:11, cursor:'pointer', borderRadius:3, textDecoration:'none', display:'flex', alignItems:'center', gap:3 }}>
                      <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413z"/><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.07-1.35C8.46 21.51 10.19 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
                      WA
                    </a>
                    <button onClick={() => deleteBooking(b._id)} style={{ background:'#FCEBEB', color:'#C62828', border:'none', padding:'5px 10px', fontSize:11, cursor:'pointer', borderRadius:3 }}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div style={{ background:'#fff', width:'100%', maxWidth:500, borderRadius:6, overflow:'hidden', boxShadow:'0 24px 80px rgba(0,0,0,0.3)' }}>
            <div style={{ background:'#1A2540', padding:'18px 24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'#fff', fontWeight:700 }}>Booking Details</h3>
              <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.6)', fontSize:22, cursor:'pointer' }}>×</button>
            </div>
            <div style={{ padding:24 }}>
              {[['Guest Name', selected.name],['Email', selected.email],['Phone', selected.phone||'—'],['Room', selected.roomName||'—'],['Check-in', selected.checkin?new Date(selected.checkin).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'}):'—'],['Check-out', selected.checkout?new Date(selected.checkout).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'}):'—'],['Nights', selected.nights||'—'],['Guests', selected.guests||'—'],['Price/Night', selected.pricePerNight?`$${selected.pricePerNight}`:'—'],['Total', selected.totalPrice?`$${selected.totalPrice.toLocaleString()}`:'—'],['Source', selected.source],['Special Requests', selected.specialRequests||'None'],['Notes', selected.notes||'None']].map(([l,v])=>(
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #F5F0E8', fontSize:13 }}>
                  <span style={{ color:'#888', fontWeight:500 }}>{l}</span>
                  <span style={{ color:'#1A2540', fontWeight:600, textAlign:'right', maxWidth:280 }}>{v}</span>
                </div>
              ))}
              <div style={{ display:'flex', gap:8, marginTop:20 }}>
                {['confirmed','completed','cancelled'].map(s => (
                  <button key={s} onClick={() => updateStatus(selected._id, s)} style={{ flex:1, padding:'9px', border:'none', borderRadius:4, cursor:'pointer', fontSize:12, fontWeight:600, background:s==='confirmed'?'#EAF3DE':s==='cancelled'?'#FCEBEB':'#E6F1FB', color:s==='confirmed'?'#2E7D32':s==='cancelled'?'#C62828':'#1565C0', textTransform:'capitalize' }}>
                    {s==='confirmed'?'✓ Confirm':s==='completed'?'✓ Complete':'✗ Cancel'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Booking Modal */}
      {showAdd && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div style={{ background:'#fff', width:'100%', maxWidth:520, borderRadius:6, overflow:'hidden', boxShadow:'0 24px 80px rgba(0,0,0,0.3)', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ background:'#1A2540', padding:'18px 24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'#fff', fontWeight:700 }}>Add Manual Booking</h3>
              <button onClick={() => setShowAdd(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.6)', fontSize:22, cursor:'pointer' }}>×</button>
            </div>
            <form onSubmit={addBooking} style={{ padding:24 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {[['name','Guest Name','text',true],['email','Email','email',true],['phone','Phone','text',false]].map(([k,l,t,req])=>(
                  <div key={k} style={{ gridColumn: k==='name'?'1/-1':'auto' }}>
                    <label style={lbl}>{l}</label>
                    <input type={t} required={req} value={newBooking[k]} onChange={e=>setNewBooking({...newBooking,[k]:e.target.value})} style={inp}/>
                  </div>
                ))}
                <div>
                  <label style={lbl}>Room</label>
                  <select value={newBooking.room} onChange={e=>setNewBooking({...newBooking,room:e.target.value})} style={{ ...inp, cursor:'pointer' }}>
                    <option value="">Select Room</option>
                    {rooms.map(r=><option key={r._id} value={r._id}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Guests</label>
                  <input type="number" min="1" max="10" value={newBooking.guests} onChange={e=>setNewBooking({...newBooking,guests:e.target.value})} style={inp}/>
                </div>
                <div>
                  <label style={lbl}>Check-in</label>
                  <input type="date" required value={newBooking.checkin} onChange={e=>setNewBooking({...newBooking,checkin:e.target.value})} style={inp}/>
                </div>
                <div>
                  <label style={lbl}>Check-out</label>
                  <input type="date" required value={newBooking.checkout} onChange={e=>setNewBooking({...newBooking,checkout:e.target.value})} style={inp}/>
                </div>
                <div>
                  <label style={lbl}>Source</label>
                  <select value={newBooking.source} onChange={e=>setNewBooking({...newBooking,source:e.target.value})} style={{ ...inp, cursor:'pointer' }}>
                    {['admin','website','airbnb','vrbo','whatsapp','walkin'].map(s=><option key={s} value={s} style={{textTransform:'capitalize'}}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Payment Status</label>
                  <select value={newBooking.paymentStatus} onChange={e=>setNewBooking({...newBooking,paymentStatus:e.target.value})} style={{ ...inp, cursor:'pointer' }}>
                    {['unpaid','partial','paid'].map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={lbl}>Notes</label>
                  <textarea value={newBooking.notes} onChange={e=>setNewBooking({...newBooking,notes:e.target.value})} rows={2} style={{ ...inp, resize:'vertical' }}/>
                </div>
              </div>
              <div style={{ display:'flex', gap:10, marginTop:20 }}>
                <button type="submit" style={{ flex:1, background:'#C9933A', color:'#fff', border:'none', padding:'12px', fontSize:13, fontWeight:600, cursor:'pointer', borderRadius:4 }}>ADD BOOKING</button>
                <button type="button" onClick={() => setShowAdd(false)} style={{ flex:1, background:'#F5F0E8', color:'#555', border:'none', padding:'12px', fontSize:13, fontWeight:600, cursor:'pointer', borderRadius:4 }}>CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
