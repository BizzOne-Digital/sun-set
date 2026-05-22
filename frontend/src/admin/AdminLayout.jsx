import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to:'/admin', end:true, label:'Dashboard', icon:<svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { to:'/admin/bookings', label:'Bookings', icon:<svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { to:'/admin/calendar', label:'Calendar', icon:<svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/><circle cx="8" cy="16" r="1" fill="currentColor"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg> },
  { to:'/admin/rooms', label:'Rooms', icon:<svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg> },
  { to:'/admin/gallery', label:'Gallery', icon:<svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg> },
  { to:'/admin/reviews', label:'Reviews', icon:<svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg> },
  { to:'/admin/leads', label:'Leads', icon:<svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { to:'/admin/management-apps', label:'Mgmt Applications', icon:<svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg> },
  { to:'/admin/managed-properties', label:'Managed Properties', icon:<svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M1 22V9l11-7 11 7v13H1z"/><path d="M9 22V12h6v10"/></svg> },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#F5F3EE', fontFamily:"'Poppins',sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: collapsed?60:230, minHeight:'100vh', background:'#0E1729', display:'flex', flexDirection:'column', transition:'width 0.3s', overflow:'hidden', flexShrink:0, position:'sticky', top:0, height:'100vh' }}>
        <div style={{ padding: collapsed?'18px 0':'20px 16px', borderBottom:'1px solid rgba(201,147,58,0.15)', display:'flex', alignItems:'center', justifyContent:collapsed?'center':'flex-start', gap:10, minHeight:64 }}>
          {!collapsed && <div><div style={{fontSize:13,fontWeight:700,color:'#fff',fontFamily:"'Playfair Display',serif",letterSpacing:'0.05em'}}>SUNSET RETREAT</div><div style={{fontSize:9,color:'#C9933A',letterSpacing:'0.2em'}}>ADMIN</div></div>}
          {collapsed && <div style={{width:28,height:28,background:'rgba(201,147,58,0.2)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="14" height="14" fill="none" stroke="#C9933A" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div>}
        </div>
        <nav style={{ flex:1, padding:'10px 0', overflowY:'auto' }}>
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end} style={({isActive})=>({
              display:'flex', alignItems:'center', gap:10,
              padding: collapsed?'11px 0':'10px 16px',
              justifyContent: collapsed?'center':'flex-start',
              color: isActive?'#C9933A':'rgba(255,255,255,0.5)',
              background: isActive?'rgba(201,147,58,0.1)':'transparent',
              borderLeft: isActive?'2px solid #C9933A':'2px solid transparent',
              fontSize:12.5, fontWeight: isActive?600:400,
              transition:'all 0.2s', textDecoration:'none', whiteSpace:'nowrap',
            })}>
              {item.icon}
              {!collapsed && item.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ borderTop:'1px solid rgba(201,147,58,0.15)', padding: collapsed?'12px 0':'12px 16px' }}>
          {!collapsed && <div style={{marginBottom:10}}><p style={{fontSize:12,color:'#fff',fontWeight:500}}>{user?.name}</p><p style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>{user?.email}</p></div>}
          <div style={{ display:'flex', justifyContent:collapsed?'center':'space-between', alignItems:'center' }}>
            <button onClick={()=>setCollapsed(!collapsed)} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.4)',padding:4,display:'flex'}}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{collapsed?<path d="M9 18l6-6-6-6"/>:<path d="M15 18l-6-6 6-6"/>}</svg>
            </button>
            {!collapsed && <button onClick={handleLogout} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.4)',fontSize:11,display:'flex',alignItems:'center',gap:4,padding:4}}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout
            </button>}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
        <div style={{ background:'#fff', borderBottom:'1px solid #E8E0D0', padding:'0 28px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 }}>
          <span style={{fontSize:13,color:'#888'}}>Welcome, <span style={{color:'#1A2540',fontWeight:600}}>{user?.name}</span></span>
          <a href="/" target="_blank" rel="noreferrer" style={{fontSize:12,color:'#C9933A',display:'flex',alignItems:'center',gap:4}}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            View Website
          </a>
        </div>
        <div style={{ padding:28, flex:1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
