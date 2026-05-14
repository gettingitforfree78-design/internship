import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { submitApplication } from '../services/api';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaBook, FaCalendarAlt, FaMapMarkerAlt, FaFileAlt } from 'react-icons/fa';

const Field = ({ label, name, icon: Icon, type = 'text', required = true, placeholder, children, form, set, errors }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
    <label style={{ color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500 }}>
      {label}{required && <span style={{ color: '#FF6B35' }}> *</span>}
    </label>
    {children || (
      <div className="input-wrapper">
        {Icon && <Icon className="input-icon" />}
        <input type={type} value={form[name]} onChange={e => set(name, e.target.value)}
          placeholder={placeholder || label} className={Icon ? 'form-input' : 'form-input-plain'}
          style={errors[name] ? { borderColor: '#f87171' } : {}} />
      </div>
    )}
    {errors[name] && <span style={{ color: '#f87171', fontSize: '0.8125rem' }}>{errors[name]}</span>}
  </div>
);

export default function ApplicationForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    college: user?.college || '',
    course: '',
    internshipRole: '',
    startDate: '',
    endDate: '',
    mode: 'Remote',
    stipend: '',
    address: '',
  });
  const [errors, setErrors] = useState({});

  const [customRole, setCustomRole] = useState('');
  const [customStipend, setCustomStipend] = useState('');

  const set = useCallback((k, v) => { 
    setForm(f => ({ ...f, [k]: v })); 
    setErrors(e => ({ ...e, [k]: '' })); 
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) errs.phone = '10-digit phone number required';
    if (!form.college.trim()) errs.college = 'College name is required';
    if (!form.course.trim()) errs.course = 'Course / degree is required';
    if (!form.internshipRole.trim()) errs.internshipRole = 'Internship role is required';
    if (!form.startDate) errs.startDate = 'Start date is required';
    if (!form.endDate) errs.endDate = 'End date is required';
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) errs.endDate = 'End date must be after start date';
    if (!form.stipend.trim()) errs.stipend = 'Stipend preference is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); toast.error('Please fix the errors below'); return; }
    setLoading(true);
    try {
      const res = await submitApplication(form);
      toast.success('Application submitted! Proceeding to payment...');
      navigate('/payment', { state: { applicationId: res.data.application._id, applicantName: form.fullName } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '5.5rem', paddingBottom: '4rem', background: 'var(--color-primary-900)' }}>
      <div className="container" style={{ maxWidth: '52rem' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 1.25rem', background: 'rgba(255,107,53,0.1)', borderRadius: '9999px', color: '#FF8C5A', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1rem' }}>
            📝 Step 1 of 2 — Application Form
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 800, marginBottom: '0.5rem' }}>
            Internship <span className="gradient-text">Application</span>
          </h1>
          <p style={{ color: '#94a3b8', lineHeight: 1.7 }}>Fill in your details. After submission, you'll be redirected to pay ₹149.</p>
        </motion.div>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '3.5rem', padding: '0 0.5rem', flexWrap: 'wrap' }}>
          {['Application Form', 'Payment ₹149', 'Offer Letter'].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? '1 1 auto' : '0 0 auto', minWidth: 'fit-content' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  width: '2.25rem', height: '2.25rem', borderRadius: '50%', 
                  background: i === 0 ? 'linear-gradient(135deg, #FF6B35, #FF8C5A)' : 'rgba(255,255,255,0.05)', 
                  color: i === 0 ? '#fff' : '#475569', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontSize: '0.9375rem', fontWeight: 800, flexShrink: 0,
                  boxShadow: i === 0 ? '0 4px 12px rgba(255,107,53,0.3)' : 'none',
                  border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.1)'
                }}>
                  {i + 1}
                </div>
                <span style={{ 
                  fontSize: '0.9375rem', 
                  color: i === 0 ? '#fff' : '#64748b', 
                  fontWeight: i === 0 ? 700 : 500, 
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.01em'
                }}>
                  {s}
                </span>
              </div>
              {i < 2 && (
                <div style={{ 
                  flex: 1, height: '2px', 
                  background: i === 0 ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.05)', 
                  margin: '0 1.25rem', minWidth: '1rem' 
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit}>
            {/* Personal Info */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#FF8C5A', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                Personal Information
              </h3>
              <div className="grid-2" style={{ gap: '1.25rem' }}>
                <Field label="Full Name" name="fullName" icon={FaUser} placeholder="Your full name" form={form} set={set} errors={errors} />
                <Field label="Email Address" name="email" icon={FaEnvelope} type="email" placeholder="your@email.com" form={form} set={set} errors={errors} />
                <Field label="Phone Number" name="phone" icon={FaPhone} placeholder="10-digit mobile number" form={form} set={set} errors={errors} />
                <Field label="Address" name="address" icon={FaMapMarkerAlt} required={false} placeholder="City, State (optional)" form={form} set={set} errors={errors} />
              </div>
            </div>

            {/* Academic Info */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#FF8C5A', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                Academic Details
              </h3>
              <div className="grid-2" style={{ gap: '1.25rem' }}>
                <Field label="College / University" name="college" icon={FaGraduationCap} placeholder="e.g. IIT Delhi" form={form} set={set} errors={errors} />
                <Field label="Course / Degree" name="course" icon={FaBook} placeholder="e.g. B.Tech Computer Science" form={form} set={set} errors={errors} />
              </div>
            </div>

            {/* Internship Details */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#FF8C5A', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                Internship Details
              </h3>
              <div className="grid-2" style={{ gap: '1.25rem' }}>
                <Field label="Internship Designation" name="internshipRole" icon={FaFileAlt} form={form} set={set} errors={errors}>
                  <div className="input-wrapper">
                    <FaFileAlt className="input-icon" />
                    <select value={form.internshipRole === customRole && customRole ? 'Other' : form.internshipRole} onChange={e => { if (e.target.value !== 'Other') { setCustomRole(''); set('internshipRole', e.target.value); } else { set('internshipRole', 'Other'); } }} className="form-input" style={errors.internshipRole ? { borderColor: '#f87171' } : {}}>
                      <option value="">Select Category</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Business Development">Business Development</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Content Writing">Content Writing</option>
                      <option value="App Development">App Development</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Cyber Security">Cyber Security</option>
                      <option value="Other">✏️ Other (type below)</option>
                    </select>
                  </div>
                  {(form.internshipRole === 'Other' || customRole) && (
                    <div className="input-wrapper" style={{ marginTop: '0.5rem' }}>
                      <FaFileAlt className="input-icon" />
                      <input
                        type="text"
                        value={customRole}
                        onChange={e => { setCustomRole(e.target.value); set('internshipRole', e.target.value || 'Other'); }}
                        placeholder="e.g. HR Management, Finance, Legal..."
                        className="form-input"
                        style={errors.internshipRole ? { borderColor: '#f87171' } : {}}
                      />
                    </div>
                  )}
                </Field>
              </div>
            </div>

            {/* Internship Preferences */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#FF8C5A', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                Internship Preferences
              </h3>
              <div className="grid-2" style={{ gap: '1.25rem' }}>
                <Field label="Preferred Start Date" name="startDate" icon={FaCalendarAlt} type="date" form={form} set={set} errors={errors}>
                  <div className="input-wrapper">
                    <FaCalendarAlt className="input-icon" />
                    <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)}
                      className="form-input" style={errors.startDate ? { borderColor: '#f87171' } : {}}
                      min={new Date().toISOString().split('T')[0]} />
                  </div>
                </Field>
                <Field label="Preferred End Date" name="endDate" icon={FaCalendarAlt} type="date" form={form} set={set} errors={errors}>
                  <div className="input-wrapper">
                    <FaCalendarAlt className="input-icon" />
                    <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)}
                      className="form-input" style={errors.endDate ? { borderColor: '#f87171' } : {}}
                      min={form.startDate || new Date().toISOString().split('T')[0]} />
                  </div>
                </Field>
              </div>

              <div className="grid-2" style={{ gap: '1.25rem', marginTop: '1.25rem' }}>
                {/* Mode */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500 }}>Internship Mode <span style={{ color: '#FF6B35' }}>*</span></label>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {['Remote', 'Onsite'].map(m => (
                      <button key={m} type="button" onClick={() => set('mode', m)} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', border: `2px solid ${form.mode === m ? '#FF6B35' : 'rgba(255,255,255,0.08)'}`, background: form.mode === m ? 'rgba(255,107,53,0.1)' : 'rgba(255,255,255,0.03)', color: form.mode === m ? '#FF8C5A' : '#64748b', fontWeight: form.mode === m ? 600 : 400, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9375rem' }}>
                        {m === 'Remote' ? '💻 Remote' : '🏢 Onsite'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stipend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500 }}>Expected Stipend <span style={{ color: '#FF6B35' }}>*</span></label>
                  <select value={form.stipend} onChange={e => set('stipend', e.target.value)} className="form-input-plain" style={errors.stipend ? { borderColor: '#f87171' } : {}}>
                    <option value="">Select preference</option>
                    <option value="Unpaid (Certificate Only)">Unpaid (Certificate Only)</option>
                    <option value="₹2,000 – ₹5,000/month">₹2,000 – ₹5,000/month</option>
                    <option value="₹5,000 – ₹10,000/month">₹5,000 – ₹10,000/month</option>
                    <option value="₹10,000+/month">₹10,000+/month</option>
                    <option value="Performance Based">Performance Based</option>
                    <option value="Other">Other (specify below)</option>
                  </select>
                  {form.stipend === 'Other' && (
                    <input
                      type="text"
                      value={customStipend}
                      onChange={e => { setCustomStipend(e.target.value); set('stipend', e.target.value || 'Other'); }}
                      placeholder="e.g. ₹3,500/month, Equity based..."
                      className="form-input-plain"
                      style={{ marginTop: '0.5rem', ...(errors.stipend ? { borderColor: '#f87171' } : {}) }}
                    />
                  )}
                  {errors.stipend && <span style={{ color: '#f87171', fontSize: '0.8125rem' }}>{errors.stipend}</span>}
                </div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', fontSize: '1.0625rem', padding: '1rem' }}>
              {loading ? '⏳ Submitting...' : '✅ Submit & Proceed to Payment →'}
            </button>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8125rem', marginTop: '1rem' }}>
              🔒 Your information is secure and encrypted
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}


