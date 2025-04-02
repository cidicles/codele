"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, SkipForward, RefreshCw, RotateCcw, Calendar, EyeIcon, ArrowRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CodeDisplay from "@/components/code-display"
import { functionChallenges } from "@/lib/function-challenges"
import confetti from "canvas-confetti"
import { cn } from "@/lib/utils"
import MatrixParticles from "@/components/MatrixParticles"

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

    // Reset feedback before moving to next challenge
    setFeedback(null)
    
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
      <Card className="w-full shadow-lg bg-[#121212] border-[#232323]">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-white">No New Challenges Available</CardTitle>
        </CardHeader>
        <CardContent className="pb-2 text-center">
          <p className="mb-6 text-gray-400">You've completed all available challenges! Your final score: {score}</p>
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
    <Card className="w-full shadow-lg bg-[#121212] border-[#232323]">
      <CardHeader className="pb-2">
        <div className="text-center space-y-4 mb-8 relative">
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-5xl font-bold mb-0 text-white font-mono 
                           tracking-tight relative z-10 animate-glow">
              {'<Codele/>'}
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00ff00]/0 via-[#00ff00]/10 to-[#00ff00]/0 
                            blur-lg z-0 animate-pulse-slow"></div>
          </div>
          
          <div className="relative">
            <p className="text-gray-300 text-lg md:text-xl font-mono leading-relaxed">
              <span className="text-[#00ff00]">&gt;</span> Decode the mystery function
              <span className="animate-blink">_</span>
            </p>
            <p className="text-gray-400 text-sm md:text-base mt-2 font-light">
              Reveal the code. Analyze the pattern. Choose wisely.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-white">{gameMode === "daily" ? "Daily Challenge" : "Practice Mode"}</CardTitle>
            {isTodaysChallenge && (
              <Badge variant="outline" className="bg-[#1a1a1a] text-[#00ff00] border-[#00ff00]">
                Today's Challenge
              </Badge>
            )}
          </div>
          <Badge variant="outline" className="ml-auto text-white border-white">
            Score: {score}
          </Badge>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-gray-400">
            {gameMode === "daily" ? getFormattedDate() : `Challenge #${challenge.id}`}
          </div>
          <Badge variant="outline" className="capitalize text-[#00ff00] border-[#00ff00]">
            {challenge.difficulty}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Progress 
            value={(revealLevel / maxRevealLevel) * 100} 
            className="h-2 bg-[#232323]"
            indicatorClassName="bg-[#00ff00]"
          />
          <span className="text-sm text-gray-400 min-w-[45px]">{timer}s</span>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="mb-4 bg-[#1a1a1a] rounded-lg p-4">
          <CodeDisplay 
            code={getRevealedCode()} 
            language="javascript"
            theme="dark"
          />
        </div>

        <div className="space-y-6">
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333333] shadow-lg">
            <div className="mb-4">
              <h3 className="text-[#00ff00] font-mono text-lg mb-2 flex items-center gap-2">
                <span className="text-sm opacity-75">&gt;</span>
                What does this function do?
              </h3>
              <p className="text-gray-400 text-sm">
                Analyze the code and select the correct answer
              </p>
            </div>

            <div className="space-y-4">
              <Select
                value={selectedAnswer}
                onValueChange={setSelectedAnswer}
                disabled={feedback === "correct" || gameOver}
              >
                <SelectTrigger 
                  className={cn(
                    "w-full bg-[#121212] text-white border-[#333333] h-12",
                    "hover:border-[#00ff00] transition-colors duration-200",
                    "focus:ring-1 focus:ring-[#00ff00] focus:ring-opacity-50",
                    selectedAnswer && "border-[#00ff00]"
                  )}
                >
                  <SelectValue 
                    placeholder="Select your answer..." 
                    className="text-gray-400"
                  />
                </SelectTrigger>
                <SelectContent 
                  className="bg-[#121212] border-[#333333] text-white"
                >
                  {shuffledOptions.map((option, index) => (
                    <SelectItem 
                      key={index} 
                      value={option}
                      className={cn(
                        "hover:bg-[#1a1a1a] focus:bg-[#1a1a1a]",
                        "cursor-pointer py-3 px-4",
                        "data-[highlighted]:bg-[#1a1a1a]",
                        "data-[highlighted]:text-[#00ff00]",
                        selectedAnswer === option && "text-[#00ff00]"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm opacity-75">{index + 1}.</span>
                        {option}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={checkGuess}
                disabled={!selectedAnswer || feedback === "correct" || gameOver}
                className={cn(
                  "w-full h-12 font-mono text-base transition-all duration-200",
                  "bg-[#00ff00] text-black hover:bg-[#00dd00]",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "shadow-[0_0_10px_rgba(0,255,0,0.2)]",
                  "flex items-center justify-center gap-2",
                  !selectedAnswer && "animate-pulse"
                )}
              >
                {!selectedAnswer ? (
                  <>
                    <span>Choose an answer</span>
                    <span className="animate-blink">_</span>
                  </>
                ) : (
                  <>
                    <span>Submit Answer</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              {feedback && (
                <div
                  className={cn(
                    "mt-4 p-4 rounded-lg border transition-all duration-300",
                    "font-mono text-sm",
                    feedback === "correct" 
                      ? "bg-[#0a2800] border-[#00ff00] text-[#00ff00]"
                      : "bg-[#280000] border-red-500 text-red-400"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {feedback === "correct" ? (
                      <>
                        <Check className="h-5 w-5 shrink-0" />
                        <div className="space-y-1">
                          <p className="font-medium">Correct! Well done!</p>
                          <p className="text-[#00ff00]/80 text-xs">
                            The function {challenge.answer}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5 shrink-0" />
                        <div className="space-y-1">
                          <p className="font-medium">Not quite right</p>
                          <p className="text-red-400/80 text-xs">
                            Try again or reveal more code
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333333]">
              <p className="text-[#00ff00] text-2xl font-mono mb-1">
                {maxRevealLevel - revealLevel}
              </p>
              <p className="text-gray-400 text-sm">Reveals Left</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333333]">
              <p className="text-[#00ff00] text-2xl font-mono mb-1">
                {timer}s
              </p>
              <p className="text-gray-400 text-sm">Time Left</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap justify-between gap-2 pt-2 border-t border-[#232323]">
        <div className="flex gap-2">
          <Button
            variant="default"
            size="lg"
            onClick={revealMore}
            disabled={revealLevel >= maxRevealLevel || feedback === "correct" || gameOver}
            className={cn(
              "font-semibold px-6 py-3 transition-all duration-200 transform hover:scale-105",
              "flex items-center gap-2 relative",
              "bg-[#00ff00] hover:bg-[#00dd00] text-black font-mono",
              "border border-[#00ff00]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              "shadow-[0_0_10px_rgba(0,255,0,0.3)]",
            )}
          >
            <EyeIcon className="h-5 w-5" />
            Reveal More
            {revealLevel < maxRevealLevel && (
              <span className="absolute -top-2 -right-2 bg-[#00ff00] text-black 
                              rounded-full w-6 h-6 flex items-center justify-center 
                              text-sm font-bold border border-[#00ff00] 
                              animate-bounce shadow-glow">
                {maxRevealLevel - revealLevel}
              </span>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={skipChallenge} 
            disabled={gameOver}
            className="bg-[#232323] border-[#333333] text-white hover:bg-[#232323] hover:text-[#00ff00] 
                      hover:border-[#00ff00] transition-colors"
          >
            <SkipForward className="h-4 w-4 mr-1" />
            Skip
          </Button>
        </div>

        <div className="flex gap-2">
          {gameMode === "practice" && (
            <Button 
              variant="outline" 
              size="lg" 
              onClick={switchToDailyChallenge} 
              disabled={hasPlayedToday}
              className="bg-[#232323] border-[#333333] text-white hover:bg-[#232323] hover:text-[#00ff00] 
                        hover:border-[#00ff00] transition-colors disabled:opacity-50 
                        disabled:hover:text-white disabled:hover:border-[#333333]"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Daily Challenge
            </Button>
          )}
          {gameMode === "daily" && feedback === "correct" && (
            <Button 
              variant="outline" 
              size="lg" 
              onClick={switchToPracticeMode}
              className="bg-[#232323] border-[#333333] text-white hover:bg-[#232323] hover:text-[#00ff00] 
                        hover:border-[#00ff00] transition-colors"
            >
              Practice Mode
            </Button>
          )}
        </div>

        <div className="flex gap-2 ml-auto">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={restartGame}
            className="bg-[#232323] border-[#333333] text-white hover:bg-[#232323] hover:text-[#00ff00] 
                      hover:border-[#00ff00] transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Restart
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={resetProgress}
            className="bg-[#232323] border-[#333333] text-white hover:bg-[#232323] hover:text-[#00ff00] 
                      hover:border-[#00ff00] transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset All
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

