import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  getAllUsers, deleteUser, getUserStats,
  getInternships, createInternship, updateInternship, deleteInternship,
  getPaymentHistory, getAllCertificates, generateCertificate, sendCertificate,
  getAllCompanies
} from '../services/api';
import toast from 'react-hot-toast';
import {
  FaUsers, FaGraduationCap, FaCreditCard, FaCertificate,
  FaBuilding, FaTrash, FaPlus, FaEdit, FaPaperPlane,
  FaChartBar, FaSpinner, FaTimes, FaCheck
} from 'react-icons/fa';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: FaChartBar },
  { id: 'users', label: 'Users', icon: FaUsers },
  { id: 'internships', label: 'Internships', icon: FaGraduationCap },
  { id: 'payments', label: 'Payments', icon: FaCreditCard },
  { id: 'certificates', label: 'Certificates', icon: FaCertificate },
  { id: 'companies', label: 'Companies', icon: FaBuilding },
];

const defaultInternship = {
  title: '', category: '', duration: '', price: '', originalPrice: '',
  shortDescription: '', icon: '🚀', skills: '', features: '',
};

export default function Admin() {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [internships, setInternships] = useState([]);
  const [payments, setPayments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultInternship);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, internsRes, paymentsRes, certsRes, compsRes] = await Promise.all([
        getUserStats(), getAllUsers(), getInternships(),
        getPaymentHistory(true), getAllCertificates(), getAllCompanies()
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users || []);
      setInternships(internsRes.data.internships || []);
      setPayments(paymentsRes.data.payments || []);
      setCertificates(certsRes.data.certificates || []);
      setCompanies(compsRes.data.companies || []);
    } catch { toast.error('Failed to load data'); }
    setLoading(false);
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try { await deleteUser(id); setUsers(u => u.filter(x => x._id !== id)); toast.success('User deleted'); }
    catch { toast.error('Failed to delete user'); }
  };

  const handleSaveInternship = async (e) => {
    e.preventDefault(); setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price), originalPrice: Number(form.originalPrice),
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      features: form.features.split(',').map(s => s.trim()).filter(Boolean),
    };
    try {
      if (editingId) { await updateInternship(editingId, payload); toast.success('Updated!'); }
      else { await createInternship(payload); toast.success('Created!'); }
      setShowForm(false); setEditingId(null); setForm(defaultInternship);
      const res = await getInternships(); setInternships(res.data.internships || []);
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    setSaving(false);
  };

  const handleEditInternship = (intern) => {
    setForm({
      title: intern.title, category: intern.category, duration: intern.duration,
      price: intern.price, originalPrice: intern.originalPrice,
      shortDescription: intern.shortDescription, icon: intern.icon || '🚀',
      skills: (intern.skills || []).join(', '), features: (intern.features || []).join(', '),
    });
    setEditingId(intern._id); setShowForm(true);
  };

  const handleDeleteInternship = async (id) => {
    if (!confirm('Delete this internship?')) return;
    try { await deleteInternship(id); setInternships(i => i.filter(x => x._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); }
  };

  const handleGenerateCert = async (userId, internshipId) => {
    try {
      await generateCertificate(userId, { internshipId });
      toast.success('Certificate generated!');
      const res = await getAllCertificates(); setCertificates(res.data.certificates || []);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleSendCert = async (userId, certId) => {
    try { await sendCertificate(userId, { certificateId: certId }); toast.success('Certificate emailed!'); }
    catch { toast.error('Email failed'); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><FaSpinner className="animate-spin text-accent-500 text-3xl" /></div>;

  return (
    <div className="min-h-screen pb-12 relative z-10 pt-28 md:pt-32 lg:pt-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">Admin <span className="gradient-text">Panel</span></h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">Manage users, internships, payments, and certificates</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 shrink-0 ${tab === t.id ? 'bg-accent-500 text-white shadow-lg' : 'glass text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <t.icon className="text-sm" /> {t.label}
            </button>
          ))}
        </div>

        {/* Dashboard Stats */}
        {tab === 'dashboard' && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: stats?.totalUsers ?? users.length, icon: FaUsers, color: 'text-blue-400' },
                { label: 'Internships', value: internships.length, icon: FaGraduationCap, color: 'text-accent-500' },
                { label: 'Revenue (₹)', value: payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0).toLocaleString('en-IN'), icon: FaCreditCard, color: 'text-green-400' },
                { label: 'Certificates', value: certificates.length, icon: FaCertificate, color: 'text-yellow-400' },
              ].map((s, i) => (
                <div key={i} className="glass rounded-2xl p-6 text-center">
                  <s.icon className={`text-3xl mx-auto mb-3 ${s.color}`} />
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-gray-400 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {users.slice(0, 5).map((u, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div><p className="text-white text-sm">{u.name}</p><p className="text-gray-500 text-xs">{u.email}</p></div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${u.role === 'admin' ? 'bg-accent-500/20 text-accent-400' : 'bg-white/5 text-gray-400'}`}>{u.role}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Recent Payments</h3>
                <div className="space-y-3">
                  {payments.slice(0, 5).map((p, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div><p className="text-white text-sm">{p.userId?.name || 'User'}</p><p className="text-gray-500 text-xs">{p.internshipId?.title || 'Internship'}</p></div>
                      <span className="text-green-400 text-sm font-medium">₹{p.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass rounded-2xl overflow-hidden p-4 md:p-8">
            <div className="overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                  {['Name', 'Email', 'College', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs tracking-wider text-gray-400 font-bold uppercase">{h}</th>
                  ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-5 text-white text-sm font-medium">{u.name}</td>
                      <td className="px-6 py-5 text-gray-300 text-sm">{u.email}</td>
                      <td className="px-6 py-5 text-gray-400 text-sm">{u.college || '—'}</td>
                      <td className="px-6 py-5"><span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${u.role === 'admin' ? 'bg-accent-500/20 text-accent-400' : 'bg-white/5 text-gray-400'}`}>{u.role.toUpperCase()}</span></td>
                      <td className="px-6 py-5 text-gray-400 text-sm">{new Date(u.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      <td className="px-6 py-5">
                        {u.role !== 'admin' && (
                          <button onClick={() => handleDeleteUser(u._id)} className="text-red-400 hover:text-red-300 transition-colors bg-red-400/10 p-2 rounded-lg"><FaTrash /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="text-center py-16 text-gray-400 text-sm">No users found</p>}
            </div>
          </motion.div>
        )}

        {/* Internships Tab */}
        {tab === 'internships' && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => { setForm(defaultInternship); setEditingId(null); setShowForm(true); }}
                className="flex items-center gap-2 px-5 py-2.5 bg-accent-500 text-white rounded-xl text-sm font-medium hover:bg-accent-600 transition-colors">
                <FaPlus /> Add Internship
              </button>
            </div>

            {showForm && (
              <div className="glass rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">{editingId ? 'Edit' : 'New'} Internship</h3>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><FaTimes /></button>
                </div>
                <form onSubmit={handleSaveInternship} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'title', placeholder: 'Title', required: true },
                    { name: 'category', placeholder: 'Category (e.g. Technology)' },
                    { name: 'duration', placeholder: 'Duration (e.g. 4 Weeks)' },
                    { name: 'icon', placeholder: 'Emoji Icon (e.g. 💻)' },
                    { name: 'price', placeholder: 'Price (₹)', type: 'number', required: true },
                    { name: 'originalPrice', placeholder: 'Original Price (₹)', type: 'number' },
                  ].map(f => (
                    <input key={f.name} required={f.required} type={f.type || 'text'} placeholder={f.placeholder}
                      value={form[f.name]} onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                      className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-500" />
                  ))}
                  <textarea placeholder="Short Description" value={form.shortDescription}
                    onChange={e => setForm({ ...form, shortDescription: e.target.value })}
                    className="sm:col-span-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-500 resize-none h-20" />
                  <input placeholder="Skills (comma-separated)" value={form.skills}
                    onChange={e => setForm({ ...form, skills: e.target.value })}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-500" />
                  <input placeholder="Features (comma-separated)" value={form.features}
                    onChange={e => setForm({ ...form, features: e.target.value })}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-500" />
                  <div className="sm:col-span-2 flex gap-3 justify-end">
                    <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 glass rounded-xl text-gray-400 hover:text-white text-sm">Cancel</button>
                    <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-accent-500 text-white rounded-xl text-sm font-medium hover:bg-accent-600 disabled:opacity-50">
                      {saving ? <FaSpinner className="animate-spin" /> : <FaCheck />} {editingId ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="glass rounded-2xl overflow-hidden p-4 md:p-8">
              <div className="overflow-x-auto rounded-xl border border-white/5">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                    {['', 'Title', 'Category', 'Duration', 'Price', 'Enrolled', 'Actions'].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-xs tracking-wider text-gray-400 font-bold uppercase">{h}</th>
                    ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {internships.map((intern, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-5 text-3xl">{intern.icon}</td>
                        <td className="px-6 py-5 text-white text-sm font-medium">{intern.title}</td>
                        <td className="px-6 py-5 text-gray-400 text-sm">{intern.category}</td>
                        <td className="px-6 py-5 text-gray-400 text-sm">{intern.duration}</td>
                        <td className="px-6 py-5 text-white text-sm font-medium">₹{intern.price}</td>
                        <td className="px-6 py-5 text-gray-400 text-sm">{intern.enrolledCount}</td>
                        <td className="px-6 py-5 flex items-center gap-3">
                          <button onClick={() => handleEditInternship(intern)} className="text-blue-400 hover:text-blue-300 bg-blue-400/10 p-2 rounded-lg transition-colors"><FaEdit /></button>
                          <button onClick={() => handleDeleteInternship(intern._id)} className="text-red-400 hover:text-red-300 bg-red-400/10 p-2 rounded-lg transition-colors"><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {internships.length === 0 && <p className="text-center py-16 text-gray-400 text-sm">No internships. Add one above.</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* Payments Tab */}
        {tab === 'payments' && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass rounded-2xl overflow-hidden p-4 md:p-8">
            <div className="overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                  {['Student', 'Internship', 'Amount', 'Order ID', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs tracking-wider text-gray-400 font-bold uppercase">{h}</th>
                  ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {payments.map((p, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-5 text-white text-sm font-medium">{p.userId?.name || '—'}</td>
                      <td className="px-6 py-5 text-gray-300 text-sm">{p.internshipId?.title || '—'}</td>
                      <td className="px-6 py-5 text-white text-sm font-medium">₹{p.amount}</td>
                      <td className="px-6 py-5 text-gray-400 text-xs font-mono">{p.razorpayOrderId?.slice(-12) || '—'}</td>
                      <td className="px-6 py-5"><span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${p.status === 'paid' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{p.status.toUpperCase()}</span></td>
                      <td className="px-6 py-5 text-gray-400 text-sm">{new Date(p.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {payments.length === 0 && <p className="text-center py-16 text-gray-400 text-sm">No payments yet</p>}
            </div>
          </motion.div>
        )}

        {/* Certificates Tab */}
        {tab === 'certificates' && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
            {/* Generate Certificate */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Generate Certificate for Student</h3>
              <p className="text-gray-400 text-sm mb-4">Select a user from the Payments tab who has completed their internship, then generate and email their certificate.</p>
              <div className="flex flex-wrap gap-3">
                {payments.filter(p => p.status === 'paid').map((p, i) => (
                  <div key={i} className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                    <div>
                      <p className="text-white text-sm font-medium">{p.userId?.name}</p>
                      <p className="text-gray-400 text-xs">{p.internshipId?.title}</p>
                    </div>
                    <button onClick={() => handleGenerateCert(p.userId?._id, p.internshipId?._id)}
                      className="px-3 py-1 text-xs bg-accent-500/10 text-accent-400 rounded-lg hover:bg-accent-500/20 transition-colors font-medium">
                      Generate
                    </button>
                  </div>
                ))}
                {payments.filter(p => p.status === 'paid').length === 0 && <p className="text-gray-400 text-sm">No paid enrollments found.</p>}
              </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden p-4 md:p-8">
              <div className="overflow-x-auto rounded-xl border border-white/5">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                    {['Student', 'Internship', 'Certificate ID', 'Date', 'Email Sent', 'Actions'].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-xs tracking-wider text-gray-400 font-bold uppercase">{h}</th>
                    ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {certificates.map((c, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-5 text-white text-sm font-medium">{c.userId?.name || '—'}</td>
                        <td className="px-6 py-5 text-gray-300 text-sm">{c.internshipName}</td>
                        <td className="px-6 py-5 text-gray-400 text-xs font-mono">{c.certificateId}</td>
                        <td className="px-6 py-5 text-gray-400 text-sm">{new Date(c.completionDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                        <td className="px-6 py-5"><span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${c.emailSent ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>{c.emailSent ? 'YES' : 'NO'}</span></td>
                        <td className="px-6 py-5 flex items-center gap-3">
                          <a href={`${import.meta.env.VITE_API_URL}/certificate/download/${c._id}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-sm font-medium bg-blue-400/10 px-3 py-1.5 rounded-lg transition-colors">Download</a>
                          {!c.emailSent && <button onClick={() => handleSendCert(c.userId?._id, c._id)} className="flex items-center gap-2 bg-accent-500/10 text-accent-400 hover:bg-accent-500/20 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"><FaPaperPlane className="text-xs" /> Email</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {certificates.length === 0 && <p className="text-center py-16 text-gray-400 text-sm">No certificates generated yet</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* Companies Tab */}
        {tab === 'companies' && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass rounded-2xl overflow-hidden p-4 md:p-8">
            <div className="overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                  {['Company', 'Email', 'Phone', 'Industry', 'Status', 'Joined'].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs tracking-wider text-gray-400 font-bold uppercase">{h}</th>
                  ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {companies.map((c, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-5 text-white text-sm font-medium">{c.name}</td>
                      <td className="px-6 py-5 text-gray-300 text-sm">{c.email}</td>
                      <td className="px-6 py-5 text-gray-400 text-sm">{c.phone || '—'}</td>
                      <td className="px-6 py-5 text-gray-400 text-sm">{c.industry || '—'}</td>
                      <td className="px-6 py-5"><span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${c.status === 'approved' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{c.status.toUpperCase()}</span></td>
                      <td className="px-6 py-5 text-gray-400 text-sm">{new Date(c.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {companies.length === 0 && <p className="text-center py-16 text-gray-400 text-sm">No partner companies yet</p>}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
