import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import OwnerSidebar from '../../components/owner/OwnerSidebar.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import api from '../../utils/api.js'
import toast from 'react-hot-toast'
import { FiTrash2 } from 'react-icons/fi'

const STAT_CARDS = [
  { status: 'pending',          label: 'Pending',          bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', icon: '⏳' },
  { status: 'payment_received', label: 'Payment Received', bg: 'bg-blue-50 border-blue-200',    text: 'text-blue-700',   icon: '✅' },
  { status: 'completed',        label: 'Completed',        bg: 'bg-green-50 border-green-200',  text: 'text-green-700',  icon: '🎉' },
]

export default function DashboardHomePage() {
  const [stats,          setStats]          = useState([])
  const [total,          setTotal]          = useState(0)
  const [today,          setToday]          = useState(0)
  const [recentRequests, setRecentRequests] = useState([])
  const [loading,        setLoading]        = useState(true)

  const load = async () => {
    try {
      const [statsRes, reqRes] = await Promise.all([
        api.get('/owner/requests/stats'),
        api.get('/owner/requests?limit=6')
      ])
      setStats(statsRes.data.stats)
      setTotal(statsRes.data.total)
      setToday(statsRes.data.today)
      setRecentRequests(reqRes.data.requests)
    } catch (err) {
      console.error('Dashboard load error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const getCount = (status) => stats.find(s => s._id === status)?.count || 0

  // Delete single request from dashboard
  const handleDeleteRequest = async (requestId, customerName) => {
    if (!window.confirm(`Delete request from ${customerName}? This cannot be undone.`)) return
    try {
      await api.delete(`/owner/requests/${requestId}`)
      toast.success('Request deleted')
      load()
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OwnerSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-3xl font-bold text-ink mb-1">Dashboard</h1>
          <p className="text-gray-500 font-body mb-8">Welcome back, Owner 👋</p>

          {loading ? (
            <div className="flex items-center justify-center h-64"><div className="loader" /></div>
          ) : (
            <>
              {/* Top Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-5 shadow-sm border">
                  <p className="text-4xl font-bold font-display text-ink">{total}</p>
                  <p className="text-gray-500 text-sm font-body mt-1">Total Orders</p>
                </div>
                <div className="bg-primary-50 rounded-2xl p-5 shadow-sm border border-primary-200">
                  <p className="text-4xl font-bold font-display text-primary-700">{today}</p>
                  <p className="text-primary-600 text-sm font-body mt-1">Today</p>
                </div>
                {STAT_CARDS.slice(0, 2).map(card => (
                  <div key={card.status} className={`rounded-2xl p-5 shadow-sm border ${card.bg}`}>
                    <p className="text-3xl mb-1">{card.icon}</p>
                    <p className={`text-3xl font-bold font-display ${card.text}`}>{getCount(card.status)}</p>
                    <p className={`text-sm font-body mt-1 ${card.text}`}>{card.label}</p>
                  </div>
                ))}
              </div>

              {/* 3-Step Status Breakdown */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {STAT_CARDS.map(card => (
                  <Link key={card.status} to={`/owner/requests?status=${card.status}`}
                    className={`rounded-2xl p-5 shadow-sm border ${card.bg} hover:shadow-md transition-shadow`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{card.icon}</span>
                      <p className={`font-display font-bold text-3xl ${card.text}`}>{getCount(card.status)}</p>
                    </div>
                    <p className={`text-sm font-body ${card.text}`}>{card.label}</p>
                    <p className="text-xs text-gray-400 mt-1 font-body">Click to view →</p>
                  </Link>
                ))}
              </div>

              {/* Recent Requests */}
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-6">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h2 className="font-display text-xl font-bold text-ink">Recent Requests</h2>
                  <Link to="/owner/requests" className="btn-outline text-sm">View All →</Link>
                </div>
                {recentRequests.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 font-body">No requests yet</div>
                ) : (
                  <div className="divide-y">
                    {recentRequests.map(req => (
                      <div key={req._id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                        <div className="min-w-0">
                          <p className="font-body font-bold text-ink text-sm truncate">{req.customerName}</p>
                          <p className="text-xs text-gray-500 font-mono">{req.requestId}</p>
                          <p className="text-xs text-gray-400 capitalize font-body mt-0.5">
                            {req.type?.replace(/_/g, ' ')} · {req.customerPhone}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="flex flex-col items-end gap-1">
                            <StatusBadge status={req.status} size="sm" />
                            <p className="text-xs text-gray-400 font-body">
                              {new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            </p>
                          </div>
                          {/* Delete button */}
                          <button
                            onClick={() => handleDeleteRequest(req.requestId, req.customerName)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-all"
                            title="Delete request"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/owner/requests?status=pending"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-2xl p-5 text-center font-body font-bold transition-colors">
                  <p className="text-2xl mb-1">⏳</p>
                  <p className="text-sm">Pending ({getCount('pending')})</p>
                </Link>
                <Link to="/owner/requests?status=payment_received"
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl p-5 text-center font-body font-bold transition-colors">
                  <p className="text-2xl mb-1">✅</p>
                  <p className="text-sm">Paid ({getCount('payment_received')})</p>
                </Link>
                <Link to="/owner/templates"
                  className="bg-primary-600 hover:bg-primary-700 text-white rounded-2xl p-5 text-center font-body font-bold transition-colors">
                  <p className="text-2xl mb-1">🎨</p>
                  <p className="text-sm">Templates</p>
                </Link>
                <Link to="/owner/media"
                  className="bg-violet-600 hover:bg-violet-700 text-white rounded-2xl p-5 text-center font-body font-bold transition-colors">
                  <p className="text-2xl mb-1">🖼️</p>
                  <p className="text-sm">Media & Rates</p>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}