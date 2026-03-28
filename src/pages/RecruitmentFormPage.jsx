import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'

export default function RecruitmentFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    status: 1,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Kết nối HR API khi backend implement
    setTimeout(() => {
      navigate('/recruitment')
    }, 500)
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/recruitment')} className="p-2 rounded-lg hover:bg-surface-200 text-surface-500">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-surface-800">{isEdit ? 'Sửa tin tuyển dụng' : 'Thêm tin tuyển dụng'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Vị trí tuyển dụng *</label>
          <input
            type="text"
            className="input-field"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="VD: Kỹ sư NDT Level II"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Mô tả công việc *</label>
          <textarea
            className="input-field"
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Mô tả chi tiết công việc..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Yêu cầu *</label>
          <textarea
            className="input-field"
            rows={4}
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            placeholder="Chứng chỉ, kinh nghiệm, kỹ năng..."
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Mức lương</label>
            <input
              type="text"
              className="input-field"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
              placeholder="VD: 15-25 triệu hoặc Thỏa thuận"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Trạng thái</label>
            <select
              className="input-field"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: Number(e.target.value) })}
            >
              <option value={1}>Đang tuyển</option>
              <option value={0}>Tạm dừng</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
          <button type="button" onClick={() => navigate('/recruitment')} className="btn-secondary">Hủy</button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Save size={16} />}
            {isEdit ? 'Cập nhật' : 'Đăng tin'}
          </button>
        </div>
      </form>
    </div>
  )
}
