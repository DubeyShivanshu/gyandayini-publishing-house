import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../utils/api.js'
import toast from 'react-hot-toast'

export default function SignUpPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/signup', { name: form.name, phone: form.phone, email: form.email, password: form.password })
      login(res.data.user, res.data.token)
      toast.success('Account created successfully! Welcome!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed')
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
          <h1 className="font-display text-3xl font-bold text-ink">Create Account</h1>
          <p className="text-gray-500 font-body mt-1">Join Gyandayini Publishing House</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name *</label>
              <input className="input-field" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" />
            </div>
            <div>
              <label className="label">Phone Number * <span className="text-xs text-gray-400">(used for login)</span></label>
              <input className="input-field" required type="tel" maxLength={10} value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, ''))} placeholder="10-digit mobile number" />
            </div>
            <div>
              <label className="label">Email (Optional)</label>
              <input className="input-field" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" />
            </div>
            <div>
              <label className="label">Password *</label>
              <input className="input-field" required type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 6 characters" />
            </div>
            <div>
              <label className="label">Confirm Password *</label>
              <input className="input-field" required type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Repeat password" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? <><div className="loader w-4 h-4 border-2" /> Creating...</> : '✅ Create Account'}
            </button>
          </form>
          <p className="text-center text-sm font-body text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/signin" className="text-primary-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
