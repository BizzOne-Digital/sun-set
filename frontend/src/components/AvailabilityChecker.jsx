import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function firstDay(y, m) { return new Date(y, m, 1).getDay(); }
function pad(n) { return String(n).padStart(2, '0'); }
function fmt(d) { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function parseDate(s) { const [y,m,d] = s.split('-').map(Number); return new Date(y,m-1,d); }

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

export default function AvailabilityChecker({ roomId, pricePerNight, onBook, rooms = [] }) {
  const today = new Date(); today.setHours(0,0,0,0);

  const [viewDate, setViewDate] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [unavailable, setUnavailable] = useState(new Set());
  const [checkin, setCheckin] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [hovering, setHovering] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [activeRoomId, setActiveRoomId] = useState(roomId);

  // Fetch unavailable dates whenever room changes
  useEffect(() => {
    setLoading(true);
    setCheckin(null); setCheckout(null); setResult(null);
    api.get('/api/bookings/unavailable-dates', { params: { roomId: activeRoomId } })
      .then(r => setUnavailable(new Set(r.data.dates)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeRoomId]);

  // If roomId prop changes (parent update), sync it
  useEffect(() => { if (roomId) setActiveRoomId(roomId); }, [roomId]);

  const isUnavailable = s => unavailable.has(s);
  const isPast = s => parseDate(s) < today;
  const isDisabled = s => isPast(s) || isUnavailable(s);

  const inRange = s => {
    if (!checkin) return false;
    const end = checkout || hovering;
    if (!end) return false;
    const d = parseDate(s), st = parseDate(checkin), en = parseDate(end);
    return d > st && d < en;
  };

  const handleDay = s => {
    if (isDisabled(s)) return;
    if (!checkin || (checkin && checkout)) {
      setCheckin(s); setCheckout(null); setResult(null);
    } else {
      if (s <= checkin) { setCheckin(s); setCheckout(null); return; }
      // Check no blocked dates in range
      const st = parseDate(checkin), en = parseDate(s);
      let d = new Date(st); d.setDate(d.getDate() + 1);
      while (d < en) {
        if (isUnavailable(fmt(d))) {
          toast.error('Some dates in this range are not available.');
          return;
        }
        d.setDate(d.getDate() + 1);
      }
      setCheckout(s);
    }
  };

  const checkAvailability = async () => {
    if (!checkin || !checkout) return toast.error('Please select check-in and check-out dates');
    setChecking(true);
    try {
      const r = await api.post('/api/bookings/check-availability', { checkin, checkout, roomId: activeRoomId });
      setResult(r.data);
      if (!r.data.available) toast.error('These dates are not available. Please choose different dates.');
    } catch { toast.error('Could not check availability'); }
    finally { setChecking(false); }
  };

  const nights = (checkin && checkout) ? Math.ceil((parseDate(checkout) - parseDate(checkin)) / 86400000) : 0;
  const activePricePerNight = rooms.length > 0 ? (rooms.find(r => r._id === activeRoomId)?.pricePerNight || pricePerNight) : pricePerNight;

  const { y, m } = viewDate;
  const totalDays = daysInMonth(y, m);
  const startDay = firstDay(y, m);
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  const prevMonth = () => setViewDate(v => v.m === 0 ? { y: v.y-1, m: 11 } : { y: v.y, m: v.m-1 });
  const nextMonth = () => setViewDate(v => v.m === 11 ? { y: v.y+1, m: 0 } : { y: v.y, m: v.m+1 });

  const getDayStyle = s => {
    const base = { textAlign:'center', padding:'7px 2px', fontSize:13, cursor:'pointer', background:'#fff', transition:'all 0.15s', userSelect:'none', borderRadius:4 };
    if (!s) return { ...base, cursor:'default', background:'transparent' };
    if (isPast(s)) return { ...base, color:'#ccc', cursor:'not-allowed' };
    if (isUnavailable(s)) return { ...base, background:'#FFF0F0', color:'#EE8888', cursor:'not-allowed', textDecoration:'line-through', borderRadius:4 };
    if (s === checkin) return { ...base, background:'#1A2540', color:'#fff', fontWeight:700, borderRadius:4 };
    if (s === checkout) return { ...base, background:'#C9933A', color:'#fff', fontWeight:700, borderRadius:4 };
    if (inRange(s)) return { ...base, background:'rgba(201,147,58,0.15)', color:'#1A2540' };
    return { ...base, color:'#333' };
  };

  return (
    <div style={{ fontFamily:"'Poppins',sans-serif", border:'1px solid #E8E0D0', borderRadius:6, overflow:'hidden', background:'#fff', boxShadow:'0 4px 20px rgba(0,0,0,0.08)' }}>

      {/* Room selector — only show if multiple rooms passed */}
      {rooms.length > 1 && (
        <div style={{ padding:'10px 14px', background:'#F9F5EE', borderBottom:'1px solid #E8E0D0', display:'flex', gap:8 }}>
          {rooms.map(r => (
            <button key={r._id} onClick={() => setActiveRoomId(r._id)}
              style={{ flex:1, padding:'7px 10px', border:`1px solid ${activeRoomId===r._id?'#C9933A':'#E0D8CC'}`, background:activeRoomId===r._id?'#C9933A':'#fff', color:activeRoomId===r._id?'#fff':'#555', fontSize:11, fontWeight:600, cursor:'pointer', borderRadius:4, transition:'all 0.2s', fontFamily:"'Poppins',sans-serif" }}>
              {r.name}
            </button>
          ))}
        </div>
      )}

      {/* Legend */}
      <div style={{ display:'flex', gap:14, padding:'8px 14px', background:'#F9F5EE', borderBottom:'1px solid #E8E0D0', flexWrap:'wrap' }}>
        {[['#1A2540','Check-in'],['#C9933A','Check-out'],['rgba(201,147,58,0.15)','Selected'],['#FFF0F0','Unavailable']].map(([bg,l]) => (
          <div key={l} style={{ display:'flex', alignItems:'center', gap:4 }}>
            <div style={{ width:12, height:12, background:bg, borderRadius:2, border:'1px solid rgba(0,0,0,0.08)' }}/>
            <span style={{ fontSize:10, color:'#777' }}>{l}</span>
          </div>
        ))}
      </div>

      {/* Calendar header */}
      <div style={{ background:'#1A2540', padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <button onClick={prevMonth} style={{ background:'none', border:'1px solid rgba(255,255,255,0.3)', color:'#fff', width:28, height:28, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:4 }}>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>
        </button>
        <span style={{ color:'#fff', fontWeight:600, fontSize:14 }}>{MONTHS[m]} {y}</span>
        <button onClick={nextMonth} style={{ background:'none', border:'1px solid rgba(255,255,255,0.3)', color:'#fff', width:28, height:28, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:4 }}>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6"/></svg>
        </button>
      </div>

      {/* Day names */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', background:'#F9F5EE', borderBottom:'1px solid #E8E0D0' }}>
        {DAYS.map(d => <div key={d} style={{ textAlign:'center', fontSize:10, fontWeight:600, color:'#888', padding:'7px 0' }}>{d}</div>)}
      </div>

      {/* Grid */}
      {loading
        ? <div style={{ padding:32, textAlign:'center', color:'#C9933A', fontSize:13 }}>Loading availability...</div>
        : <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, padding:'6px' }}>
            {cells.map((day, i) => {
              const dateStr = day ? `${y}-${pad(m+1)}-${pad(day)}` : null;
              return (
                <div key={i} style={getDayStyle(dateStr)}
                  onClick={() => dateStr && handleDay(dateStr)}
                  onMouseEnter={() => { if (dateStr && checkin && !checkout && !isDisabled(dateStr)) setHovering(dateStr); }}
                  onMouseLeave={() => setHovering(null)}>
                  {day || ''}
                </div>
              );
            })}
          </div>
      }

      {/* Summary + Actions */}
      <div style={{ padding:'12px 14px', background:'#F9F5EE', borderTop:'1px solid #E8E0D0' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:600, color:'#888', textTransform:'uppercase', marginBottom:3 }}>Check-in</div>
            <div style={{ fontSize:13, fontWeight:600, color: checkin ? '#1A2540' : '#bbb' }}>{checkin || 'Select date'}</div>
          </div>
          <div>
            <div style={{ fontSize:10, fontWeight:600, color:'#888', textTransform:'uppercase', marginBottom:3 }}>Check-out</div>
            <div style={{ fontSize:13, fontWeight:600, color: checkout ? '#1A2540' : '#bbb' }}>{checkout || 'Select date'}</div>
          </div>
        </div>

        {nights > 0 && activePricePerNight && (
          <div style={{ background:'rgba(201,147,58,0.08)', border:'1px solid rgba(201,147,58,0.2)', padding:'7px 10px', marginBottom:8, borderRadius:4, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:12, color:'#555' }}>{nights} night{nights>1?'s':''} × ${activePricePerNight}</span>
            <span style={{ fontSize:14, fontWeight:700, color:'#1A2540' }}>${(nights * activePricePerNight).toLocaleString()}</span>
          </div>
        )}

        {result && (
          <div style={{ marginBottom:8, padding:'7px 10px', borderRadius:4, background: result.available ? '#EAF3DE' : '#FCEBEB', border:`1px solid ${result.available ? '#C5E1A5' : '#FFCCCC'}` }}>
            <p style={{ fontSize:12, fontWeight:600, color: result.available ? '#2E7D32' : '#C62828' }}>
              {result.available ? `✓ Available for ${nights} nights!` : '✗ These dates are already booked'}
            </p>
          </div>
        )}

        <div style={{ display:'flex', gap:8 }}>
          <button onClick={checkAvailability} disabled={!checkin || !checkout || checking}
            style={{ flex:1, background:'#1A2540', color:'#fff', border:'none', padding:'10px', fontSize:11, fontWeight:600, cursor:(!checkin||!checkout||checking)?'not-allowed':'pointer', opacity:(!checkin||!checkout)?0.5:1, letterSpacing:'0.05em', fontFamily:"'Poppins',sans-serif", borderRadius:4 }}>
            {checking ? 'Checking...' : 'CHECK AVAILABILITY'}
          </button>
          {result?.available && (
            <button onClick={() => onBook && onBook({ checkin, checkout, nights, total: nights * (activePricePerNight||0) })}
              style={{ flex:1, background:'#C9933A', color:'#fff', border:'none', padding:'10px', fontSize:11, fontWeight:600, cursor:'pointer', letterSpacing:'0.05em', fontFamily:"'Poppins',sans-serif", borderRadius:4 }}>
              BOOK NOW
            </button>
          )}
        </div>
      </div>
    </div>
  );
}