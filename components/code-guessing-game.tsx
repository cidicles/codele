"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, SkipForward, RefreshCw, RotateCcw, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CodeDisplay from "@/components/code-display"
import { functionChallenges } from "@/lib/function-challenges"
import confetti from "canvas-confetti"

// Local storage keys
const COMPLETED_CHALLENGES_KEY = "codele-completed-challenges"
const LAST_PLAYED_DATE_KEY = "codele-last-played-date"

export default function CodeGuessingGame() {
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([])
  const [currentChallenge, setCurrentChallenge] = useState<number | null>(null)
  const [revealLevel, setRevealLevel] = useState(1)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [timer, setTimer] = useState(60)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [noMoreChallenges, setNoMoreChallenges] = useState(false)
  const [todaysChallenge, setTodaysChallenge] = useState<number | null>(null)
  const [lastPlayedDate, setLastPlayedDate] = useState<string | null>(null)
  const [gameMode, setGameMode] = useState<"daily" | "practice">("daily")
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([])

  const maxRevealLevel = 5

  // Function to trigger confetti animation
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  // Get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  // Determine today's challenge based on day of year
  const getTodaysChallenge = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now - start
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)

    // Use the day of year to pick a challenge (mod by the number of challenges)
    return (dayOfYear % functionChallenges.length) + 1
  }

  // Shuffle the options for the current challenge
  const shuffleOptions = (challengeIndex: number) => {
    if (challengeIndex === null) return

    const challenge = functionChallenges[challengeIndex]
    // If the challenge has options, use them; otherwise create default options
    const options =
      challenge.options && challenge.options.length > 0
        ? [...challenge.options]
        : [
            challenge.answer,
            "does something else entirely",
            "performs the opposite operation",
            "is not a valid function",
          ]

    // Shuffle the options
    const shuffled = [...options].sort(() => Math.random() - 0.5)
    setShuffledOptions(shuffled)
  }

  // Load saved data on initial render
  useEffect(() => {
    const storedChallenges = localStorage.getItem(COMPLETED_CHALLENGES_KEY)
    const parsedChallenges = storedChallenges ? JSON.parse(storedChallenges) : []
    setCompletedChallenges(parsedChallenges)

    const storedLastPlayedDate = localStorage.getItem(LAST_PLAYED_DATE_KEY)
    setLastPlayedDate(storedLastPlayedDate)

    // Get today's challenge
    const todaysChallengeId = getTodaysChallenge()
    setTodaysChallenge(todaysChallengeId)

    // If today's date is different from last played date, show today's challenge
    const today = getTodayString()
    if (today !== storedLastPlayedDate) {
      const challengeIndex = functionChallenges.findIndex((c) => c.id === todaysChallengeId)
      if (challengeIndex !== -1) {
        setCurrentChallenge(challengeIndex)
        shuffleOptions(challengeIndex)
      }
    } else {
      // If already played today, check if there are unplayed past challenges
      selectRandomUnplayedChallenge(parsedChallenges)
    }
  }, [])

  // When current challenge changes, shuffle the options
  useEffect(() => {
    if (currentChallenge !== null) {
      shuffleOptions(currentChallenge)
    }
  }, [currentChallenge])

  // Save completed challenges to local storage whenever they change
  useEffect(() => {
    if (completedChallenges.length > 0) {
      localStorage.setItem(COMPLETED_CHALLENGES_KEY, JSON.stringify(completedChallenges))
    }
  }, [completedChallenges])

  // Update last played date when completing today's challenge
  useEffect(() => {
    if (currentChallenge !== null && todaysChallenge !== null) {
      const currentChallengeId = functionChallenges[currentChallenge].id
      if (currentChallengeId === todaysChallenge && feedback === "correct") {
        const today = getTodayString()
        localStorage.setItem(LAST_PLAYED_DATE_KEY, today)
        setLastPlayedDate(today)
      }
    }
  }, [currentChallenge, todaysChallenge, feedback])

  // Select a random challenge that hasn't been completed yet
  const selectRandomUnplayedChallenge = (completed: number[] = completedChallenges) => {
    const availableChallenges = functionChallenges
      .map((challenge, index) => ({ id: challenge.id, index }))
      .filter(({ id }) => !completed.includes(id))

    if (availableChallenges.length === 0) {
      setNoMoreChallenges(true)
      setCurrentChallenge(null)
      return
    }

    setNoMoreChallenges(false)
    const randomIndex = Math.floor(Math.random() * availableChallenges.length)
    setCurrentChallenge(availableChallenges[randomIndex].index)
  }

  // Switch to daily challenge mode
  const switchToDailyChallenge = () => {
    if (todaysChallenge !== null) {
      const challengeIndex = functionChallenges.findIndex((c) => c.id === todaysChallenge)
      if (challengeIndex !== -1) {
        resetChallenge(challengeIndex)
        setGameMode("daily")
      }
    }
  }

  // Switch to practice mode
  const switchToPracticeMode = () => {
    selectRandomUnplayedChallenge()
    setGameMode("practice")
  }

  // Reset game state for a new challenge
  const resetChallenge = (nextIndex: number) => {
    setCurrentChallenge(nextIndex)
    setRevealLevel(1)
    setSelectedAnswer("")
    setFeedback(null)
    setTimer(60)
    setIsTimerRunning(true)
    shuffleOptions(nextIndex)
  }

  // Move to next challenge
  const nextChallenge = () => {
    // Mark current challenge as completed
    if (currentChallenge !== null) {
      const currentChallengeId = functionChallenges[currentChallenge].id
      if (!completedChallenges.includes(currentChallengeId)) {
        setCompletedChallenges((prev) => [...prev, currentChallengeId])
      }
    }

    if (gameMode === "daily") {
      // If in daily mode and today's challenge is completed, switch to practice
      switchToPracticeMode()
    } else {
      // In practice mode, get another random challenge
      selectRandomUnplayedChallenge()
    }
  }

  // Restart the game
  const restartGame = () => {
    setScore(0)
    setGameOver(false)

    if (gameMode === "daily" && todaysChallenge !== null) {
      const challengeIndex = functionChallenges.findIndex((c) => c.id === todaysChallenge)
      if (challengeIndex !== -1) {
        resetChallenge(challengeIndex)
      }
    } else {
      selectRandomUnplayedChallenge()
    }
  }

  // Reset all progress
  const resetProgress = () => {
    localStorage.removeItem(COMPLETED_CHALLENGES_KEY)
    localStorage.removeItem(LAST_PLAYED_DATE_KEY)
    setCompletedChallenges([])
    setLastPlayedDate(null)
    setScore(0)
    setGameOver(false)

    if (todaysChallenge !== null) {
      const challengeIndex = functionChallenges.findIndex((c) => c.id === todaysChallenge)
      if (challengeIndex !== -1) {
        resetChallenge(challengeIndex)
        setGameMode("daily")
      }
    }
  }

  // Check the user's guess
  const checkGuess = () => {
    if (currentChallenge === null || !selectedAnswer) return

    const challenge = functionChallenges[currentChallenge]
    const isCorrect = selectedAnswer === challenge.answer

    setFeedback(isCorrect ? "correct" : "incorrect")

    if (isCorrect) {
      // Trigger confetti animation for correct answer
      triggerConfetti()

      // Award points based on how early they guessed
      const pointsEarned = Math.max(1, maxRevealLevel - revealLevel + 1) * 10
      setScore((prevScore) => prevScore + pointsEarned)
      setIsTimerRunning(false)

      // Mark challenge as completed
      const currentChallengeId = challenge.id
      if (!completedChallenges.includes(currentChallengeId)) {
        setCompletedChallenges((prev) => [...prev, currentChallengeId])
      }
    } else if (revealLevel < maxRevealLevel) {
      // Reveal more of the function on incorrect guess
      setRevealLevel((prevLevel) => prevLevel + 1)
    }
  }

  // Skip current challenge
  const skipChallenge = () => {
    nextChallenge()
  }

  // Reveal more of the function
  const revealMore = () => {
    if (revealLevel < maxRevealLevel) {
      setRevealLevel((prevLevel) => prevLevel + 1)
    }
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)
    } else if (timer === 0) {
      setIsTimerRunning(false)
      if (feedback !== "correct") {
        setRevealLevel(maxRevealLevel)
      }
    }

    return () => clearInterval(interval)
  }, [timer, isTimerRunning, feedback])

  // Calculate how much of the function to reveal
  const getRevealedCode = () => {
    if (currentChallenge === null) return ""

    const fullCode = functionChallenges[currentChallenge].code
    const totalLines = fullCode.split("\n").length
    const linesToReveal = Math.ceil((revealLevel / maxRevealLevel) * totalLines)

    return fullCode.split("\n").slice(0, linesToReveal).join("\n")
  }

  // Get today's date in a readable format
  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date().toLocaleDateString(undefined, options)
  }

  // Render the "No more challenges" state
  if (noMoreChallenges) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-center">No New Challenges Available</CardTitle>
        </CardHeader>
        <CardContent className="pb-2 text-center">
          <p className="mb-6 text-slate-600">You've completed all available challenges! Your final score: {score}</p>
          <Button onClick={resetProgress} className="mx-auto">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Progress
          </Button>
        </CardContent>
      </Card>
    )
  }

  // If no challenge is selected (should not happen in normal flow)
  if (currentChallenge === null) {
    return <div>Loading challenge...</div>
  }

  const challenge = functionChallenges[currentChallenge]
  const isTodaysChallenge = challenge.id === todaysChallenge
  const today = getTodayString()
  const hasPlayedToday = lastPlayedDate === today

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle>{gameMode === "daily" ? "Daily Challenge" : "Practice Mode"}</CardTitle>
            {isTodaysChallenge && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Today's Challenge
              </Badge>
            )}
          </div>
          <Badge variant="outline" className="ml-auto">
            Score: {score}
          </Badge>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-slate-500">
            {gameMode === "daily" ? getFormattedDate() : `Challenge #${challenge.id}`}
          </div>
          <Badge variant="outline" className="capitalize">
            {challenge.difficulty}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Progress value={(revealLevel / maxRevealLevel) * 100} className="h-2" />
          <span className="text-sm text-slate-500 min-w-[45px]">{timer}s</span>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="mb-4">
          <CodeDisplay code={getRevealedCode()} language="javascript" />
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">What does this function do?</p>
            <div className="flex flex-col gap-2">
              <Select
                value={selectedAnswer}
                onValueChange={setSelectedAnswer}
                disabled={feedback === "correct" || gameOver}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your answer..." />
                </SelectTrigger>
                <SelectContent>
                  {shuffledOptions.map((option, index) => (
                    <SelectItem key={index} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={checkGuess}
                disabled={!selectedAnswer || feedback === "correct" || gameOver}
                className="w-full"
              >
                Submit Answer
              </Button>
            </div>
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-md ${
                feedback === "correct"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              <div className="flex items-center gap-2">
                {feedback === "correct" ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                <p>{feedback === "correct" ? "Correct! Well done!" : "Not quite right. Try again or reveal more."}</p>
              </div>
              {feedback === "correct" && <p className="mt-2 text-sm">The function {challenge.answer}.</p>}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap justify-between gap-2 pt-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={revealMore}
            disabled={revealLevel >= maxRevealLevel || feedback === "correct" || gameOver}
          >
            Reveal More
          </Button>
          <Button variant="outline" size="sm" onClick={skipChallenge} disabled={gameOver}>
            <SkipForward className="h-4 w-4 mr-1" />
            Skip
          </Button>
        </div>

        <div className="flex gap-2">
          {gameMode === "practice" && (
            <Button variant="outline" size="sm" onClick={switchToDailyChallenge} disabled={hasPlayedToday}>
              <Calendar className="h-4 w-4 mr-1" />
              Daily Challenge
            </Button>
          )}
          {gameMode === "daily" && feedback === "correct" && (
            <Button variant="outline" size="sm" onClick={switchToPracticeMode}>
              Practice Mode
            </Button>
          )}
          {feedback === "correct" && (
            <Button variant="outline" size="sm" onClick={nextChallenge}>
              Next Challenge
            </Button>
          )}
        </div>

        <div className="flex gap-2 ml-auto">
          <Button variant="default" size="sm" onClick={restartGame}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Restart
          </Button>
          <Button variant="outline" size="sm" onClick={resetProgress}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset All
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

