import CodeGuessingGame from "@/components/code-guessing-game"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-24 bg-slate-50">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Codele</h1>
        <p className="text-slate-600 text-center mb-8">Guess what the function does based on the revealed code!</p>
        <CodeGuessingGame />
      </div>
    </main>
  )
}

