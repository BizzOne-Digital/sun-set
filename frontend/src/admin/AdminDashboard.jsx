import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Card = ({label, value, sub, color='#C9933A', icon}) => (
  <div style={{background:'#fff',border:'1px solid #EDE8E0',padding:'22px 24px',position:'relative',overflow:'hidden',borderRadius:6}}>
    <div style={{position:'absolute',top:0,left:0,width:3,height:'100%',background:color}}/>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
      <div>
        <p style={{fontSize:11,letterSpacing:'0.12em',textTransform:'uppercase',color:'#999',marginBottom:8}}>{label}</p>
        <p style={{fontFamily:"'Playfair Display',serif",fontSize:38,fontWeight:700,color:'#1A2540',lineHeight:1}}>{value}</p>
        {sub&&<p style={{fontSize:12,color:color,marginTop:6}}>{sub}</p>}
      </div>
      <div style={{color,opacity:0.2,fontSize:40}}>{icon}</div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total:0, confirmed:0, pending:0, revenue:0 });
  const [bookings, setBookings] = useState([]);
  const [leads, setLeads] = useState([]);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    api.get('/api/bookings/stats').then(r=>setStats(r.data)).catch(()=>{});
    api.get('/api/bookings').then(r=>setBookings(r.data.slice(0,6))).catch(()=>{});
    api.get('/api/leads').then(r=>setLeads(r.data.slice(0,5))).catch(()=>{});
    api.get('/api/management-applications').then(r=>setApps(r.data.slice(0,3))).catch(()=>{});
  }, []);

  const statusColor = {pending:'#FAEEDA',confirmed:'#EAF3DE',cancelled:'#FCEBEB',completed:'#E6F1FB'};
  const statusText = {pending:'#633806',confirmed:'#27500A',cancelled:'#C62828',completed:'#0C447C'};

  return (
    <div>
      <div style={{marginBottom:28}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:32,color:'#1A2540',fontWeight:700}}>Dashboard</h1>
        <p style={{fontSize:13,color:'#999',marginTop:4}}>Sunset Retreat JA Admin Panel</p>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:32}}>
        <Card label="Total Bookings" value={stats.total} sub={`${stats.pending} pending`} color="#C9933A" icon="📅"/>
        <Card label="Confirmed" value={stats.confirmed} sub="Active bookings" color="#2E7D32" icon="✓"/>
        <Card label="Pending" value={stats.pending} sub="Awaiting confirmation" color="#E65100" icon="⏳"/>
        <Card label="Revenue" value={`$${stats.revenue.toLocaleString()}`} sub="Confirmed & paid" color="#1565C0" icon="💰"/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
        {/* Recent Bookings */}
        <div style={{background:'#fff',border:'1px solid #EDE8E0',borderRadius:6,overflow:'hidden'}}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid #EDE8E0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:'#1A2540',fontWeight:700}}>Recent Bookings</h3>
            <Link to="/admin/bookings" style={{fontSize:12,color:'#C9933A'}}>View all →</Link>
          </div>
          {bookings.length === 0
            ? <div style={{padding:'32px 20px',textAlign:'center',color:'#aaa',fontSize:13}}>No bookings yet</div>
            : bookings.map(b=>(
              <div key={b._id} style={{padding:'12px 20px',borderBottom:'1px solid #F5F0E8',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <p style={{fontSize:13,fontWeight:600,color:'#1A2540'}}>{b.name}</p>
                  <p style={{fontSize:11,color:'#999',marginTop:1}}>{b.checkin?new Date(b.checkin).toLocaleDateString('en-GB',{day:'numeric',month:'short'}):'-'} → {b.checkout?new Date(b.checkout).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'-'}</p>
                </div>
                <span style={{background:statusColor[b.status]||'#F1EFE8',color:statusText[b.status]||'#444',fontSize:10,fontWeight:600,padding:'3px 10px',borderRadius:20,textTransform:'capitalize'}}>{b.status}</span>
              </div>
            ))
          }
        </div>

        {/* Recent Leads */}
        <div style={{background:'#fff',border:'1px solid #EDE8E0',borderRadius:6,overflow:'hidden'}}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid #EDE8E0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:'#1A2540',fontWeight:700}}>Recent Leads</h3>
            <Link to="/admin/leads" style={{fontSize:12,color:'#C9933A'}}>View all →</Link>
          </div>
          {leads.length === 0
            ? <div style={{padding:'32px 20px',textAlign:'center',color:'#aaa',fontSize:13}}>No leads yet</div>
            : leads.map(l=>(
              <div key={l._id} style={{padding:'12px 20px',borderBottom:'1px solid #F5F0E8',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <p style={{fontSize:13,fontWeight:600,color:'#1A2540'}}>{l.name}</p>
                  <p style={{fontSize:11,color:'#999',marginTop:1}}>{l.email}</p>
                </div>
                <span style={{background:l.status==='new'?'#E6F1FB':'#EAF3DE',color:l.status==='new'?'#0C447C':'#27500A',fontSize:10,fontWeight:600,padding:'3px 10px',borderRadius:20,textTransform:'capitalize'}}>{l.status}</span>
              </div>
            ))
          }
        </div>
      </div>

      {/* Mgmt Applications */}
      {apps.length > 0 && (
        <div style={{background:'#fff',border:'1px solid #EDE8E0',borderRadius:6,overflow:'hidden'}}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid #EDE8E0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:'#1A2540',fontWeight:700}}>New Management Applications</h3>
            <Link to="/admin/management-apps" style={{fontSize:12,color:'#C9933A'}}>View all →</Link>
          </div>
          {apps.map(a=>(
            <div key={a._id} style={{padding:'12px 20px',borderBottom:'1px solid #F5F0E8',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <p style={{fontSize:13,fontWeight:600,color:'#1A2540'}}>{a.ownerName} — {a.propertyAddress||'Property'}</p>
                <p style={{fontSize:11,color:'#999',marginTop:1}}>{a.email} · {a.phone}</p>
              </div>
              <span style={{background:'#E6F1FB',color:'#0C447C',fontSize:10,fontWeight:600,padding:'3px 10px',borderRadius:20,textTransform:'capitalize'}}>{a.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div style={{marginTop:20,background:'#fff',border:'1px solid #EDE8E0',borderRadius:6,padding:'20px 24px'}}>
        <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:'#1A2540',marginBottom:14,fontWeight:700}}>Quick Actions</h3>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          {[{to:'/admin/calendar',label:'Manage Calendar',c:'#1A2540'},{to:'/admin/bookings',label:'All Bookings',c:'#C9933A'},{to:'/admin/rooms',label:'Edit Rooms',c:'#2E7D32'},{to:'/admin/reviews',label:'Approve Reviews',c:'#1565C0'},{to:'/admin/gallery',label:'Manage Gallery',c:'#6A1B9A'},{to:'/admin/management-apps',label:'Mgmt Applications',c:'#E65100'}].map(a=>(
            <Link key={a.to} to={a.to} style={{background:a.c,color:'#fff',padding:'9px 18px',fontSize:12,fontWeight:600,letterSpacing:'0.05em',display:'inline-flex',alignItems:'center',gap:6,textDecoration:'none',borderRadius:4,transition:'opacity 0.2s'}} onMouseEnter={e=>e.currentTarget.style.opacity=0.85} onMouseLeave={e=>e.currentTarget.style.opacity=1}>
              {a.label} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
