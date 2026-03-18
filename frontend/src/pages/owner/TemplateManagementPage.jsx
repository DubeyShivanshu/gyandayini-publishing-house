import { useState, useEffect } from 'react'
import OwnerSidebar from '../../components/owner/OwnerSidebar.jsx'
import api from '../../utils/api.js'
import toast from 'react-hot-toast'
import { FiPlus, FiTrash2, FiEdit3, FiSave, FiX } from 'react-icons/fi'

const CATEGORIES = ['marriage', 'birthday', 'anniversary', 'death', 'other']
const FIELD_TYPES = ['text', 'textarea', 'date', 'number', 'select']

const emptyField = () => ({ fieldKey: '', labelEnglish: '', labelHindi: '', type: 'text', required: false, order: 0 })

function TemplateForm({ template, onSave, onCancel }) {
  const [form, setForm] = useState(template || {
    name: '', category: 'marriage', basePrice: 500, language: 'hindi',
    description: '', previewImageUrl: '', formFields: []
  })
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('image', file)
    try {
      const res = await api.post('/upload/template-preview', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      set('previewImageUrl', res.data.url)
      toast.success('Preview image uploaded')
    } catch { toast.error('Image upload failed') }
    finally { setUploading(false) }
  }

  const addField = () => set('formFields', [...(form.formFields || []), emptyField()])
  const removeField = (i) => set('formFields', form.formFields.filter((_, idx) => idx !== i))
  const updateField = (i, k, v) => {
    const fields = [...form.formFields]
    fields[i] = { ...fields[i], [k]: v }
    set('formFields', fields)
  }

  const handleSave = async () => {
    if (!form.name || !form.category || !form.basePrice) { toast.error('Name, category, price required'); return }
    setSaving(true)
    try {
      if (template?._id) {
        await api.put(`/templates/${template._id}`, form)
        toast.success('Template updated!')
      } else {
        await api.post('/templates', form)
        toast.success('Template created!')
      }
      onSave()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">{template ? 'Edit Template' : 'Add New Template'}</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Template Name *</label>
          <input className="input-field" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Classic Traditional" />
        </div>
        <div>
          <label className="label">Category *</label>
          <select className="input-field" value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Base Price (₹) *</label>
          <input type="number" className="input-field" value={form.basePrice} onChange={e => set('basePrice', parseFloat(e.target.value))} />
        </div>
        <div>
          <label className="label">Language</label>
          <select className="input-field" value={form.language} onChange={e => set('language', e.target.value)}>
            <option value="hindi">Hindi</option>
            <option value="english">English</option>
            <option value="both">Hindi + English</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">Description</label>
        <textarea className="input-field" rows={2} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Short description of the template" />
      </div>

      {/* Preview Image */}
      <div>
        <label className="label">Preview Image</label>
        <div className="flex items-center gap-4">
          {form.previewImageUrl && <img src={form.previewImageUrl} alt="preview" className="w-20 h-28 object-cover rounded-lg border" />}
          <label className="btn-outline cursor-pointer">
            {uploading ? 'Uploading...' : '📤 Upload Preview'}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          <div>
            <p className="text-xs text-gray-400 mb-1">or paste image URL:</p>
            <input className="input-field text-sm" value={form.previewImageUrl} onChange={e => set('previewImageUrl', e.target.value)} placeholder="https://..." />
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="label mb-0">Form Fields (for customer to fill)</label>
          <button onClick={addField} className="btn-outline text-xs flex items-center gap-1">
            <FiPlus size={14} /> Add Field
          </button>
        </div>
        <div className="space-y-3">
          {(form.formFields || []).map((field, i) => (
            <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-50 p-3 rounded-xl relative">
              <input className="input-field text-xs py-2" value={field.fieldKey} onChange={e => updateField(i, 'fieldKey', e.target.value)} placeholder="Key (camelCase)" />
              <input className="input-field text-xs py-2" value={field.labelEnglish} onChange={e => updateField(i, 'labelEnglish', e.target.value)} placeholder="Label (English)" />
              <input className="input-field text-xs py-2" value={field.labelHindi} onChange={e => updateField(i, 'labelHindi', e.target.value)} placeholder="Label (Hindi)" />
              <div className="flex gap-2">
                <select className="input-field text-xs py-2 flex-1" value={field.type} onChange={e => updateField(i, 'type', e.target.value)}>
                  {FIELD_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <button onClick={() => removeField(i)} className="text-red-400 hover:text-red-600 p-2"><FiTrash2 size={14} /></button>
              </div>
              <label className="col-span-full flex items-center gap-2 text-xs text-gray-500 font-body cursor-pointer">
                <input type="checkbox" checked={field.required} onChange={e => updateField(i, 'required', e.target.checked)} />
                Required
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="btn-outline flex-1">Cancel</button>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {saving ? <><div className="loader w-4 h-4 border-2" /> Saving...</> : <><FiSave /> Save Template</>}
        </button>
      </div>
    </div>
  )
}

export default function TemplateManagementPage() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editTemplate, setEditTemplate] = useState(null)
  const [filter, setFilter] = useState('')

  const loadTemplates = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/templates${filter ? `?category=${filter}` : ''}`)
      setTemplates(res.data.templates)
    } catch { toast.error('Failed to load templates') }
    finally { setLoading(false) }
  }

  useEffect(() => { loadTemplates() }, [filter])

  const handleDelete = async (id) => {
    if (!confirm('Delete this template?')) return
    try {
      await api.delete(`/templates/${id}`)
      toast.success('Template deleted')
      loadTemplates()
    } catch { toast.error('Delete failed') }
  }

  const handleToggleActive = async (t) => {
    try {
      await api.put(`/templates/${t._id}`, { isActive: !t.isActive })
      toast.success(`Template ${t.isActive ? 'hidden' : 'activated'}`)
      loadTemplates()
    } catch { toast.error('Update failed') }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OwnerSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-display text-3xl font-bold text-ink">Template Management</h1>
            <button onClick={() => { setEditTemplate(null); setShowForm(true) }} className="btn-primary flex items-center gap-2">
              <FiPlus /> Add Template
            </button>
          </div>

          {(showForm || editTemplate) && (
            <div className="mb-6">
              <TemplateForm
                template={editTemplate}
                onSave={() => { setShowForm(false); setEditTemplate(null); loadTemplates() }}
                onCancel={() => { setShowForm(false); setEditTemplate(null) }}
              />
            </div>
          )}

          {/* Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {['', ...CATEGORIES].map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold border-2 capitalize transition-all ${filter === cat ? 'bg-primary-600 border-primary-600 text-white' : 'border-gray-200 text-gray-600 hover:border-primary-300'}`}>
                {cat || 'All'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48"><div className="loader" /></div>
          ) : templates.length === 0 ? (
            <div className="text-center py-16 text-gray-400 font-body">
              <p className="text-4xl mb-3">🎨</p>
              <p>No templates yet. Add your first template!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {templates.map(t => (
                <div key={t._id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${!t.isActive ? 'opacity-50' : ''}`}>
                  {t.previewImageUrl && <img src={t.previewImageUrl} alt={t.name} className="w-full h-44 object-cover" />}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-display font-bold text-ink">{t.name}</h3>
                        <p className="text-xs text-gray-500 capitalize font-body">{t.category} · {t.language}</p>
                      </div>
                      <span className="text-primary-700 font-bold text-sm">₹{t.basePrice}</span>
                    </div>
                    <p className="text-xs text-gray-400 font-body mb-3">{t.formFields?.length || 0} form fields</p>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditTemplate(t); setShowForm(false) }} className="btn-outline text-xs flex items-center gap-1 flex-1">
                        <FiEdit3 size={12} /> Edit
                      </button>
                      <button onClick={() => handleToggleActive(t)} className={`text-xs font-bold px-3 py-2 rounded-lg border-2 transition-all ${t.isActive ? 'border-gray-200 text-gray-500 hover:border-red-300' : 'border-green-300 text-green-600 hover:bg-green-50'}`}>
                        {t.isActive ? 'Hide' : 'Show'}
                      </button>
                      <button onClick={() => handleDelete(t._id)} className="text-red-400 hover:text-red-600 p-2"><FiTrash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
