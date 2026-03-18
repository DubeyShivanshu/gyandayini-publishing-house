import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../utils/api.js'
import toast from 'react-hot-toast'

export default function SignInPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ phone: '', password: '' })
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { phone: form.phone, password: form.password })
      login(res.data.user, res.data.token)
      toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}!`)
      navigate(res.data.user.role === 'owner' ? '/owner' : '/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-display font-bold text-2xl">ज्ञ</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-ink">Sign In</h1>
          <p className="text-gray-500 font-body mt-1">Welcome back to Gyandayini</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Phone Number *</label>
              <input className="input-field" required type="tel" maxLength={10} value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, ''))} placeholder="10-digit mobile number" />
            </div>
            <div>
              <label className="label">Password *</label>
              <input className="input-field" required type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Your password" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><div className="loader w-4 h-4 border-2" /> Signing In...</> : '🔓 Sign In'}
            </button>
          </form>
          <p className="text-center text-sm font-body text-gray-500 mt-4">
            New here?{' '}
            <Link to="/signup" className="text-primary-600 font-bold hover:underline">Create Account</Link>
          </p>
          <div className="border-t mt-4 pt-4 text-center">
            <Link to="/owner/login" className="text-xs text-gray-400 hover:text-primary-600 font-body">Owner Login →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
