import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AccommodationsPage from './pages/AccommodationsPage';
import ServicesPage from './pages/ServicesPage';
import ManagePage from './pages/ManagePage';
import GalleryPage from './pages/GalleryPage';
import ReviewsPage from './pages/ReviewsPage';
import ContactPage from './pages/ContactPage';
import AttractionsPage from './pages/AttractionsPage';
import ThingsToDoPage from './pages/ThingsToDoPage';

// Admin pages
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminCalendar from './admin/AdminCalendar';
import AdminBookings from './admin/AdminBookings';
import AdminRooms from './admin/AdminRooms';
import AdminGallery from './admin/AdminGallery';
import AdminReviews from './admin/AdminReviews';
import AdminLeads from './admin/AdminLeads';
import AdminManagementApps from './admin/AdminManagementApps';
import AdminManagedProperties from './admin/AdminManagedProperties';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontFamily:"'Poppins',sans-serif", color:'#C9933A' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:'#1A2540', marginBottom:8 }}>SUNSET RETREAT JA</div>
        <div style={{ fontSize:13, color:'#C9933A' }}>Loading...</div>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/admin/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { fontFamily:"'Poppins',sans-serif", fontSize:13, borderRadius:4 }, success: { iconTheme: { primary:'#C9933A', secondary:'#fff' } } }} />
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/accommodations" element={<AccommodationsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/manage" element={<ManagePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/attractions" element={<AttractionsPage />} />
          <Route path="/things-to-do" element={<ThingsToDoPage />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="calendar" element={<AdminCalendar />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="rooms" element={<AdminRooms />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="management-apps" element={<AdminManagementApps />} />
            <Route path="managed-properties" element={<AdminManagedProperties />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
