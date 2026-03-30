import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

const ICONS = {
  success: <CheckCircle size={20} className="text-green-500 flex-shrink-0" />,
  error: <XCircle size={20} className="text-red-500 flex-shrink-0" />,
  info: <Info size={20} className="text-blue-500 flex-shrink-0" />,
}

const STYLES = {
  success: 'border-green-200 bg-green-50',
  error: 'border-red-200 bg-red-50',
  info: 'border-blue-200 bg-blue-50',
}

const TEXT_STYLES = {
  success: 'text-green-800',
  error: 'text-red-800',
  info: 'text-blue-800',
}

export default function Toast({ type, message, duration, onClose }) {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(onClose, 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const handleClose = () => {
    setExiting(true)
    setTimeout(onClose, 300)
  }

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm min-w-[300px] transition-all duration-300 ${STYLES[type]} ${
        visible && !exiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      {ICONS[type]}
      <p className={`text-sm font-medium flex-1 ${TEXT_STYLES[type]}`}>{message}</p>
      <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
        <X size={16} />
      </button>
    </div>
  )
}
