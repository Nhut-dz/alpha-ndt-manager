import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import DataTable from '../components/ui/DataTable'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { postAPI } from '../services/api'

const ITEMS_PER_PAGE = 10

export default function ArticlesPage() {
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)

  const fetchPosts = () => {
    setLoading(true)
    postAPI.list()
      .then((res) => setPosts(res.data.data || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPosts() }, [])

  const filtered = posts.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.admin?.name?.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await postAPI.delete(deleteId)
      fetchPosts()
    } catch {}
    setDeleteId(null)
  }

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'title',
      label: 'Tiêu đề',
      render: (val) => <span className="font-medium max-w-xs truncate block">{val}</span>,
    },
    {
      key: 'category',
      label: 'Danh mục',
      render: (val) => val?.name || '—',
    },
    {
      key: 'admin',
      label: 'Tác giả',
      render: (val) => val?.name || '—',
    },
    {
      key: 'view',
      label: 'Lượt xem',
      render: (val) => val || 0,
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (val) => (
        <span className={val === 1 ? 'badge-success' : 'badge-warning'}>
          {val === 1 ? 'Đã đăng' : 'Nháp'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Ngày tạo',
      render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '—',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-800">Quản lý bài viết</h1>
          <p className="text-surface-500 text-sm mt-1">{posts.length} bài viết</p>
        </div>
        <Link to="/articles/create" className="btn-primary">
          <Plus size={18} /> Thêm bài viết
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          className="input-field pl-9"
          placeholder="Tìm kiếm bài viết..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginated}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          actions={(row) => (
            <div className="flex items-center justify-end gap-2">
              <Link to={`/articles/${row.id}/edit`} className="p-1.5 rounded hover:bg-brand-50 text-brand-500" title="Sửa">
                <Pencil size={16} />
              </Link>
              <button onClick={() => setDeleteId(row.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500" title="Xóa">
                <Trash2 size={16} />
              </button>
            </div>
          )}
        />
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Xóa bài viết"
        message="Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
