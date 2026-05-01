import { useState } from 'react';
import { motion } from 'framer-motion';
import { registerCompany } from '../services/api';
import toast from 'react-hot-toast';
import { FaBuilding, FaUsers, FaChartLine, FaHandshake, FaCheck, FaArrowRight } from 'react-icons/fa';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const benefits = [
  { icon: FaUsers, title: 'Pre-Screened Talent', desc: 'Access a pool of motivated, trained college students ready to contribute from day one.' },
  { icon: FaChartLine, title: 'Zero Hiring Cost', desc: 'No recruitment fees. Browse profiles and onboard interns directly through our platform.' },
  { icon: FaHandshake, title: 'Managed Onboarding', desc: 'We handle paperwork, offer letters, and compliance — you focus on your projects.' },
  { icon: FaBuilding, title: 'Brand Visibility', desc: 'Get featured in front of 500+ students as a preferred employer partner.' },
];

export default function Companies() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', industry: '', description: '' });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerCompany(form);
      toast.success('Registration submitted! Our team will contact you within 24 hours.');
      setForm({ name: '', email: '', phone: '', industry: '', description: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient page-header" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '50rem' }}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1.25rem', borderRadius: '9999px', background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', color: '#FF8C5A', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              🤝 For Businesses & Startups
            </motion.div>
            <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900, color: '#fff', marginBottom: '1.25rem', lineHeight: 1.15 }}>
              Hire Talented Interns <span className="gradient-text">For Free</span>
            </motion.h1>
            <motion.p variants={fadeUp} style={{ color: '#94a3b8', fontSize: '1.0625rem', lineHeight: 1.85 }}>
              Partner with Launchpad Intensive to access India's most motivated college students — pre-trained, eager, and ready to add value to your team.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '3rem 0', background: 'rgba(27,40,69,0.4)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div className="grid-4">
            {[{ value: '500+', label: 'Trained Interns' }, { value: '50+', label: 'Partner Companies' }, { value: '₹0', label: 'Hiring Cost' }, { value: '24h', label: 'Avg Onboarding' }].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 800 }}>{s.value}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.375rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ color: '#fff', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 800, marginBottom: '0.75rem' }}>Why Partner <span className="gradient-text">With Us?</span></h2>
              <p style={{ color: '#94a3b8' }}>We make it effortless to find and onboard the right intern talent.</p>
            </motion.div>
            <div className="grid-4">
              {benefits.map((b, i) => (
                <motion.div key={i} variants={fadeUp} className="card card-hover" style={{ padding: '2rem' }}>
                  <div className="icon-box" style={{ marginBottom: '1.25rem' }}><b.icon /></div>
                  <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.625rem' }}>{b.title}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section" style={{ background: 'rgba(27,40,69,0.2)' }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} style={{ color: '#fff', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 800, textAlign: 'center', marginBottom: '3rem' }}>How It <span className="gradient-text">Works</span></motion.h2>
            <div className="grid-3">
              {[
                { step: '01', title: 'Register Your Company', desc: 'Fill in our quick company registration form below — takes under 2 minutes.' },
                { step: '02', title: 'Browse & Select', desc: 'Our team matches you with the best interns from our trained pool.' },
                { step: '03', title: 'Onboard & Grow', desc: 'We handle paperwork. You get a ready-to-work intern within 24 hours.' },
              ].map((s, i) => (
                <motion.div key={i} variants={fadeUp} className="card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg,#FF6B35,#FF8C5A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1rem', flexShrink: 0 }}>{s.step}</div>
                    <h3 style={{ color: '#fff', fontWeight: 700, margin: 0 }}>{s.title}</h3>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What interns can do */}
      <section className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ color: '#fff', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 800 }}>What Our Interns Can <span className="gradient-text">Do For You</span></h2>
            </motion.div>
            <div className="grid-3">
              {['Digital Marketing & SEO', 'Content Writing & Copywriting', 'Social Media Management', 'Web Development & Design', 'Data Entry & Research', 'Business Development & Sales'].map((skill, i) => (
                <motion.div key={i} variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1rem 1.5rem' }} className="card">
                  <FaCheck style={{ color: '#4ade80', flexShrink: 0 }} />
                  <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{skill}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="section" style={{ background: 'rgba(27,40,69,0.2)' }} id="register">
        <div className="container" style={{ maxWidth: '44rem' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ color: '#fff', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 800, marginBottom: '0.75rem' }}>Register as <span className="gradient-text">Partner Company</span></h2>
              <p style={{ color: '#94a3b8' }}>Our team will reach out within 24 hours to get you started.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="card" style={{ padding: '2.5rem' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="grid-2" style={{ gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <label style={{ color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500 }}>Company Name *</label>
                    <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. TechCorp India" className="form-input-plain" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <label style={{ color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500 }}>Industry *</label>
                    <select required value={form.industry} onChange={e => set('industry', e.target.value)} className="form-input-plain">
                      <option value="">Select industry</option>
                      {['Technology', 'Marketing', 'Finance', 'Healthcare', 'Education', 'E-Commerce', 'Media', 'Other'].map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid-2" style={{ gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <label style={{ color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500 }}>Work Email *</label>
                    <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="hr@company.com" className="form-input-plain" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <label style={{ color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500 }}>Phone Number *</label>
                    <input required value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="10-digit number" className="form-input-plain" />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500 }}>About Your Company *</label>
                  <textarea required rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Tell us about your company and what kind of interns you're looking for..." className="form-textarea" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', fontSize: '1.0625rem', padding: '0.9375rem' }}>
                  {loading ? 'Submitting...' : <>Register Now — It's Free <FaArrowRight /></>}
                </button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
