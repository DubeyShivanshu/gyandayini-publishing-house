import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { Link } from 'react-router-dom'

const socialLinks = [
  {
    icon: <FaInstagram size={22} />,
    href: 'https://www.instagram.com/gyandayini_ads_ballia/',
    label: 'Instagram',
    color: 'hover:text-pink-500'
  },
  {
    icon: <FaFacebookF size={22} />,
    href: 'https://facebook.com/gyandayini',
    label: 'Facebook',
    color: 'hover:text-blue-500'
  },
  {
    icon: <FaWhatsapp size={22} />,
    href: 'https://wa.me/917860172643',
    label: 'WhatsApp',
    color: 'hover:text-green-500'
  },
  {
    icon: <MdEmail size={24} />,
    href: 'mailto:gyandayiniph@gmail.com',
    label: 'Gmail',
    color: 'hover:text-red-400'
  }
]

export default function Footer() {
  return (
    <footer className="bg-ink text-cream">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <span className="text-white font-display font-bold text-lg">ज्ञ</span>
              </div>
              <div>
                <p className="font-display font-bold text-lg text-cream leading-tight">GYANDAYINI</p>
                <p className="text-primary-400 text-xs">PUBLISHING HOUSE</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm font-body leading-relaxed">
              Your trusted shop for printing & publishing services, and custom poster & cards printing.
              <br />
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-cream mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2">
              {[
                ['/', 'Home'],
                ['/printing', 'Printing Services'],
                ['/govt-forms', 'Jan Seva Kendra Help'],
                ['/card-printing', 'Card Printing'],
                ['/track', 'Track Order'],
                ['/contact', 'Contact Us'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-200 font-body">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Social */}
          <div>
            <h3 className="font-display font-bold text-cream mb-4 text-lg">Connect With Us</h3>
            <div className="flex items-center gap-4 mb-6">
              {socialLinks.map(({ icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 ${color} transition-all duration-200 hover:bg-white/20 hover:scale-110`}
                >
                  {icon}
                </a>
              ))}
            </div>
            <div className="text-sm text-gray-400 space-y-1 font-body">
              <p>📍 Rampur Udaybhan, In Front of Electric Office, Ballia</p>
              <p>📞 +91 78601 72643</p>
              <p>🕐 Mon–Sat: 8:30 AM – 7:15 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs font-body">
            © 2026 Gyandayini Publishing House. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs font-body">
            Designed & Developed by{" "}
            <a
              href="https://www.linkedin.com/in/shivanshu-dubey-63949823b/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 font-bold hover:underline"
            >
              Shivanshu Dubey
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
