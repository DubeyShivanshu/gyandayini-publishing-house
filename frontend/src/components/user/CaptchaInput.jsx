import { useState, useEffect } from 'react'
import api from '../../utils/api.js'
import toast from 'react-hot-toast'

export default function CaptchaInput({ onVerified }) {
  const [captchaId, setCaptchaId] = useState('')
  const [svg, setSvg] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)

  const loadCaptcha = async () => {
    try {
      const res = await api.get('/captcha/generate')
      setCaptchaId(res.data.captchaId)
      setSvg(res.data.svg)
      setAnswer('')
    } catch (err) {
      toast.error('Failed to load captcha')
    }
  }

  useEffect(() => { loadCaptcha() }, [])

  const handleVerify = async () => {
    if (!answer.trim()) { toast.error('Enter the captcha text'); return }
    setLoading(true)
    try {
      await api.post('/captcha/verify', { captchaId, answer })
      setVerified(true)
      toast.success('Captcha verified!')
      onVerified()
    } catch (err) {
      toast.error('Wrong captcha. Try again.')
      loadCaptcha()
    } finally {
      setLoading(false)
    }
  }

  if (verified) {
    return (
      <div className="flex items-center gap-2 text-green-600 font-body font-bold text-sm">
        <span className="text-xl">✅</span> Captcha Verified
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <label className="label">Security Check (Captcha) *</label>
      <div className="flex items-center gap-3 flex-wrap">
        <div
          className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <button type="button" onClick={loadCaptcha} className="btn-outline text-xs" title="Refresh captcha">
          🔄 Refresh
        </button>
      </div>
      <div className="flex gap-3">
        <input
          type="text"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleVerify()}
          placeholder="Type the text shown above"
          className="input-field flex-1"
        />
        <button type="button" onClick={handleVerify} disabled={loading} className="btn-primary whitespace-nowrap">
          {loading ? '...' : 'Verify'}
        </button>
      </div>
    </div>
  )
}
