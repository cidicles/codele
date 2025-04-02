'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

interface WhoaData {
  movie: string
  year: number
  character: string
  full_line: string
  poster: string
  video: {
    '1080p': string
    '720p': string
    '480p': string
    '360p': string
  }
  audio: string
}

interface WhoaOverlayProps {
  onComplete: () => void
}

const WhoaOverlay = ({ onComplete }: WhoaOverlayProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [volume, setVolume] = useState(0.5)
  const [whoaData, setWhoaData] = useState<WhoaData | null>(null)

  useEffect(() => {
    const fetchAndPlayWhoa = async () => {
      try {
        const response = await fetch('https://whoa.onrender.com/whoas/random')
        const data = await response.json()
        setWhoaData(data[0]) // API still returns an array with one item

        if (videoRef.current && data[0].video) {
          // Try to use the highest quality that's available
          const videoUrl = data[0].video['1080p'] || 
                          data[0].video['720p'] || 
                          data[0].video['480p'] || 
                          data[0].video['360p']
          videoRef.current.src = videoUrl
          videoRef.current.volume = volume
          videoRef.current.play()
        }
      } catch (error) {
        console.error('Error fetching whoa:', error)
        onComplete() // Fallback if there's an error
      }
    }

    fetchAndPlayWhoa()
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume
    }
  }, [volume])

  const handleVideoEnd = () => {
    if (containerRef.current) {
      containerRef.current.classList.add('fade-out')
      setTimeout(() => {
        onComplete()
      }, 1000)
    }
  }

  if (!whoaData) return null

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
    >
      <div className="relative max-w-4xl w-full mx-4">
        {/* Movie Info Header */}
        <div className="absolute -top-16 left-0 right-0 flex items-center justify-between text-white bg-black/60 p-4 rounded-t-lg backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <img 
              src={whoaData.poster} 
              alt={whoaData.movie}
              className="h-12 w-auto rounded"
            />
            <div>
              <h3 className="font-bold text-lg">{whoaData.movie} ({whoaData.year})</h3>
              <p className="text-sm text-gray-300">
                {whoaData.character}: "{whoaData.full_line}"
              </p>
            </div>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,255,0,0.2)]">
          <video
            ref={videoRef}
            className="w-full max-h-[70vh] bg-black"
            onEnded={handleVideoEnd}
            autoPlay
          />
          
          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setVolume(prev => prev === 0 ? 0.5 : 0)}
                className="text-white hover:text-[#00ff00] transition-colors"
              >
                {volume === 0 ? 
                  <VolumeX className="h-5 w-5" /> : 
                  <Volume2 className="h-5 w-5" />
                }
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 accent-[#00ff00]"
              />
            </div>
          </div>
        </div>

        {/* Matrix-style decorative elements */}
        <div className="absolute -inset-[2px] border border-[#00ff00]/20 rounded-lg pointer-events-none" />
        <div className="absolute -inset-[1px] border border-[#00ff00]/40 rounded-lg pointer-events-none animate-pulse" />
      </div>
    </div>
  )
}

export default WhoaOverlay 