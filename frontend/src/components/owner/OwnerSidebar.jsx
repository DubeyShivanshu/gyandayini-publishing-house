import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { FiHome, FiList, FiGrid, FiLogOut, FiImage, FiMenu, FiX } from 'react-icons/fi'
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
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/owner/login')
  }

  const closeSidebar = () => setOpen(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <span className="font-display font-bold text-lg">ज्ञ</span>
            </div>
            <div>
              <p className="font-display font-bold text-sm leading-tight">GYANDAYINI</p>
              <p className="text-primary-400 text-xs">Owner Panel</p>
            </div>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={closeSidebar}
            className="lg:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <FiX size={22} />
          </button>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body font-bold text-sm transition-all duration-200 ${
              pathname === to
                ? 'bg-primary-600 text-white'
                : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {icon}
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom: Logout + View Website */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-900/30 hover:text-red-300 transition-all font-body font-bold text-sm w-full"
        >
          <FiLogOut size={20} />
          Logout
        </button>
        <Link
          to="/"
          onClick={closeSidebar}
          className="block text-xs text-gray-600 text-center mt-3 hover:text-gray-400"
        >
          ← View Website
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Desktop Sidebar (lg and above) ── */}
      <aside className="hidden lg:flex w-64 bg-ink text-cream flex-col min-h-screen flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile Top Bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-ink text-cream flex items-center justify-between px-4 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <span className="font-display font-bold text-sm">ज्ञ</span>
          </div>
          <div>
            <p className="font-display font-bold text-xs leading-tight">GYANDAYINI</p>
            <p className="text-primary-400 text-xs">Owner Panel</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="text-gray-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* ── Mobile Drawer Overlay ── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          onClick={closeSidebar}
        >
          {/* Dark backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Drawer panel */}
          <div
            className="relative w-72 max-w-[85vw] bg-ink text-cream h-full shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* ── Mobile top bar spacer (pushes page content down) ── */}
      <div className="lg:hidden h-14 flex-shrink-0" />
    </>
  )
}