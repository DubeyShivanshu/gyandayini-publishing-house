import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CaptchaInput from '../../components/user/CaptchaInput.jsx'
import api from '../../utils/api.js'
import toast from 'react-hot-toast'

const FORM_TYPES = [
  { value: 'pan', label: 'PAN Card Application', icon: '🪪', docs: ['Aadhaar Card', 'Photo'], fields: ['Full Name', 'Father Name', 'Date of Birth', 'Address'] },
  { value: 'aadhaar', label: 'Aadhaar Enrollment/Update', icon: '🔷', docs: ['Birth Certificate / Any ID Proof', 'Address Proof'], fields: ['Full Name', 'Date of Birth', 'Address', 'Mobile'] },
  { value: 'domicile', label: 'Domicile Certificate', icon: '🏠', docs: ['Birth Certificate', 'School TC', 'Aadhaar'], fields: ['Full Name', 'Father/Mother Name', 'DOB', 'Residential Address', 'Period of Residence'] },
  { value: 'income', label: 'Income Certificate', icon: '💰', docs: ['Aadhaar', 'Ration Card', 'Self Declaration'], fields: ['Name', 'Occupation', 'Monthly Income', 'Address'] },
  { value: 'caste', label: 'Caste Certificate', icon: '📜', docs: ['Aadhaar', 'Ration Card', 'Previous Caste Certificate'], fields: ['Full Name', 'Caste/Category', 'Father Name', 'Address'] },
  { value: 'birth', label: 'Birth Certificate', icon: '👶', docs: ['Hospital Record', 'Parents Aadhaar'], fields: ['Child Name', 'Date of Birth', 'Place of Birth', 'Father Name', 'Mother Name'] },
  { value: 'death', label: 'Death Certificate', icon: '📋', docs: ['Hospital Record / Doctor Certificate'], fields: ['Deceased Name', 'Date of Death', 'Cause of Death', 'Address', 'Informant Name'] },
  { value: 'other', label: 'Other Government Form', icon: '📑', docs: ['Relevant Documents'], fields: ['Describe your requirement'] }
]

export default function GovtFormServicePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedForm, setSelectedForm] = useState(null)
  const [form, setForm] = useState({ customerName: '', customerPhone: '', customerEmail: '', formDetails: {} })
  const [captchaOk, setCaptchaOk] = useState(false)
  const [loading, setLoading] = useState(false)
  const [docFiles, setDocFiles] = useState([])

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const setDetail = (k, v) => setForm(p => ({ ...p, formDetails: { ...p.formDetails, [k]: v } }))

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files)
    const formData = new FormData()
    files.forEach(f => formData.append('docs', f))
    try {
      const res = await api.post('/upload/docs', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setDocFiles(res.data.files)
      toast.success(`${res.data.files.length} document(s) uploaded`)
    } catch {
      toast.error('Document upload failed')
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await api.post('/requests', {
        type: 'govt_form',
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail,
        govtForm: {
          formType: selectedForm.value,
          formDetails: form.formDetails,
          uploadedDocs: docFiles
        }
      })
      toast.success('Request submitted!')
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
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 text-white flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">📝</div>
          <h1 className="section-title">Jan Seva Kendra Services</h1>
          <p className="font-hindi text-blue-600 mt-1">जन सेवा केंद्र सेवाएं</p>
        </div>

        {/* Step 1: Select Form Type */}
        {step === 1 && (
          <div className="fade-in-up space-y-4">
            <p className="text-center text-gray-600 font-body mb-6">Select the form you need help with:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FORM_TYPES.map(ft => (
                <button key={ft.value} onClick={() => { setSelectedForm(ft); setStep(2) }}
                  className="card p-4 text-left hover:border-blue-500 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{ft.icon}</span>
                    <span className="font-body font-bold text-ink text-sm">{ft.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Fill Details */}
        {step === 2 && selectedForm && (
          <div className="card p-6 fade-in-up space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{selectedForm.icon}</span>
              <h2 className="font-display text-xl font-bold">{selectedForm.label}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Your Name *</label>
                <input className="input-field" required value={form.customerName} onChange={e => set('customerName', e.target.value)} placeholder="Full Name" />
              </div>
              <div>
                <label className="label">Phone *</label>
                <input className="input-field" required type="tel" maxLength={10} value={form.customerPhone} onChange={e => set('customerPhone', e.target.value.replace(/\D/g, ''))} placeholder="10-digit" />
              </div>
            </div>

            <div>
              <label className="label">Email Address</label>
              <input className="input-field" type="email" value={form.customerEmail} onChange={e => set('customerEmail', e.target.value)} placeholder="your@email.com (optional)" />
            </div>

            <div>
              <h3 className="font-body font-bold text-gray-700 mb-3">Form Information:</h3>
              <div className="space-y-3">
                {selectedForm.fields.map(field => (
                  <div key={field}>
                    <label className="label">{field}</label>
                    <input className="input-field" placeholder={`Enter ${field}`} onChange={e => setDetail(field, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-body font-bold text-blue-800 mb-2">📎 Required Documents:</h3>
              <ul className="list-disc list-inside space-y-1">
                {selectedForm.docs.map(d => <li key={d} className="text-sm text-blue-700 font-body">{d}</li>)}
              </ul>
              <div className="mt-3">
                <label className="btn-outline cursor-pointer inline-flex items-center gap-2">
                  📤 Upload Documents
                  <input type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />
                </label>
                {docFiles.length > 0 && <p className="text-xs text-green-600 mt-1 font-body">✓ {docFiles.length} document(s) uploaded</p>}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-outline flex-1">← Back</button>
              <button onClick={() => {
                if (!form.customerName || !form.customerPhone) { toast.error('Name and phone are required'); return }
                setStep(3)
              }} className="btn-primary flex-1">Next: Verify →</button>
            </div>
          </div>
        )}

        {/* Step 3: Captcha only */}
        {step === 3 && (
          <div className="card p-6 fade-in-up space-y-6">
            <h2 className="font-display text-xl font-bold">Verify You're Human</h2>
            <p className="text-sm text-gray-600 font-body">Complete the captcha to prevent fake orders.</p>
            <CaptchaInput onVerified={() => setCaptchaOk(true)} />
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-outline flex-1">← Back</button>
              <button disabled={!captchaOk} onClick={() => setStep(4)}
                className={`flex-1 font-bold py-3 px-6 rounded-lg ${captchaOk ? 'btn-primary' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                Review →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Submit */}
        {step === 4 && (
          <div className="card p-6 fade-in-up space-y-4">
            <h2 className="font-display text-xl font-bold">Review & Submit</h2>
            <div className="bg-parchment rounded-xl p-4 space-y-2 text-sm font-body">
              <div className="flex justify-between"><span className="text-gray-500">Form Type</span><span className="font-bold">{selectedForm?.label}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-bold">{form.customerName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-bold">{form.customerPhone}</span></div>
              {form.customerEmail && <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-bold">{form.customerEmail}</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">Documents</span><span className="font-bold text-green-600">{docFiles.length > 0 ? `✓ ${docFiles.length} uploaded` : 'None'}</span></div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm font-body">
              <p className="text-blue-700">💡 <strong>Payment:</strong> The owner will contact you with pricing. Pay via phone/UPI/cash when you visit or through contact.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="btn-outline flex-1">← Back</button>
              <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {loading ? <><div className="loader w-4 h-4 border-2" /> Submitting...</> : '✅ Submit Request'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}