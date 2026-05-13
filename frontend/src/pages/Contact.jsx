import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitContact } from '../services/api';
import toast from 'react-hot-toast';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaArrowRight } from 'react-icons/fa';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const contactInfo = [
  { icon: FaMapMarkerAlt, title: 'Address', lines: ['123 Startup Hub, Connaught Place', 'New Delhi, India — 110001'] },
  { icon: FaEnvelope, title: 'Email Us', lines: ['launchpad7.hr@gmail.com'] },
  { icon: FaPhone, title: 'Call Us', lines: ['+91 98765 43210', '+91 88889 99000'] },
  { icon: FaClock, title: 'Working Hours', lines: ['Mon–Sat: 9:00 AM – 7:00 PM', 'Sunday: Closed'] },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContact(form);
      toast.success('Message sent! We\'ll get back to you within 24 hours.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient page-header" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '44rem' }}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1.25rem', borderRadius: '9999px', background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', color: '#FF8C5A', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              💬 We typically reply within 24 hours
            </motion.div>
            <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900, color: '#fff', marginBottom: '1rem', lineHeight: 1.15 }}>
              Get in <span className="gradient-text">Touch</span>
            </motion.h1>
            <motion.p variants={fadeUp} style={{ color: '#94a3b8', fontSize: '1.0625rem', lineHeight: 1.8 }}>
              Have a question about internships, partnerships, or anything else? We'd love to hear from you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '2.5rem', alignItems: 'start' }}>

            {/* Contact Info */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.h2 variants={fadeUp} style={{ color: '#fff', fontWeight: 800, fontSize: '1.5rem', marginBottom: '2rem' }}>Contact <span className="gradient-text">Information</span></motion.h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {contactInfo.map((info, i) => (
                  <motion.div key={i} variants={fadeUp} className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', background: 'rgba(255,107,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <info.icon style={{ color: '#FF6B35', fontSize: '1rem' }} />
                    </div>
                    <div>
                      <div style={{ color: '#FF8C5A', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>{info.title}</div>
                      {info.lines.map((l, j) => <div key={j} style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{l}</div>)}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Map placeholder */}
              <motion.div variants={fadeUp} style={{ borderRadius: '1rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(27,40,69,0.5)', height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <FaMapMarkerAlt style={{ fontSize: '2rem', color: '#FF6B35', marginBottom: '0.5rem' }} />
                <span style={{ fontSize: '0.875rem' }}>Connaught Place, New Delhi</span>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="card" style={{ padding: '2.5rem' }}>
                <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.375rem', marginBottom: '0.5rem' }}>Send Us a <span className="gradient-text">Message</span></h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '2rem' }}>Fill the form and our team will get back to you within 24 hours.</p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="grid-2" style={{ gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <label style={{ color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500 }}>Your Name *</label>
                      <div className="input-wrapper">
                        <input required type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name" className="form-input-plain" />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <label style={{ color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500 }}>Email Address *</label>
                      <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" className="form-input-plain" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <label style={{ color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500 }}>Subject *</label>
                    <select required value={form.subject} onChange={e => set('subject', e.target.value)} className="form-input-plain">
                      <option value="">Select a subject</option>
                      <option>Internship Inquiry</option>
                      <option>Payment Issue</option>
                      <option>Certificate Support</option>
                      <option>Company Partnership</option>
                      <option>General Question</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <label style={{ color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500 }}>Message *</label>
                    <textarea required rows={5} value={form.message} onChange={e => set('message', e.target.value)} placeholder="How can we help you? Please describe your query in detail..." className="form-textarea" />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', fontSize: '1.0625rem', padding: '0.9375rem' }}>
                    {loading ? 'Sending...' : <>Send Message <FaArrowRight /></>}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ strip */}
      <section className="section" style={{ background: 'rgba(27,40,69,0.2)' }}>
        <div className="container" style={{ maxWidth: '52rem' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', textAlign: 'center', marginBottom: '2.5rem' }}>Quick <span className="gradient-text">Answers</span></motion.h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { q: 'How long does it take to receive my offer letter?', a: 'Your offer letter is generated and emailed automatically as soon as your payment is verified — usually within 2–5 minutes.' },
                { q: 'I didn\'t receive the offer letter email. What should I do?', a: 'Check your spam folder first. If still not found, contact us at launchpad7.hr@gmail.com with your payment reference.' },
                { q: 'Can I change my internship dates after applying?', a: 'Yes, you can request a date change by emailing us within 7 days of your application.' },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp} className="card" style={{ padding: '1.5rem 2rem' }}>
                  <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>{item.q}</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>{item.a}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`@media(max-width:768px){.contact-grid{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}


