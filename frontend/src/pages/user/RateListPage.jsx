import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api.js'

export default function RateListPage() {
  const [rateImages, setRateImages]  = useState([])
  const [demoImages, setDemoImages]  = useState([])
  const [loading,    setLoading]     = useState(true)
  const [lightbox,   setLightbox]    = useState(null) // { url, title }

  useEffect(() => {
    const load = async () => {
      try {
        const [rateRes, demoRes] = await Promise.all([
          api.get('/media?type=rate_list'),
          api.get('/media?type=demo')
        ])
        setRateImages(rateRes.data.media)
        setDemoImages(demoRes.data.media)
      } catch (err) {
        console.error('Rate list load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-cream">

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 via-emerald-700 to-ink py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">💰</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            Printing Rate List
          </h1>
          <p className="font-hindi text-green-200 text-xl mb-3">मूल्य सूची</p>
          <p className="font-body text-white/80 text-lg max-w-xl mx-auto">
            Check our photo printing, frame printing, and other rates before placing your order.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

        {/* Rate List Images */}
        <section>
          <div className="text-center mb-8">
            <h2 className="section-title text-ink mb-2">📋 Price Charts</h2>
            <p className="font-body text-gray-500">
              Click any image to zoom in and see full details
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><div className="loader" /></div>
          ) : rateImages.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
              <p className="text-5xl mb-3">📄</p>
              <p className="font-display text-xl font-bold text-gray-400">Rate list not uploaded yet</p>
              <p className="text-gray-400 font-body mt-2">Please contact the owner for current prices.</p>
              <a href="tel:+917860172643" className="inline-block mt-4 btn-primary">📞 Call for Rates</a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {rateImages.map(img => (
                <div
                  key={img._id}
                  className="card overflow-hidden cursor-pointer group hover:scale-[1.02] transition-transform duration-200"
                  onClick={() => setLightbox({ url: img.imageUrl, title: img.title })}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={img.imageUrl}
                      alt={img.title || 'Rate List'}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      style={{ maxHeight: '500px', objectFit: 'contain', background: '#f9f9f9' }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-ink text-sm font-bold px-4 py-2 rounded-full">
                        🔍 Click to Zoom
                      </span>
                    </div>
                  </div>
                  {img.title && (
                    <div className="px-4 py-3 border-t">
                      <p className="font-body font-bold text-ink text-sm">{img.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Demo / Sample Work */}
        {demoImages.length > 0 && (
          <section>
            <div className="text-center mb-8">
              <h2 className="section-title text-ink mb-2">🖼️ Our Sample Work</h2>
              <p className="font-body text-gray-500">Browse our previous printing work and quality samples</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {demoImages.map(img => (
                <div
                  key={img._id}
                  className="card overflow-hidden cursor-pointer group hover:scale-105 transition-transform duration-200"
                  onClick={() => setLightbox({ url: img.imageUrl, title: img.title })}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.title || 'Demo'}
                    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {img.title && (
                    <div className="px-3 py-2 border-t">
                      <p className="text-xs font-body text-gray-600 truncate">{img.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-10 text-center text-white">
          <h2 className="font-display text-3xl font-bold mb-3">Ready to Order?</h2>
          <p className="font-body text-primary-200 mb-6 max-w-md mx-auto">
            Place your printing request online. Our team will review and confirm your order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/printing" className="bg-white text-primary-700 font-bold py-3 px-8 rounded-xl hover:bg-primary-50 transition-colors">
              🖨️ Place Print Order
            </Link>
            <a href="tel:+917860172643" className="bg-white/10 border border-white/30 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/20 transition-colors">
              📞 Call for Quote
            </a>
          </div>
        </section>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              {lightbox.title && <p className="text-white font-body font-bold">{lightbox.title}</p>}
              <button
                onClick={() => setLightbox(null)}
                className="ml-auto text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-xl transition-colors"
              >
                ✕
              </button>
            </div>
            <img
              src={lightbox.url}
              alt={lightbox.title || 'Full View'}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}
