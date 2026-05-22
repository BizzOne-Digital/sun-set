import { useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

export default function BookingModal({ isOpen, onClose, room, checkin, checkout, nights, total }) {
  const [form, setForm] = useState({ name:'', email:'', phone:'', guests:'1', specialRequests:'' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!isOpen) return null;

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/bookings', {
        ...form,
        checkin, checkout, nights,
        totalPrice: total,
        pricePerNight: room?.pricePerNight,
        room: room?._id,
        roomName: room?.name,
        source: 'website',
      });
      setDone(true);
      toast.success('Booking request sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally { setLoading(false); }
  };

  const overlay = { position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 };
  const modal = { background:'#fff', width:'100%', maxWidth:520, maxHeight:'90vh', overflow:'auto', borderRadius:6, boxShadow:'0 24px 80px rgba(0,0,0,0.3)' };
  const inp = { width:'100%', padding:'11px 14px', border:'1px solid #E8E0D0', fontFamily:"'Poppins',sans-serif", fontSize:13, outline:'none', borderRadius:4, marginBottom:0 };
  const lbl = { display:'block', fontSize:11, fontWeight:600, color:'#888', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.05em' };

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        {/* Header */}
        <div style={{ background:'#1A2540', padding:'20px 24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'#fff', fontWeight:700 }}>Complete Your Booking</h3>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.6)', marginTop:3 }}>{room?.name}</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:22 }}>×</button>
        </div>

        {done ? (
          <div style={{ padding:40, textAlign:'center' }}>
            <div style={{ width:64, height:64, background:'#EAF3DE', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
              <svg width="32" height="32" fill="none" stroke="#2E7D32" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>
            </div>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:'#1A2540', marginBottom:8 }}>Booking Request Sent!</h3>
            <p style={{ fontSize:14, color:'#555', lineHeight:1.7, marginBottom:24 }}>We've received your request and will confirm within 24 hours. Check your email for details.</p>
            <div style={{ background:'#F9F5EE', padding:'16px', borderRadius:4, marginBottom:24, textAlign:'left' }}>
              <p style={{ fontSize:13, color:'#555' }}><b>Check-in:</b> {checkin}</p>
              <p style={{ fontSize:13, color:'#555' }}><b>Check-out:</b> {checkout}</p>
              <p style={{ fontSize:13, color:'#555' }}><b>Nights:</b> {nights}</p>
              <p style={{ fontSize:13, color:'#555' }}><b>Total:</b> ${total?.toLocaleString()}</p>
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              <a href={`https://wa.me/18762689319?text=Hi! I just submitted a booking for ${room?.name} from ${checkin} to ${checkout}.`} target="_blank" rel="noreferrer"
                style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#25D366', color:'#fff', padding:'11px 22px', fontSize:13, fontWeight:600, borderRadius:4, textDecoration:'none' }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413z"/><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.07-1.35C8.46 21.51 10.19 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
                Confirm via WhatsApp
              </a>
              <button onClick={onClose} style={{ background:'#1A2540', color:'#fff', border:'none', padding:'11px 22px', fontSize:13, fontWeight:600, borderRadius:4, cursor:'pointer' }}>Close</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} style={{ padding:'24px' }}>
            {/* Booking summary */}
            <div style={{ background:'#F9F5EE', padding:'14px 16px', borderRadius:4, marginBottom:20, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
              <div><div style={{ fontSize:10, color:'#888', fontWeight:600, textTransform:'uppercase', marginBottom:2 }}>Check-in</div><div style={{ fontSize:13, fontWeight:600 }}>{checkin}</div></div>
              <div><div style={{ fontSize:10, color:'#888', fontWeight:600, textTransform:'uppercase', marginBottom:2 }}>Check-out</div><div style={{ fontSize:13, fontWeight:600 }}>{checkout}</div></div>
              <div><div style={{ fontSize:10, color:'#888', fontWeight:600, textTransform:'uppercase', marginBottom:2 }}>Total</div><div style={{ fontSize:13, fontWeight:700, color:'#C9933A' }}>${total?.toLocaleString()}</div></div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              <div>
                <label style={lbl}>Full Name *</label>
                <input name="name" value={form.name} onChange={handle} required placeholder="Your name" style={inp}/>
              </div>
              <div>
                <label style={lbl}>Email *</label>
                <input name="email" type="email" value={form.email} onChange={handle} required placeholder="your@email.com" style={inp}/>
              </div>
              <div>
                <label style={lbl}>Phone / WhatsApp *</label>
                <input name="phone" value={form.phone} onChange={handle} required placeholder="+1 876..." style={inp}/>
              </div>
              <div>
                <label style={lbl}>Guests</label>
                <select name="guests" value={form.guests} onChange={handle} style={{ ...inp, cursor:'pointer' }}>
                  {['1','2','3','4'].map(n => <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={lbl}>Special Requests</label>
              <textarea name="specialRequests" value={form.specialRequests} onChange={handle} rows={3} placeholder="Any special requests, dietary needs, etc." style={{ ...inp, resize:'vertical' }}/>
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button type="submit" disabled={loading} style={{ flex:1, background:'#C9933A', color:'#fff', border:'none', padding:'13px', fontSize:13, fontWeight:700, cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1, letterSpacing:'0.05em' }}>
                {loading ? 'Sending...' : 'CONFIRM BOOKING'}
              </button>
              <a href={`https://wa.me/18762689319?text=Hi! I'd like to book ${room?.name} from ${checkin} to ${checkout} for ${nights} nights.`} target="_blank" rel="noreferrer"
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:'#25D366', color:'#fff', padding:'13px 16px', fontSize:12, fontWeight:600, borderRadius:4, textDecoration:'none', whiteSpace:'nowrap' }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413z"/><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.07-1.35C8.46 21.51 10.19 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
                WhatsApp
              </a>
            </div>
            <p style={{ fontSize:11, color:'#999', textAlign:'center', marginTop:12 }}>We'll confirm your booking within 24 hours via email & WhatsApp.</p>
          </form>
        )}
      </div>
    </div>
  );
}
