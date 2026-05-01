import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaEnvelope, FaFileAlt, FaHome, FaTachometerAlt } from 'react-icons/fa';

export default function SuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.offerLetterId) navigate('/');
  }, [state, navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-primary-900)', padding: '5rem 1.5rem 3rem' }}>
      <div style={{ width: '100%', maxWidth: '38rem', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
          {/* Success Icon */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
            <div style={{ width: '7rem', height: '7rem', borderRadius: '50%', background: 'rgba(74,222,128,0.1)', border: '3px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <FaCheckCircle style={{ color: '#4ade80', fontSize: '3rem' }} />
            </div>
            {/* Rings */}
            {[1, 2].map(r => (
              <motion.div key={r} initial={{ scale: 1, opacity: 0.5 }} animate={{ scale: 2 + r * 0.5, opacity: 0 }} transition={{ duration: 1.5 + r * 0.5, repeat: Infinity, ease: 'easeOut' }}
                style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '7rem', height: '7rem', borderRadius: '50%', border: '2px solid rgba(74,222,128,0.3)' }} />
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card" style={{ padding: '3rem 2.5rem' }}>
          <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '2rem', marginBottom: '0.75rem', lineHeight: 1.2 }}>
            Payment <span style={{ color: '#4ade80' }}>Successful!</span> 🎉
          </h1>
          <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: '2rem', fontSize: '1.0625rem' }}>
            {state?.emailSent
              ? <>Your <strong style={{ color: '#FF8C5A' }}>Offer Letter</strong> has been sent to your registered email address. Please check your inbox (and spam folder).</>
              : 'Your offer letter has been generated and will be available in your dashboard.'}
          </p>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem', textAlign: 'left' }}>
            <div className="card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)' }}>
              <FaFileAlt style={{ color: '#4ade80', fontSize: '1.25rem', flexShrink: 0 }} />
              <div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Offer Letter ID</div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9375rem', fontFamily: 'monospace' }}>{state?.offerLetterId}</div>
              </div>
            </div>

            {state?.emailSent && (
              <div className="card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                <FaEnvelope style={{ color: '#60a5fa', fontSize: '1.25rem', flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Email Sent To</div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9375rem' }}>Your registered email</div>
                </div>
              </div>
            )}
          </div>

          {/* Next steps */}
          <div style={{ background: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.12)', borderRadius: '0.875rem', padding: '1.25rem 1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
            <p style={{ color: '#FF8C5A', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.75rem' }}>📋 What's Next?</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                'Check your Gmail inbox for the Offer Letter PDF',
                'Download and save your Offer Letter',
                'Complete your internship tasks as guided',
                'Get your Certificate of Completion upon finish',
              ].map((step, i) => (
                <li key={i} style={{ color: '#94a3b8', fontSize: '0.875rem', display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#FF6B35' }}>{i + 1}.</span> {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn-primary" style={{ flex: 1, justifyContent: 'center', minWidth: '10rem' }}>
              <FaTachometerAlt /> Go to Dashboard
            </Link>
            <Link to="/" className="btn-secondary" style={{ flex: 1, justifyContent: 'center', minWidth: '10rem' }}>
              <FaHome /> Home
            </Link>
          </div>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={{ color: '#475569', fontSize: '0.8125rem', marginTop: '1.5rem' }}>
          Questions? Email us at{' '}
          <a href="mailto:hello@launchpadintensive.com" style={{ color: '#FF8C5A', textDecoration: 'none' }}>hello@launchpadintensive.com</a>
        </motion.p>
      </div>
    </div>
  );
}
