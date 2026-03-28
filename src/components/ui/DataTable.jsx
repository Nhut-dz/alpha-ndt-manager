import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function DataTable({ columns, data, page = 1, totalPages = 1, onPageChange, actions }) {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-50 border-b border-surface-200">
              {columns.map((col) => (
                <th key={col.key} className="text-left px-4 py-3 font-medium text-surface-600 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
              {actions && <th className="text-right px-4 py-3 font-medium text-surface-600">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {data.length === 0 ? (
              <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8 text-surface-400">No data</td></tr>
            ) : data.map((row, i) => (
              <tr key={row.id || i} className="hover:bg-surface-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-surface-700">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions && <td className="px-4 py-3 text-right">{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-surface-200">
          <p className="text-sm text-surface-500">Page {page} / {totalPages}</p>
          <div className="flex gap-1">
            <button onClick={() => onPageChange?.(page - 1)} disabled={page <= 1} className="p-1.5 rounded hover:bg-surface-100 disabled:opacity-40"><ChevronLeft size={16} /></button>
            <button onClick={() => onPageChange?.(page + 1)} disabled={page >= totalPages} className="p-1.5 rounded hover:bg-surface-100 disabled:opacity-40"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </div>
  )
}
