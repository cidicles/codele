import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import MatrixBackground from './components/MatrixBackground'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Codele - Guess the Function",
  description: "A coding guessing game where you identify what functions do based on revealed code",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main className="matrix-container">
          {children}
        </main>
        <MatrixBackground />
      </body>
    </html>
  )
}



import './globals.css'