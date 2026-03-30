import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import DataTable from '../components/ui/DataTable'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { projectAPI, storageUrl } from '../services/api'
import { useToast } from '../context/ToastContext'

const ITEMS_PER_PAGE = 10

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState(null)
  const [loading, setLoading] = useState(true)
  const { showSuccess, showError } = useToast()

  const fetchProjects = () => {
    setLoading(true)
    projectAPI.list().then((res) => {
      setProjects(res.data.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetchProjects() }, [])

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.client || '').toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleDelete = async () => {
    try {
      await projectAPI.delete(deleteId)
      showSuccess('Project deleted successfully')
      fetchProjects()
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete project')
    }
    setDeleteId(null)
  }

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'title', label: 'Project', render: (val, row) => (
        <div className="flex items-center gap-3">
          {row.img_url && <img src={row.img_url} alt="" className="w-10 h-10 rounded object-cover" />}
          <span className="font-medium">{val}</span>
        </div>
      )
    },
    { key: 'client', label: 'Client' },
    { key: 'tag', label: 'Industry' },
    { key: 'year', label: 'Year' },
    {
      key: 'status', label: 'Status', render: (val) => (
        <span className={val === 1 ? 'badge-success' : 'badge-warning'}>
          {val === 1 ? 'Published' : 'Draft'}
        </span>
      )
    },
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
          <h1 className="text-2xl font-bold text-surface-800">Project Management</h1>
          <p className="text-surface-500 text-sm mt-1">{projects.length} projects</p>
        </div>
        <Link to="/projects/create" className="btn-primary"><Plus size={18} /> Add Project</Link>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input type="text" className="input-field pl-9" placeholder="Search projects..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
      </div>

      <DataTable columns={columns} data={paginated} page={page} totalPages={totalPages} onPageChange={setPage}
        actions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <Link to={`/projects/${row.id}/edit`} className="p-1.5 rounded hover:bg-brand-50 text-brand-500" title="Edit"><Pencil size={16} /></Link>
            <button onClick={() => setDeleteId(row.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500" title="Delete"><Trash2 size={16} /></button>
          </div>
        )}
      />

      <ConfirmDialog open={deleteId !== null} title="Delete Project" message="Are you sure you want to delete this project?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  )
}
