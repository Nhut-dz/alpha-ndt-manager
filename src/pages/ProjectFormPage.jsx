import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Image, Plus, X } from 'lucide-react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { projectAPI, storageUrl } from '../services/api'

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean'],
  ],
}

const quillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'align',
  'list', 'bullet', 'blockquote', 'code-block',
  'link', 'image',
]

const TAG_OPTIONS = ['Oil & Gas', 'Gas', 'Marine', 'Offshore', 'Subsea', 'Pipeline', 'Plant', 'Industrial', 'Refinery', 'Power', 'Bridge', 'Renewable Energy', 'Wind Energy', 'Infrastructure']

export default function ProjectFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    title: '', description: '', content: '', client: '', industry: '', location: '',
    year: '', duration: '', tag: '', img: null, status: 1, sort_order: 0,
    highlights: [], methods: [], standards: [],
  })
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newHighlight, setNewHighlight] = useState('')
  const [newMethod, setNewMethod] = useState('')
  const [newStandard, setNewStandard] = useState('')

  useEffect(() => {
    if (isEdit) {
      projectAPI.get(id).then((res) => {
        const p = res.data.data
        setForm({
          title: p.title || '', description: p.description || '', content: p.content || '',
          client: p.client || '', industry: p.industry || '', location: p.location || '',
          year: p.year || '', duration: p.duration || '', tag: p.tag || '', img: null,
          status: p.status ?? 1, sort_order: p.sort_order || 0,
          highlights: p.highlights || [], methods: p.methods || [], standards: p.standards || [],
        })
        if (p.img_url) setPreview(p.img_url)
      }).catch(() => navigate('/projects'))
    }
  }, [id, isEdit, navigate])

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setForm({ ...form, img: file })
      setPreview(URL.createObjectURL(file))
    }
  }

  const addToArray = (field, value, setter) => {
    if (value.trim()) {
      setForm({ ...form, [field]: [...form[field], value.trim()] })
      setter('')
    }
  }

  const removeFromArray = (field, index) => {
    setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const submitData = { ...form }
      if (!submitData.img) delete submitData.img
      if (isEdit) {
        await projectAPI.update(id, submitData)
      } else {
        await projectAPI.create(submitData)
      }
      navigate('/projects')
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const TagArrayInput = ({ label, items, field, value, setValue, placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-surface-700 mb-1.5">{label}</label>
      <div className="flex gap-2 mb-2">
        <input type="text" className="input-field flex-1" value={value} onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addToArray(field, value, setValue) } }} />
        <button type="button" className="btn-secondary" onClick={() => addToArray(field, value, setValue)}><Plus size={16} /></button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-sm px-2.5 py-1 rounded-lg">
              {item}
              <button type="button" onClick={() => removeFromArray(field, i)} className="text-brand-400 hover:text-red-500"><X size={14} /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/projects')} className="p-2 rounded-lg hover:bg-surface-200 text-surface-500"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-bold text-surface-800">{isEdit ? 'Edit Project' : 'Add Project'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Project Title <span className="text-red-500">*</span></label>
          <input type="text" className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. NDT Service for Offshore Platform" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Client</label>
            <input type="text" className="input-field" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="e.g. PetroVietnam" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Industry</label>
            <input type="text" className="input-field" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="e.g. Oil & Gas" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Tag/Category</label>
            <select className="input-field" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}>
              <option value="">Select tag</option>
              {TAG_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Year</label>
            <input type="text" className="input-field" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="e.g. 2025" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Duration</label>
            <input type="text" className="input-field" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 3 months" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Location</label>
          <input type="text" className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Vung Tau, Vietnam" />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Short Description</label>
          <textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief project summary..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Detailed Content</label>
          <div className="quill-wrapper">
            <ReactQuill theme="snow" value={form.content} onChange={(value) => setForm({ ...form, content: value })} modules={quillModules} formats={quillFormats} placeholder="Full project details..." />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Project Image</label>
          <div className="flex items-start gap-4">
            {preview && <img src={preview} alt="Preview" className="w-24 h-24 rounded-lg object-cover border border-surface-200" />}
            <label className="btn-secondary cursor-pointer">
              <Image size={16} /> Choose Image
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
          </div>
          <p className="text-xs text-surface-400 mt-1">Max 5MB. JPG, PNG, WebP</p>
        </div>

        <TagArrayInput label="Highlights" items={form.highlights} field="highlights" value={newHighlight} setValue={setNewHighlight} placeholder="Add highlight (press Enter)" />
        <TagArrayInput label="NDT Methods" items={form.methods} field="methods" value={newMethod} setValue={setNewMethod} placeholder="e.g. UT, RT, MT, PT" />
        <TagArrayInput label="Applied Standards" items={form.standards} field="standards" value={newStandard} setValue={setNewStandard} placeholder="e.g. ASME, AWS D1.1" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Status</label>
            <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: Number(e.target.value) })}>
              <option value={1}>Published</option>
              <option value={0}>Draft</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Sort Order</label>
            <input type="number" className="input-field" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} min={0} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
          <button type="button" onClick={() => navigate('/projects')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Save size={16} />}
            {isEdit ? 'Update' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
}
