'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, X as CloseIcon } from 'lucide-react'

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
  const audioRef = useRef<HTMLAudioElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [volume, setVolume] = useState(0.5)
  const [isLoading, setIsLoading] = useState(true)
  const [playbackError, setPlaybackError] = useState<string | null>(null)
  const [whoaData, setWhoaData] = useState<WhoaData | null>(null)
  const [isAudioMode, setIsAudioMode] = useState(false)

  useEffect(() => {
    const fetchAndPlayWhoa = async () => {
      try {
        setIsLoading(true)
        setPlaybackError(null)
        
        // Fetch the whoa data
        const response = await fetch('https://whoa.onrender.com/whoas/random')
        const data = await response.json()
        setWhoaData(data[0])

        // Try audio first if available
        if (data[0].audio) {
          try {
            const audioElement = new Audio(data[0].audio)
            await audioElement.play()
            setIsAudioMode(true)
            setIsLoading(false)
            // Add event listener for when audio ends
            audioElement.addEventListener('ended', onComplete)
            return // Exit if audio plays successfully
          } catch (audioErr) {
            console.warn('Failed to play audio, attempting video playback')
          }
        }

        // If audio fails or isn't available, try video
        if (videoRef.current && data[0].video) {
          const qualities = ['480p', '360p', '720p', '1080p']
          let playbackSuccess = false

          for (const quality of qualities) {
            if (data[0].video[quality]) {
              try {
                videoRef.current.src = data[0].video[quality]
                videoRef.current.crossOrigin = "anonymous"
                await videoRef.current.play()
                playbackSuccess = true
                break
              } catch (err) {
                console.warn(`Failed to play ${quality} video, trying next quality`)
                continue
              }
            }
          }

          if (!playbackSuccess) {
            setPlaybackError(
              'Unable to play video or audio content. Please try again or close this overlay.'
            )
          }
        }
      } catch (error) {
        console.error('Error fetching whoa:', error)
        setPlaybackError('Failed to load content')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAndPlayWhoa()

    // Cleanup function
    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
      }
      const audioElements = document.getElementsByTagName('audio')
      for (let i = 0; i < audioElements.length; i++) {
        audioElements[i].pause()
      }
    }
  }, [onComplete])

  const handleVideoError = () => {
    setPlaybackError('Video playback failed. Please try again or close this overlay.')
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
    >
      <div className="relative max-w-4xl w-full mx-4">
        {/* Close Button */}
        <button
          onClick={onComplete}
          className="absolute -top-12 right-0 text-white hover:text-[#00ff00] 
                     transition-colors z-50 p-2"
          aria-label="Close overlay"
        >
          <CloseIcon className="h-6 w-6" />
        </button>

        {/* Movie Info Header */}
        <div className="absolute -top-16 left-0 right-12 flex items-center justify-between 
                      text-white bg-black/60 p-4 rounded-t-lg backdrop-blur-sm">
          {whoaData && (
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
          )}
        </div>

        {/* Video Container */}
        <div className="relative rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,255,0,0.2)]">
          {isLoading && (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <div className="text-[#00ff00] animate-pulse">Loading...</div>
            </div>
          )}
          
          {playbackError ? (
            <div className="bg-black p-8 text-center">
              <p className="text-red-400 mb-4">{playbackError}</p>
              <button
                onClick={onComplete}
                className="px-4 py-2 bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] 
                         rounded transition-colors border border-[#333333]"
              >
                Close Overlay
              </button>
            </div>
          ) : (
            <>
              {!isAudioMode && (
                <video
                  ref={videoRef}
                  className="w-full max-h-[70vh] bg-black"
                  onEnded={onComplete}
                  onError={handleVideoError}
                  autoPlay
                  playsInline
                  crossOrigin="anonymous"
                  controls
                >
                  {/* Add source with type */}
                  {whoaData?.video && (
                    Object.entries(whoaData.video).map(([quality, url]) => (
                      <source 
                        key={quality} 
                        src={url} 
                        type="video/mp4"
                      />
                    ))
                  )}
                </video>
              )}

              {isAudioMode && (
                <div className="p-4 text-center">
                  <div className="text-green-500 mb-4">
                    Playing audio...
                  </div>
                  {whoaData?.full_line && (
                    <div className="text-white text-lg mb-4 font-matrix">
                      "{whoaData.full_line}"
                    </div>
                  )}
                  {whoaData?.movie && (
                    <div className="text-gray-400">
                      - {whoaData.movie}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          
          {/* Video Controls */}
          {!playbackError && (
            <div className="absolute bottom-0 left-0 right-0 p-4 
                          bg-gradient-to-t from-black/80 to-transparent">
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
          )}
        </div>

        {/* Matrix-style decorative elements */}
        <div className="absolute -inset-[2px] border border-[#00ff00]/20 rounded-lg pointer-events-none" />
        <div className="absolute -inset-[1px] border border-[#00ff00]/40 rounded-lg pointer-events-none animate-pulse" />
      </div>
    </div>
  )
}

export default WhoaOverlay 