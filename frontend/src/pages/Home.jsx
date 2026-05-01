import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRocket, FaGraduationCap, FaCertificate, FaBriefcase, FaUsers, FaGlobe, FaAward, FaStar, FaChevronDown, FaChevronUp, FaArrowRight } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

function Counter({ end, suffix = '', label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true);
        let current = 0;
        const step = end / 60;
        const interval = setInterval(() => {
          current += step;
          if (current >= end) { setCount(end); clearInterval(interval); }
          else setCount(end % 1 === 0 ? Math.floor(current) : current.toFixed(1));
        }, 25);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, started]);
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800 }}>{count}{suffix}</div>
      <div style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.875rem' }}>{label}</div>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: 'Who can apply for internships?', a: 'Any college student from India, whether undergraduate or postgraduate, can apply. No prior experience required.' },
    { q: 'How do I receive my certificate?', a: 'After successful completion and payment verification, your certificate is automatically generated as a PDF and sent to your registered email.' },
    { q: 'What payment methods are accepted?', a: 'We accept all major payment methods through Razorpay — UPI, debit/credit cards, net banking, and wallets.' },
    { q: 'Is this a work-from-home internship?', a: 'Yes! All our internships are remote with flexible timings so you can manage alongside your college schedule.' },
    { q: 'Do I get a Letter of Recommendation?', a: 'Top performers receive a personalized Letter of Recommendation along with their certificate.' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {faqs.map((faq, i) => (
        <div key={i} className="glass" style={{ borderRadius: '0.875rem', overflow: 'hidden' }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.25rem 1.5rem', textAlign: 'left', background: 'none', border: 'none',
            cursor: 'pointer', color: '#fff'
          }}>
            <span style={{ fontWeight: 500, fontSize: '0.9375rem' }}>{faq.q}</span>
            {open === i ? <FaChevronUp style={{ color: '#FF6B35', flexShrink: 0, marginLeft: '1rem' }} />
              : <FaChevronDown style={{ color: '#94a3b8', flexShrink: 0, marginLeft: '1rem' }} />}
          </button>
          {open === i && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p style={{ padding: '0 1.5rem 1.25rem', color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7 }}>{faq.a}</p>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const features = [
    { icon: FaBriefcase, title: 'Real Internships', desc: 'Work on live projects with industry mentors, not simulated tasks' },
    { icon: FaCertificate, title: 'Verified Certificates', desc: 'Get digitally verified certificates sent directly to your Gmail' },
    { icon: FaGraduationCap, title: 'Learn by Doing', desc: 'Hands-on experience with the latest tools and technologies' },
    { icon: FaUsers, title: 'Expert Mentorship', desc: 'Guidance from professionals with 5+ years of experience' },
    { icon: FaGlobe, title: 'Work from Home', desc: 'Flexible remote internships that fit your college schedule' },
    { icon: FaAward, title: 'Career Support', desc: 'Resume building, interview prep, and job referral assistance' },
  ];

  const testimonials = [
    { name: 'Priya Sharma', college: 'Delhi University', text: 'The digital marketing internship was incredible! I learned more in 6 weeks than a semester of theory.', rating: 5 },
    { name: 'Rahul Patel', college: 'IIT Bombay', text: 'Launchpad gave me real project experience that helped me land my dream job at a top startup.', rating: 5 },
    { name: 'Ananya Reddy', college: 'BITS Pilani', text: 'The certificate and LOR I received boosted my profile significantly. Highly recommend!', rating: 5 },
  ];

  return (
    <div>
      {/* ── HERO ── */}
      <section className="hero-gradient hero-section">
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div className="animate-float" style={{ position: 'absolute', top: '15%', right: '10%', width: '20rem', height: '20rem', background: 'rgba(255,107,53,0.08)', borderRadius: '50%', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '15%', left: '5%', width: '25rem', height: '25rem', background: 'rgba(45,63,94,0.2)', borderRadius: '50%', filter: 'blur(80px)' }} />
        </div>
        <div className="hero-content">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#FF8C5A', fontSize: '0.875rem', marginBottom: '2rem' }}>
              <FaRocket style={{ fontSize: '0.75rem' }} /> Now accepting applications for 2025 batch
            </motion.div>
            <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              {isAuthenticated ? <>Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span></> : <>Launch Your Career with <span className="gradient-text">Real Internships</span></>}
            </motion.h1>
            <motion.p variants={fadeUp} style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#94a3b8', maxWidth: '38rem', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              India's premier internship platform for college students. Gain hands-on experience, earn verified certificates, and kickstart your professional journey.
            </motion.p>
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary" style={{ fontSize: '1.0625rem' }}>
                  Go to Dashboard <FaArrowRight />
                </Link>
              ) : (
                <Link to="/internships" className="btn-primary" style={{ fontSize: '1.0625rem' }}>
                  Apply for Internship <FaArrowRight />
                </Link>
              )}
              <Link to="/companies" className="btn-secondary" style={{ fontSize: '1.0625rem' }}>
                Partner with Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '4rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(27,40,69,0.3)' }}>
        <div className="container">
          <div className="grid-4">
            <Counter end={500} suffix="+" label="Students Trained" />
            <Counter end={50} suffix="+" label="Company Partners" />
            <Counter end={95} suffix="%" label="Completion Rate" />
            <Counter end={4.8} label="Average Rating" />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                Why Choose <span className="gradient-text">Launchpad?</span>
              </h2>
              <p style={{ color: '#94a3b8', maxWidth: '36rem', margin: '0 auto' }}>Everything you need to build a standout career, all in one platform.</p>
            </motion.div>
            <div className="grid-3">
              {features.map((f, i) => (
                <motion.div key={i} variants={fadeUp} className="card card-hover" style={{ padding: '2rem' }}>
                  <div className="icon-box" style={{ marginBottom: '1.25rem' }}><f.icon /></div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>{f.title}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7 }}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section" style={{ background: 'rgba(27,40,69,0.2)' }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff' }}>
                What Our <span className="gradient-text">Students Say</span>
              </h2>
            </motion.div>
            <div className="grid-3">
              {testimonials.map((t, i) => (
                <motion.div key={i} variants={fadeUp} className="card card-hover" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                    {[...Array(t.rating)].map((_, j) => <FaStar key={j} style={{ color: '#FF6B35', fontSize: '0.875rem' }} />)}
                  </div>
                  <p style={{ color: '#cbd5e1', fontSize: '0.9375rem', lineHeight: 1.8, marginBottom: '1.5rem', fontStyle: 'italic' }}>"{t.text}"</p>
                  <div>
                    <p style={{ color: '#fff', fontWeight: 600 }}>{t.name}</p>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{t.college}</p>
                  </div>
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
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff' }}>
                Frequently Asked <span className="gradient-text">Questions</span>
              </h2>
            </motion.div>
            <motion.div variants={fadeUp}><FAQ /></motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '20rem', height: '20rem', background: 'rgba(255,107,53,0.08)', borderRadius: '50%', filter: 'blur(60px)' }} />
            <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
              Ready to <span className="gradient-text">Launch?</span>
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
              Subscribe to get notified about new internship openings and exclusive opportunities.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', maxWidth: '28rem', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
              <input type="email" placeholder="Enter your email" className="form-input-plain" style={{ flex: 1, minWidth: '14rem' }} />
              <button className="btn-primary" style={{ whiteSpace: 'nowrap' }}>Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
