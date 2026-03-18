import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import EmailOTPInput from '../../components/user/OTPInput.jsx'
import CaptchaInput from '../../components/user/CaptchaInput.jsx'
import api from '../../utils/api.js'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { value: 'marriage', label: 'Marriage Card', icon: '💒', color: 'from-pink-400 to-rose-600' },
  { value: 'birthday', label: 'Birthday Card', icon: '🎂', color: 'from-yellow-400 to-orange-500' },
  { value: 'anniversary', label: 'Anniversary Card', icon: '💝', color: 'from-red-400 to-rose-500' },
  { value: 'death', label: 'Death Announcement', icon: '🙏', color: 'from-gray-500 to-gray-700' },
]

export default function CardPrintingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState(null)
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [formData, setFormData] = useState({})
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '' })
  const [quantity, setQuantity] = useState(100)
  const [language, setLanguage] = useState('hindi')
  const [captchaOk, setCaptchaOk] = useState(false)
  const [otpOk, setOtpOk] = useState(false)
  const [loading, setLoading] = useState(false)

  const loadTemplates = async (cat) => {
    try {
      const res = await api.get(`/templates?category=${cat}`)
      setTemplates(res.data.templates)
    } catch {
      // Use demo templates
      setTemplates([
        { _id: 'demo1', name: 'Classic Traditional', previewImageUrl: 'https://via.placeholder.com/300x400/d4711e/ffffff?text=Template+1', basePrice: 500, formFields: [
          { fieldKey: 'brideName', labelEnglish: "Bride's Name", labelHindi: "दुल्हन का नाम", required: true },
          { fieldKey: 'groomName', labelEnglish: "Groom's Name", labelHindi: "दूल्हे का नाम", required: true },
          { fieldKey: 'weddingDate', labelEnglish: "Wedding Date", labelHindi: "विवाह तिथि", type: 'date', required: true },
          { fieldKey: 'venue', labelEnglish: "Venue / Location", labelHindi: "स्थान", required: true },
          { fieldKey: 'fatherBride', labelEnglish: "Father of Bride", labelHindi: "वधू पिता", required: false },
          { fieldKey: 'fatherGroom', labelEnglish: "Father of Groom", labelHindi: "वर पिता", required: false },
        ]},
        { _id: 'demo2', name: 'Modern Elegant', previewImageUrl: 'https://via.placeholder.com/300x400/b85718/ffffff?text=Template+2', basePrice: 700, formFields: [
          { fieldKey: 'brideName', labelEnglish: "Bride's Name", labelHindi: "दुल्हन का नाम", required: true },
          { fieldKey: 'groomName', labelEnglish: "Groom's Name", labelHindi: "दूल्हे का नाम", required: true },
          { fieldKey: 'weddingDate', labelEnglish: "Wedding Date", labelHindi: "विवाह तिथि", type: 'date', required: true },
          { fieldKey: 'venue', labelEnglish: "Venue", labelHindi: "स्थान", required: true },
        ]},
      ])
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await api.post('/requests', {
        type: 'card_printing',
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        cardPrinting: {
          category: category.value,
          templateId: selectedTemplate._id === 'demo1' || selectedTemplate._id === 'demo2' ? null : selectedTemplate._id,
          formData,
          language,
          quantity
        }
      })
      toast.success('Card printing request submitted!')
      navigate(`/receipt/${res.data.requestId}`, { state: { request: res.data.request } })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  const setFd = (k, v) => setFormData(p => ({ ...p, [k]: v }))

  return (
    <div className="min-h-screen bg-cream py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-600 text-white flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">🎴</div>
          <h1 className="section-title">Card Printing</h1>
          <p className="font-hindi text-rose-600 mt-1">कार्ड प्रिंटिंग सेवा</p>
        </div>

        {/* Step 1: Category */}
        {step === 1 && (
          <div className="fade-in-up">
            <p className="text-center text-gray-600 font-body mb-6">Select card category:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATEGORIES.map(cat => (
                <button key={cat.value} onClick={() => { setCategory(cat); loadTemplates(cat.value); setStep(2) }}
                  className="card p-5 text-center hover:scale-105 transition-transform group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                    {cat.icon}
                  </div>
                  <p className="font-body font-bold text-sm text-ink">{cat.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Template Selection */}
        {step === 2 && (
          <div className="fade-in-up space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{category?.icon}</span>
              <h2 className="font-display text-xl font-bold">Choose Template for {category?.label}</h2>
            </div>
            {templates.length === 0 ? (
              <div className="text-center py-12 text-gray-400 font-body">No templates available yet for this category.<br /><span className="text-sm">Owner will add templates soon.</span></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {templates.map(t => (
                  <button key={t._id} onClick={() => { setSelectedTemplate(t); setStep(3) }}
                    className={`card overflow-hidden text-left hover:scale-[1.02] transition-all ${selectedTemplate?._id === t._id ? 'ring-2 ring-primary-500' : ''}`}>
                    <img src={t.previewImageUrl} alt={t.name} className="w-full h-52 object-cover" />
                    <div className="p-4">
                      <h3 className="font-display font-bold text-ink">{t.name}</h3>
                      <p className="text-primary-600 font-bold text-sm mt-1">Starting ₹{t.basePrice}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setStep(1)} className="btn-outline">← Back</button>
          </div>
        )}

        {/* Step 3: Fill Form */}
        {step === 3 && selectedTemplate && (
          <div className="card p-6 fade-in-up space-y-5">
            <h2 className="font-display text-xl font-bold">Fill Card Details</h2>

            <div className="flex items-center gap-3 bg-parchment rounded-xl p-4">
              <img src={selectedTemplate.previewImageUrl} alt="" className="w-16 h-20 object-cover rounded-lg" />
              <div>
                <p className="font-bold font-body">{selectedTemplate.name}</p>
                <p className="text-primary-600 text-sm">₹{selectedTemplate.basePrice} + printing</p>
              </div>
            </div>

            {/* Language Selection */}
            <div>
              <label className="label">Card Language</label>
              <div className="flex gap-3">
                {['hindi', 'english', 'both'].map(lang => (
                  <button key={lang} type="button" onClick={() => setLanguage(lang)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all capitalize ${language === lang ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600'}`}>
                    {lang === 'both' ? 'Hindi + English' : lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Your Name *</label>
                <input className="input-field" required value={customer.name} onChange={e => setCustomer(p => ({ ...p, name: e.target.value }))} placeholder="Contact person name" />
              </div>
              <div>
                <label className="label">Phone *</label>
                <input className="input-field" type="tel" maxLength={10} value={customer.phone} onChange={e => setCustomer(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))} placeholder="10-digit mobile" />
              </div>
            </div>

            <div>
              <label className="label">Email Address * <span className="text-xs text-gray-400">(for OTP verification)</span></label>
              <input className="input-field" type="email" required value={customer.email} onChange={e => setCustomer(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" />
            </div>

            {/* Dynamic Form Fields */}
            {selectedTemplate.formFields?.map(field => (
              <div key={field.fieldKey}>
                <label className="label">
                  {language === 'hindi' ? (field.labelHindi || field.labelEnglish) : field.labelEnglish}
                  {field.required && ' *'}
                </label>
                {field.type === 'textarea' ? (
                  <textarea className="input-field" rows={3} onChange={e => setFd(field.fieldKey, e.target.value)} placeholder={field.labelEnglish} />
                ) : field.type === 'date' ? (
                  <input type="date" className="input-field" onChange={e => setFd(field.fieldKey, e.target.value)} required={field.required} />
                ) : field.type === 'select' ? (
                  <select className="input-field" onChange={e => setFd(field.fieldKey, e.target.value)}>
                    <option value="">Select...</option>
                    {field.options?.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input className="input-field" onChange={e => setFd(field.fieldKey, e.target.value)} placeholder={field.labelEnglish} required={field.required} />
                )}
              </div>
            ))}

            <div>
              <label className="label">Quantity (Minimum 100)</label>
              <input type="number" className="input-field" min={100} step={50} value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-outline flex-1">← Back</button>
              <button onClick={() => {
                if (!customer.name || !customer.phone || !customer.email) { toast.error('Name, phone and email required'); return }
                setStep(4)
              }} className="btn-primary flex-1">Next: Verify →</button>
            </div>
          </div>
        )}

        {/* Step 4: OTP + Captcha */}
        {step === 4 && (
          <div className="card p-6 fade-in-up space-y-6">
            <h2 className="font-display text-xl font-bold">Verify Identity</h2>
            <CaptchaInput onVerified={() => setCaptchaOk(true)} />
            <EmailOTPInput email={customer.email} onVerified={() => setOtpOk(true)} />
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="btn-outline flex-1">← Back</button>
              <button disabled={loading || !captchaOk || !otpOk} onClick={handleSubmit}
                className={`flex-1 font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 ${captchaOk && otpOk ? 'btn-primary' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                {loading ? <><div className="loader w-4 h-4 border-2" /> Submitting...</> : '✅ Submit Order'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
