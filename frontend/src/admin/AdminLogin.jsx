import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch {
      toast.error('Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#0E1729', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      {/* BG pattern */}
      <div style={{ position:'fixed', inset:0, backgroundImage:`url(https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1400&q=60)`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.12 }}/>

      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:420 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'#fff', marginBottom:4 }}>SUNSET RETREAT JA</div>
          <div style={{ fontSize:11, letterSpacing:'0.2em', color:'#C9933A', textTransform:'uppercase' }}>Admin Portal</div>
        </div>

        <form onSubmit={submit} style={{ background:'rgba(255,255,255,0.97)', padding:'36px 32px', boxShadow:'0 24px 80px rgba(0,0,0,0.4)' }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:'#1A2540', marginBottom:24, fontWeight:700 }}>Sign In</h2>
          
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#888', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Email Address</label>
            <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required placeholder="admin@sunsetretreatja.com"
              style={{ width:'100%', padding:'12px 14px', border:'1px solid #E0D8CC', fontSize:13, outline:'none', fontFamily:"'Poppins',sans-serif", borderRadius:4, transition:'border 0.2s' }}
              onFocus={e=>e.target.style.borderColor='#C9933A'} onBlur={e=>e.target.style.borderColor='#E0D8CC'}/>
          </div>
          
          <div style={{ marginBottom:24 }}>
            <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#888', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Password</label>
            <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required placeholder="••••••••"
              style={{ width:'100%', padding:'12px 14px', border:'1px solid #E0D8CC', fontSize:13, outline:'none', fontFamily:"'Poppins',sans-serif", borderRadius:4, transition:'border 0.2s' }}
              onFocus={e=>e.target.style.borderColor='#C9933A'} onBlur={e=>e.target.style.borderColor='#E0D8CC'}/>
          </div>
          
          <button type="submit" disabled={loading}
            style={{ width:'100%', background:'#C9933A', color:'#fff', border:'none', padding:'13px', fontSize:13, fontWeight:700, cursor:loading?'not-allowed':'pointer', letterSpacing:'0.08em', opacity:loading?0.75:1, fontFamily:"'Poppins',sans-serif", borderRadius:4, transition:'background 0.2s' }}
            onMouseEnter={e=>{if(!loading)e.target.style.background='#b8821f'}} onMouseLeave={e=>e.target.style.background='#C9933A'}>
            {loading ? 'Signing in...' : 'SIGN IN'}
          </button>
          
          <a href="/" style={{ display:'block', textAlign:'center', marginTop:20, fontSize:12, color:'#999', textDecoration:'none' }}>← Back to Website</a>
        </form>
      </div>
    </div>
  );
}
