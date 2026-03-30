import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Image } from 'lucide-react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { recruitmentAPI, storageUrl } from '../services/api'
import { useToast } from '../context/ToastContext'

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
}

export default function RecruitmentFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    title: '', description: '', content: '', position: '', department: '', location: '',
    employment_type: 'full-time', quantity: 1, salary_range: '', requirements: '', benefits: '',
    deadline: '', contact_email: '', img: null, status: 1,
  })
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      recruitmentAPI.get(id).then((res) => {
        const r = res.data.data
        setForm({
          title: r.title || '', description: r.description || '', content: r.content || '',
          position: r.position || '', department: r.department || '', location: r.location || '',
          employment_type: r.employment_type || 'full-time', quantity: r.quantity || 1,
          salary_range: r.salary_range || '', requirements: r.requirements || '', benefits: r.benefits || '',
          deadline: r.deadline ? r.deadline.split('T')[0] : '', contact_email: r.contact_email || '',
          img: null, status: r.status ?? 1,
        })
        if (r.img_url) setPreview(r.img_url)
      }).catch(() => navigate('/recruitment'))
    }
  }, [id, isEdit, navigate])

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setForm({ ...form, img: file })
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const submitData = { ...form }
      if (!submitData.img) delete submitData.img
      if (!submitData.deadline) delete submitData.deadline
      if (isEdit) {
        await recruitmentAPI.update(id, submitData)
        showSuccess('Job posting updated successfully')
      } else {
        await recruitmentAPI.create(submitData)
        showSuccess('Job posting created successfully')
      }
      navigate('/recruitment')
    } catch (err) {
      const msg = err.response?.data?.message || 'An error occurred'
      setError(msg)
      showError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/recruitment')} className="p-2 rounded-lg hover:bg-surface-200 text-surface-500"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-bold text-surface-800">{isEdit ? 'Edit Job Posting' : 'Add Job Posting'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Job Title <span className="text-red-500">*</span></label>
          <input type="text" className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. NDT Engineer Level II" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Position</label>
            <input type="text" className="input-field" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="e.g. Senior Engineer" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Department</label>
            <input type="text" className="input-field" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="e.g. NDT Operations" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Employment Type</label>
            <select className="input-field" value={form.employment_type} onChange={(e) => setForm({ ...form, employment_type: e.target.value })}>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Quantity</label>
            <input type="number" className="input-field" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} min={1} />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Salary Range</label>
            <input type="text" className="input-field" value={form.salary_range} onChange={(e) => setForm({ ...form, salary_range: e.target.value })} placeholder="e.g. 15-25M VND" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Location</label>
            <input type="text" className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Vung Tau, Vietnam" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Deadline</label>
            <input type="date" className="input-field" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Contact Email</label>
          <input type="email" className="input-field" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} placeholder="hr@alpha-ndt.com" />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Short Description</label>
          <textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief job description..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Requirements</label>
          <textarea className="input-field" rows={4} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder="Certifications, experience, skills..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Benefits</label>
          <textarea className="input-field" rows={4} value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} placeholder="Insurance, bonuses, training..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Detailed Content</label>
          <div className="quill-wrapper">
            <ReactQuill theme="snow" value={form.content} onChange={(value) => setForm({ ...form, content: value })} modules={quillModules} placeholder="Full job posting content..." />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Cover Image</label>
          <div className="flex items-start gap-4">
            {preview && <img src={preview} alt="Preview" className="w-24 h-24 rounded-lg object-cover border border-surface-200" />}
            <label className="btn-secondary cursor-pointer">
              <Image size={16} /> Choose Image
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Status</label>
          <select className="input-field w-auto" value={form.status} onChange={(e) => setForm({ ...form, status: Number(e.target.value) })}>
            <option value={1}>Active</option>
            <option value={0}>Draft</option>
            <option value={2}>Closed</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
          <button type="button" onClick={() => navigate('/recruitment')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Save size={16} />}
            {isEdit ? 'Update' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  )
}
