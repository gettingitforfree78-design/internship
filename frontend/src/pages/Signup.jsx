import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaRocket, FaUser, FaEnvelope, FaLock, FaPhone, FaGraduationCap } from 'react-icons/fa';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', college: '' });
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to Launchpad 🚀');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed. Please try again.');
    }
    setLoading(false);
  };

  const fields = [
    { icon: FaUser, name: 'name', type: 'text', placeholder: 'Full Name', required: true },
    { icon: FaEnvelope, name: 'email', type: 'email', placeholder: 'Email Address', required: true },
    { icon: FaPhone, name: 'phone', type: 'tel', placeholder: 'Phone Number (10 digits)', required: false },
    { icon: FaGraduationCap, name: 'college', type: 'text', placeholder: 'College Name', required: false },
    { icon: FaLock, name: 'password', type: 'password', placeholder: 'Password (min 6 characters)', required: true },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1rem 2rem' }} className="hero-gradient">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '440px' }}>
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
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#fff', margin: 0 }}>Create Account</h1>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Start your internship journey today</p>
        </div>

        {/* Card */}
        <div className="glass" style={{ borderRadius: '1.25rem', padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {fields.map((f) => (
              <div key={f.name} className="input-wrapper">
                <f.icon className="input-icon" />
                <input
                  required={f.required}
                  type={f.type}
                  value={form[f.name]}
                  onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                  placeholder={f.placeholder}
                  className="form-input"
                />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              {loading ? 'Creating Account...' : 'Sign Up Free'}
            </button>
          </form>
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem', marginTop: '1.25rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#FF8C5A', fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}


