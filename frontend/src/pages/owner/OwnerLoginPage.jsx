import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../utils/api.js'
import toast from 'react-hot-toast'

export default function OwnerLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ phone: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/owner-login', form)
      login(res.data.user, res.data.token)
      toast.success('Welcome, Owner!')
      navigate('/owner')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid owner credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <span className="text-white font-display font-bold text-3xl">ज्ञ</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-cream">Owner Login</h1>
          <p className="text-gray-400 font-body text-sm mt-1">Gyandayini Admin Panel</p>
        </div>

        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1 font-body">Phone Number</label>
              <input
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 placeholder-gray-500 font-body"
                type="tel"
                maxLength={10}
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))}
                placeholder="Owner phone number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1 font-body">Password</label>
              <input
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 placeholder-gray-500 font-body"
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Owner password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <><div className="loader w-4 h-4 border-2" /> Signing In...</> : '🔓 Owner Login'}
            </button>
          </form>

          <div className="text-center mt-6 space-y-3">
            <div>
              <Link to="/" className="text-gray-500 text-xs hover:text-gray-300 font-body transition-colors">
                ← Back to Website
              </Link>
            </div>
            <div className="border-t border-white/10 pt-3">
              <Link to="/signin" className="text-gray-500 text-xs hover:text-gray-300 font-body transition-colors">
                Customer Login →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}