'use client'

import { useEffect, useRef } from 'react'

const MatrixParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 200
    canvas.height = 100

    const particles: { x: number; y: number; speed: number; size: number }[] = []
    const particleCount = 50

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.5 + Math.random() * 1,
        size: 1 + Math.random() * 2
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        ctx.fillStyle = 'rgba(0, 255, 0, 0.5)'
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size)

        particle.y += particle.speed
        if (particle.y > canvas.height) {
          particle.y = 0
          particle.x = Math.random() * canvas.width
        }
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none"
    />
  )
}

export default MatrixParticles 