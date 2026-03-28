import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import DataTable from '../components/ui/DataTable'
import ConfirmDialog from '../components/ui/ConfirmDialog'

const ITEMS_PER_PAGE = 10

// Mock data — backend HR API chưa implement, sẽ kết nối khi sẵn sàng
const MOCK_JOBS = [
  { id: 1, title: 'Kỹ sư NDT Level II', description: 'Thực hiện kiểm tra không phá hủy...', requirements: 'ASNT Level II, 3 năm kinh nghiệm', salary: 'Thỏa thuận', status: 1, created_at: '2026-03-15' },
  { id: 2, title: 'Kỹ thuật viên UT', description: 'Kiểm tra siêu âm công nghiệp...', requirements: 'PCN Level II UT, tiếng Anh giao tiếp', salary: '15-25 triệu', status: 1, created_at: '2026-03-10' },
  { id: 3, title: 'Kỹ sư Wind Energy', description: 'Kiểm tra tua-bin gió...', requirements: 'GWO certified, không sợ độ cao', salary: '20-35 triệu', status: 0, created_at: '2026-03-01' },
]

export default function RecruitmentPage() {
  const [jobs, setJobs] = useState(MOCK_JOBS)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState(null)

  const filtered = jobs.filter((j) => j.title.toLowerCase().includes(search.toLowerCase()))
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleDelete = () => {
    setJobs(jobs.filter((j) => j.id !== deleteId))
    setDeleteId(null)
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Vị trí', render: (val) => <span className="font-medium">{val}</span> },
    { key: 'salary', label: 'Mức lương' },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (val) => (
        <span className={val === 1 ? 'badge-success' : 'badge-warning'}>
          {val === 1 ? 'Đang tuyển' : 'Tạm dừng'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Ngày đăng',
      render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '—',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-800">Quản lý tuyển dụng</h1>
          <p className="text-surface-500 text-sm mt-1">{jobs.length} tin tuyển dụng</p>
        </div>
        <Link to="/recruitment/create" className="btn-primary">
          <Plus size={18} /> Thêm tin
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          className="input-field pl-9"
          placeholder="Tìm kiếm vị trí..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
      </div>

      <DataTable
        columns={columns}
        data={paginated}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        actions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <Link to={`/recruitment/${row.id}/edit`} className="p-1.5 rounded hover:bg-brand-50 text-brand-500" title="Sửa">
              <Pencil size={16} />
            </Link>
            <button onClick={() => setDeleteId(row.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500" title="Xóa">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />

      <ConfirmDialog
        open={deleteId !== null}
        title="Xóa tin tuyển dụng"
        message="Bạn có chắc chắn muốn xóa tin tuyển dụng này?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
