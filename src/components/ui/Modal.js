import { useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"

const Modal = ({ isOpen, onClose, title, message, type = "info", showCloseButton = true }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case "error":
        return <AlertCircle className="h-8 w-8 text-red-500" />
      case "warning":
        return <AlertCircle className="h-8 w-8 text-yellow-500" />
      default:
        return <Info className="h-8 w-8 text-blue-500" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={showCloseButton ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-md transform rounded-2xl bg-white p-6 shadow-2xl animate-scale-in ${getBgColor()}`}>
        {/* Close button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Content */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
            {getIcon()}
          </div>
          
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            {title}
          </h3>
          
          <p className="text-gray-600">
            {message}
          </p>
        </div>

        {/* Action button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              type === "success" 
                ? "bg-green-600 text-white hover:bg-green-700" 
                : type === "error"
                ? "bg-red-600 text-white hover:bg-red-700"
                : type === "warning"
                ? "bg-yellow-600 text-white hover:bg-yellow-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {type === "success" ? "Continuer" : "OK"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal 