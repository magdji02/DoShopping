import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'

const ToastContext = createContext()

export function ToastProvider({ children }){
  const [toasts, setToasts] = useState([])
  const push = useCallback((type, message) => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed z-[60] top-5 right-5 space-y-3 max-w-sm">
        {toasts.map(t => {
          const isSuccess = t.type === 'success'
          const isError = t.type === 'error'
          const isInfo = t.type === 'info'
          
          return (
            <div
              key={t.id}
              role="status"
              className={`rounded-lg shadow-lg p-4 flex items-start gap-3 animate-fadeIn ${
                isSuccess ? 'bg-green-50 border-l-4 border-green-500' :
                isError ? 'bg-red-50 border-l-4 border-red-500' :
                'bg-blue-50 border-l-4 border-blue-500'
              }`}
            >
              {isSuccess && <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />}
              {isError && <ExclamationCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
              {isInfo && <InformationCircleIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />}
              
              <p className={`text-sm font-medium flex-1 ${
                isSuccess ? 'text-green-800' :
                isError ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {t.message}
              </p>
              
              <button
                onClick={() => removeToast(t.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(){
  const ctx = useContext(ToastContext)
  if(!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default function Toast(){ return null }
