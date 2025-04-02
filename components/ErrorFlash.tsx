'use client'

import { useEffect } from 'react'

interface ErrorFlashProps {
  onComplete: () => void
}

const ErrorFlash = ({ onComplete }: ErrorFlashProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 600) // 0.6 seconds

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center animate-error-flash">
      <div className="font-mono text-7xl text-red-600 font-bold tracking-tight animate-error-text">
        [ERROR]
      </div>
    </div>
  )
}

export default ErrorFlash 