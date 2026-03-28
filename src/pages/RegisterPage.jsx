import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, UserPlus, Eye, EyeOff } from 'lucide-react'
import { authAPI } from '../services/api'

const ROLES = [
  { id: 2, name: 'Post_Admin', label: 'Quản lý bài viết' },
  { id: 3, name: 'HR_Admin', label: 'Quản lý tuyển dụng' },
  { id: 4, name: 'Contact_Admin', label: 'Quản lý liên hệ' },
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role_id: '',
  })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.password !== form.password_confirmation) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    setLoading(true)
    try {
      const res = await authAPI.register(form)
      setSuccess(`Tạo tài khoản "${res.data.data.admin.name}" thành công!`)
      setForm({ name: '', email: '', password: '', password_confirmation: '', role_id: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-surface-200 text-surface-500">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-surface-800">Tạo tài khoản Admin</h1>
          <p className="text-surface-500 text-sm mt-1">Chỉ Super Admin mới có quyền tạo tài khoản</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>}

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Họ tên *</label>
          <input
            type="text"
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nhập họ tên"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Email *</label>
          <input
            type="email"
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="admin@alpha-ndt.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Vai trò *</label>
          <select
            className="input-field"
            value={form.role_id}
            onChange={(e) => setForm({ ...form, role_id: e.target.value })}
            required
          >
            <option value="">Chọn vai trò</option>
            {ROLES.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name} — {role.label}
              </option>
            ))}
          </select>
          <div className="mt-2 space-y-1">
            {ROLES.map((role) => (
              <p key={role.id} className="text-xs text-surface-400">
                <span className="font-medium text-surface-500">{role.name}:</span> {role.label}
              </p>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Mật khẩu *</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              className="input-field pr-10"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Tối thiểu 8 ký tự"
              minLength={8}
              required
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600" onClick={() => setShowPw(!showPw)}>
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Xác nhận mật khẩu *</label>
          <input
            type={showPw ? 'text' : 'password'}
            className="input-field"
            value={form.password_confirmation}
            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
            placeholder="Nhập lại mật khẩu"
            minLength={8}
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
          <button type="button" onClick={() => navigate('/')} className="btn-secondary">Hủy</button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <UserPlus size={16} />}
            Tạo tài khoản
          </button>
        </div>
      </form>
    </div>
  )
}
