"use client"

import { useEffect, useState } from "react"

interface ScoreDisplayProps {
  score: number
  summary: string
}

export default function ScoreDisplay({ score, summary }: ScoreDisplayProps) {
  const [color, setColor] = useState("")

  useEffect(() => {
    // Calculate color based on score (0-100)
    // 0 = red, 50 = gold, 100 = green
    if (score <= 50) {
      // Interpolate between red and gold
      const ratio = score / 50
      const r = Math.round(255 - ratio * (255 - 255)) // 255 -> 255
      const g = Math.round(0 + ratio * (215 - 0)) // 0 -> 215
      const b = Math.round(0 + ratio * (0 - 0)) // 0 -> 0
      setColor(`rgb(${r}, ${g}, ${b})`)
    } else {
      // Interpolate between gold and green
      const ratio = (score - 50) / 50
      const r = Math.round(255 - ratio * (255 - 46)) // 255 -> 46
      const g = Math.round(215 - ratio * (215 - 192)) // 215 -> 192
      const b = Math.round(0 + ratio * (68 - 0)) // 0 -> 68
      setColor(`rgb(${r}, ${g}, ${b})`)
    }
  }, [score])

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div
        className="w-48 h-48 rounded-full flex items-center justify-center text-6xl font-bold"
        style={{
          backgroundColor: color,
          color: score > 70 ? "#2A2626" : "#F2E2E2",
          boxShadow: `0 0 30px ${color}`,
        }}
      >
        {score}
      </div>

      <div className="text-xl max-w-md">{summary}</div>
      
      <div className="text-sm text-[#A39E9E]">
        <a href="#" onClick={() => window.location.reload()}>
          Try again
        </a>
      </div>
    </div>
  )
}

