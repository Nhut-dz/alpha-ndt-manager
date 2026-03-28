import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, FolderOpen, Mail, Briefcase, Users, UserPlus, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/articles', icon: FileText, label: 'Articles' },
  { to: '/categories', icon: FolderOpen, label: 'Categories' },
  { to: '/contacts', icon: Mail, label: 'Contacts' },
  { to: '/recruitment', icon: Briefcase, label: 'Recruitment' },
  { to: '/users', icon: Users, label: 'Users', superOnly: true },
  { to: '/register', icon: UserPlus, label: 'Create Account', superOnly: true },
]

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth()
  const isSuperAdmin = user?.role === 'Super Admin'

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-surface-900 transform transition-transform duration-200
      lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-surface-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-accent-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">α</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">Alpha NDT</h1>
            <p className="text-surface-400 text-xs">Admin</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden text-surface-400 hover:text-white"><X size={20} /></button>
      </div>

      <nav className="mt-6 px-3 space-y-1">
        {navItems.filter((item) => !item.superOnly || isSuperAdmin).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isActive ? 'bg-brand-500/10 text-brand-400 border-r-2 border-brand-400' : 'text-surface-400 hover:bg-surface-800 hover:text-white'}
            `}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-surface-700">
        <p className="text-surface-500 text-xs text-center">v1.0.0 — Alpha NDT Manager</p>
      </div>
    </aside>
  )
}
