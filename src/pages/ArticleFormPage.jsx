import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Image } from 'lucide-react'
import { postAPI, categoryAPI } from '../services/api'

export default function ArticleFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({ title: '', content: '', post_category_id: '', status: 1, img: null })
  const [categories, setCategories] = useState([])
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    categoryAPI.list().then((res) => setCategories(res.data.data || [])).catch(() => {})
    if (isEdit) {
      postAPI.get(id).then((res) => {
        const post = res.data.data
        setForm({ title: post.title, content: post.content, post_category_id: post.post_category_id, status: post.status, img: null })
        if (post.img) setPreview(post.img)
      }).catch(() => navigate('/articles'))
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
      if (isEdit) {
        await postAPI.update(id, form)
      } else {
        await postAPI.create(form)
      }
      navigate('/articles')
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/articles')} className="p-2 rounded-lg hover:bg-surface-200 text-surface-500">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-surface-800">{isEdit ? 'Sửa bài viết' : 'Thêm bài viết'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Tiêu đề *</label>
          <input
            type="text"
            className="input-field"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Nhập tiêu đề bài viết"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Danh mục *</label>
          <select
            className="input-field"
            value={form.post_category_id}
            onChange={(e) => setForm({ ...form, post_category_id: e.target.value })}
            required
          >
            <option value="">Chọn danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Nội dung *</label>
          <textarea
            className="input-field"
            rows={10}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Nhập nội dung bài viết..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Hình ảnh</label>
          <div className="flex items-start gap-4">
            {preview && (
              <img src={preview} alt="Preview" className="w-24 h-24 rounded-lg object-cover border border-surface-200" />
            )}
            <label className="btn-secondary cursor-pointer">
              <Image size={16} /> Chọn ảnh
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
          </div>
          <p className="text-xs text-surface-400 mt-1">Tối đa 2MB. JPG, PNG, WebP</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Trạng thái</label>
          <select
            className="input-field w-auto"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: Number(e.target.value) })}
          >
            <option value={1}>Đã đăng</option>
            <option value={0}>Nháp</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
          <button type="button" onClick={() => navigate('/articles')} className="btn-secondary">Hủy</button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Save size={16} />}
            {isEdit ? 'Cập nhật' : 'Tạo bài viết'}
          </button>
        </div>
      </form>
    </div>
  )
}
