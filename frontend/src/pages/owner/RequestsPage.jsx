import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import OwnerSidebar from '../../components/owner/OwnerSidebar.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import api from '../../utils/api.js'
import toast from 'react-hot-toast'
import { FiChevronDown, FiChevronUp, FiDownload, FiPlus, FiTrash2, FiSave, FiExternalLink } from 'react-icons/fi'

// Only 3 valid statuses
const STATUS_OPTIONS = [
  { value: 'pending',          label: '⏳ Pending',          color: 'border-yellow-400 text-yellow-700 hover:bg-yellow-50' },
  { value: 'payment_received', label: '✅ Payment Received', color: 'border-blue-400 text-blue-700 hover:bg-blue-50'   },
  { value: 'completed',        label: '🎉 Completed',        color: 'border-green-400 text-green-700 hover:bg-green-50' },
]

// Download helper
const downloadFile = async (url, filename) => {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename || 'file'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(a.href)
  } catch {
    // Fallback: open in new tab if CORS prevents direct download
    window.open(url, '_blank')
  }
}

// Empty receipt item
const emptyItem = () => ({ itemName: '', quantity: 1, pricePerItem: 0 })

// Individual request card
function RequestCard({ req, onUpdate }) {
  const [expanded,   setExpanded]   = useState(false)
  const [notes,      setNotes]      = useState(req.ownerNotes || '')
  const [statusLoad, setStatusLoad] = useState(false)
  const [receiptItems, setReceiptItems] = useState(
    req.receipt?.items?.length
      ? req.receipt.items.map(i => ({ ...i }))
      : [emptyItem()]
  )
  const [receiptNotes, setReceiptNotes] = useState(req.receipt?.notes || '')
  const [receiptLoad,  setReceiptLoad]  = useState(false)
  const [activeTab,    setActiveTab]    = useState('details') // 'details' | 'receipt'

  const grandTotal = receiptItems.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.pricePerItem)), 0)

  // Status update 
  const updateStatus = async (newStatus) => {
    if (req.status === newStatus) return
    setStatusLoad(true)
    try {
      await api.put(`/owner/requests/${req.requestId}/status`, { status: newStatus, ownerNotes: notes })
      toast.success(`Status → ${newStatus.replace(/_/g, ' ')}`)
      onUpdate()
    } catch {
      toast.error('Status update failed')
    } finally {
      setStatusLoad(false)
    }
  }

  // Save notes separately 
  const saveNotes = async () => {
    try {
      await api.put(`/owner/requests/${req.requestId}/status`, { status: req.status, ownerNotes: notes })
      toast.success('Notes saved')
    } catch {
      toast.error('Failed to save notes')
    }
  }

  // Receipt builder 
  const addItem = () => setReceiptItems(p => [...p, emptyItem()])
  const removeItem = (i) => setReceiptItems(p => p.filter((_, idx) => idx !== i))
  const updateItem = (i, k, v) => {
    setReceiptItems(p => {
      const updated = [...p]
      updated[i] = { ...updated[i], [k]: v }
      return updated
    })
  }

  const saveReceipt = async () => {
    if (receiptItems.some(it => !it.itemName.trim() || !it.quantity || !it.pricePerItem)) {
      toast.error('Fill all item fields before saving')
      return
    }
    setReceiptLoad(true)
    try {
      await api.put(`/owner/requests/${req.requestId}/receipt`, {
        items: receiptItems.map(it => ({
          itemName: it.itemName,
          quantity: Number(it.quantity),
          pricePerItem: Number(it.pricePerItem)
        })),
        notes: receiptNotes
      })
      toast.success('Receipt saved and visible to customer!')
      onUpdate()
    } catch {
      toast.error('Failed to save receipt')
    } finally {
      setReceiptLoad(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden mb-4">
      {/* Card Header (always visible) */}
      <div
        className="p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(p => !p)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{req.requestId}</p>
            <StatusBadge status={req.status} size="sm" />
          </div>
          <p className="font-body font-bold text-ink mt-1.5">{req.customerName}</p>
          <div className="flex flex-wrap gap-3 text-xs text-gray-500 font-body mt-1">
            <span>📞 {req.customerPhone}</span>
            {req.customerEmail && <span>📧 {req.customerEmail}</span>}
            <span className="capitalize">📌 {req.type?.replace(/_/g, ' ')}</span>
            <span>📅 {new Date(req.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {req.receipt?.grandTotal > 0 && (
            <span className="font-display font-bold text-primary-700">₹{req.receipt.grandTotal}</span>
          )}
          {expanded ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
        </div>
      </div>

      {/* Expanded Panel */}
      {expanded && (
        <div className="border-t bg-gray-50">
          {/* Tab switcher */}
          <div className="flex border-b bg-white">
            {['details', 'receipt'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-bold font-body capitalize transition-colors ${
                  activeTab === tab ? 'border-b-2 border-primary-600 text-primary-700' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {tab === 'details' ? '📋 Request Details' : '🧾 Bill / Receipt'}
              </button>
            ))}
          </div>

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="p-5 space-y-5">

              {/* Uploaded file with download */}
              {req.printing?.fileUrl && (
                <div className="bg-white rounded-xl border p-4">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-3">📄 Uploaded Print File</p>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <a href={req.printing.fileUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 btn-outline text-xs">
                      <FiExternalLink size={13} /> View
                    </a>
                    <button
                      onClick={() => downloadFile(req.printing.fileUrl, `${req.requestId}-print-file`)}
                      className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors">
                      <FiDownload size={13} /> Download
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 font-body space-y-0.5">
                    <p>Size: <strong>{req.printing.size}</strong> &nbsp;·&nbsp; Qty: <strong>{req.printing.quantity}</strong></p>
                    <p>Color: <strong className="capitalize">{req.printing.colorMode?.replace('_', ' ')}</strong> &nbsp;·&nbsp; Paper: <strong>{req.printing.paperType}</strong></p>
                    {req.printing.instructions && <p>Instructions: <span className="text-gray-700">{req.printing.instructions}</span></p>}
                  </div>
                </div>
              )}

              {/* Govt Form */}
              {req.govtForm?.formType && (
                <div className="bg-white rounded-xl border p-4">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-3">📝 Jan Seva Kendra Service</p>
                  <p className="text-sm font-body font-bold capitalize mb-2">{req.govtForm.formType} Form</p>
                  {req.govtForm.formDetails && Object.keys(req.govtForm.formDetails).length > 0 && (
                    <div className="grid grid-cols-2 gap-1 mb-3">
                      {Object.entries(req.govtForm.formDetails).map(([k, v]) => (
                        <div key={k} className="text-xs font-body">
                          <span className="text-gray-500">{k}:</span> <span className="font-bold">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {req.govtForm.uploadedDocs?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 mb-2">Uploaded Docs:</p>
                      <div className="flex flex-wrap gap-2">
                        {req.govtForm.uploadedDocs.map((doc, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer"
                              className="text-xs btn-outline py-1.5 inline-flex items-center gap-1">
                              <FiExternalLink size={11} /> {doc.name || `Doc ${i + 1}`}
                            </a>
                            <button onClick={() => downloadFile(doc.url, doc.name || `doc-${i + 1}`)}
                              className="text-xs bg-primary-600 text-white px-2 py-1.5 rounded-lg hover:bg-primary-700 flex items-center gap-1">
                              <FiDownload size={11} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Card Printing */}
              {req.cardPrinting?.category && (
                <div className="bg-white rounded-xl border p-4">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">🎴 Card Printing</p>
                  <div className="text-sm font-body space-y-1">
                    <p>Category: <strong className="capitalize">{req.cardPrinting.category}</strong></p>
                    <p>Quantity: <strong>{req.cardPrinting.quantity}</strong> cards</p>
                    <p>Language: <strong className="capitalize">{req.cardPrinting.language}</strong></p>
                  </div>
                  {req.cardPrinting.formData && Object.keys(req.cardPrinting.formData).length > 0 && (
                    <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-1">
                      {Object.entries(req.cardPrinting.formData).map(([k, v]) => (
                        <div key={k} className="text-xs font-body">
                          <span className="text-gray-500">{k}:</span> <span className="font-bold">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Owner Notes */}
              <div className="bg-white rounded-xl border p-4 space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase">Owner Notes (visible to customer)</p>
                <textarea
                  className="input-field text-sm"
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Please contact us to discuss printing details…"
                />
                <button onClick={saveNotes} className="btn-outline text-xs flex items-center gap-1.5">
                  <FiSave size={13} /> Save Notes
                </button>
              </div>

              {/* Status Update */}
              <div className="bg-white rounded-xl border p-4">
                <p className="text-xs font-bold text-gray-500 uppercase mb-3">Update Order Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s.value}
                      onClick={() => updateStatus(s.value)}
                      disabled={statusLoad || req.status === s.value}
                      className={`text-xs font-bold px-4 py-2 rounded-xl border-2 transition-all ${
                        req.status === s.value
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                          : s.color
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Receipt Tab */}
          {activeTab === 'receipt' && (
            <div className="p-5 space-y-4">
              <div className="bg-white rounded-xl border p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-display font-bold text-ink">Bill / Receipt Builder</p>
                  <button onClick={addItem} className="btn-outline text-xs flex items-center gap-1.5">
                    <FiPlus size={13} /> Add Item
                  </button>
                </div>

                {/* Header */}
                <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-400 uppercase border-b pb-2 mb-2">
                  <div className="col-span-5">Item Name</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-3 text-right">Price / Item (₹)</div>
                  <div className="col-span-2" />
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {receiptItems.map((item, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <input
                          className="input-field text-xs py-2"
                          placeholder="e.g. A4 Color Print"
                          value={item.itemName}
                          onChange={e => updateItem(i, 'itemName', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min={1}
                          className="input-field text-xs py-2 text-center"
                          value={item.quantity}
                          onChange={e => updateItem(i, 'quantity', e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          min={0}
                          className="input-field text-xs py-2 text-right"
                          value={item.pricePerItem}
                          onChange={e => updateItem(i, 'pricePerItem', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-ink">
                          ₹{(Number(item.quantity) * Number(item.pricePerItem)).toFixed(0)}
                        </span>
                        {receiptItems.length > 1 && (
                          <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 p-1">
                            <FiTrash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grand total */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-primary-200">
                  <span className="font-display font-bold text-ink text-lg">Grand Total</span>
                  <span className="font-display font-bold text-2xl text-primary-700">₹{grandTotal.toFixed(0)}</span>
                </div>

                {/* Notes */}
                <div className="mt-4">
                  <label className="text-xs font-bold text-gray-500">Receipt Notes (optional)</label>
                  <input
                    className="input-field mt-1 text-sm"
                    placeholder="e.g. Includes lamination charges"
                    value={receiptNotes}
                    onChange={e => setReceiptNotes(e.target.value)}
                  />
                </div>

                <button
                  onClick={saveReceipt}
                  disabled={receiptLoad}
                  className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
                >
                  {receiptLoad
                    ? <><div className="loader w-4 h-4 border-2" /> Saving...</>
                    : <><FiSave size={15} /> Save Receipt (Customer Can See This)</>
                  }
                </button>

                {req.receipt?.generatedAt && (
                  <p className="text-xs text-center text-green-600 mt-2 font-body">
                    ✓ Receipt last saved: {new Date(req.receipt.generatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Main Page
export default function RequestsPage() {
  const [searchParams] = useSearchParams()
  const [requests,    setRequests]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || '')
  const [filterType,   setFilterType]   = useState('')
  const [page,        setPage]        = useState(1)
  const [totalPages,  setTotalPages]  = useState(1)
  const [total,       setTotal]       = useState(0)

  const loadRequests = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 20 })
      if (filterStatus) params.set('status', filterStatus)
      if (filterType)   params.set('type', filterType)
      const res = await api.get(`/owner/requests?${params}`)
      setRequests(res.data.requests)
      setTotalPages(res.data.pages)
      setTotal(res.data.total)
    } catch {
      toast.error('Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadRequests() }, [filterStatus, filterType, page]) // eslint-disable-line

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OwnerSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold text-ink">All Requests</h1>
              <p className="text-gray-500 font-body text-sm mt-1">{total} total requests</p>
            </div>
            <button onClick={loadRequests} className="btn-outline flex items-center gap-2">
              🔄 Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6 bg-white p-4 rounded-2xl shadow-sm border">
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">Filter by Status</label>
              <select className="input-field text-sm py-2" value={filterStatus}
                onChange={e => { setFilterStatus(e.target.value); setPage(1) }}>
                <option value="">All Status</option>
                {STATUS_OPTIONS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">Filter by Type</label>
              <select className="input-field text-sm py-2" value={filterType}
                onChange={e => { setFilterType(e.target.value); setPage(1) }}>
                <option value="">All Types</option>
                <option value="printing">🖨️ Printing</option>
                <option value="govt_form">📝 Govt Form</option>
                <option value="card_printing">🎴 Card Printing</option>
              </select>
            </div>
          </div>

          {/* List */}
          {loading ? (
            <div className="flex items-center justify-center h-48"><div className="loader" /></div>
          ) : requests.length === 0 ? (
            <div className="text-center py-20 text-gray-400 font-body">
              <p className="text-5xl mb-3">📭</p>
              <p className="text-lg font-bold">No requests found</p>
              <p className="text-sm mt-1">Try changing the filters</p>
            </div>
          ) : (
            <>
              {requests.map(req => (
                <RequestCard key={req._id} req={req} onUpdate={loadRequests} />
              ))}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-6">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-outline">← Prev</button>
                  <span className="font-body text-sm text-gray-600">{page} / {totalPages}</span>
                  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn-outline">Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
