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

export default function AvailabilityChecker({ roomId, pricePerNight, onBook }) {
  const today = new Date(); today.setHours(0,0,0,0);

  const [viewDate, setViewDate] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [unavailable, setUnavailable] = useState(new Set());
  const [checkin, setCheckin] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [hovering, setHovering] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setLoading(true);
    setCheckin(null); setCheckout(null); setResult(null);
    api.get('/api/bookings/unavailable-dates', { params: { roomId } })
      .then(r => setUnavailable(new Set(r.data.dates)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [roomId]);

  // Auto-refresh every 30 seconds to catch admin blocks
  useEffect(() => {
    const interval = setInterval(() => {
      api.get("/api/bookings/unavailable-dates", { params: { roomId } })
        .then(r => setUnavailable(new Set(r.data.dates)))
        .catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [roomId]);

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
      const r = await api.post('/api/bookings/check-availability', { checkin, checkout, roomId });
      setResult(r.data);
    } catch { toast.error('Could not check availability'); }
    finally { setChecking(false); }
  };

  const nights = (checkin && checkout) ? Math.ceil((parseDate(checkout) - parseDate(checkin)) / 86400000) : 0;

  const { y, m } = viewDate;
  const cells = [];
  for (let i = 0; i < firstDay(y, m); i++) cells.push(null);
  for (let d = 1; d <= daysInMonth(y, m); d++) cells.push(d);

  const prevMonth = () => setViewDate(v => v.m === 0 ? { y: v.y-1, m: 11 } : { y: v.y, m: v.m-1 });
  const nextMonth = () => setViewDate(v => v.m === 11 ? { y: v.y+1, m: 0 } : { y: v.y, m: v.m+1 });

  const getDayStyle = s => {
    const base = { textAlign:'center', padding:'7px 2px', fontSize:13, cursor:'pointer', background:'#fff', transition:'all 0.15s', userSelect:'none' };
    if (!s) return { ...base, cursor:'default', background:'transparent' };
    if (isPast(s)) return { ...base, color:'#ccc', cursor:'not-allowed' };
    if (isUnavailable(s)) return { ...base, background:'#FFF0F0', color:'#EE8888', cursor:'not-allowed', textDecoration:'line-through' };
    if (s === checkin) return { ...base, background:'#1A2540', color:'#fff', fontWeight:700 };
    if (s === checkout) return { ...base, background:'#C9933A', color:'#fff', fontWeight:700 };
    if (inRange(s)) return { ...base, background:'rgba(201,147,58,0.15)', color:'#1A2540' };
    return { ...base, color:'#333' };
  };

  return (
    <div style={{ fontFamily:"'Poppins',sans-serif", border:'1px solid #E8E0D0', borderRadius:6, overflow:'hidden', background:'#fff', boxShadow:'0 4px 20px rgba(0,0,0,0.08)' }}>

      {/* Legend */}
      <div style={{ display:'flex', gap:12, padding:'8px 14px', background:'#F9F5EE', borderBottom:'1px solid #E8E0D0', flexWrap:'wrap' }}>
        {[['#1A2540','#fff','Check-in'],['#C9933A','#fff','Check-out'],['rgba(201,147,58,0.15)','#333','Selected'],['#FFF0F0','#EE8888','Unavailable']].map(([bg,c,l]) => (
          <div key={l} style={{ display:'flex', alignItems:'center', gap:4 }}>
            <div style={{ width:12, height:12, background:bg, borderRadius:2, border:'1px solid rgba(0,0,0,0.08)' }}/>
            <span style={{ fontSize:10, color:'#777' }}>{l}</span>
          </div>
        ))}
      </div>

      {/* Header */}
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
        ? <div style={{ padding:28, textAlign:'center', color:'#C9933A', fontSize:13 }}>Loading availability...</div>
        : <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:1, padding:'4px' }}>
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

      {/* Footer */}
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

        {nights > 0 && pricePerNight && (
          <div style={{ background:'rgba(201,147,58,0.08)', border:'1px solid rgba(201,147,58,0.2)', padding:'7px 10px', marginBottom:8, borderRadius:4, display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontSize:12, color:'#555' }}>{nights} night{nights>1?'s':''} × ${pricePerNight}</span>
            <span style={{ fontSize:14, fontWeight:700, color:'#1A2540' }}>${(nights * pricePerNight).toLocaleString()}</span>
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
            <button onClick={() => onBook && onBook({ checkin, checkout, nights, total: nights * (pricePerNight||0) })}
              style={{ flex:1, background:'#C9933A', color:'#fff', border:'none', padding:'10px', fontSize:11, fontWeight:600, cursor:'pointer', letterSpacing:'0.05em', fontFamily:"'Poppins',sans-serif", borderRadius:4 }}>
              BOOK NOW
            </button>
          )}
        </div>
      </div>
    </div>
  );
}