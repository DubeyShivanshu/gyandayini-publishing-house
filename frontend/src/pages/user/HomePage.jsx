import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FiPrinter, FiFileText, FiCreditCard, FiSearch, FiPhone, FiImage, FiList } from 'react-icons/fi'
import api from '../../utils/api.js'

const services = [
  {
    to: '/printing',
    icon: <FiPrinter size={30} />,
    title: 'Printing Services',
    titleHindi: 'प्रिंटिंग सेवाएं',
    desc: 'Documents, photos, frames, posters – any size, color or B&W.',
    color: 'from-orange-400 to-primary-600',
    bg: 'bg-orange-50'
  },
  {
    to: '/govt-forms',
    icon: <FiFileText size={30} />,
    title: 'Jan Seva Kendra Services',
    titleHindi: 'जन सेवा केंद्र सेवाएं',
    desc: 'PAN card, Aadhaar, Domicile, Caste, Income – we fill it for you.',
    color: 'from-blue-400 to-blue-600',
    bg: 'bg-blue-50'
  },
  {
    to: '/card-printing',
    icon: <FiCreditCard size={30} />,
    title: 'Card Printing',
    titleHindi: 'कार्ड प्रिंटिंग',
    desc: 'Marriage, Birthday, Anniversary, Death announcement cards.',
    color: 'from-pink-400 to-rose-600',
    bg: 'bg-pink-50'
  },
  {
    to: '/rate-list',
    icon: <FiList size={30} />,
    title: 'Rate List',
    titleHindi: 'मूल्य सूची',
    desc: 'View our photo & frame printing price chart before ordering.',
    color: 'from-green-400 to-emerald-600',
    bg: 'bg-green-50'
  },
  {
    to: '/track',
    icon: <FiSearch size={30} />,
    title: 'Track Your Order',
    titleHindi: 'ऑर्डर ट्रैक करें',
    desc: 'Check real-time status of your request with your Order ID.',
    color: 'from-violet-400 to-purple-600',
    bg: 'bg-violet-50'
  },
  {
    to: '/contact',
    icon: <FiPhone size={30} />,
    title: 'Contact & Location',
    titleHindi: 'संपर्क और पता',
    desc: 'Find us on the map or reach out via phone or WhatsApp.',
    color: 'from-teal-400 to-cyan-600',
    bg: 'bg-teal-50'
  }
]

// ── Advertisement Banner Carousel 
function AdsBanner({ ads }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (ads.length < 2) return
    const timer = setInterval(() => setCurrent(p => (p + 1) % ads.length), 4000)
    return () => clearInterval(timer)
  }, [ads.length])

  if (ads.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative rounded-3xl overflow-hidden shadow-xl" style={{ maxHeight: '320px' }}>
        {ads.map((ad, i) => (
          <div
            key={ad._id}
            className={`transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
          >
            <img
              src={ad.imageUrl}
              alt={ad.title || 'Advertisement'}
              className="w-full object-cover"
              style={{ maxHeight: '320px', objectFit: 'cover' }}
            />
            {ad.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white font-body font-bold">{ad.title}</p>
              </div>
            )}
          </div>
        ))}
        {/* Dots */}
        {ads.length > 1 && (
          <div className="absolute bottom-3 right-4 flex gap-1.5">
            {ads.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-5' : 'bg-white/50'}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ── Demo Gallery Thumbnails 
function DemoGallery({ demos }) {
  const [lightbox, setLightbox] = useState(null)

  if (demos.length === 0) return null

  return (
    <section className="bg-parchment py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title">Our Sample Work</h2>
          <p className="font-hindi text-primary-600 mt-1">हमारे नमूना कार्य</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {demos.slice(0, 10).map(img => (
            <div key={img._id}
              className="card overflow-hidden cursor-pointer group hover:scale-105 transition-transform duration-200"
              onClick={() => setLightbox(img)}>
              <img src={img.imageUrl} alt={img.title || 'Demo'} className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300" />
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link to="/rate-list" className="btn-secondary inline-flex items-center gap-2">
            <FiImage size={16} /> View All Samples & Rate List
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox.imageUrl} alt={lightbox.title} className="max-w-3xl w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white text-3xl font-light">✕</button>
        </div>
      )}
    </section>
  )
}

export default function HomePage() {
  const [ads,   setAds]   = useState([])
  const [demos, setDemos] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const [adRes, demoRes] = await Promise.all([
          api.get('/media?type=advertisement'),
          api.get('/media?type=demo')
        ])
        setAds(adRes.data.media)
        setDemos(demoRes.data.media)
      } catch { /* silently fail — media is optional */ }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-ink overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white" />
          <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-primary-300" />
          <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-turmeric" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/90 text-sm font-body">Open Now · Trusted Since 2013</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            GYANDAYINI<br />
            <span className="text-primary-200">PUBLISHING HOUSE</span>
          </h1>
          <p className="font-body text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Your one-stop destination for printing & publishing services, jan seva kendra, and custom cards printing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/printing" className="btn-primary text-base py-4 px-8 shadow-2xl">
              🖨️ Start a Request
            </Link>
            <Link to="/rate-list" className="bg-white/10 backdrop-blur border border-white/30 text-white hover:bg-white/20 font-bold py-4 px-8 rounded-lg transition-all duration-200">
              💰 View Rate List
            </Link>
            <Link to="/track" className="bg-white/10 backdrop-blur border border-white/30 text-white hover:bg-white/20 font-bold py-4 px-8 rounded-lg transition-all duration-200">
              📋 Track My Order
            </Link>
          </div>
        </div>
      </section>

      {/* ── Advertisement Banners ── */}
      <AdsBanner ads={ads} />

      {/* ── Services Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="section-title mb-2">Our Services</h2>

          <p className="text-gray-500 font-body mt-2 max-w-xl mx-auto">
            Everything you need, all in one place. Place your request online and pick it up!
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <Link
              key={service.title}
              to={service.to}
              className="card group hover:scale-[1.02] transition-transform duration-200"
            >
              <div className={`${service.bg} p-6`}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                  {service.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-ink mb-1">{service.title}</h3>
                <p className="font-hindi text-primary-600 text-sm mb-2">{service.titleHindi}</p>
                <p className="font-body text-gray-600 text-sm leading-relaxed">{service.desc}</p>
              </div>
              <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-primary-600 text-sm font-bold font-body">Get Started</span>
                <span className="text-primary-500 group-hover:translate-x-1 transition-transform duration-200">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Demo Gallery ── */}
      <DemoGallery demos={demos} />

      {/* ── Why Choose Us ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="section-title">Why Choose Us?</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '⚡', title: 'Fast Turnaround', desc: 'Same day for most jobs' },
            { icon: '🔒', title: 'Secure & Private', desc: 'OTP verified, docs safe' },
            { icon: '💰', title: 'Best Rates', desc: 'Most affordable in town' },
            { icon: '📱', title: 'Order Online', desc: 'From your phone or PC' }
          ].map(item => (
            <div key={item.title} className="text-center bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h4 className="font-display font-bold text-ink mb-1">{item.title}</h4>
              <p className="text-sm text-gray-500 font-body">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-ink py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-white mb-3">Ready to place your order?</h2>
          <p className="font-body text-gray-400 mb-8">Simple process: Submit → Owner confirms price → You pay → Collect</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link to="/printing" className="btn-primary">🖨️ Printing Service</Link>
            <Link to="/govt-forms" className="bg-white/10 border border-white/20 text-white hover:bg-white/20 font-bold py-3 px-6 rounded-lg transition-all">📝 Jan Seva Kendra</Link>
            <Link to="/card-printing" className="bg-white/10 border border-white/20 text-white hover:bg-white/20 font-bold py-3 px-6 rounded-lg transition-all">🎴 Card Printing</Link>
          </div>
        </div>
      </section>

    </div>
  )
}
