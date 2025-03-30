"use client"

import { useState, useRef, useEffect } from "react"
import AudioRecorder from "@/components/audio-recorder"
import ScoreDisplay from "@/components/score-display"
import LoadingSpinner from "@/components/loading-spinner"
import LoginModal from "@/components/login-modal"
import SignupModal from "@/components/signup-modal"
import PastResultsModal from "@/components/past-results-modal"

export default function Home() {
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ score: number; summary: string } | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showPastResultsModal, setShowPastResultsModal] = useState(false)
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

  const handleSignUp = (confirmation: { success: boolean }) => {
    if (confirmation.success) {
      setShowSignUpModal(false)
    }
  }

  const handlePastResults = () => {
    setShowPastResultsModal(true)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-[#2A2626] text-[#F2E2E2] font-montserrat">
      <div className="w-full flex justify-end mb-4">
        {token ? (
          <button 
            onClick={handleLogout}
            className="hover:text-[#6E5E5E] text-[#F2E2E2] transition-colors"
          >
            Logout
          </button>
        ) : (
          <button 
            onClick={() => setShowLoginModal(true)}
            className="hover:text-[#6E5E5E] text-[#F2E2E2] transition-colors "
          >
            Login
          </button>
        )}
        <span className="mx-2 text-[#F2E2E2]"></span>
        {token ? (
            <button 
            onClick={() => setShowSignUpModal(true)}
            className="hover:text-[#6E5E5E] text-[#F2E2E2] hidden"
          >
            Sign Up
          </button>
        )
        : (
          <button 
            onClick={() => setShowSignUpModal(true)}
            className="hover:text-[#6E5E5E] text-[#F2E2E2] transition-colors"
          >
            Sign Up
          </button>
          )
        }
        <span className="mx-2 text-[#F2E2E2]"></span>
        {token && (
          <button 
            onClick={handlePastResults}
            className="hover:text-[#6E5E5E] text-[#F2E2E2] transition-colors"
          >
            Past Results
          </button>
        )}  
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        {!token ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#F2E2E2] mb-4">Welcome to Accent Analyzer.</h1>
            <p className="text-[#F2E2E2]">Please login or sign up to analyze your speech accent.</p>
          </div>
        ) : (
          <>
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
          </>
        )}
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

      {showSignUpModal && (
        <SignupModal 
          onClose={() => setShowSignUpModal(false)}
          onSignUp={handleSignUp}
        />
      )}

      {showPastResultsModal && (
        <PastResultsModal
          onClose={() => setShowPastResultsModal(false)}
          token={token}
          isOpen={showPastResultsModal}
        />
      )}
    </main>
  )
}
