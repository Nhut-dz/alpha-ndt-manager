import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import DataTable from '../components/ui/DataTable'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { recruitmentAPI } from '../services/api'
import { useToast } from '../context/ToastContext'

const ITEMS_PER_PAGE = 10

export default function RecruitmentPage() {
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState(null)
  const [loading, setLoading] = useState(true)
  const { showSuccess, showError } = useToast()

  const fetchJobs = () => {
    setLoading(true)
    recruitmentAPI.list().then((res) => {
      setJobs(res.data.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetchJobs() }, [])

  const filtered = jobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    (j.position || '').toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleDelete = async () => {
    try {
      await recruitmentAPI.delete(deleteId)
      showSuccess('Job posting deleted successfully')
      fetchJobs()
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete job posting')
    }
    setDeleteId(null)
  }

  const statusLabel = (val) => {
    if (val === 1) return { text: 'Active', cls: 'badge-success' }
    if (val === 2) return { text: 'Closed', cls: 'badge-danger' }
    return { text: 'Draft', cls: 'badge-warning' }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Position', render: (val) => <span className="font-medium">{val}</span> },
    { key: 'department', label: 'Department', render: (val) => val || '—' },
    { key: 'employment_type', label: 'Type', render: (val) => val || '—' },
    { key: 'salary_range', label: 'Salary', render: (val) => val || 'Negotiable' },
    { key: 'quantity', label: 'Qty' },
    {
      key: 'status', label: 'Status', render: (val) => {
        const s = statusLabel(val)
        return <span className={s.cls}>{s.text}</span>
      }
    },
    { key: 'deadline', label: 'Deadline', render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '—' },
  ]

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-800">Recruitment Management</h1>
          <p className="text-surface-500 text-sm mt-1">{jobs.length} job postings</p>
        </div>
        <Link to="/recruitment/create" className="btn-primary"><Plus size={18} /> Add Job</Link>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input type="text" className="input-field pl-9" placeholder="Search positions..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
      </div>

      <DataTable columns={columns} data={paginated} page={page} totalPages={totalPages} onPageChange={setPage}
        actions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <Link to={`/recruitment/${row.id}/edit`} className="p-1.5 rounded hover:bg-brand-50 text-brand-500" title="Edit"><Pencil size={16} /></Link>
            <button onClick={() => setDeleteId(row.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500" title="Delete"><Trash2 size={16} /></button>
          </div>
        )}
      />

      <ConfirmDialog open={deleteId !== null} title="Delete Job Posting" message="Are you sure you want to delete this job posting?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  )
}
