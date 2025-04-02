'use client'

import { useEffect, useState } from 'react'

interface RaptorOverlayProps {
  onComplete: () => void
}

const RaptorOverlay = ({ onComplete }: RaptorOverlayProps) => {
  const [position, setPosition] = useState(window.innerWidth)

  useEffect(() => {
    let startTime: number
    let animationFrameId: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const duration = 2000 // 2 seconds

      // Calculate new position
      const newPosition = window.innerWidth - (progress / duration * (window.innerWidth + 128))
      setPosition(newPosition)

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        onComplete()
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [onComplete])

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 pointer-events-none h-32">
      <img 
        src="/raptor.png" 
        alt="Velociraptor"
        style={{
          position: 'absolute',
          left: `${position}px`,
          width: '128px',
          height: '128px',
          objectFit: 'contain',
          transform: 'scaleX(-1)'
        }}
      />
    </div>
  )
}

export default RaptorOverlay 