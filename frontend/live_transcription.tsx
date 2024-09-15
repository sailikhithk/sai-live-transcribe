'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Pause, Play, StopCircle } from "lucide-react"

export default function Component() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1)
        // Simulate live transcription by adding random words
        const words = ["Hello", "world", "this", "is", "a", "live", "transcription", "demo"]
        const randomWord = words[Math.floor(Math.random() * words.length)]
        setTranscript((prevTranscript) => prevTranscript + " " + randomWord)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording, isPaused])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleStartStop = () => {
    if (isRecording) {
      setIsRecording(false)
      setIsPaused(false)
      setElapsedTime(0)
    } else {
      setIsRecording(true)
      setTranscript("")
    }
  }

  const handlePauseResume = () => {
    setIsPaused(!isPaused)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Live Transcription</span>
          <span className="text-2xl font-mono">{formatTime(elapsedTime)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-96 overflow-y-auto bg-muted p-4 rounded-md">
        <p className="whitespace-pre-wrap">{transcript}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="icon" onClick={handleStartStop}>
          {isRecording ? <StopCircle className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="icon" onClick={handlePauseResume} disabled={!isRecording}>
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  )
}