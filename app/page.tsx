import CodeGuessingGame from "@/components/code-guessing-game"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-24">
      <div className="max-w-3xl w-full">
        <CodeGuessingGame />
      </div>
    </main>
  )
}

