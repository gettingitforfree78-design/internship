import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaRocket, FaEnvelope, FaLock } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, resetSession, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const dest = new URLSearchParams(location.search).get('redirect') || (user?.role === 'admin' ? '/admin' : '/dashboard');
      navigate(dest);
    }
  }, [isAuthenticated, navigate, location, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      const userData = res.user;
      toast.success('Welcome back! 🚀');
      const dest = new URLSearchParams(location.search).get('redirect') || (userData?.role === 'admin' ? '/admin' : '/dashboard');
      navigate(dest);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }} className="hero-gradient">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '400px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '4rem', height: '4rem', borderRadius: '1rem',
            background: 'linear-gradient(135deg, #FF6B35, #FF8C5A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <FaRocket style={{ color: '#fff', fontSize: '1.5rem' }} />
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#fff', margin: 0 }}>Welcome Back</h1>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Login to your dashboard</p>
        </div>

        {/* Card */}
        <div className="glass" style={{ borderRadius: '1.25rem', padding: '2.5rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="form-input" />
            </div>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="form-input" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          {/* Dev Tools */}
          {import.meta.env.DEV && (

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <p style={{ color: '#475569', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>🛠️ Developer Tools</p>
              <button onClick={resetSession} style={{ width: '100%', padding: '0.75rem', background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '0.75rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
                Clear All Sessions & Reset
              </button>
            </div>
          )}

          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem', marginTop: '1.5rem' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#FF8C5A', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}


