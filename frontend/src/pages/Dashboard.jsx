import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getPaymentHistory, getMyCertificates, updateProfile, getMyApplications, shareOfferLetter } from '../services/api';
import toast from 'react-hot-toast';
import { FaUser, FaGraduationCap, FaCertificate, FaCreditCard, FaDownload, FaEdit, FaSave, FaCheck, FaSpinner, FaFileAlt, FaShare } from 'react-icons/fa';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('overview');
  const [payments, setPayments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [shareEmail, setShareEmail] = useState({});
  const [sharing, setSharing] = useState(false);
  const [profile, setProfile] = useState({ name: '', phone: '', college: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const [payRes, certRes, appRes] = await Promise.all([
          getPaymentHistory(), getMyCertificates(), getMyApplications()
        ]);
        setPayments(payRes.data.payments || []);
        setCertificates(certRes.data.certificates || []);
        setApplications(appRes.data.applications || []);
      } catch { /* silent */ }
      if (user) setProfile({ name: user.name, phone: user.phone || '', college: user.college || '' });
      setLoading(false);
    };
    load();
  }, [user]);

  const handleProfileSave = async () => {
    try {
      await updateProfile(profile);
      toast.success('Profile updated!');
      setEditing(false);
    } catch { toast.error('Update failed'); }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaUser },
    { id: 'internships', label: 'My Internships', icon: FaGraduationCap },
    { id: 'offers', label: 'Offer Letters', icon: FaFileAlt },
    { id: 'payments', label: 'Payments', icon: FaCreditCard },
    { id: 'certificates', label: 'Certificates', icon: FaCertificate },
  ];

  const paidInternships = payments.filter(p => p.status === 'paid');
  const paidApplications = applications.filter(a => a.paymentStatus === 'paid');

  const handleShare = async (appId) => {
    const email = shareEmail[appId];
    if (!email) return toast.error('Please enter an email address');

    setSharing(true);
    try {
      const { data } = await shareOfferLetter(appId, { email });
      toast.success(data.message || 'Offer letter shared successfully!');
      setShareEmail({ ...shareEmail, [appId]: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to share offer letter');
    } finally {
      setSharing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><FaSpinner className="animate-spin text-accent-500 text-3xl" /></div>;

  // MAIN ISSUE:
  // style={{ paddingTop: '350px' }}
  // This is breaking your layout and pushing content strangely.
  // Remove it and use responsive spacing.

  return (
    <div className="min-h-screen pb-12 relative z-10 pt-28 md:pt-32 lg:pt-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
            Welcome,{" "}
            <span className="gradient-text">
              {user?.name?.split(" ")[0]}
            </span>{" "}
            👋
          </h1>

          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Track your internships, payments, and certificates
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 shrink-0
            ${tab === t.id
                  ? "bg-accent-500 text-white shadow-lg"
                  : "glass text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <t.icon className="text-sm" />
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="space-y-6"
          >

            {/* Journey */}
            <div className="glass rounded-2xl p-5 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <h3 className="text-xl font-bold text-white">
                  Your Internship Journey
                </h3>

                <span className="text-xs md:text-sm text-gray-300 bg-white/5 px-4 py-2 rounded-full">
                  {paidApplications.length > 0
                    ? "🎉 Application Completed"
                    : "🚀 In Progress"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">

                {[
                  {
                    label: "Apply",
                    sub: "Details submitted",
                    done: true,
                    icon: FaCheck,
                  },
                  {
                    label: "Payment",
                    sub: "₹199 fee paid",
                    done: paidApplications.length > 0,
                    icon:
                      paidApplications.length > 0
                        ? FaCheck
                        : FaCreditCard,
                  },
                  {
                    label: "Offer Letter",
                    sub: "Ready to download",
                    done: paidApplications.length > 0,
                    icon:
                      paidApplications.length > 0
                        ? FaCheck
                        : FaFileAlt,
                  },
                ].map((s, i) => (
                  <div key={i}>
                    <div
                      className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3
                    ${s.done
                          ? "bg-accent-500 text-white"
                          : "bg-white/5 text-gray-500"
                        }`}
                    >
                      <s.icon />
                    </div>

                    <h4 className="text-white font-semibold">
                      {s.label}
                    </h4>

                    <p className="text-gray-400 text-sm mt-1">
                      {s.sub}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="glass rounded-2xl p-6 text-center">
                <FaGraduationCap className="text-accent-500 text-3xl mx-auto mb-3" />
                <p className="text-3xl font-bold text-white">
                  {paidApplications.length}
                </p>
                <p className="text-gray-400 text-sm">
                  Internships Enrolled
                </p>
              </div>

              <div className="glass rounded-2xl p-6 text-center">
                <FaCreditCard className="text-green-400 text-3xl mx-auto mb-3" />
                <p className="text-3xl font-bold text-white">
                  ₹{paidApplications.length * 199}
                </p>
                <p className="text-gray-400 text-sm">
                  Total Invested
                </p>
              </div>

              <div className="glass rounded-2xl p-6 text-center">
                <FaCertificate className="text-yellow-400 text-3xl mx-auto mb-3" />
                <p className="text-3xl font-bold text-white">
                  {certificates.length}
                </p>
                <p className="text-gray-400 text-sm">
                  Certificates Earned
                </p>
              </div>
            </div>

            {/* Profile */}
            <div className="glass rounded-2xl p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  Profile Settings
                </h3>

                <button className="px-4 py-2 rounded-xl bg-accent-500 text-white text-sm font-semibold">
                  {editing ? "Save Changes" : "Edit Profile"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-400 text-xs block mb-2">
                    FULL NAME
                  </label>
                  <p className="text-white text-lg">{user?.name}</p>
                </div>

                <div>
                  <label className="text-gray-400 text-xs block mb-2">
                    EMAIL ADDRESS
                  </label>
                  <p className="text-white text-lg">{user?.email}</p>
                </div>

                <div>
                  <label className="text-gray-400 text-xs block mb-2">
                    PHONE NUMBER
                  </label>
                  <p className="text-white text-lg">{user?.phone}</p>
                </div>

                <div>
                  <label className="text-gray-400 text-xs block mb-2">
                    COLLEGE / UNIVERSITY
                  </label>
                  <p className="text-white text-lg">{user?.college}</p>
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {/* My Internships */}
        {tab === 'internships' && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
            {paidInternships.length === 0 ? (
              <div className="glass rounded-2xl p-8 md:p-12 text-center"><p className="text-gray-400 text-sm md:text-base">No internships yet. <a href="/internships" className="text-accent-400 hover:underline">Browse programs</a></p></div>
            ) : paidInternships.map((p, i) => (
              <div key={i} className="glass rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-2xl">{p.internshipId?.icon || '🚀'}</div>
                  <div>
                    <h3 className="text-white text-lg font-semibold">{p.internshipId?.title || 'Internship'}</h3>
                    <p className="text-gray-400 text-sm mt-1">{p.internshipId?.duration} • {p.internshipId?.category}</p>
                  </div>
                </div>
                <span className="px-4 py-2 rounded-xl bg-green-500/10 text-green-400 text-sm font-semibold flex items-center gap-2"><FaCheck className="text-xs" /> Enrolled</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Offer Letters */}
        {tab === 'offers' && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
            {applications.length === 0 ? (
              <div className="glass rounded-2xl p-8 md:p-12 text-center"><p className="text-gray-400 text-sm md:text-base">No offer letters available yet.</p></div>
            ) : applications.map((app) => (
              <div key={app._id} className="glass rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div>
                  <h3 className="text-white text-lg font-semibold">{app.internshipRole}</h3>
                  <p className="text-gray-400 text-sm mt-1 mb-3">Company: Launchpad Intensive (Shodwe, Inc.)</p>
                  
                  {app.paymentStatus === 'paid' ? (
                    <a 
                      href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/applications/download/${app._id}?token=${localStorage.getItem('launchpad_token')}`}
                      className="inline-flex items-center gap-2 text-accent-400 text-sm font-mono bg-accent-500/10 px-3 py-1.5 rounded-lg hover:bg-accent-500/20 transition-colors"
                      download={`OfferLetter_${app.offerLetterId}.pdf`}
                    >
                      {app.offerLetterId} <FaDownload className="text-xs" />
                    </a>
                  ) : (
                    <span className={`inline-flex items-center gap-2 text-sm font-mono px-3 py-1.5 rounded-lg ${
                      app.paymentStatus === 'pending_verification' ? 'text-yellow-400 bg-yellow-500/10' :
                      app.paymentStatus === 'rejected' ? 'text-red-400 bg-red-500/10' :
                      app.paymentStatus === 'failed' ? 'text-red-400 bg-red-500/10' :
                      'text-gray-400 bg-white/5'
                    }`}>
                      {app.paymentStatus === 'pending_verification' && '⏳ Pending Verification (12-24 hrs)'}
                      {app.paymentStatus === 'rejected' && '❌ Verification Rejected'}
                      {app.paymentStatus === 'failed' && '❌ Payment Failed'}
                      {app.paymentStatus === 'pending' && '🕒 Waiting for Payment'}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                  {app.paymentStatus === 'paid' ? (
                    <>
                      <a 
                        href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/applications/download/${app._id}?token=${localStorage.getItem('launchpad_token')}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        download={`OfferLetter_${app.offerLetterId}.pdf`}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-accent-500 text-white rounded-xl text-sm font-semibold hover:bg-accent-600 transition-colors shadow-lg shadow-accent-500/20"
                      >
                        <FaDownload /> Download PDF
                      </a>
                      
                      <div className="flex gap-2 flex-1 sm:flex-none">
                        <input 
                          type="email" 
                          placeholder="Share via email..." 
                          value={shareEmail[app._id] || ''} 
                          onChange={(e) => setShareEmail({...shareEmail, [app._id]: e.target.value})}
                          className="w-full sm:w-64 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-accent-500 transition-colors"
                        />
                        <button 
                          onClick={() => handleShare(app._id)}
                          disabled={sharing || !shareEmail[app._id]}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-colors disabled:opacity-50 shrink-0"
                        >
                          {sharing ? <FaSpinner className="animate-spin" /> : <FaShare />}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border ${
                      app.paymentStatus === 'pending_verification' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                      app.paymentStatus === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      app.paymentStatus === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      'bg-white/5 text-gray-500 border-white/10'
                    }`}>
                      {app.paymentStatus === 'pending_verification' && 'Offer letter will be generated once verified.'}
                      {app.paymentStatus === 'rejected' && 'Payment verification failed. Please contact support.'}
                      {app.paymentStatus === 'failed' && 'Transaction failed. Please try again.'}
                      {app.paymentStatus === 'pending' && <Link to="/payment" state={{ applicationId: app._id }} className="text-accent-400 hover:underline">Complete Payment</Link>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Payments */}
        {tab === 'payments' && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass rounded-2xl overflow-hidden p-4 md:p-8">
            <div className="overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs tracking-wider text-gray-400 font-bold uppercase">Internship / Role</th>
                    <th className="text-left px-6 py-4 text-xs tracking-wider text-gray-400 font-bold uppercase">Method</th>
                    <th className="text-left px-6 py-4 text-xs tracking-wider text-gray-400 font-bold uppercase">Amount</th>
                    <th className="text-left px-6 py-4 text-xs tracking-wider text-gray-400 font-bold uppercase">Status</th>
                    <th className="text-left px-6 py-4 text-xs tracking-wider text-gray-400 font-bold uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {/* Razorpay Payments */}
                  {payments.map((p, i) => (
                    <tr key={`pay-${i}`} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-5 text-white text-sm font-medium">{p.internshipId?.title || 'Internship Fee'}</td>
                      <td className="px-6 py-5 text-gray-400 text-sm">Razorpay</td>
                      <td className="px-6 py-5 text-white text-sm">₹{p.amount}</td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${p.status === 'paid' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-400 text-sm">{new Date(p.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    </tr>
                  ))}
                  {/* UPI Manual Applications */}
                  {applications.filter(a => a.upiTransactionId).map((a, i) => (
                    <tr key={`app-${i}`} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-5 text-white text-sm font-medium">{a.internshipRole}</td>
                      <td className="px-6 py-5 text-gray-400 text-sm">UPI (Manual)</td>
                      <td className="px-6 py-5 text-white text-sm">₹{a.amount || 199}</td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          a.paymentStatus === 'paid' ? 'bg-green-500/10 text-green-400' :
                          a.paymentStatus === 'pending_verification' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {a.paymentStatus.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-400 text-sm">{new Date(a.updatedAt || a.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {payments.length === 0 && applications.filter(a => a.upiTransactionId).length === 0 && (
                <p className="text-center py-16 text-gray-400 text-sm">No payment records found.</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Certificates */}
        {tab === 'certificates' && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
            {certificates.length === 0 ? (
              <div className="glass rounded-2xl p-8 md:p-12 text-center"><p className="text-gray-400 text-sm md:text-base">No certificates yet. Complete an internship to earn one!</p></div>
            ) : certificates.map((c, i) => (
              <div key={i} className="glass rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <h3 className="text-white text-lg font-semibold">{c.internshipName}</h3>
                  <p className="text-gray-400 text-sm mt-1">ID: <span className="font-mono text-white/70">{c.certificateId}</span> • {new Date(c.completionDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <a href={`${import.meta.env.VITE_API_URL}/certificate/download/${c._id}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-accent-500/10 text-accent-400 rounded-xl text-sm font-semibold hover:bg-accent-500/20 transition-colors border border-accent-500/20">
                  <FaDownload /> Download Certificate
                </a>
              </div>
            ))}
          </motion.div>
        )}

      </div>
    </div>
  );
}
