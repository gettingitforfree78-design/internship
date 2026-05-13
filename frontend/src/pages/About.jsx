import { motion } from 'framer-motion';
import { FaRocket, FaEye, FaHeart, FaUsers, FaGraduationCap, FaCertificate, FaGlobe, FaAward } from 'react-icons/fa';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const team = [
  { name: 'Aryan Sharma', role: 'CEO & Co-Founder', emoji: '👨‍💼', bio: 'IIT alumni with 8 years in EdTech. Passionate about bridging the skill-gap for Indian students.' },
  { name: 'Priya Mehra', role: 'Head of Programs', emoji: '👩‍💻', bio: 'Ex-Google, builds curriculum that reflects real industry needs, not just theory.' },
  { name: 'Rahul Verma', role: 'CTO', emoji: '🧑‍🔬', bio: 'Full-stack engineer who ensures our platform runs seamlessly for thousands of students.' },
  { name: 'Neha Kapoor', role: 'Student Success Lead', emoji: '👩‍🎓', bio: 'Dedicated to ensuring every student gets maximum value from their internship experience.' },
];

const milestones = [
  { year: '2021', event: 'Launchpad Intensive founded in New Delhi' },
  { year: '2022', event: 'First 100 students certified across 5 programs' },
  { year: '2023', event: 'Reached 50+ company partnerships' },
  { year: '2024', event: '500+ students certified, expanded to 3 cities' },
  { year: '2025', event: 'Launched automated digital offer letter & certificate system' },
];

export default function About() {
  return (
    <div>
      <section className="hero-gradient page-header" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '50rem' }}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1.25rem', borderRadius: '9999px', background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', color: '#FF8C5A', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              <FaRocket style={{ fontSize: '0.75rem' }} /> Est. 2021 — New Delhi, India
            </motion.div>
            <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900, color: '#fff', marginBottom: '1.25rem', lineHeight: 1.15 }}>
              Building <span className="gradient-text">India's Launchpad</span><br />for Young Professionals
            </motion.h1>
            <motion.p variants={fadeUp} style={{ color: '#94a3b8', fontSize: '1.0625rem', lineHeight: 1.85, margin: '0 auto' }}>
              Founded with one mission — giving every Indian college student access to real, meaningful internship experience that actually builds their career.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '3rem 0', background: 'rgba(27,40,69,0.4)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div className="grid-4">
            {[{ value: '500+', label: 'Students Certified' }, { value: '50+', label: 'Company Partners' }, { value: '95%', label: 'Satisfaction Rate' }, { value: '4.9★', label: 'Avg Rating' }].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 800 }}>{s.value}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.375rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: '2rem' }}>
            {[
              { icon: FaRocket, color: '#FF6B35', title: 'Our Mission', text: 'To democratize access to quality internship experiences for every Indian college student — regardless of their college tier, city, or background. Every student deserves a fair shot at building a successful career with real skills and verified credentials.' },
              { icon: FaEye, color: '#4ade80', title: 'Our Vision', text: 'To become India\'s most trusted internship and career launchpad — empowering 100,000+ students by 2027. A future where every graduate enters the workforce with genuine experience, not just a degree on paper.' },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card" style={{ padding: '2.5rem', borderTop: `3px solid ${item.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
                  <div className="icon-box" style={{ background: `rgba(${item.color === '#FF6B35' ? '255,107,53' : '74,222,128'},0.1)`, color: item.color }}><item.icon /></div>
                  <h2 style={{ color: '#fff', fontSize: '1.375rem', fontWeight: 800, margin: 0 }}>{item.title}</h2>
                </div>
                <p style={{ color: '#94a3b8', lineHeight: 1.85, fontSize: '0.9375rem', margin: 0 }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'rgba(27,40,69,0.2)' }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ color: '#fff', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 800 }}>What We <span className="gradient-text">Stand For</span></h2>
            </motion.div>
            <div className="grid-4">
              {[
                { icon: FaHeart, title: 'Student First', desc: 'Every decision starts with "how does this help the student?"' },
                { icon: FaGlobe, title: 'Accessibility', desc: 'Quality internships shouldn\'t be limited to metro cities.' },
                { icon: FaAward, title: 'Excellence', desc: 'Highest standards in certificates, mentorship, and support.' },
                { icon: FaUsers, title: 'Community', desc: 'Building India\'s largest network of job-ready professionals.' },
              ].map((v, i) => (
                <motion.div key={i} variants={fadeUp} className="card card-hover" style={{ padding: '2rem', textAlign: 'center' }}>
                  <div className="icon-box" style={{ margin: '0 auto 1.25rem' }}><v.icon /></div>
                  <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>{v.title}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container" style={{ maxWidth: '48rem' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} style={{ color: '#fff', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 800, textAlign: 'center', marginBottom: '3rem' }}>Our <span className="gradient-text">Journey</span></motion.h2>
            <div style={{ position: 'relative', paddingLeft: '2rem' }}>
              <div style={{ position: 'absolute', left: '0.75rem', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, #FF6B35, transparent)' }} />
              {milestones.map((m, i) => (
                <motion.div key={i} variants={fadeUp} style={{ position: 'relative', paddingLeft: '2rem', paddingBottom: '2rem' }}>
                  <div style={{ position: 'absolute', left: '-1.5rem', top: '0.35rem', width: '0.875rem', height: '0.875rem', borderRadius: '50%', background: '#FF6B35', border: '2px solid var(--color-primary-900)', boxShadow: '0 0 10px rgba(255,107,53,0.4)' }} />
                  <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ color: '#FF8C5A', fontWeight: 700, fontSize: '0.875rem' }}>{m.year}</span>
                    <p style={{ color: '#cbd5e1', margin: '0.25rem 0 0', fontSize: '0.9375rem' }}>{m.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="section" style={{ background: 'rgba(27,40,69,0.2)' }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ color: '#fff', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 800 }}>Meet the <span className="gradient-text">Team</span></h2>
            </motion.div>
            <div className="grid-4">
              {team.map((t, i) => (
                <motion.div key={i} variants={fadeUp} className="card card-hover" style={{ padding: '2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{t.emoji}</div>
                  <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.25rem' }}>{t.name}</h3>
                  <div style={{ color: '#FF8C5A', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.75rem' }}>{t.role}</div>
                  <p style={{ color: '#94a3b8', fontSize: '0.8125rem', lineHeight: 1.7, margin: 0 }}>{t.bio}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


