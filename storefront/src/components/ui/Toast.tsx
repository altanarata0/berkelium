"use client"

import { createContext, useCallback, useContext, useState } from "react"

type Toast = {
  id: number
  message: string
  type: "success" | "error" | "info"
}

type ToastContextType = {
  toast: (message: string, type?: Toast["type"]) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

let toastId = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(
    (message: string, type: Toast["type"] = "success") => {
      const id = ++toastId
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 3000)
    },
    []
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              pointer-events-auto px-5 py-3 text-sm font-body shadow-lg
              animate-[slideIn_0.3s_ease-out]
              ${
                t.type === "success"
                  ? "bg-berkeley-blue text-off-white"
                  : t.type === "error"
                    ? "bg-red-600 text-white"
                    : "bg-charcoal text-off-white"
              }
            `}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}
