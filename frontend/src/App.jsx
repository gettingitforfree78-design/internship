import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Internships from './pages/Internships';
import Companies from './pages/Companies';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import ApplicationForm from './pages/ApplicationForm';
import PaymentPage from './pages/PaymentPage';
import SuccessPage from './pages/SuccessPage';

// Spinner
const Spinner = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="spinner" />
  </div>
);

// Protected route — must be logged in
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner />;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin-only route
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

// Layout wrapper
const Layout = ({ children, noFooter = false }) => (
  <>
    <Navbar />
    <main>{children}</main>
    {!noFooter && <Footer />}
  </>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/internships" element={<Layout><Internships /></Layout>} />
      <Route path="/companies" element={<Layout><Companies /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/login" element={<Layout noFooter><Login /></Layout>} />
      <Route path="/signup" element={<Layout noFooter><Signup /></Layout>} />

      {/* Protected — student */}
      <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
      <Route path="/apply" element={<PrivateRoute><Layout noFooter><ApplicationForm /></Layout></PrivateRoute>} />
      <Route path="/payment" element={<PrivateRoute><Layout noFooter><PaymentPage /></Layout></PrivateRoute>} />
      <Route path="/success" element={<PrivateRoute><Layout noFooter><SuccessPage /></Layout></PrivateRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><Layout><Admin /></Layout></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', fontSize: '0.9rem' },
            success: { iconTheme: { primary: '#FF6B35', secondary: '#fff' } },
            duration: 4000,
          }}
        />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
