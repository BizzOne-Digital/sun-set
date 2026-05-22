import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function pad(n) { return String(n).padStart(2, '0'); }
function fmt(y, m, d) { return `${y}-${pad(m+1)}-${pad(d)}`; }

export default function AdminCalendar() {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [bookings, setBookings] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [mode, setMode] = useState('view'); // view | block | unblock
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const [blockReason, setBlockReason] = useState('Maintenance');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [b, bl, r] = await Promise.all([
        api.get('/api/bookings', { params: { month: view.m+1, year: view.y } }),
        api.get('/api/blocked-dates', { params: selectedRoom !== 'all' ? { roomId: selectedRoom } : {} }),
        api.get('/api/rooms/all'),
      ]);
      setBookings(b.data);
      setBlocked(bl.data);
      setRooms(r.data);
    } catch { toast.error('Failed to load calendar data'); }
  };

  useEffect(() => { fetchData(); }, [view, selectedRoom]);

  // Build date maps
  const bookedDates = {};
  bookings.forEach(b => {
    const d = new Date(b.checkin);
    while (d < new Date(b.checkout)) {
      const k = fmt(d.getFullYear(), d.getMonth(), d.getDate());
      if (!bookedDates[k]) bookedDates[k] = [];
      bookedDates[k].push(b);
      d.setDate(d.getDate() + 1);
    }
  });

  const blockedDates = {};
  blocked.forEach(b => {
    const k = new Date(b.date).toISOString().split('T')[0];
    blockedDates[k] = b;
  });

  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const firstDay = new Date(view.y, view.m, 1).getDay();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const blockRange = async () => {
    if (!rangeStart || !rangeEnd) return toast.error('Select start and end date');
    setLoading(true);
    try {
      await api.post('/api/blocked-dates/range', {
        startDate: rangeStart,
        endDate: rangeEnd,
        roomId: selectedRoom !== 'all' ? selectedRoom : undefined,
        reason: blockReason,
      });
      toast.success('Dates blocked successfully');
      setRangeStart(''); setRangeEnd('');
      fetchData();
    } catch { toast.error('Failed to block dates'); }
    finally { setLoading(false); }
  };

  const unblockDate = async (id) => {
    try {
      await api.delete(`/api/blocked-dates/${id}`);
      toast.success('Date unblocked');
      fetchData();
    } catch { toast.error('Failed to unblock'); }
  };

  const getDayStatus = (dateStr) => {
    if (bookedDates[dateStr]) return 'booked';
    if (blockedDates[dateStr]) return 'blocked';
    return 'available';
  };

  const getDayStyle = (status, isPast) => {
    const base = { textAlign:'center', padding:'6px 2px', fontSize:12, minHeight:52, display:'flex', flexDirection:'column', alignItems:'center', gap:2, border:'1px solid transparent', cursor:'pointer', transition:'all 0.15s', position:'relative' };
    if (!status) return { ...base, background:'#FAFAF8', cursor:'default' };
    if (isPast) return { ...base, background:'#F9F9F9', color:'#CCC' };
    if (status === 'booked') return { ...base, background:'rgba(201,147,58,0.12)', border:'1px solid rgba(201,147,58,0.3)' };
    if (status === 'blocked') return { ...base, background:'#FFF0F0', border:'1px solid #FFCCCC' };
    return { ...base, background:'#F0FFF4', border:'1px solid #C5E1A5' };
  };

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, color:'#1A2540', fontWeight:700 }}>Availability Calendar</h1>
        <p style={{ fontSize:13, color:'#888', marginTop:4 }}>Manage bookings, block & unblock dates</p>
      </div>

      {/* Controls */}
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:24, alignItems:'center' }}>
        <select value={selectedRoom} onChange={e=>setSelectedRoom(e.target.value)} style={{ padding:'8px 14px', border:'1px solid #E0D8CC', fontSize:13, fontFamily:"'Poppins',sans-serif", outline:'none', background:'#fff', borderRadius:4 }}>
          <option value="all">All Rooms</option>
          {rooms.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
        </select>
        <button onClick={()=>setView(v=>v.m===0?{y:v.y-1,m:11}:{y:v.y,m:v.m-1})} style={{ padding:'8px 16px', border:'1px solid #E0D8CC', background:'#fff', cursor:'pointer', borderRadius:4, fontSize:13 }}>‹ Prev</button>
        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:'#1A2540', minWidth:140, textAlign:'center' }}>{MONTHS[view.m]} {view.y}</span>
        <button onClick={()=>setView(v=>v.m===11?{y:v.y+1,m:0}:{y:v.y,m:v.m+1})} style={{ padding:'8px 16px', border:'1px solid #E0D8CC', background:'#fff', cursor:'pointer', borderRadius:4, fontSize:13 }}>Next ›</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:20 }}>
        {/* Calendar */}
        <div style={{ background:'#fff', border:'1px solid #E8E0D0', borderRadius:6, overflow:'hidden' }}>
          {/* Legend */}
          <div style={{ display:'flex', gap:20, padding:'10px 16px', background:'#F9F5EE', borderBottom:'1px solid #E8E0D0', flexWrap:'wrap' }}>
            {[['#F0FFF4','#2E7D32','Available'],['rgba(201,147,58,0.12)','#C9933A','Booked'],['#FFF0F0','#E53935','Blocked']].map(([bg,c,l])=>(
              <div key={l} style={{display:'flex',alignItems:'center',gap:6}}>
                <div style={{width:14,height:14,background:bg,border:`1px solid ${c}`,borderRadius:2}}/>
                <span style={{fontSize:11,color:'#777'}}>{l}</span>
              </div>
            ))}
          </div>
          {/* Day names */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', background:'#F9F5EE', borderBottom:'1px solid #E8E0D0' }}>
            {DAYS.map(d => <div key={d} style={{ textAlign:'center', fontSize:11, fontWeight:600, color:'#888', padding:'8px 0' }}>{d}</div>)}
          </div>
          {/* Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:1, background:'#E8E0D0', padding:1 }}>
            {cells.map((day, i) => {
              if (!day) return <div key={i} style={{ background:'#FAFAF8', minHeight:52 }}/>;
              const dateStr = fmt(view.y, view.m, day);
              const status = getDayStatus(dateStr);
              const isPast = new Date(dateStr) < new Date(new Date().toDateString());
              const dayBookings = bookedDates[dateStr] || [];
              return (
                <div key={i} style={getDayStyle(status, isPast)}>
                  <span style={{ fontSize:12, fontWeight:600, color: isPast?'#CCC':status==='booked'?'#C9933A':status==='blocked'?'#E53935':'#1A2540' }}>{day}</span>
                  {status === 'booked' && dayBookings.length > 0 && (
                    <span style={{ fontSize:9, background:'#C9933A', color:'#fff', padding:'1px 5px', borderRadius:10, maxWidth:'100%', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {dayBookings[0].name?.split(' ')[0]}
                    </span>
                  )}
                  {status === 'blocked' && blockedDates[dateStr] && (
                    <span style={{ fontSize:9, color:'#E53935' }}>Blocked</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Block Dates */}
          <div style={{ background:'#fff', border:'1px solid #E8E0D0', borderRadius:6, padding:'20px' }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:'#1A2540', marginBottom:16, fontWeight:700 }}>Block / Unblock Dates</h3>
            <div style={{ marginBottom:12 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#888', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.05em' }}>Start Date</label>
              <input type="date" value={rangeStart} onChange={e=>setRangeStart(e.target.value)} style={{ width:'100%', padding:'9px 12px', border:'1px solid #E0D8CC', fontSize:13, outline:'none', borderRadius:4 }}/>
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#888', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.05em' }}>End Date</label>
              <input type="date" value={rangeEnd} onChange={e=>setRangeEnd(e.target.value)} style={{ width:'100%', padding:'9px 12px', border:'1px solid #E0D8CC', fontSize:13, outline:'none', borderRadius:4 }}/>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#888', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.05em' }}>Reason</label>
              <select value={blockReason} onChange={e=>setBlockReason(e.target.value)} style={{ width:'100%', padding:'9px 12px', border:'1px solid #E0D8CC', fontSize:13, outline:'none', borderRadius:4, background:'#fff' }}>
                {['Maintenance','Personal Use','Renovation','Staff Access','Other'].map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <button onClick={blockRange} disabled={loading} style={{ width:'100%', background:'#E53935', color:'#fff', border:'none', padding:'11px', fontSize:12, fontWeight:600, cursor:'pointer', borderRadius:4, opacity:loading?0.7:1, letterSpacing:'0.05em' }}>
              {loading ? 'Blocking...' : 'BLOCK THESE DATES'}
            </button>
          </div>

          {/* Blocked dates list */}
          <div style={{ background:'#fff', border:'1px solid #E8E0D0', borderRadius:6, padding:'20px', maxHeight:300, overflow:'auto' }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:'#1A2540', marginBottom:14, fontWeight:700 }}>Blocked Dates</h3>
            {blocked.length === 0
              ? <p style={{ fontSize:13, color:'#aaa', textAlign:'center', padding:'20px 0' }}>No blocked dates</p>
              : blocked.slice().sort((a,b) => new Date(a.date)-new Date(b.date)).map(b => (
                <div key={b._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid #F5F0E8' }}>
                  <div>
                    <p style={{ fontSize:13, fontWeight:600, color:'#1A2540' }}>{new Date(b.date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</p>
                    <p style={{ fontSize:11, color:'#888' }}>{b.reason}</p>
                  </div>
                  <button onClick={() => unblockDate(b._id)} style={{ background:'none', border:'1px solid #FFCCCC', color:'#E53935', padding:'4px 10px', fontSize:11, cursor:'pointer', borderRadius:3 }}>Unblock</button>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
