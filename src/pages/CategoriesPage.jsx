import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { categoryAPI } from '../services/api'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', status: 1 })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const { showSuccess, showError } = useToast()

  const fetchCategories = () => {
    setLoading(true)
    categoryAPI.list()
      .then((res) => setCategories(res.data.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCategories() }, [])

  const openCreate = () => { setEditItem({}); setForm({ name: '', description: '', status: 1 }); setError('') }
  const openEdit = (cat) => { setEditItem(cat); setForm({ name: cat.name, description: cat.description || '', status: cat.status }); setError('') }

  const handleSave = async () => {
    setError(''); setSaving(true)
    try {
      if (editItem.id) {
        await categoryAPI.update(editItem.id, form)
        showSuccess('Category updated successfully')
      } else {
        await categoryAPI.create(form)
        showSuccess('Category created successfully')
      }
      setEditItem(null); fetchCategories()
    } catch (err) {
      const msg = err.response?.data?.message || 'An error occurred'
      setError(msg)
      showError(msg)
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await categoryAPI.delete(deleteId)
      showSuccess('Category deleted successfully')
      fetchCategories()
    } catch (err) {
      showError(err.response?.data?.message || 'Cannot delete this category')
    }
    setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-800">Category Management</h1>
          <p className="text-surface-500 text-sm mt-1">{categories.length} categories</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={18} /> Add Category</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.length === 0 ? (
            <p className="text-surface-400 text-sm col-span-full text-center py-8">No categories yet</p>
          ) : categories.map((cat) => (
            <div key={cat.id} className="card hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <h3 className="font-semibold text-surface-800">{cat.name}</h3>
                  <p className="text-xs text-surface-400 mt-0.5">/{cat.slug}</p>
                  {cat.description && <p className="text-sm text-surface-600 mt-2 line-clamp-2">{cat.description}</p>}
                </div>
                <span className={cat.status === 1 ? 'badge-success' : 'badge-warning'}>{cat.status === 1 ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-surface-100">
                <button onClick={() => openEdit(cat)} className="text-sm text-brand-500 hover:text-brand-600 flex items-center gap-1"><Pencil size={14} /> Edit</button>
                <button onClick={() => setDeleteId(cat.id)} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 ml-auto"><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editItem !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-800">{editItem.id ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setEditItem(null)} className="text-surface-400 hover:text-surface-600"><X size={20} /></button>
            </div>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Category Name *</label>
                <input type="text" className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. NDT News" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Description</label>
                <textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief category description..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Status</label>
                <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: Number(e.target.value) })}>
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditItem(null)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name.trim()} className="btn-primary">
                {saving ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Save size={16} />}
                {editItem.id ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={deleteId !== null} title="Delete Category" message="Are you sure you want to delete this category? Cannot delete if there are related articles." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  )
}
