import { useAuth } from '../../context/AuthContext'
import { Menu, LogOut, User } from 'lucide-react'

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-surface-200 h-16 flex items-center justify-between px-4 sm:px-6">
      <button onClick={onMenuClick} className="lg:hidden text-surface-500 hover:text-surface-700">
        <Menu size={24} />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-surface-700">{user?.name || 'Admin'}</p>
            <p className="text-xs text-surface-400">{user?.role || 'Administrator'}</p>
          </div>
        </div>
        <button onClick={logout} className="text-surface-400 hover:text-red-500 transition-colors" title="Sign Out">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}
