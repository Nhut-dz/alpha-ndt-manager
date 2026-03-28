import { useState, useEffect } from 'react'
import { FileText, Mail, Briefcase, Eye } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import StatsCard from '../components/ui/StatsCard'
import { postAPI, contactAPI } from '../services/api'

const CHART_COLORS = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ef4444']

export default function DashboardPage() {
  const [stats, setStats] = useState({ posts: 0, contacts: 0, pendingContacts: 0 })
  const [recentPosts, setRecentPosts] = useState([])
  const [recentContacts, setRecentContacts] = useState([])

  useEffect(() => {
    Promise.all([
      postAPI.list().catch(() => ({ data: { data: [] } })),
      contactAPI.list().catch(() => ({ data: { data: [] } })),
    ]).then(([postsRes, contactsRes]) => {
      const posts = postsRes.data.data || []
      const contacts = contactsRes.data.data || []
      setStats({
        posts: posts.length,
        contacts: contacts.length,
        pendingContacts: contacts.filter((c) => c.status === 0).length,
      })
      setRecentPosts(posts.slice(0, 5))
      setRecentContacts(contacts.slice(0, 5))
    })
  }, [])

  const monthlyData = [
    { name: 'T1', posts: 4, contacts: 12 },
    { name: 'T2', posts: 6, contacts: 8 },
    { name: 'T3', posts: 8, contacts: 15 },
    { name: 'T4', posts: 3, contacts: 10 },
    { name: 'T5', posts: 7, contacts: 9 },
    { name: 'T6', posts: 5, contacts: 14 },
  ]

  const statusData = [
    { name: 'Đã xử lý', value: stats.contacts - stats.pendingContacts },
    { name: 'Chưa xử lý', value: stats.pendingContacts },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-800">Dashboard</h1>
        <p className="text-surface-500 text-sm mt-1">Tổng quan hệ thống Alpha NDT</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={FileText} label="Tổng bài viết" value={stats.posts} color="brand" change={12} />
        <StatsCard icon={Mail} label="Tổng liên hệ" value={stats.contacts} color="accent" change={8} />
        <StatsCard icon={Mail} label="Chưa xử lý" value={stats.pendingContacts} color="purple" />
        <StatsCard icon={Eye} label="Lượt truy cập" value="—" color="green" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h3 className="font-semibold text-surface-800 mb-4">Thống kê theo tháng</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip />
              <Bar dataKey="posts" name="Bài viết" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="contacts" name="Liên hệ" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-surface-800 mb-4">Trạng thái liên hệ</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {statusData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-surface-800 mb-4">Bài viết gần đây</h3>
          <div className="space-y-3">
            {recentPosts.length === 0 ? (
              <p className="text-sm text-surface-400">Chưa có bài viết</p>
            ) : recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between py-2 border-b border-surface-100 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-surface-700 truncate">{post.title}</p>
                  <p className="text-xs text-surface-400">{post.admin_name || 'Admin'}</p>
                </div>
                <span className={post.status === 1 ? 'badge-success' : 'badge-warning'}>
                  {post.status === 1 ? 'Đã đăng' : 'Nháp'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-surface-800 mb-4">Liên hệ gần đây</h3>
          <div className="space-y-3">
            {recentContacts.length === 0 ? (
              <p className="text-sm text-surface-400">Chưa có liên hệ</p>
            ) : recentContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between py-2 border-b border-surface-100 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-surface-700 truncate">{contact.name}</p>
                  <p className="text-xs text-surface-400">{contact.email}</p>
                </div>
                <span className={contact.status === 1 ? 'badge-success' : 'badge-warning'}>
                  {contact.status === 1 ? 'Đã xử lý' : 'Mới'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
