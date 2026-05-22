import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{ position:'fixed', bottom:32, right:28, zIndex:9999, width:46, height:46, background:'#C9933A', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(201,147,58,0.45)', opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(14px)', pointerEvents:visible?'auto':'none', transition:'all 0.35s ease', borderRadius:'50%' }}>
      <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="18,15 12,9 6,15"/></svg>
    </button>
  );
}
