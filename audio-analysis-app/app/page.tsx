"use client"

import { useState, useRef, useEffect } from "react"
import AudioRecorder from "@/components/audio-recorder"
import ScoreDisplay from "@/components/score-display"
import LoadingSpinner from "@/components/loading-spinner"
import LoginModal from "@/components/login-modal"


export default function Home() {
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ score: number; summary: string } | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const audioRef = useRef<Blob | null>(null)

  // Load token from localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('access')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

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
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : undefined
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

  const handleLogin = (tokens: object) => {
    const { access, refresh } = tokens as { access: string; refresh: string }
    setToken(access)
    // Ignoring refresh for now since we're not using it right now.
    localStorage.setItem('access', access)
    setShowLoginModal(false)
  }

  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem('access')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-[#2A2626] text-[#F2E2E2] font-montserrat">
      <div className="w-full flex justify-end mb-4">
        {token ? (
          <button 
            onClick={handleLogout}
            className="bg-[#867878] hover:bg-[#6E5E5E] text-[#F2E2E2] py-2 px-4 rounded-md transition-colors"
          >
            Logout
          </button>
        ) : (
          <button 
            onClick={() => setShowLoginModal(true)}
            className="bg-[#867878] hover:bg-[#6E5E5E] text-[#F2E2E2] py-2 px-4 rounded-md transition-colors"
          >
            Login
          </button>
        )}
      </div>
      
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

      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          onLogin={handleLogin}
        />
      )}
    </main>
  )
}
