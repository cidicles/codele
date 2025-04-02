"use client"

import { useEffect, useRef } from "react"
import Prism from "prismjs"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-python"
import "prismjs/themes/prism-tomorrow.css"

interface CodeDisplayProps {
  code: string
  language: string
}

export default function CodeDisplay({ code, language }: CodeDisplayProps) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [code])

  return (
    <div className="rounded-md bg-slate-900 overflow-hidden">
      <pre className="p-4 overflow-x-auto text-sm">
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  )
}

