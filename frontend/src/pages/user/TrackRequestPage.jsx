import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../utils/api.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import toast from 'react-hot-toast'
import { FiCopy, FiTrash2, FiSearch, FiClock, FiPackage, FiCheckCircle } from 'react-icons/fi'

// ── 3-step config 
const STEPS = [
  {
    key: 'pending',
    Icon: FiClock,
    label: 'Submitted',
    sublabel: 'Request received',
  },
  {
    key: 'payment_received',
    Icon: FiPackage,
    label: 'Payment Received',
    sublabel: 'Payment confirmed',
  },
  {
    key: 'completed',
    Icon: FiCheckCircle,
    label: 'Completed',
    sublabel: 'Order ready',
  },
]

// ── localStorage helpers 
const STORAGE_KEY = 'gyd_request_ids'

const getSavedIds = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}

const saveRequestId = (id, name, phone) => {
  const list = getSavedIds().filter(r => r.id !== id)
  list.unshift({ id, name, phone, savedAt: new Date().toISOString() })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 10)))
}

const removeFromSaved = (id) => {
  const list = getSavedIds().filter(r => r.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

const getServiceLabel = (type) => ({
  printing: '🖨️ Printing', govt_form: '📝 Jan Seva Kendra',
  card_printing: '🎴 Card Printing', photo_frame: '🖼️ Photo/Frame'
}[type] || type || 'Service')

export default function TrackRequestPage() {
  const [urlParams] = useSearchParams()
  const [requestId, setRequestId] = useState(urlParams.get('id') || '')
  const [phone, setPhone]         = useState(urlParams.get('phone') || '')
  const [request, setRequest]     = useState(null)
  const [loading, setLoading]     = useState(false)
  const [savedIds, setSavedIds]   = useState(getSavedIds())

  useEffect(() => {
    if (urlParams.get('id') && urlParams.get('phone')) {
      doTrack(urlParams.get('id'), urlParams.get('phone'))
    }
  }, []) // eslint-disable-line

  const doTrack = async (id, ph) => {
    setLoading(true)
    try {
      const res = await api.get(`/requests/track?requestId=${id.trim().toUpperCase()}&phone=${ph.trim()}`)
      const req = res.data.request
      setRequest(req)
      saveRequestId(req.requestId, req.customerName, req.customerPhone)
      setSavedIds(getSavedIds())
    } catch (err) {
      toast.error(err.response?.data?.message || 'Request not found. Check ID and phone.')
      setRequest(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!requestId.trim() || !phone.trim()) { toast.error('Enter both Request ID and phone'); return }
    doTrack(requestId, phone)
  }

  const copyId = (id) => {
    navigator.clipboard.writeText(id)
    toast.success('Copied!')
  }

  const handleRemove = (id) => {
    removeFromSaved(id)
    setSavedIds(getSavedIds())
  }

  const fillFrom = (saved) => {
    setRequestId(saved.id)
    setPhone(saved.phone)
    toast('Filled! Press Track to search.', { icon: '✍️' })
  }

  const stepIndex = STEPS.findIndex(s => s.key === request?.status)

  return (
    <div className="min-h-screen bg-cream py-10">
      <div className="max-w-2xl mx-auto px-4 space-y-6">

        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 text-white flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">🔍</div>
          <h1 className="section-title">Track Your Order</h1>
          <p className="font-hindi text-purple-600 mt-1">अपना ऑर्डर ट्रैक करें</p>
        </div>

        {/* ── Saved Request IDs Storage Box ── */}
        {savedIds.length > 0 && (
          <div className="card border-2 border-dashed border-primary-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📦</span>
              <h2 className="font-display font-bold text-ink">Your Saved Request IDs</h2>
              <span className="ml-auto text-xs text-gray-400 font-body bg-gray-100 px-2 py-1 rounded-full">
                {savedIds.length} saved
              </span>
            </div>
            <p className="text-xs text-gray-500 font-body mb-3">
              Tap a row to fill Request ID and phone automatically ↓
            </p>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {savedIds.map(saved => (
                <div
                  key={saved.id}
                  onClick={() => fillFrom(saved)}
                  className="flex items-center gap-3 bg-parchment hover:bg-primary-50 border border-transparent hover:border-primary-200 rounded-xl px-4 py-3 cursor-pointer transition-all group"
                >
                  {/* Left: ID + name */}
                  <div className="flex-1 min-w-0">
                    <p className="font-mono font-bold text-sm text-primary-700 truncate">{saved.id}</p>
                    <p className="text-xs text-gray-500 font-body mt-0.5">
                      {saved.name} &middot; {saved.phone}
                    </p>
                  </div>

                  {/* Date */}
                  <span className="text-xs text-gray-400 font-body whitespace-nowrap hidden sm:block">
                    {new Date(saved.savedAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short' })}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => { e.stopPropagation(); copyId(saved.id) }}
                      className="p-1.5 rounded-lg hover:bg-white text-gray-400 hover:text-primary-600 transition-colors"
                      title="Copy ID"
                    >
                      <FiCopy size={13} />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleRemove(saved.id) }}
                      className="p-1.5 rounded-lg hover:bg-white text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Search Form ── */}
        <form onSubmit={handleSubmit} className="card p-6">
          <h2 className="font-display font-bold text-lg text-ink mb-4">Enter Details to Track</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Request ID *</label>
              <div className="relative">
                <input
                  className="input-field pr-10 font-mono uppercase"
                  value={requestId}
                  onChange={e => setRequestId(e.target.value.toUpperCase())}
                  placeholder="GYD-XXXXX-XXXX"
                />
                {requestId && (
                  <button type="button" onClick={() => copyId(requestId)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600">
                    <FiCopy size={15} />
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="label">Registered Phone Number *</label>
              <input
                className="input-field"
                type="tel"
                maxLength={10}
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit mobile number"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading
                ? <><div className="loader w-4 h-4 border-2" /> Tracking...</>
                : <><FiSearch size={16} /> Track Request</>}
            </button>
          </div>
        </form>

        {/* ── Result ── */}
        {request && (
          <div className="space-y-5 fade-in-up">

            {/* Status + 3-step progress */}
            <div className="card p-6">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500 font-body">Request ID</p>
                  <p className="font-mono font-bold text-lg text-ink">{request.requestId}</p>
                </div>
                <StatusBadge status={request.status} />
              </div>

              {/* 3-Step Progress */}
              <div className="relative mb-8">
                {/* Background connector */}
                <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-gray-200 z-0" />
                {/* Progress fill */}
                <div
                  className="absolute top-5 left-[10%] h-0.5 bg-gradient-to-r from-primary-500 to-primary-400 z-0 transition-all duration-700"
                  style={{ width: stepIndex > 0 ? `${(stepIndex / (STEPS.length - 1)) * 80}%` : '0%' }}
                />
                <div className="relative z-10 flex items-start justify-between">
                  {STEPS.map((step, i) => {
                    const done   = stepIndex > i
                    const active = stepIndex === i
                    const StepIcon = step.Icon
                    return (
                      <div key={step.key} className="flex flex-col items-center gap-2 w-1/3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                          done
                            ? 'bg-primary-600 border-primary-600 text-white shadow-md'
                            : active
                              ? 'bg-white border-primary-500 text-primary-600 shadow-lg ring-4 ring-primary-100'
                              : 'bg-white border-gray-300 text-gray-300'
                        }`}>
                          {done ? <span className="text-base">✓</span> : <StepIcon size={17} />}
                        </div>
                        <div className="text-center">
                          <p className={`text-xs font-bold font-body leading-tight ${
                            active ? 'text-primary-700' : done ? 'text-gray-700' : 'text-gray-400'
                          }`}>
                            {step.label}
                          </p>
                          <p className={`text-xs font-body mt-0.5 hidden sm:block ${active || done ? 'text-gray-400' : 'text-gray-300'}`}>
                            {step.sublabel}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Details */}
              <div className="bg-parchment rounded-xl p-4 space-y-2 text-sm font-body">
                <div className="flex justify-between">
                  <span className="text-gray-500">Customer</span>
                  <span className="font-bold">{request.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-bold">{request.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service</span>
                  <span className="font-bold">{getServiceLabel(request.type)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Submitted</span>
                  <span className="font-bold">
                    {new Date(request.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
                {request.ownerNotes && (
                  <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs font-bold text-amber-700 mb-1">📩 Message from Owner:</p>
                    <p className="text-amber-800">{request.ownerNotes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Receipt / Bill ── */}
            {request.receipt?.items?.length > 0 ? (
              <div className="card overflow-hidden">
                <div className="bg-gradient-to-r from-primary-700 to-primary-900 px-6 py-4 flex items-center gap-3">
                  <span className="text-2xl">🧾</span>
                  <div>
                    <h3 className="font-display font-bold text-white text-lg">Bill / Receipt</h3>
                    <p className="text-primary-300 text-xs font-body">
                      Generated on {new Date(request.receipt.generatedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-body">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-2 text-xs text-gray-500 font-bold uppercase tracking-wide">Item Name</th>
                          <th className="text-center py-2 text-xs text-gray-500 font-bold uppercase tracking-wide">Qty</th>
                          <th className="text-right py-2 text-xs text-gray-500 font-bold uppercase tracking-wide">Rate (₹)</th>
                          <th className="text-right py-2 text-xs text-gray-500 font-bold uppercase tracking-wide">Total (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {request.receipt.items.map((item, i) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 text-ink font-medium">{item.itemName}</td>
                            <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                            <td className="py-3 text-right text-gray-600">₹{item.pricePerItem}</td>
                            <td className="py-3 text-right font-bold text-ink">₹{item.totalPrice}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-primary-200">
                          <td colSpan={3} className="pt-4 font-display font-bold text-base text-ink">Grand Total</td>
                          <td className="pt-4 text-right font-display font-bold text-2xl text-primary-700">
                            ₹{request.receipt.grandTotal}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  {request.receipt.notes && (
                    <p className="text-xs text-gray-500 font-body italic mt-4 pt-3 border-t">
                      📝 {request.receipt.notes}
                    </p>
                  )}

                  {/* Pay instructions */}
                  <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="font-body font-bold text-amber-800 text-sm mb-3">💬 Pay via Call, Email, or Visit:</p>
                    <div className="space-y-1.5 text-sm font-body">
                      <a href="tel:+917860172643" className="flex items-center gap-2 text-amber-700 hover:text-primary-700">
                        📞 <span className="font-bold">+91 78601 72643</span>
                      </a>
                      <a href="mailto:gyandayini@gmail.com" className="flex items-center gap-2 text-amber-700 hover:text-primary-700">
                        📧 <span className="font-bold">gyandayiniph@gmail.com</span>
                      </a>
                      <p className="flex items-center gap-2 text-amber-700">
                        🏪 <span>Rampur Udaybhan, In Front of Electric Office, Ballia · Mon–Sat: 8:30AM – 7:15PM</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-5">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
                  <p className="text-3xl mb-2">💬</p>
                  <p className="font-display font-bold text-amber-800">Bill not yet generated</p>
                  <p className="text-xs text-amber-600 mt-1 font-body">
                    Owner will review and set pricing. Check back soon or contact the owner.
                  </p>
                  <a href="tel:+917860172643" className="inline-block mt-3 btn-primary text-sm py-2 px-5">
                    📞 Contact Owner
                  </a>
                </div>
              </div>
            )}

            {/* Status messages */}
            {request.status === 'payment_received' && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4">
                <span className="text-3xl">✅</span>
                <div>
                  <p className="font-display font-bold text-blue-800 text-lg">Payment Confirmed!</p>
                  <p className="text-sm text-blue-600 font-body mt-1">
                    Owner has confirmed your payment. Your work/order is now being processed.
                  </p>
                </div>
              </div>
            )}

            {request.status === 'completed' && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-start gap-4">
                <span className="text-3xl">🎉</span>
                <div>
                  <p className="font-display font-bold text-green-800 text-lg">Order Completed!</p>
                  <p className="text-sm text-green-600 font-body mt-1">Your order is ready! Please visit the shop to collect.</p>
                  <p className="text-xs text-green-500 font-body mt-1">📍 Rampur Udaybhan, In Front of Electric Office, Ballia · Mon–Sat: 8:30AM – 7:15PM</p>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}
