import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  // Protected links — require login
  const protectedLinks = [
    { to: '/printing',      label: 'Printing' },
    { to: '/govt-forms',    label: 'Jan Seva Kendra Services' },
    { to: '/card-printing', label: 'Card Printing' },
    { to: '/track',         label: 'Track Order' },
  ]

  // Public links — no login needed
  const publicLinks = [
    { to: '/rate-list', label: 'Rate List' },
    { to: '/contact',   label: 'Contact' },
  ]

  const allNavLinks = [...protectedLinks, ...publicLinks]

  // Handle click on protected nav links
  const handleProtectedClick = (e, to) => {
    if (!user) {
      e.preventDefault()
      setMenuOpen(false)
      navigate('/signup')
    } else {
      setMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b-2 border-primary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white font-display font-bold text-lg">ज्ञ</span>
            </div>
            <div className="min-w-0 hidden sm:block">
              <p className="font-display font-bold text-ink text-sm leading-tight truncate">GYANDAYINI</p>
              <p className="font-body text-primary-600 text-xs leading-tight">PUBLISHING HOUSE</p>
            </div>
            <div className="min-w-0 sm:hidden">
              <p className="font-display font-bold text-ink text-xs leading-tight">GYANDAYINI</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {allNavLinks.map(link => {
              const isProtected = protectedLinks.some(p => p.to === link.to)
              return (
                <Link
                  key={link.to}
                  to={isProtected && !user ? '/signup' : link.to}
                  className="text-sm font-body font-bold text-gray-700 hover:text-primary-600 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={user.role === 'owner' ? '/owner' : '/track'}
                  className="hidden sm:flex items-center gap-1 text-sm font-body font-bold text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <FiUser size={16} />
                  <span className="hidden md:inline">{user.name.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1 btn-outline text-xs py-2 px-3">
                  <FiLogOut size={14} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/signin" className="btn-outline text-xs py-2 px-3">Login</Link>
                <Link to="/signup" className="btn-primary text-xs py-2 px-3">Sign Up</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors ml-1"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2 shadow-lg">
          {allNavLinks.map(link => {
            const isProtected = protectedLinks.some(p => p.to === link.to)
            return (
              <Link
                key={link.to}
                to={isProtected && !user ? '/signup' : link.to}
                onClick={e => handleProtectedClick(e, link.to)}
                className="block py-3 px-4 rounded-lg font-body font-bold text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
              >
                {link.label}
                {isProtected && !user && (
                  <span className="ml-2 text-xs text-primary-400 font-normal">🔒 Login required</span>
                )}
              </Link>
            )
          })}
          {user && (
            <div className="border-t pt-2 mt-2">
              <p className="text-xs text-gray-500 px-4 py-1">Logged in as {user.name}</p>
            </div>
          )}
          {!user && (
            <div className="border-t pt-3 mt-2 flex gap-2 px-2">
              <Link to="/signin" onClick={() => setMenuOpen(false)}
                className="btn-outline text-sm flex-1 text-center py-2">
                Login
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}
                className="btn-primary text-sm flex-1 text-center py-2">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}