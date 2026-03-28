import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import DataTable from '../components/ui/DataTable'
import ConfirmDialog from '../components/ui/ConfirmDialog'

const ITEMS_PER_PAGE = 10

const MOCK_JOBS = [
  { id: 1, title: 'NDT Engineer Level II', description: 'Perform non-destructive testing...', requirements: 'ASNT Level II, 3 years experience', salary: 'Negotiable', status: 1, created_at: '2026-03-15' },
  { id: 2, title: 'UT Technician', description: 'Industrial ultrasonic inspection...', requirements: 'PCN Level II UT, English communication', salary: '15-25M VND', status: 1, created_at: '2026-03-10' },
  { id: 3, title: 'Wind Energy Engineer', description: 'Wind turbine inspection...', requirements: 'GWO certified, no fear of heights', salary: '20-35M VND', status: 0, created_at: '2026-03-01' },
]

export default function RecruitmentPage() {
  const [jobs, setJobs] = useState(MOCK_JOBS)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState(null)

  const filtered = jobs.filter((j) => j.title.toLowerCase().includes(search.toLowerCase()))
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleDelete = () => { setJobs(jobs.filter((j) => j.id !== deleteId)); setDeleteId(null) }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Position', render: (val) => <span className="font-medium">{val}</span> },
    { key: 'salary', label: 'Salary' },
    { key: 'status', label: 'Status', render: (val) => <span className={val === 1 ? 'badge-success' : 'badge-warning'}>{val === 1 ? 'Active' : 'Paused'}</span> },
    { key: 'created_at', label: 'Posted', render: (val) => val ? new Date(val).toLocaleDateString('en-US') : '—' },
  ]

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
