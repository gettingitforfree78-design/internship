import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaRocket, FaCheck, FaCertificate, FaFileAlt, FaEnvelope, FaShieldAlt, FaStar, FaArrowRight } from 'react-icons/fa';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function Internships() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/apply');
    } else {
      navigate('/apply');
    }
  };

  const includes = [
    { icon: FaFileAlt, text: 'Official Offer Letter (PDF)' },
    { icon: FaCertificate, text: 'Certificate of Completion' },
    { icon: FaEnvelope, text: 'Delivered to your Gmail instantly' },
    { icon: FaShieldAlt, text: 'Verified by Launchpad Intensive Pvt Ltd' },
    { icon: FaRocket, text: 'Real internship experience & support' },
    { icon: FaStar, text: 'Letter of Recommendation (top performers)' },
  ];

  const faqs = [
    { q: 'What do I receive after payment?', a: 'You immediately receive a professional Offer Letter PDF sent to your registered Gmail, and a Certificate of Completion upon finishing.' },
    { q: 'Is this a remote internship?', a: 'Yes! You can choose Remote or Onsite mode in your application form.' },
    { q: 'How long does the internship last?', a: 'You choose your own start and end dates. Typically 4–12 weeks.' },
    { q: 'Is the certificate valid?', a: 'Yes. It is issued by Launchpad Intensive Private Limited and can be added to LinkedIn and your resume.' },
  ];

  return (
    <div>
      {/* ── HERO ── */}
      <section className="hero-gradient page-header" style={{ textAlign: 'center', paddingBottom: '5rem' }}>
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1.25rem', borderRadius: '9999px', background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.25)', color: '#FF8C5A', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '0.04em' }}>
              🎓 LIMITED SEATS AVAILABLE
            </motion.div>
            <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900, color: '#fff', marginBottom: '1rem', lineHeight: 1.15 }}>
              Apply for <span className="gradient-text">Internship Certificate</span>
            </motion.h1>
            <motion.p variants={fadeUp} style={{ color: '#94a3b8', fontSize: '1.125rem', maxWidth: '34rem', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              Get your internship opportunity, offer letter, real experience, and certificate — all in one place.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CARD ── */}
      <section style={{ marginTop: '-3rem', padding: '0 0 5rem' }}>
        <div className="container" style={{ maxWidth: '64rem' }}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="card" style={{ overflow: 'visible', boxShadow: '0 30px 80px rgba(0,0,0,0.4)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>

                {/* LEFT: Details */}
                <div style={{ padding: '3rem 2.5rem', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', background: 'rgba(74,222,128,0.1)', borderRadius: '9999px', color: '#4ade80', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1.75rem' }}>
                    ✅ Verified Program
                  </div>
                  <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', lineHeight: 1.2 }}>
                    Internship Certificate Program
                  </h2>
                  <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: '2rem', fontSize: '0.9375rem' }}>
                    A complete internship experience package by <strong style={{ color: '#fff' }}>Launchpad Intensive Private Limited</strong>. Receive your offer letter, gain real-world experience, and earn a verified certificate for your resume and LinkedIn.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem' }}>
                    {includes.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'rgba(255,107,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <item.icon style={{ color: '#FF6B35', fontSize: '0.875rem' }} />
                        </div>
                        <span style={{ color: '#cbd5e1', fontSize: '0.9375rem' }}>{item.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Trust badges */}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {['Govt Compliant', 'ISO Certified', 'Trusted by 500+ Students'].map((b, i) => (
                      <span key={i} className="badge badge-blue">{b}</span>
                    ))}
                  </div>
                </div>

                {/* RIGHT: Pricing */}
                <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,107,53,0.03)', textAlign: 'center' }}>
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ color: '#64748b', fontSize: '0.875rem', textDecoration: 'line-through', marginBottom: '0.25rem' }}>₹999</div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '0.25rem' }}>
                      <span style={{ color: '#FF6B35', fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>₹</span>
                      <span style={{ color: '#fff', fontSize: '5rem', fontWeight: 900, lineHeight: 1 }}>149</span>
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.35rem 1rem', background: 'rgba(74,222,128,0.1)', borderRadius: '9999px', color: '#4ade80', fontSize: '0.8125rem', fontWeight: 600, marginTop: '0.5rem' }}>
                      🎉 80% OFF — Limited Time
                    </div>
                  </div>

                  <button onClick={handleApply} className="btn-primary" style={{ width: '100%', fontSize: '1.125rem', padding: '1rem', marginBottom: '1.25rem' }}>
                    Apply Now <FaArrowRight />
                  </button>

                  <p style={{ color: '#64748b', fontSize: '0.8125rem', lineHeight: 1.7 }}>
                    🔒 Secure payment via Razorpay<br />
                    📧 Offer letter sent instantly to Gmail<br />
                    💯 100% money-back if not delivered
                  </p>

                  <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                      {[...Array(5)].map((_, i) => <FaStar key={i} style={{ color: '#FF6B35', fontSize: '0.875rem' }} />)}
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>Rated 4.9/5 by 500+ students</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" style={{ background: 'rgba(27,40,69,0.2)' }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 800, color: '#fff' }}>
                How It <span className="gradient-text">Works</span>
              </h2>
            </motion.div>
            <div className="grid-4">
              {[
                { step: '01', title: 'Sign Up', desc: 'Create your free account in 30 seconds' },
                { step: '02', title: 'Fill Application', desc: 'Complete your internship application form' },
                { step: '03', title: 'Pay ₹149', desc: 'Secure payment via QR Code — Fast & Reliable' },
                { step: '04', title: 'Get Offer Letter', desc: 'PDF sent instantly to your Gmail inbox' },
              ].map((s, i) => (
                <motion.div key={i} variants={fadeUp} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #FF6B35, #FF8C5A)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontWeight: 800, color: '#fff', fontSize: '1rem' }}>{s.step}</div>
                  <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>{s.title}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7 }}>{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section">
        <div className="container-sm">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: '2.5rem' }}>
              Common <span className="gradient-text">Questions</span>
            </motion.h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {faqs.map((faq, i) => (
                <motion.div key={i} variants={fadeUp} className="card" style={{ padding: '1.5rem 2rem' }}>
                  <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>{faq.q}</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: '40rem', textAlign: 'center' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card" style={{ padding: '3.5rem 2rem' }}>
            <FaRocket style={{ color: '#FF6B35', fontSize: '2.5rem', marginBottom: '1rem' }} />
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.875rem', marginBottom: '1rem' }}>
              Ready to <span className="gradient-text">Launch?</span>
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '2rem', lineHeight: 1.8 }}>
              Join 500+ students who have already kickstarted their careers with Launchpad Intensive.
            </p>
            <button onClick={handleApply} className="btn-primary" style={{ fontSize: '1.0625rem', padding: '0.9375rem 2.5rem' }}>
              Apply Now — ₹149 Only <FaArrowRight />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Mobile responsive fix */}
      <style>{`
        @media(max-width: 768px) {
          .internship-card-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
