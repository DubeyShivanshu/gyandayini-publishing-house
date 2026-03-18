import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { FiHome, FiList, FiGrid, FiLogOut, FiImage } from 'react-icons/fi'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/owner', icon: <FiHome size={20} />, label: 'Dashboard' },
  { to: '/owner/requests', icon: <FiList size={20} />, label: 'Requests' },
  { to: '/owner/templates', icon: <FiGrid size={20} />, label: 'Templates' },
  { to: '/owner/media', icon: <FiImage size={20} />, label: 'Media & Rate List' },
]

export default function OwnerSidebar() {
  const { pathname } = useLocation()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/owner/login')
  }

  return (
    <aside className="w-64 bg-ink text-cream flex flex-col min-h-screen flex-shrink-0">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <span className="font-display font-bold text-lg">ज्ञ</span>
          </div>
          <div>
            <p className="font-display font-bold text-sm leading-tight">GYANDAYINI</p>
            <p className="text-primary-400 text-xs">Owner Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body font-bold text-sm transition-all duration-200 ${
              pathname === to ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {icon}
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-900/30 hover:text-red-300 transition-all font-body font-bold text-sm w-full"
        >
          <FiLogOut size={20} />
          Logout
        </button>
        <Link to="/" className="block text-xs text-gray-600 text-center mt-3 hover:text-gray-400">← View Website</Link>
      </div>
    </aside>
  )
}
