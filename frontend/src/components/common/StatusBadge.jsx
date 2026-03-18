const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border border-yellow-200', icon: '⏳' },
  payment_received: { label: 'Payment Received', color: 'bg-blue-100 text-blue-800 border border-blue-200', icon: '✅' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800 border border-green-200', icon: '🎉' },
}

export default function StatusBadge({ status, size = 'md' }) {
  const config = statusConfig[status] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700 border border-gray-200', icon: '•' }
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-bold ${config.color} ${sizeClass}`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  )
}

export { statusConfig }

