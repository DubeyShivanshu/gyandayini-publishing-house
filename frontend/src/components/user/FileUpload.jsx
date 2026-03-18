import { useState, useRef } from 'react'
import api from '../../utils/api.js'
import toast from 'react-hot-toast'
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi'

export default function FileUpload({ onUpload, accept = 'image/*,application/pdf', label = 'Upload File', endpoint = '/upload/file' }) {
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(null)
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return
    const maxSize = 20 * 1024 * 1024
    if (file.size > maxSize) { toast.error('File too large. Max 20MB allowed.'); return }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await api.post(endpoint, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setUploaded(res.data)
      onUpload(res.data)
      toast.success('File uploaded successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const removeFile = () => {
    setUploaded(null)
    onUpload(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <label className="label">{label}</label>
      {uploaded ? (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
          <FiFile className="text-green-600" size={20} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-body font-bold text-green-800 truncate">{uploaded.originalName}</p>
            <p className="text-xs text-green-600">{(uploaded.size / 1024).toFixed(1)} KB</p>
          </div>
          {uploaded.url && (
            <a href={uploaded.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 underline">View</a>
          )}
          <button type="button" onClick={removeFile} className="text-red-400 hover:text-red-600">
            <FiX size={18} />
          </button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-primary-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <div className="space-y-2">
              <div className="loader mx-auto" />
              <p className="text-sm text-gray-500 font-body">Uploading...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <FiUploadCloud className="mx-auto text-primary-400" size={36} />
              <p className="font-body font-bold text-gray-600">Drag & drop or click to upload</p>
              <p className="text-xs text-gray-400">Images (JPG, PNG, WEBP) and PDF files up to 20MB</p>
            </div>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => handleFile(e.target.files[0])}
      />
    </div>
  )
}
