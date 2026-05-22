import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

export default function ThingsToDoPage() {
  return (
    <>
      <Navbar /><ScrollToTop />
      <div style={{position:'relative',background:'#0E1729',padding:'80px 0',textAlign:'center',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:`url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=60)`,backgroundSize:'cover',backgroundPosition:'center',opacity:0.2}}/>
        <div className="container" style={{position:'relative',zIndex:1}}>
          <p className="section-label">Activities</p>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(32px,5vw,52px)',fontWeight:700,color:'#fff',marginTop:10}}>Things To Do</h1>
        </div>
      </div>
      <section className="section-pad" style={{textAlign:'center'}}>
        <div className="container">
          <h2 className="section-title" style={{marginBottom:12}}>Explore Ocho Rios</h2>
          <p style={{fontSize:14,color:'#666',marginBottom:32}}>Check our full attractions guide for all activities near Sunset Retreat JA.</p>
          <Link to="/attractions" className="btn-gold">VIEW ALL ATTRACTIONS</Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
