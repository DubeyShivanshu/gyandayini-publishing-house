import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FileUpload from '../../components/user/FileUpload.jsx'
import CaptchaInput from '../../components/user/CaptchaInput.jsx'
import api from '../../utils/api.js'
import toast from 'react-hot-toast'

const PRINT_SIZES = ['A4', 'A3', 'A5', 'Letter', '4x6 Photo', '5x7 Photo', '8x10 Photo', '12x18 Poster', 'Custom']
const PAPER_TYPES = ['Normal Paper', 'Glossy Photo Paper', 'Matte Photo Paper', 'Canvas', 'Vinyl']

export default function PrintingServicePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    customerName: '', customerPhone: '', customerEmail: '',
    size: 'A4', quantity: 1, colorMode: 'color',
    paperType: 'Normal Paper', instructions: '',
    fileData: null
  })
  const [captchaOk, setCaptchaOk] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.fileData) { toast.error('Please upload your file'); return }
    if (!captchaOk) { toast.error('Please complete captcha'); return }

    setLoading(true)
    try {
      const res = await api.post('/requests', {
        type: 'printing',
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail,
        printing: {
          fileUrl: form.fileData.url,
          filePublicId: form.fileData.publicId,
          fileType: form.fileData.mimeType?.includes('pdf') ? 'pdf' : 'image',
          size: form.size,
          quantity: form.quantity,
          paperType: form.paperType,
          colorMode: form.colorMode,
          instructions: form.instructions
        }
      })
      toast.success('Request submitted successfully!')
      navigate(`/receipt/${res.data.requestId}`, { state: { request: res.data.request } })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream py-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-primary-600 text-white flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">🖨️</div>
          <h1 className="section-title">Printing Services</h1>
          <p className="font-hindi text-primary-600 mt-1">प्रिंटिंग सेवाएं</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['Upload & Details', 'Verify', 'Submit'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              {i < 2 && <div className={`w-10 h-0.5 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Upload & Details */}
          {step === 1 && (
            <div className="card p-6 fade-in-up space-y-5">
              <h2 className="font-display text-xl font-bold">Upload File & Enter Details</h2>

              <FileUpload label="Upload File (Image or PDF) *" onUpload={data => set('fileData', data)} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Your Name *</label>
                  <input className="input-field" required value={form.customerName} onChange={e => set('customerName', e.target.value)} placeholder="Full Name" />
                </div>
                <div>
                  <label className="label">Phone Number *</label>
                  <input className="input-field" required type="tel" maxLength={10} value={form.customerPhone} onChange={e => set('customerPhone', e.target.value.replace(/\D/g, ''))} placeholder="10-digit mobile" />
                </div>
              </div>

              <div>
                <label className="label">Email Address</label>
                <input className="input-field" type="email" value={form.customerEmail} onChange={e => set('customerEmail', e.target.value)} placeholder="your@email.com (optional)" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="label">Print Size</label>
                  <select className="input-field" value={form.size} onChange={e => set('size', e.target.value)}>
                    {PRINT_SIZES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Quantity</label>
                  <input className="input-field" type="number" min={1} max={10000} value={form.quantity} onChange={e => set('quantity', parseInt(e.target.value))} />
                </div>
                <div>
                  <label className="label">Color Mode</label>
                  <select className="input-field" value={form.colorMode} onChange={e => set('colorMode', e.target.value)}>
                    <option value="color">Color</option>
                    <option value="black_white">Black & White</option>
                  </select>
                </div>
                <div>
                  <label className="label">Paper Type</label>
                  <select className="input-field" value={form.paperType} onChange={e => set('paperType', e.target.value)}>
                    {PAPER_TYPES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Special Instructions</label>
                <textarea className="input-field" rows={3} value={form.instructions} onChange={e => set('instructions', e.target.value)} placeholder="Any special instructions, borders, sizing notes..." />
              </div>

              <button type="button" onClick={() => {
                if (!form.customerName || !form.customerPhone) { toast.error('Name and phone are required'); return }
                if (form.customerPhone.length !== 10) { toast.error('Enter valid 10-digit phone'); return }
                if (!form.fileData) { toast.error('Please upload your file'); return }
                setStep(2)
              }} className="btn-primary w-full">
                Next: Verify →
              </button>
            </div>
          )}

          {/* Step 2: Captcha only */}
          {step === 2 && (
            <div className="card p-6 fade-in-up space-y-6">
              <h2 className="font-display text-xl font-bold">Verify You're Human</h2>
              <p className="text-sm text-gray-600 font-body">Complete the captcha to prevent fake orders.</p>

              <CaptchaInput onVerified={() => setCaptchaOk(true)} />

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1">← Back</button>
                <button type="button" disabled={!captchaOk} onClick={() => setStep(3)}
                  className={`flex-1 font-bold py-3 px-6 rounded-lg transition-all ${captchaOk ? 'btn-primary' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                  Next: Review & Submit →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="card p-6 fade-in-up space-y-4">
              <h2 className="font-display text-xl font-bold">Review Your Order</h2>
              <div className="bg-parchment rounded-xl p-4 space-y-2 text-sm font-body">
                <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-bold">{form.customerName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-bold">{form.customerPhone}</span></div>
                {form.customerEmail && <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-bold">{form.customerEmail}</span></div>}
                <div className="flex justify-between"><span className="text-gray-500">Size</span><span className="font-bold">{form.size}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Quantity</span><span className="font-bold">{form.quantity}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Color</span><span className="font-bold capitalize">{form.colorMode.replace('_', ' ')}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Paper</span><span className="font-bold">{form.paperType}</span></div>
                {form.instructions && <div><span className="text-gray-500">Instructions:</span><p className="font-bold mt-1">{form.instructions}</p></div>}
                <div className="flex justify-between"><span className="text-gray-500">File</span><span className="font-bold text-green-600">✓ Uploaded</span></div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm font-body">
                <p className="text-blue-700">💡 <strong>How to pay:</strong> After submitting, the owner will review your request and send you the price. Contact them via phone or email to pay and collect your order.</p>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="btn-outline flex-1">← Back</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {loading ? <><div className="loader w-4 h-4 border-2" /> Submitting...</> : '✅ Submit Order'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}