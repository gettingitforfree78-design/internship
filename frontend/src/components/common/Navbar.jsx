import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { FaRocket, FaBars, FaTimes } from 'react-icons/fa';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/internships', label: 'Internships' },
  { path: '/companies', label: 'Companies' },
  { path: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); setIsOpen(false); };

  return (
    <nav className="navbar">
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.5rem' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', background: 'linear-gradient(135deg, #FF6B35, #FF8C5A)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FaRocket style={{ color: '#fff', fontSize: '1rem' }} />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.0625rem', lineHeight: 1.2 }}>Launchpad</div>
              <div style={{ color: '#FF8C5A', fontSize: '0.6875rem', fontWeight: 500 }}>Intensive Pvt Ltd</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} style={{
                padding: '0.5rem 1rem', borderRadius: '0.625rem', fontSize: '0.9rem', fontWeight: 500,
                textDecoration: 'none', transition: 'all 0.2s',
                color: location.pathname === link.path ? '#FF6B35' : '#cbd5e1',
                background: location.pathname === link.path ? 'rgba(255,107,53,0.1)' : 'transparent',
              }}>{link.label}</Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="desktop-nav">
            {isAuthenticated ? (
              <>
                <Link to={isAdmin ? '/admin' : '/dashboard'} style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                  {isAdmin ? '⚙️ Admin' : 'Dashboard'}
                </Link>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Hi, {user?.name?.split(' ')[0]}</span>
                <button onClick={handleLogout} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, padding: '0.5rem 0.75rem' }}>Login</Link>
                <Link to="/signup" className="btn-primary" style={{ padding: '0.625rem 1.25rem', fontSize: '0.9rem' }}>Sign Up Free</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setIsOpen(!isOpen)} style={{ display: 'none', background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '1.375rem', padding: '0.5rem' }} className="mobile-toggle">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,22,40,0.97)' }}>
            <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} style={{
                  padding: '0.875rem 1rem', borderRadius: '0.625rem', fontSize: '0.9375rem', fontWeight: 500,
                  textDecoration: 'none', color: location.pathname === link.path ? '#FF6B35' : '#cbd5e1',
                }}>{link.label}</Link>
              ))}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '0.5rem', paddingTop: '0.75rem' }}>
                {isAuthenticated ? (
                  <>
                    <Link to={isAdmin ? '/admin' : '/dashboard'} onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '0.875rem 1rem', color: '#FF8C5A', textDecoration: 'none', fontWeight: 500 }}>
                      {isAdmin ? 'Admin Panel' : 'Dashboard'}
                    </Link>
                    <button onClick={handleLogout} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.875rem 1rem', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9375rem' }}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '0.875rem 1rem', color: '#cbd5e1', textDecoration: 'none' }}>Login</Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '0.875rem 1rem', color: '#FF6B35', textDecoration: 'none', fontWeight: 600 }}>Sign Up Free</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
