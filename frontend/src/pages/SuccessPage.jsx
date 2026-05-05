import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaEnvelope, FaFileAlt, FaHome, FaTachometerAlt, FaCommentAlt, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { submitFeedback } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function SuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPending = state?.application?.status === 'pending_verification';

  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!state?.offerLetterId && !isPending) navigate('/');
  }, [state, navigate, isPending]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      await submitFeedback({
        feedback,
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        type: isPending ? 'Post-Payment-Pending' : 'Success-Feedback'
      });
      toast.success('Feedback sent! Thank you.');
      setSubmitted(true);
      setFeedback('');
    } catch (err) {
      toast.error('Failed to send feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-primary-900)', padding: '5rem 1.5rem 3rem' }}>
      <div style={{ width: '100%', maxWidth: '38rem', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
          {/* Success Icon */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
            <div style={{ width: '7rem', height: '7rem', borderRadius: '50%', background: isPending ? 'rgba(255,215,0,0.1)' : 'rgba(74,222,128,0.1)', border: `3px solid ${isPending ? 'rgba(255,215,0,0.3)' : 'rgba(74,222,128,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <FaCheckCircle style={{ color: isPending ? '#fbbf24' : '#4ade80', fontSize: '3rem' }} />
            </div>
            {/* Rings */}
            {[1, 2].map(r => (
              <motion.div key={r} initial={{ scale: 1, opacity: 0.5 }} animate={{ scale: 2 + r * 0.5, opacity: 0 }} transition={{ duration: 1.5 + r * 0.5, repeat: Infinity, ease: 'easeOut' }}
                style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '7rem', height: '7rem', borderRadius: '50%', border: `2px solid ${isPending ? 'rgba(255,215,0,0.3)' : 'rgba(74,222,128,0.3)'}` }} />
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card" style={{ padding: '3rem 2.5rem' }}>
          <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '2rem', marginBottom: '0.75rem', lineHeight: 1.2 }}>
            {isPending ? <>Payment <span style={{ color: '#fbbf24' }}>Submitted!</span> ⏳</> : <>Payment <span style={{ color: '#4ade80' }}>Successful!</span> 🎉</>}
          </h1>
          <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: '2rem', fontSize: '1.0625rem' }}>
            {isPending 
              ? <>Thank you for your application. We have received your payment details. Please wait <strong style={{ color: '#FF8C5A' }}>12-24 hours</strong> for our team to verify the transaction.</>
              : (state?.emailSent
                ? <>Your <strong style={{ color: '#FF8C5A' }}>Offer Letter</strong> has been sent to your registered email address. Please check your inbox (and spam folder).</>
                : 'Your offer letter has been generated and will be available in your dashboard.')}
          </p>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem', textAlign: 'left' }}>
            {!isPending && (
              <div className="card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)' }}>
                <FaFileAlt style={{ color: '#4ade80', fontSize: '1.25rem', flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Offer Letter ID</div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9375rem', fontFamily: 'monospace' }}>{state?.offerLetterId}</div>
                </div>
              </div>
            )}

            <div className="card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
              <FaEnvelope style={{ color: '#60a5fa', fontSize: '1.25rem', flexShrink: 0 }} />
              <div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Status Notification</div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9375rem' }}>{isPending ? 'Verification in progress' : 'Email Sent'}</div>
              </div>
            </div>
          </div>

          {/* Next steps */}
          <div style={{ background: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.12)', borderRadius: '0.875rem', padding: '1.25rem 1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
            <p style={{ color: '#FF8C5A', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.75rem' }}>📋 What's Next?</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(isPending ? [
                'Admin will verify your UPI transaction ID',
                'Your Offer Letter will be sent to your Gmail',
                'Check your dashboard after 24 hours',
                'If payment fails verification, we will contact you',
              ] : [
                'Check your Gmail inbox for the Offer Letter PDF',
                'Download and save your Offer Letter',
                'Complete your internship tasks as guided',
                'Get your Certificate of Completion upon finish',
              ]).map((step, i) => (
                <li key={i} style={{ color: '#94a3b8', fontSize: '0.875rem', display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#FF6B35' }}>{i + 1}.</span> {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <Link to="/dashboard" className="btn-primary" style={{ flex: 1, justifyContent: 'center', minWidth: '10rem' }}>
              <FaTachometerAlt /> Go to Dashboard
            </Link>
            <Link to="/" className="btn-secondary" style={{ flex: 1, justifyContent: 'center', minWidth: '10rem' }}>
              <FaHome /> Home
            </Link>
          </div>

          {/* Feedback Section */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'rgba(255,107,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaCommentAlt style={{ color: '#FF6B35', fontSize: '1rem' }} />
              </div>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: 0 }}>Share Your Feedback</h3>
                <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '2px 0 0' }}>Help us improve your experience</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  onSubmit={handleFeedbackSubmit}
                >
                  <textarea 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us about your experience or if you faced any issues..."
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      padding: '1rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'none',
                      marginBottom: '1rem',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(255,107,53,0.3)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                  <button 
                    type="submit" 
                    disabled={isSubmitting || !feedback.trim()}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: feedback.trim() ? '#FF6B35' : 'rgba(255,107,53,0.2)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '0.75rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: feedback.trim() ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {isSubmitting ? <FaSpinner className="animate-spin" /> : <><FaPaperPlane /> Submit Feedback</>}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="thanks"
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.1)', borderRadius: '0.75rem', padding: '1.25rem', textAlign: 'center' }}
                >
                  <p style={{ color: '#4ade80', fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>🎉 Thank you for your valuable feedback!</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.5rem' }}>Our HR team will review it shortly.</p>
                </motion.div>
              )}
            </AnimatePresence>
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
