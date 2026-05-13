import { Link } from 'react-router-dom';
import { FaRocket, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-primary-900 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-400 flex items-center justify-center">
                <FaRocket className="text-white text-lg" />
              </div>
              <div>
                <span className="text-lg font-bold text-white">Launchpad</span>
                <span className="text-xs block text-accent-400 -mt-1">Intensive Pvt Ltd</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Empowering Indian college students with real-world internship experiences that launch careers and build futures.
            </p>
            <div className="flex gap-3">
              {[FaTwitter, FaLinkedin, FaInstagram, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-accent-500 hover:bg-accent-500/10 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-3">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/internships', label: 'Internships' },
                { to: '/companies', label: 'For Companies' },
                { to: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="block text-gray-400 text-sm hover:text-accent-400 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-white font-semibold mb-4">Programs</h4>
            <div className="space-y-3">
              {['Digital Marketing', 'Web Development', 'Business Development', 'Data Science'].map((p) => (
                <span key={p} className="block text-gray-400 text-sm">{p}</span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <FaMapMarkerAlt className="text-accent-500 mt-1 shrink-0" />
                <span>123 Startup Hub, Connaught Place, New Delhi, India - 110001</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <FaEnvelope className="text-accent-500 shrink-0" />
                <span>launchpad7.hr@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <FaPhone className="text-accent-500 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Launchpad Intensive Private Limited. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

