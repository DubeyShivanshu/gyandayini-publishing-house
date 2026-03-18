import { useParams, useLocation, Link } from 'react-router-dom'

export default function ReceiptPage() {
  const { requestId } = useParams()
  const { state } = useLocation()
  const request = state?.request

  if (!request) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🧾</p>
          <p className="text-gray-500 font-body mb-4">Receipt not found.</p>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    )
  }

  const receipt = request.receipt
  const hasReceipt = receipt?.items?.length > 0

  const handlePrint = () => window.print()

  const getServiceLabel = (type) => {
    const map = { printing: 'Printing Service', govt_form: 'Government Form Help', card_printing: 'Card Printing', photo_frame: 'Photo / Frame' }
    return map[type] || type
  }

  return (
    <div className="min-h-screen bg-cream py-10">
      <div className="max-w-lg mx-auto px-4">
        <div id="receipt" className="bg-white rounded-2xl shadow-xl overflow-hidden print:shadow-none">

          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white text-center print:bg-primary-700">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
              <span className="font-display font-bold text-2xl">ज्ञ</span>
            </div>
            <h1 className="font-display text-2xl font-bold">GYANDAYINI</h1>
            <p className="text-primary-300 text-xs mt-1">PUBLISHING HOUSE</p>
          </div>

          {/* Success Banner */}
          <div className="text-center py-6 border-b border-gray-100">
            <div className="text-5xl mb-2">✅</div>
            <h2 className="font-display text-xl font-bold text-ink">Request Submitted!</h2>
            <div className="mt-3 inline-block bg-parchment rounded-xl px-5 py-2">
              <p className="text-xs text-gray-500 font-body">Request ID</p>
              <p className="font-mono font-bold text-lg text-primary-700">{request.requestId || requestId}</p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Customer Details</h3>
            <div className="space-y-2 text-sm font-body">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span className="font-bold">{request.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone</span>
                <span className="font-bold">{request.customerPhone}</span>
              </div>
              {request.customerEmail && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-bold text-xs">{request.customerEmail}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Service</span>
                <span className="font-bold">{getServiceLabel(request.type)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-bold">{new Date(request.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-bold text-yellow-600">⏳ Pending Review</span>
              </div>
            </div>
          </div>

          {/* Receipt / Bill Section */}
          {hasReceipt ? (
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Bill / Receipt</h3>
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-500 uppercase border-b border-gray-200 pb-2 mb-2">
                <div className="col-span-5">Item</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-3 text-right">Total</div>
              </div>
              {/* Items */}
              {receipt.items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 text-sm font-body py-2 border-b border-gray-50">
                  <div className="col-span-5 font-medium text-ink">{item.itemName}</div>
                  <div className="col-span-2 text-center text-gray-600">{item.quantity}</div>
                  <div className="col-span-2 text-right text-gray-600">₹{item.pricePerItem}</div>
                  <div className="col-span-3 text-right font-bold text-ink">₹{item.totalPrice}</div>
                </div>
              ))}
              {/* Grand Total */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t-2 border-primary-200">
                <span className="font-display font-bold text-lg text-ink">Grand Total</span>
                <span className="font-display font-bold text-2xl text-primary-700">₹{receipt.grandTotal}</span>
              </div>
              {receipt.notes && (
                <p className="text-xs text-gray-500 mt-2 font-body italic">Note: {receipt.notes}</p>
              )}
            </div>
          ) : (
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-2xl mb-1">💬</p>
                <p className="font-body font-bold text-amber-800 text-sm">Bill will be shared by the owner</p>
                <p className="font-body text-amber-600 text-xs mt-1">The owner will review your request and contact you with pricing.</p>
              </div>
            </div>
          )}

          {/* How to Pay */}
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">How to Pay & Collect</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">📞</span>
                <div>
                  <p className="text-sm font-bold text-ink font-body">Call / WhatsApp</p>
                  <p className="text-xs text-gray-500 font-body">+91 78601 72643 — Confirm amount and arrange payment</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">📧</span>
                <div>
                  <p className="text-sm font-bold text-ink font-body">Email</p>
                  <p className="text-xs text-gray-500 font-body">gyandayiniph@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">🏪</span>
                <div>
                  <p className="text-sm font-bold text-ink font-body">Visit the Shop</p>
                  <p className="text-xs text-gray-500 font-body">Rampur Udaybhan, In Front of Electric Office, Ballia<br/> Mon–Sat: 8:30AM – 7:15PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="bg-yellow-50 p-4 text-center">
            <p className="text-xs text-yellow-700 font-body font-bold">
              🔖 Save your Request ID: <span className="font-mono">{request.requestId || requestId}</span>
            </p>
            <p className="text-xs text-yellow-600 font-body mt-1">Use it to track your order status anytime</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button onClick={handlePrint} className="btn-outline flex-1">🖨️ Print Receipt</button>
          <Link
            to={`/track?id=${request.requestId || requestId}&phone=${request.customerPhone}`}
            className="btn-primary flex-1 text-center"
          >
            📋 Track Order
          </Link>
        </div>
        <div className="text-center mt-3">
          <Link to="/" className="text-primary-600 text-sm font-body hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

