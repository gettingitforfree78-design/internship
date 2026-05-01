import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { confirmUpiPayment, skipPayment } from '../services/api';
import toast from 'react-hot-toast';
import { FaShieldAlt, FaLock, FaQrcode, FaTimes, FaCheckCircle } from 'react-icons/fa';

const COMPANY_NAME = 'Launchpad Intensive Pvt Ltd';
const UPI_VPA = '9696614492@yapl';
const PAYMENT_AMOUNT = 1; // TODO: change back to 199 for production

// Build UPI deep link for QR
const UPI_DEEP_LINK = `upi://pay?pa=${UPI_VPA}&pn=${encodeURIComponent(COMPANY_NAME)}&am=${PAYMENT_AMOUNT}&cu=INR&tn=${encodeURIComponent('Internship Application Fee')}`;

// QR code image URL (no dependency needed)
const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(UPI_DEEP_LINK)}&bgcolor=ffffff&color=000000&margin=10`;

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [upiTxnId, setUpiTxnId] = useState('');
  const [txnError, setTxnError] = useState('');

  useEffect(() => {
    if (!state?.applicationId) navigate('/apply');
  }, [state, navigate]);

  // Show QR code modal
  const handleShowQR = () => {
    setShowQR(true);
    setUpiTxnId('');
    setTxnError('');
  };

  // After user scans & pays, confirm with transaction ID
  const handleConfirmPayment = async () => {
    // Validate transaction ID
    if (!upiTxnId.trim()) {
      setTxnError('Please enter your UPI Transaction ID');
      return;
    }
    const utrRegex = /^\d{12}$/;
    if (!utrRegex.test(upiTxnId.trim())) {
      setTxnError('Transaction ID must be exactly 12 digits (UTR number).');
      return;
    }
    setTxnError('');

    setConfirming(true);
    try {
      const { data } = await confirmUpiPayment({
        applicationId: state.applicationId,
        upiTransactionId: upiTxnId.trim(),
      });
      toast.success(data.message || 'Payment confirmed! 🎉');
      navigate('/success', { state: { ...data, applicantName: state.applicantName } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment confirmation failed');
      setTxnError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  const handleSkipPayment = async () => {
    setLoading(true);
    try {
      const { data } = await skipPayment({ applicationId: state.applicationId });
      toast.success(data.message || 'Payment Skipped! 🎉');
      navigate('/success', { state: { ...data, applicantName: state.applicantName } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to skip payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '5rem', padding: '6rem 1.5rem 3rem', background: 'var(--color-primary-900)' }}>
      <div style={{ width: '100%', maxWidth: '32rem' }}>
        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '3.5rem', padding: '0 0.5rem', flexWrap: 'wrap' }}>
          {['Application Form', 'Payment ₹199', 'Offer Letter'].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? '1 1 auto' : '0 0 auto', minWidth: 'fit-content' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  width: '2.25rem', height: '2.25rem', borderRadius: '50%', 
                  background: i === 0 ? '#4ade80' : i === 1 ? 'linear-gradient(135deg, #FF6B35, #FF8C5A)' : 'rgba(255,255,255,0.05)', 
                  color: '#fff', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontSize: '0.9375rem', fontWeight: 800, flexShrink: 0,
                  boxShadow: i === 1 ? '0 4px 12px rgba(255,107,53,0.3)' : 'none',
                  border: (i === 1 || i === 0) ? 'none' : '1px solid rgba(255,255,255,0.1)'
                }}>
                  {i === 0 ? '✓' : i + 1}
                </div>
                <span style={{ 
                  fontSize: '0.9375rem', 
                  color: i === 1 ? '#fff' : i === 0 ? '#4ade80' : '#64748b', 
                  fontWeight: i === 1 ? 700 : 500, 
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.01em'
                }}>
                  {s}
                </span>
              </div>
              {i < 2 && (
                <div style={{ 
                  flex: 1, height: '2px', 
                  background: i === 0 ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255,255,255,0.05)', 
                  margin: '0 1.25rem', minWidth: '1rem' 
                }} />
              )}
            </div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            {/* Icon */}
            <div style={{ width: '5rem', height: '5rem', borderRadius: '1.25rem', background: 'linear-gradient(135deg, #FF6B35, #FF8C5A)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <FaLock style={{ color: '#fff', fontSize: '1.75rem' }} />
            </div>

            <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.625rem', marginBottom: '0.5rem' }}>
              Complete Your Payment
            </h1>
            <p style={{ color: '#FF6B35', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              {COMPANY_NAME}
            </p>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
              Hey <strong style={{ color: '#fff' }}>{state?.applicantName?.split(' ')[0]}</strong>! One last step to get your offer letter.
            </p>

            {/* Price */}
            <div className="card" style={{ background: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.15)', padding: '2rem', marginBottom: '2rem' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Amount</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                <span style={{ color: '#FF6B35', fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem' }}>₹</span>
                <span style={{ color: '#fff', fontSize: '3.5rem', fontWeight: 900, lineHeight: 1 }}>{PAYMENT_AMOUNT}</span>
              </div>
              <div style={{ color: '#64748b', fontSize: '0.8125rem', marginTop: '0.5rem', textDecoration: 'line-through' }}>Original: ₹999</div>
            </div>

            {/* What you get */}
            <div style={{ textAlign: 'left', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                '✅ Official Internship Offer Letter (PDF)',
                '✅ Sent instantly to your Gmail',
                '✅ Certificate upon completion',
                `✅ Verified by ${COMPANY_NAME}`,
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                  {item}
                </div>
              ))}
            </div>

            {/* Pay via UPI QR button */}
            <button onClick={handleShowQR} disabled={loading} className="btn-primary" style={{ width: '100%', fontSize: '1.0625rem', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FaQrcode /> Pay ₹{PAYMENT_AMOUNT} via UPI
            </button>

            {/* Temporary Skip Payment Button */}
            <button onClick={handleSkipPayment} disabled={loading} style={{ width: '100%', fontSize: '0.9rem', padding: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid rgba(255,107,53,0.3)', color: '#FF6B35', borderRadius: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,107,53,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              Skip Payment (Temporary)
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem', color: '#475569', fontSize: '0.8125rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><FaShieldAlt style={{ color: '#4ade80' }} /> 100% Secure</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><FaLock style={{ color: '#4ade80' }} /> UPI Encrypted</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── UPI QR Code Modal ─── */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1rem',
              overflowY: 'auto',
            }}
            onClick={() => !confirming && setShowQR(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'linear-gradient(145deg, #1e293b, #0f172a)',
                borderRadius: '1.5rem',
                padding: '2.5rem 2rem',
                width: '100%',
                maxWidth: '26rem',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                position: 'relative',
                maxHeight: '95vh',
                overflowY: 'auto',
              }}
            >
              {/* Close button */}
              <button
                onClick={() => !confirming && setShowQR(false)}
                style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  background: 'rgba(255,255,255,0.06)', border: 'none',
                  borderRadius: '50%', width: '2.25rem', height: '2.25rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#94a3b8', cursor: 'pointer', fontSize: '1rem',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8'; }}
              >
                <FaTimes />
              </button>

              {/* Header */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  width: '3.5rem', height: '3.5rem', borderRadius: '1rem',
                  background: 'linear-gradient(135deg, #FF6B35, #FF8C5A)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}>
                  <FaQrcode style={{ color: '#fff', fontSize: '1.5rem' }} />
                </div>
                <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.375rem', marginBottom: '0.25rem' }}>
                  Scan & Pay ₹{PAYMENT_AMOUNT}
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Scan this QR code with any UPI app
                </p>
              </div>

              {/* QR Code */}
              <div style={{
                background: '#ffffff',
                borderRadius: '1rem',
                padding: '1rem',
                display: 'inline-block',
                marginBottom: '1.25rem',
                boxShadow: '0 4px 20px rgba(255,107,53,0.15)',
              }}>
                <img
                  src={QR_CODE_URL}
                  alt="UPI QR Code"
                  style={{ width: '220px', height: '220px', display: 'block' }}
                />
              </div>

              {/* UPI ID display */}
              <div style={{
                background: 'rgba(255,107,53,0.08)',
                border: '1px solid rgba(255,107,53,0.2)',
                borderRadius: '0.75rem',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
              }}>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.25rem' }}>UPI ID</div>
                <div style={{ color: '#FF6B35', fontWeight: 700, fontSize: '1.0625rem', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                  {UPI_VPA}
                </div>
              </div>

              {/* Amount badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(74, 222, 128, 0.08)',
                border: '1px solid rgba(74, 222, 128, 0.2)',
                borderRadius: '2rem',
                padding: '0.5rem 1.25rem',
                marginBottom: '1.5rem',
                color: '#4ade80', fontWeight: 700, fontSize: '0.9375rem',
              }}>
                Amount: ₹{PAYMENT_AMOUNT}
              </div>

              {/* Instructions */}
              <div style={{
                textAlign: 'left',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: '1.5rem',
              }}>
                <div style={{ color: '#cbd5e1', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  📋 Steps:
                </div>
                {[
                  '1. Open any UPI app (GPay, PhonePe, Paytm)',
                  '2. Scan the QR code above',
                  `3. Verify amount is ₹${PAYMENT_AMOUNT}`,
                  '4. Complete the payment',
                  '5. Copy the UPI Transaction ID from your app',
                  '6. Paste it below and click confirm',
                ].map((step, i) => (
                  <div key={i} style={{ color: '#94a3b8', fontSize: '0.8125rem', padding: '0.2rem 0' }}>
                    {step}
                  </div>
                ))}
              </div>

              {/* UPI Transaction ID Input */}
              <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                <label style={{ color: '#cbd5e1', fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                  📝 UPI Transaction ID / Reference Number
                </label>
                <input
                  type="text"
                  value={upiTxnId}
                  onChange={(e) => { setUpiTxnId(e.target.value); setTxnError(''); }}
                  placeholder="e.g. 312345678901 (12 digits)"
                  disabled={confirming}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    fontSize: '1rem',
                    fontFamily: 'monospace',
                    letterSpacing: '1px',
                    background: 'rgba(255,255,255,0.06)',
                    border: txnError ? '2px solid #ef4444' : '2px solid rgba(255,255,255,0.1)',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => { if (!txnError) e.target.style.borderColor = '#FF6B35'; }}
                  onBlur={(e) => { if (!txnError) e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
                {txnError && (
                  <div style={{ color: '#ef4444', fontSize: '0.8125rem', marginTop: '0.375rem' }}>
                    ⚠️ {txnError}
                  </div>
                )}
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.375rem' }}>
                  You'll find this in your UPI app under payment history / transaction details
                </div>
              </div>

              {/* Confirm payment button */}
              <button
                onClick={handleConfirmPayment}
                disabled={confirming || !upiTxnId.trim()}
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1.0625rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '0.75rem',
                  background: (!upiTxnId.trim() || confirming)
                    ? 'rgba(74, 222, 128, 0.15)'
                    : 'linear-gradient(135deg, #4ade80, #22c55e)',
                  color: (!upiTxnId.trim() || confirming) ? 'rgba(255,255,255,0.4)' : '#fff',
                  cursor: (!upiTxnId.trim() || confirming) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                  boxShadow: upiTxnId.trim() && !confirming ? '0 4px 15px rgba(74, 222, 128, 0.25)' : 'none',
                }}
              >
                {confirming ? (
                  <>⏳ Verifying Payment...</>
                ) : (
                  <><FaCheckCircle /> I've Completed the Payment</>
                )}
              </button>

              <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.75rem' }}>
                ⚠️ Only click after you've successfully paid via UPI and entered the Transaction ID
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
