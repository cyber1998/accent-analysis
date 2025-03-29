"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, Upload } from "lucide-react"

interface AudioRecorderProps {
  isRecording: boolean
  startRecording: () => void
  stopRecording: (audioBlob: Blob) => void
  uploadAudio: () => void
}

export default function AudioRecorder({ isRecording, startRecording, stopRecording, uploadAudio }: AudioRecorderProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [hasRecording, setHasRecording] = useState(false)

  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL)
      }
    }
  }, [audioURL])

  useEffect(() => {
    if (isRecording) {
      startMediaRecording()
    } else if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
  }, [isRecording])

  const startMediaRecording = async () => {
    audioChunksRef.current = []
    setAudioURL(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
        setHasRecording(true)
        stopRecording(audioBlob)

        // Stop all audio tracks
        stream.getAudioTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="w-32 h-32 rounded-full border-4 border-[#F2E2E2] flex items-center justify-center">
        {isRecording ? (
          <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse" />
        ) : (
          <Mic className="w-16 h-16" />
        )}
      </div>

      <div className="flex flex-col gap-4 w-full">
        {audioURL && (
          <div className="w-full">
            <audio src={audioURL} controls className="w-full" />
          </div>
        )}

        <div className="flex justify-center gap-4">
          {!isRecording ? (
            <Button onClick={startRecording} className="bg-[#F2E2E2] text-[#2A2626] hover:bg-[#d0c0c0]" size="lg">
              <Mic className="mr-2 h-5 w-5" />
              Start Recording
            </Button>
          ) : (
            <Button
              onClick={() => mediaRecorderRef.current?.stop()}
              className="bg-red-500 hover:bg-red-600 text-white"
              size="lg"
            >
              <Square className="mr-2 h-5 w-5" />
              Stop Recording
            </Button>
          )}

          {hasRecording && !isRecording && (
            <Button onClick={uploadAudio} className="bg-[#F2E2E2] text-[#2A2626] hover:bg-[#d0c0c0]" size="lg">
              <Upload className="mr-2 h-5 w-5" />
              Upload
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

