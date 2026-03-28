import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, FolderOpen, Mail, Briefcase, X } from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/articles', icon: FileText, label: 'Bài viết' },
  { to: '/categories', icon: FolderOpen, label: 'Danh mục' },
  { to: '/contacts', icon: Mail, label: 'Liên hệ' },
  { to: '/recruitment', icon: Briefcase, label: 'Tuyển dụng' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-surface-900 transform transition-transform duration-200
      lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-surface-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-accent-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">α</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">Alpha NDT</h1>
            <p className="text-surface-400 text-xs">Quản trị</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden text-surface-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isActive
                ? 'bg-brand-500/10 text-brand-400 border-r-2 border-brand-400'
                : 'text-surface-400 hover:bg-surface-800 hover:text-white'}
            `}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-surface-700">
        <p className="text-surface-500 text-xs text-center">v1.0.0 — Alpha NDT Manager</p>
      </div>
    </aside>
  )
}
