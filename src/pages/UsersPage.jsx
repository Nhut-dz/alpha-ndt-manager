import { useState, useEffect, useCallback } from 'react'
import { Search, Eye, Lock, Unlock, X, ChevronLeft, ChevronRight, User } from 'lucide-react'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { adminAPI } from '../services/api'
import { useToast } from '../context/ToastContext'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 })
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState(null)
  const [toggleUser, setToggleUser] = useState(null)
  const { showSuccess, showError } = useToast()

  const fetchUsers = useCallback(() => {
    setLoading(true)
    adminAPI.list({ search, page, per_page: 10 })
      .then((res) => {
        const paginated = res.data.data
        setUsers(paginated.data || [])
        setMeta({ current_page: paginated.current_page, last_page: paginated.last_page, total: paginated.total })
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [search, page])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1) }
  const handleViewDetail = async (user) => { try { const res = await adminAPI.get(user.id); setDetail(res.data.data) } catch { setDetail(user) } }
  const handleToggleStatus = async () => {
    if (!toggleUser) return
    try {
      await adminAPI.updateStatus(toggleUser.id, toggleUser.status === 1 ? 0 : 1)
      showSuccess(toggleUser.status === 1 ? 'Account locked' : 'Account unlocked')
      fetchUsers()
    } catch (err) {
      showError(err.response?.data?.message || 'An error occurred')
    }
    setToggleUser(null)
  }

  const roleColors = { 'Super Admin': 'bg-purple-100 text-purple-800', 'Post_Admin': 'bg-blue-100 text-blue-800', 'HR_Admin': 'bg-orange-100 text-orange-800', 'Contact_Admin': 'bg-green-100 text-green-800' }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-800">User Management</h1>
        <p className="text-surface-500 text-sm mt-1">{meta.total} accounts</p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input type="text" className="input-field pl-9" placeholder="Search by name, email..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
      </form>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" /></div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-200">
                  <th className="text-left px-4 py-3 font-medium text-surface-600">User</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-600">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-600">Created</th>
                  <th className="text-right px-4 py-3 font-medium text-surface-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {users.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-surface-400">No data</td></tr>
                ) : users.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center flex-shrink-0"><User size={14} /></div>
                        <span className="font-medium text-surface-700">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-600">{user.email}</td>
                    <td className="px-4 py-3"><span className={`badge ${roleColors[user.role] || 'bg-gray-100 text-gray-800'}`}>{user.role}</span></td>
                    <td className="px-4 py-3"><span className={user.status === 1 ? 'badge-success' : 'badge-danger'}>{user.status === 1 ? 'Active' : 'Blocked'}</span></td>
                    <td className="px-4 py-3 text-surface-500">{user.created_at ? new Date(user.created_at).toLocaleDateString('en-US') : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleViewDetail(user)} className="p-1.5 rounded hover:bg-blue-50 text-brand-500" title="View Details"><Eye size={16} /></button>
                        {user.role !== 'Super Admin' && (
                          <button onClick={() => setToggleUser(user)} className={`p-1.5 rounded ${user.status === 1 ? 'hover:bg-red-50 text-red-500' : 'hover:bg-green-50 text-green-500'}`} title={user.status === 1 ? 'Lock Account' : 'Unlock Account'}>
                            {user.status === 1 ? <Lock size={16} /> : <Unlock size={16} />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {meta.last_page > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-surface-200">
              <p className="text-sm text-surface-500">Page {meta.current_page} / {meta.last_page} ({meta.total} results)</p>
              <div className="flex gap-1">
                <button onClick={() => setPage(page - 1)} disabled={page <= 1} className="p-1.5 rounded hover:bg-surface-100 disabled:opacity-40"><ChevronLeft size={16} /></button>
                <button onClick={() => setPage(page + 1)} disabled={page >= meta.last_page} className="p-1.5 rounded hover:bg-surface-100 disabled:opacity-40"><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-surface-800">Account Details</h3>
              <button onClick={() => setDetail(null)} className="text-surface-400 hover:text-surface-600"><X size={20} /></button>
            </div>
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-3"><User size={28} /></div>
              <h4 className="text-lg font-semibold text-surface-800">{detail.name}</h4>
              <p className="text-sm text-surface-500">{detail.email}</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-surface-100"><span className="text-surface-500">ID</span><span className="font-medium text-surface-800">#{detail.id}</span></div>
              <div className="flex justify-between py-2 border-b border-surface-100"><span className="text-surface-500">Role</span><span className={`badge ${roleColors[detail.role] || 'bg-gray-100 text-gray-800'}`}>{detail.role}</span></div>
              <div className="flex justify-between py-2 border-b border-surface-100"><span className="text-surface-500">Status</span><span className={detail.status === 1 ? 'badge-success' : 'badge-danger'}>{detail.status === 1 ? 'Active' : 'Blocked'}</span></div>
              <div className="flex justify-between py-2 border-b border-surface-100"><span className="text-surface-500">Created</span><span className="text-surface-800">{detail.created_at ? new Date(detail.created_at).toLocaleString('en-US') : '—'}</span></div>
              {detail.updated_at && (<div className="flex justify-between py-2"><span className="text-surface-500">Last Updated</span><span className="text-surface-800">{new Date(detail.updated_at).toLocaleString('en-US')}</span></div>)}
            </div>
            <div className="flex justify-end mt-6"><button onClick={() => setDetail(null)} className="btn-secondary">Close</button></div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={toggleUser !== null}
        title={toggleUser?.status === 1 ? 'Lock Account' : 'Unlock Account'}
        message={toggleUser?.status === 1 ? `Are you sure you want to lock the account "${toggleUser?.name}"? The user will not be able to sign in.` : `Are you sure you want to unlock the account "${toggleUser?.name}"?`}
        onConfirm={handleToggleStatus}
        onCancel={() => setToggleUser(null)}
      />
    </div>
  )
}
