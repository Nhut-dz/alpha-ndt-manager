import { useState, useEffect } from 'react'
import { Search, Eye, Trash2, CheckCircle, Clock, X } from 'lucide-react'
import DataTable from '../components/ui/DataTable'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { contactAPI } from '../services/api'

const ITEMS_PER_PAGE = 10

export default function ContactsPage() {
  const [contacts, setContacts] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [detail, setDetail] = useState(null)

  const fetchContacts = () => {
    setLoading(true)
    contactAPI.list()
      .then((res) => setContacts(res.data.data || []))
      .catch(() => setContacts([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchContacts() }, [])

  const filtered = contacts.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  )
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleStatusToggle = async (contact) => {
    try { await contactAPI.updateStatus(contact.id, contact.status === 1 ? 0 : 1); fetchContacts() } catch {}
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try { await contactAPI.delete(deleteId); fetchContacts() } catch {}
    setDeleteId(null)
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Full Name', render: (val) => <span className="font-medium">{val}</span> },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', render: (val) => val || '—' },
    { key: 'service', label: 'Service', render: (val) => val || '—' },
    {
      key: 'status', label: 'Status',
      render: (val) => <span className={val === 1 ? 'badge-success' : 'badge-warning'}>{val === 1 ? 'Processed' : 'Pending'}</span>,
    },
    { key: 'created_at', label: 'Date', render: (val) => val ? new Date(val).toLocaleDateString('en-US') : '—' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-800">Contact Management</h1>
        <p className="text-surface-500 text-sm mt-1">{contacts.length} contacts — {contacts.filter((c) => c.status === 0).length} pending</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input type="text" className="input-field pl-9" placeholder="Search by name, email, phone..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" /></div>
      ) : (
        <DataTable columns={columns} data={paginated} page={page} totalPages={totalPages} onPageChange={setPage}
          actions={(row) => (
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setDetail(row)} className="p-1.5 rounded hover:bg-blue-50 text-brand-500" title="View Details"><Eye size={16} /></button>
              <button onClick={() => handleStatusToggle(row)} className={`p-1.5 rounded ${row.status === 1 ? 'hover:bg-yellow-50 text-yellow-500' : 'hover:bg-green-50 text-green-500'}`} title={row.status === 1 ? 'Mark as Pending' : 'Mark as Processed'}>
                {row.status === 1 ? <Clock size={16} /> : <CheckCircle size={16} />}
              </button>
              <button onClick={() => setDeleteId(row.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500" title="Delete"><Trash2 size={16} /></button>
            </div>
          )}
        />
      )}

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-800">Contact Details</h3>
              <button onClick={() => setDetail(null)} className="text-surface-400 hover:text-surface-600"><X size={20} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-surface-500">Full Name:</span> <span className="font-medium text-surface-800 ml-2">{detail.name}</span></div>
              <div><span className="text-surface-500">Email:</span> <span className="text-surface-800 ml-2">{detail.email}</span></div>
              <div><span className="text-surface-500">Phone:</span> <span className="text-surface-800 ml-2">{detail.phone || '—'}</span></div>
              <div><span className="text-surface-500">Service:</span> <span className="text-surface-800 ml-2">{detail.service || '—'}</span></div>
              <div><span className="text-surface-500">Status:</span> <span className={`ml-2 ${detail.status === 1 ? 'badge-success' : 'badge-warning'}`}>{detail.status === 1 ? 'Processed' : 'Pending'}</span></div>
              <div>
                <span className="text-surface-500">Message:</span>
                <p className="mt-1 text-surface-700 bg-surface-50 rounded-lg p-3">{detail.message || 'No message'}</p>
              </div>
              <div><span className="text-surface-500">Date:</span> <span className="text-surface-800 ml-2">{detail.created_at ? new Date(detail.created_at).toLocaleString('en-US') : '—'}</span></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { handleStatusToggle(detail); setDetail(null) }} className={detail.status === 1 ? 'btn-secondary' : 'btn-primary'}>
                {detail.status === 1 ? 'Mark as Pending' : 'Mark as Processed'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={deleteId !== null} title="Delete Contact" message="Are you sure you want to delete this contact?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  )
}
