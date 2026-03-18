import { useState, useEffect, useRef } from 'react'
import OwnerSidebar from '../../components/owner/OwnerSidebar.jsx'
import api from '../../utils/api.js'
import toast from 'react-hot-toast'
import { FiUploadCloud, FiTrash2, FiEdit3, FiSave, FiX, FiImage } from 'react-icons/fi'

const MEDIA_TYPES = [
  {
    value: 'demo',
    label: 'Demo / Sample Images',
    emoji: '🖼️',
    desc: 'Show customers examples of your printing work',
    color: 'from-blue-400 to-blue-600',
    bg: 'bg-blue-50 border-blue-200'
  },
  {
    value: 'advertisement',
    label: 'Advertisement / Banner',
    emoji: '📢',
    desc: 'Promotions, offers, and announcements for home page',
    color: 'from-pink-400 to-rose-600',
    bg: 'bg-pink-50 border-pink-200'
  },
  {
    value: 'rate_list',
    label: 'Rate List / Price Chart',
    emoji: '💰',
    desc: 'Photo printing, frame rates — visible on Rate List page',
    color: 'from-green-400 to-emerald-600',
    bg: 'bg-green-50 border-green-200'
  },
]

function UploadZone({ type, onUpload }) {
  const [title,     setTitle]     = useState('')
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return
    if (file.size > 20 * 1024 * 1024) { toast.error('File too large. Max 20MB.'); return }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const uploadRes = await api.post('/upload/template-preview', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      // Save to media collection
      await api.post('/owner/media', {
        type,
        title: title.trim() || file.name.replace(/\.[^.]+$/, ''),
        imageUrl: uploadRes.data.url,
        publicId: uploadRes.data.publicId,
        order: 0
      })
      toast.success('Image uploaded successfully!')
      setTitle('')
      onUpload()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
      <div>
        <label className="label">Caption / Title (optional)</label>
        <input
          className="input-field text-sm"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. A4 Color Print Sample"
        />
      </div>
      <div
        className="border-2 border-dashed border-primary-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all"
        onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <div className="space-y-2">
            <div className="loader mx-auto" />
            <p className="text-sm text-gray-500 font-body">Uploading…</p>
          </div>
        ) : (
          <div className="space-y-2">
            <FiUploadCloud className="mx-auto text-primary-400" size={32} />
            <p className="font-body font-bold text-gray-600 text-sm">Drag & drop or click to upload</p>
            <p className="text-xs text-gray-400">JPG, PNG, WEBP · Max 20MB</p>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => handleFile(e.target.files[0])} />
    </div>
  )
}

function MediaCard({ item, onDelete, onUpdate }) {
  const [editing,  setEditing]  = useState(false)
  const [title,    setTitle]    = useState(item.title || '')
  const [deleting, setDeleting] = useState(false)
  const [saving,   setSaving]   = useState(false)

  const handleDelete = async () => {
    if (!confirm('Delete this image?')) return
    setDeleting(true)
    try {
      await api.delete(`/owner/media/${item._id}`)
      toast.success('Image deleted')
      onDelete()
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put(`/owner/media/${item._id}`, { title })
      toast.success('Caption updated')
      setEditing(false)
      onUpdate()
    } catch {
      toast.error('Update failed')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async () => {
    try {
      await api.put(`/owner/media/${item._id}`, { isActive: !item.isActive })
      toast.success(item.isActive ? 'Image hidden from users' : 'Image now visible to users')
      onUpdate()
    } catch {
      toast.error('Update failed')
    }
  }

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${!item.isActive ? 'opacity-50' : ''}`}>
      <div className="relative">
        <img
          src={item.imageUrl}
          alt={item.title || 'Media'}
          className="w-full h-44 object-cover"
        />
        {!item.isActive && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-xs font-bold bg-black/60 px-3 py-1 rounded-full">Hidden</span>
          </div>
        )}
      </div>
      <div className="p-3 space-y-3">
        {/* Title */}
        {editing ? (
          <div className="flex gap-2">
            <input
              className="input-field text-xs py-2 flex-1"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
            />
            <button onClick={handleSave} disabled={saving}
              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              <FiSave size={14} />
            </button>
            <button onClick={() => setEditing(false)}
              className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors">
              <FiX size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="font-body text-sm text-ink font-bold flex-1 truncate">
              {item.title || <span className="text-gray-400 font-normal">No caption</span>}
            </p>
            <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-primary-600 p-1">
              <FiEdit3 size={13} />
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleToggleActive}
            className={`flex-1 text-xs font-bold py-2 px-3 rounded-xl border-2 transition-all ${
              item.isActive
                ? 'border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-600'
                : 'border-green-300 text-green-600 hover:bg-green-50'
            }`}
          >
            {item.isActive ? '👁️ Hide' : '✅ Show'}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl border border-transparent hover:border-red-200 transition-all"
          >
            <FiTrash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MediaManagementPage() {
  const [media,      setMedia]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [activeType, setActiveType] = useState('demo')

  const loadMedia = async () => {
    setLoading(true)
    try {
      const res = await api.get('/owner/media')
      setMedia(res.data.media)
    } catch {
      toast.error('Failed to load media')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadMedia() }, [])

  const filteredMedia = media.filter(m => m.type === activeType)
  const activeTypeConfig = MEDIA_TYPES.find(t => t.value === activeType)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OwnerSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="font-display text-3xl font-bold text-ink">Media & Rate List</h1>
            <p className="text-gray-500 font-body text-sm mt-1">
              Manage images shown to customers — demo work, ads, and price charts
            </p>
          </div>

          {/* Type Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {MEDIA_TYPES.map(type => {
              const count = media.filter(m => m.type === type.value).length
              return (
                <button
                  key={type.value}
                  onClick={() => setActiveType(type.value)}
                  className={`rounded-2xl p-4 text-left border-2 transition-all ${
                    activeType === type.value
                      ? `${type.bg} border-current shadow-md`
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{type.emoji}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/80 ${activeType === type.value ? 'text-gray-700' : 'text-gray-500'}`}>
                      {count} images
                    </span>
                  </div>
                  <p className="font-display font-bold text-sm text-ink">{type.label}</p>
                  <p className="text-xs text-gray-500 font-body mt-0.5">{type.desc}</p>
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Zone */}
            <div className="lg:col-span-1">
              <div className="card p-5 sticky top-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{activeTypeConfig?.emoji}</span>
                  <h2 className="font-display font-bold text-ink">Add New</h2>
                </div>
                <UploadZone type={activeType} onUpload={loadMedia} />
                <div className={`mt-4 rounded-xl p-3 border ${activeTypeConfig?.bg}`}>
                  <p className="text-xs font-bold text-gray-700 mb-1">💡 Tips:</p>
                  <ul className="text-xs text-gray-600 font-body space-y-1">
                    {activeType === 'demo' && <>
                      <li>• Upload photos of your best print work</li>
                      <li>• Use high quality, well-lit photos</li>
                    </>}
                    {activeType === 'advertisement' && <>
                      <li>• Upload promo banners or offer images</li>
                      <li>• Shown prominently on the home page</li>
                    </>}
                    {activeType === 'rate_list' && <>
                      <li>• Upload your printed rate chart / price list</li>
                      <li>• Visible on the Rate List page for customers</li>
                      <li>• Update whenever prices change</li>
                    </>}
                  </ul>
                </div>
              </div>
            </div>

            {/* Image Grid */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-ink">
                  {activeTypeConfig?.label} ({filteredMedia.length})
                </h2>
                <button onClick={loadMedia} className="btn-outline text-xs">🔄 Refresh</button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-48"><div className="loader" /></div>
              ) : filteredMedia.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                  <FiImage className="mx-auto text-gray-300 mb-3" size={48} />
                  <p className="font-body font-bold text-gray-400">No images yet</p>
                  <p className="text-sm text-gray-400 font-body mt-1">Upload your first {activeTypeConfig?.label.toLowerCase()} using the form →</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredMedia.map(item => (
                    <MediaCard key={item._id} item={item} onDelete={loadMedia} onUpdate={loadMedia} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
