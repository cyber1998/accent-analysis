"use client"

import { useState, useRef } from "react"
import AudioRecorder from "@/components/audio-recorder"
import ScoreDisplay from "@/components/score-display"
import LoadingSpinner from "@/components/loading-spinner"

export default function Home() {
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ score: number; summary: string } | null>(null)
  const audioRef = useRef<Blob | null>(null)

  const startRecording = () => {
    setIsRecording(true)
    setResult(null)
  }

  const stopRecording = (audioBlob: Blob) => {
    setIsRecording(false)
    audioRef.current = audioBlob
  }

  const uploadAudio = async () => {
    if (!audioRef.current) return

    setIsLoading(true)

    const formData = new FormData()
    formData.append("audio", audioRef.current, "recording.wav")

    try {
      // Replace with your Django backend URL
      const response = await fetch("http://localhost:8000/api/analyze-audio/", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Server error")
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error uploading audio:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-[#2A2626] text-[#F2E2E2] font-montserrat">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        {!isLoading && !result && (
          <AudioRecorder
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
            uploadAudio={uploadAudio}
          />
        )}

        {isLoading && <LoadingSpinner />}

        {result && <ScoreDisplay score={result.score} summary={result.summary} />}
      </div>

      <footer className="w-full py-6 text-center">
        <p>Made with ❤️ by Cyber</p>
      </footer>
    </main>
  )
}

