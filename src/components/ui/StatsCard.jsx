export default function StatsCard({ icon: Icon, label, value, change, color = 'brand' }) {
  const colors = {
    brand: 'bg-brand-50 text-brand-600',
    accent: 'bg-orange-50 text-accent-500',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <div className="card hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-surface-500">{label}</p>
          <p className="text-2xl font-bold text-surface-800 mt-1">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${change > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {change > 0 ? '↑' : '↓'} {Math.abs(change)}% so với tháng trước
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}
