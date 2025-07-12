
import { useApp } from "../contexts/AppContext"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

export default function NotificationToast() {
  const { notifications, removeNotification } = useApp()

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case "error":
        return <AlertCircle className="w-6 h-6 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />
      default:
        return <Info className="w-6 h-6 text-blue-500" />
    }
  }

  const getStyles = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
      case "error":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200"
      default:
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200"
    }
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm w-full">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className={`flex items-start p-4 rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-300 transform animate-slide-in-right ${getStyles(notification.type)}`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex-shrink-0 mr-3">{getIcon(notification.type)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-5">{notification.message}</p>
            <p className="text-xs opacity-75 mt-1">{notification.timestamp.toLocaleTimeString()}</p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="flex-shrink-0 ml-3 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-current"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
