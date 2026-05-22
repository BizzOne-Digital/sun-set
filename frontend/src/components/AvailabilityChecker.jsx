import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

// Days in month
function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function firstDay(y, m) { return new Date(y, m, 1).getDay(); }
function pad(n) { return String(n).padStart(2, '0'); }
function fmt(d) { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function parseDate(s) { const [y,m,d] = s.split('-').map(Number); return new Date(y,m-1,d); }

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

export default function AvailabilityChecker({ roomId, pricePerNight, onBook, compact = false }) {
  const today = new Date();
  today.setHours(0,0,0,0);

  const [viewDate, setViewDate] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [unavailable, setUnavailable] = useState(new Set());
  const [checkin, setCheckin] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [hovering, setHovering] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  // Fetch unavailable dates from backend
  useEffect(() => {
    setLoading(true);
    api.get('/api/bookings/unavailable-dates', { params: { roomId } })
      .then(r => {
        setUnavailable(new Set(r.data.dates));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [roomId]);

  const isUnavailable = (dateStr) => unavailable.has(dateStr);
  const isPast = (dateStr) => parseDate(dateStr) < today;
  const isDisabled = (dateStr) => isPast(dateStr) || isUnavailable(dateStr);

  const inRange = (dateStr) => {
    if (!checkin) return false;
    const end = checkout || hovering;
    if (!end) return false;
    const d = parseDate(dateStr);
    const s = parseDate(checkin);
    const e = parseDate(end);
    return d > s && d < e;
  };

  const handleDayClick = (dateStr) => {
    if (isDisabled(dateStr)) return;
    if (!checkin || (checkin && checkout)) {
      setCheckin(dateStr);
      setCheckout(null);
      setResult(null);
    } else {
      if (dateStr <= checkin) { setCheckin(dateStr); setCheckout(null); return; }
      // Check no blocked dates in range
      const s = parseDate(checkin);
      const e = parseDate(dateStr);
      let d = new Date(s); d.setDate(d.getDate() + 1);
      while (d < e) {
        if (isUnavailable(fmt(d))) {
          toast.error('Some dates in this range are not available. Please select different dates.');
          return;
        }
        d.setDate(d.getDate() + 1);
      }
      setCheckout(dateStr);
    }
  };

  const checkAvailability = async () => {
    if (!checkin || !checkout) return toast.error('Please select check-in and check-out dates');
    setChecking(true);
    try {
      const r = await api.post('/api/bookings/check-availability', { checkin, checkout, roomId });
      setResult(r.data);
    } catch {
      toast.error('Could not check availability');
    } finally { setChecking(false); }
  };

  const nights = (checkin && checkout) ? Math.ceil((parseDate(checkout) - parseDate(checkin)) / 86400000) : 0;

  // Build calendar
  const { y, m } = viewDate;
  const totalDays = daysInMonth(y, m);
  const startDay = firstDay(y, m);
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  const prevMonth = () => setViewDate(v => v.m === 0 ? { y: v.y-1, m: 11 } : { y: v.y, m: v.m-1 });
  const nextMonth = () => setViewDate(v => v.m === 11 ? { y: v.y+1, m: 0 } : { y: v.y, m: v.m+1 });

  const s = { // styles
    wrap:       { fontFamily:"'Poppins',sans-serif", border:'1px solid #E8E0D0', borderRadius:6, overflow:'hidden', background:'#fff', boxShadow:'0 4px 20px rgba(0,0,0,0.08)' },
    header:     { background:'#1A2540', padding:'14px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' },
    headerTxt:  { color:'#fff', fontWeight:600, fontSize:14 },
    navBtn:     { background:'none', border:'1px solid rgba(255,255,255,0.3)', color:'#fff', width:28, height:28, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:4, transition:'all 0.2s' },
    dayNames:   { display:'grid', gridTemplateColumns:'repeat(7,1fr)', background:'#F9F5EE', borderBottom:'1px solid #E8E0D0' },
    dayName:    { textAlign:'center', fontSize:11, fontWeight:600, color:'#888', padding:'8px 0' },
    grid:       { display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:1, background:'#E8E0D0', padding:1 },
  };

  const getDayStyle = (dateStr) => {
    const base = { textAlign:'center', padding:'8px 4px', fontSize:13, cursor:'pointer', background:'#fff', transition:'all 0.15s', position:'relative', userSelect:'none' };
    if (!dateStr) return { ...base, cursor:'default', background:'#FAFAF8' };
    if (isPast(dateStr)) return { ...base, color:'#ccc', cursor:'not-allowed', background:'#FAFAF8' };
    if (isUnavailable(dateStr)) return { ...base, background:'#FFF0F0', color:'#EE8888', cursor:'not-allowed', textDecoration:'line-through' };
    if (dateStr === checkin) return { ...base, background:'#1A2540', color:'#fff', fontWeight:700 };
    if (dateStr === checkout) return { ...base, background:'#C9933A', color:'#fff', fontWeight:700 };
    if (inRange(dateStr)) return { ...base, background:'rgba(201,147,58,0.12)', color:'#1A2540' };
    return { ...base, color:'#333' };
  };

  return (
    <div>
      <div style={s.wrap}>
        {/* Legend */}
        <div style={{ display:'flex', gap:16, padding:'10px 14px', background:'#F9F5EE', borderBottom:'1px solid #E8E0D0', flexWrap:'wrap' }}>
          {[['#1A2540','#fff','Check-in'],['#C9933A','#fff','Check-out'],['rgba(201,147,58,0.15)','#333','Selected Range'],['#FFF0F0','#EE8888','Unavailable / Booked']].map(([bg,c,l]) => (
            <div key={l} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <div style={{ width:14, height:14, background:bg, borderRadius:2, border:'1px solid rgba(0,0,0,0.1)' }}/>
              <span style={{ fontSize:11, color:'#777' }}>{l}</span>
            </div>
          ))}
        </div>

        {/* Calendar header */}
        <div style={s.header}>
          <button style={s.navBtn} onClick={prevMonth}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>
          </button>
          <span style={s.headerTxt}>{MONTHS[m]} {y}</span>
          <button style={s.navBtn} onClick={nextMonth}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6"/></svg>
          </button>
        </div>

        {/* Day names */}
        <div style={s.dayNames}>{DAYS.map(d => <div key={d} style={s.dayName}>{d}</div>)}</div>

        {/* Calendar grid */}
        {loading
          ? <div style={{ padding:40, textAlign:'center', color:'#C9933A', fontSize:14 }}>Loading availability...</div>
          : <div style={s.grid}>
              {cells.map((day, i) => {
                const dateStr = day ? `${y}-${pad(m+1)}-${pad(day)}` : null;
                return (
                  <div key={i} style={getDayStyle(dateStr)}
                    onClick={() => dateStr && handleDayClick(dateStr)}
                    onMouseEnter={() => { if(dateStr && checkin && !checkout && !isPast(dateStr) && !isUnavailable(dateStr)) setHovering(dateStr); }}
                    onMouseLeave={() => setHovering(null)}
                  >
                    {day || ''}
                  </div>
                );
              })}
            </div>
        }

        {/* Selection summary */}
        <div style={{ padding:'14px 16px', background:'#F9F5EE', borderTop:'1px solid #E8E0D0' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
            <div>
              <div style={{ fontSize:10, fontWeight:600, color:'#888', letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:3 }}>Check-in</div>
              <div style={{ fontSize:14, fontWeight:600, color: checkin ? '#1A2540' : '#bbb' }}>{checkin || 'Select date'}</div>
            </div>
            <div>
              <div style={{ fontSize:10, fontWeight:600, color:'#888', letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:3 }}>Check-out</div>
              <div style={{ fontSize:14, fontWeight:600, color: checkout ? '#1A2540' : '#bbb' }}>{checkout || 'Select date'}</div>
            </div>
          </div>

          {nights > 0 && pricePerNight && (
            <div style={{ background:'rgba(201,147,58,0.08)', border:'1px solid rgba(201,147,58,0.2)', padding:'8px 12px', marginBottom:10, borderRadius:4, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:13, color:'#555' }}>{nights} night{nights>1?'s':''} × ${pricePerNight}/night</span>
              <span style={{ fontSize:15, fontWeight:700, color:'#1A2540' }}>${(nights * pricePerNight).toLocaleString()}</span>
            </div>
          )}

          {result && (
            <div style={{ marginBottom:10, padding:'8px 12px', borderRadius:4, background: result.available ? '#EAF3DE' : '#FCEBEB', border:`1px solid ${result.available ? '#C5E1A5' : '#FFCCCC'}` }}>
              <p style={{ fontSize:13, fontWeight:600, color: result.available ? '#2E7D32' : '#C62828' }}>
                {result.available ? `✓ Available! ${nights} nights` : '✗ ' + result.conflict}
              </p>
            </div>
          )}

          <div style={{ display:'flex', gap:8 }}>
            <button onClick={checkAvailability} disabled={!checkin || !checkout || checking}
              style={{ flex:1, background:'#1A2540', color:'#fff', border:'none', padding:'11px', fontSize:12, fontWeight:600, cursor:(!checkin||!checkout||checking)?'not-allowed':'pointer', opacity:(!checkin||!checkout)?0.5:1, transition:'all 0.2s', letterSpacing:'0.05em' }}>
              {checking ? 'Checking...' : 'CHECK AVAILABILITY'}
            </button>
            {result?.available && (
              <button onClick={() => onBook && onBook({ checkin, checkout, nights, total: nights * (pricePerNight||0) })}
                style={{ flex:1, background:'#C9933A', color:'#fff', border:'none', padding:'11px', fontSize:12, fontWeight:600, cursor:'pointer', transition:'all 0.2s', letterSpacing:'0.05em' }}>
                BOOK NOW
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
