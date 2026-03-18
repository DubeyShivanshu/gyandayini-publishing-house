import { FaWhatsapp, FaInstagram, FaFacebookF } from 'react-icons/fa'
import { MdEmail, MdPhone, MdLocationOn, MdAccessTime } from 'react-icons/md'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="section-title">Contact Us</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-display text-xl font-bold mb-5">Get in Touch</h2>
              <div className="space-y-4">
                <a href="tel:+917860172643" className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                    <MdPhone className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-body">Phone / Call</p>
                    <p className="font-bold text-ink font-body">+91 78601 72643</p>
                  </div>
                </a>

                <a href="https://wa.me/917860172643" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                    <FaWhatsapp className="text-green-500" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-body">WhatsApp</p>
                    <p className="font-bold text-ink font-body">Chat with us</p>
                  </div>
                </a>

                <a href="mailto:gyandayiniph@gmail.com"
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 transition-colors">
                    <MdEmail className="text-red-500" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-body">Email</p>
                    <p className="font-bold text-ink font-body">gyandayiniph@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <MdLocationOn className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-body">Address</p>
                    <p className="font-bold text-ink font-body text-sm">Rampur Udaybhan, In Front of Electric Office<br />Ballia, Uttar Pradesh - 277001</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <MdAccessTime className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-body">Shop Hours</p>
                    <p className="font-bold text-ink font-body text-sm">Mon–Sat: 8:30 AM – 7:15 PM<br />Sunday: 8:30 AM – 8:30 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="card p-6">
              <h2 className="font-display text-xl font-bold mb-4">Follow Us</h2>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/gyandayini_ads_ballia/" target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-xl hover:scale-105 transition-transform">
                  <FaInstagram size={28} />
                  <span className="text-xs font-bold">Instagram</span>
                </a>
                <a href="https://facebook.com/gyandayini" target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl hover:scale-105 transition-transform">
                  <FaFacebookF size={28} />
                  <span className="text-xs font-bold">Facebook</span>
                </a>
                <a href="https://wa.me/917860172643" target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-xl hover:scale-105 transition-transform">
                  <FaWhatsapp size={28} />
                  <span className="text-xs font-bold">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Map Embed */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-display text-xl font-bold">Find Us on Map</h2>
            </div>
            <div className="h-80 bg-gray-200 relative">
              <iframe
                src="https://www.google.com/maps?q=25.771300,84.142900&hl=en&z=17&output=embed"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="Shop Location"
              />
            </div>
            <div className="p-4 bg-parchment">
              <p className="text-sm font-body text-gray-600">📍 <strong>Gyandayini Publishing House</strong><br />Rampur Udaybhan, In Front of Electric Office, Ballia(Uttar Pradesh)</p>
              <a href="https://www.google.com/maps/place/25%C2%B046'16.7%22N+84%C2%B008'34.4%22E/@25.771839,84.143379,1590m/data=!3m1!1e3!4m4!3m3!8m2!3d25.7713!4d84.1429?hl=en&entry=ttu&g_ep=EgoyMDI2MDIxMS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary-600 text-sm font-bold mt-2 hover:underline">
                Open in Google Maps →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
