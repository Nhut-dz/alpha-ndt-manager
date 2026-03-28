import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogIn, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password, form.remember)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-600 via-brand-700 to-surface-900 px-4">
      <div className="w-full max-w-lg">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-10 space-y-6">
          <div className="text-center pb-4 border-b border-surface-200">
            <img src="/logo-light.png" alt="Alpha NDT" className="h-24 w-auto mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-surface-800">Admin Panel</h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="admin@alpha-ndt.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                className="input-field pr-10"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="rounded border-surface-300 text-brand-500 focus:ring-brand-500"
              checked={form.remember}
              onChange={(e) => setForm({ ...form, remember: e.target.checked })}
            />
            <label htmlFor="remember" className="ml-2 text-sm text-surface-600">Remember me</label>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <><LogIn size={18} /> Sign In</>
            )}
          </button>
        </form>

        <p className="text-center text-brand-200 text-sm mt-6">
          © 2002 - {new Date().getFullYear()} Alpha NDT. All rights reserved.
        </p>
      </div>
    </div>
  )
}
