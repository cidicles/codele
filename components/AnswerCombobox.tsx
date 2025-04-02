'use client'

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { functionChallenges } from "@/lib/function-challenges"

interface AnswerComboboxProps {
  onSelect: (value: string) => void
  value: string
  currentOptions: string[]
  disabled?: boolean
}

// Get all unique answers from function challenges
const allAnswers = Array.from(new Set(functionChallenges.map(c => c.answer)))

export function AnswerCombobox({ onSelect, value, currentOptions, disabled }: AnswerComboboxProps) {
  const [open, setOpen] = React.useState(false)

  // Combine current options with all answers and remove duplicates
  const allOptions = Array.from(new Set([...currentOptions, ...allAnswers]))
    .sort((a, b) => a.localeCompare(b))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between h-12 font-mono",
            "bg-[#121212] text-white",
            "border border-[#333333]",
            "hover:bg-[#121212] hover:text-white",
            "hover:border-[#00ff00] hover:text-[#00ff00]",
            "transition-all duration-200",
            "focus:ring-1 focus:ring-[#00ff00] focus:ring-opacity-50",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "relative overflow-hidden",
            value && "border-[#00ff00]",
            // Matrix-style glow effect when selected
            value && "shadow-[0_0_10px_rgba(0,255,0,0.2)]"
          )}
        >
          <span className="truncate bg-[#121212]">
            {value
              ? allOptions.find((answer) => answer === value)
              : "Select your answer..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "w-[var(--radix-popover-trigger-width)] p-0",
          "bg-[#121212] border border-[#333333]",
          "shadow-lg shadow-[#00ff00]/10",
          "animate-in fade-in-0 zoom-in-95",
          "max-h-[400px] overflow-hidden"
        )}
      >
        <Command className="bg-transparent">
          <div className="px-3 py-2 border-b border-[#333333] bg-[#1a1a1a]">
            <CommandInput 
              placeholder="Search answers..." 
              className={cn(
                "h-9 w-full bg-transparent",
                "text-[#00ff00] placeholder:text-[#666666]",
                "font-mono text-sm",
                "focus:outline-none focus:ring-0",
                "border-none",
                "[&_input]:bg-transparent",
                "[&_input]:focus:ring-0",
                "[&_input]:focus:border-none",
                "[&_input]:placeholder:text-[#666666]",
                "[&_input]:text-[#00ff00]",
                "[&_input]:font-mono"
              )}
            />
          </div>
          <CommandEmpty className={cn(
            "py-6 text-center text-sm",
            "text-[#666666] font-mono"
          )}>
            No answer found.
          </CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto scrollbar-thin scrollbar-thumb-[#00ff00]/20 scrollbar-track-[#121212]">
            {allOptions.map((answer) => (
              <CommandItem
                key={answer}
                value={answer}
                onSelect={(currentValue) => {
                  onSelect(currentValue)
                  setOpen(false)
                }}
                className={cn(
                  "py-3 px-4 cursor-pointer font-mono",
                  "text-white/80 hover:text-[#00ff00]",
                  "hover:bg-[#1a1a1a]",
                  "focus:bg-[#1a1a1a] focus:text-[#00ff00]",
                  "data-[selected=true]:bg-[#1a1a1a]",
                  "data-[selected=true]:text-[#00ff00]",
                  "transition-colors duration-200",
                  "relative",
                  // Matrix-style hover effect
                  "hover:shadow-[inset_0_0_10px_rgba(0,255,0,0.1)]",
                  value === answer && [
                    "text-[#00ff00]",
                    "bg-[#1a1a1a]",
                    "shadow-[inset_0_0_10px_rgba(0,255,0,0.1)]"
                  ]
                )}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    "text-[#00ff00]",
                    value === answer ? "opacity-100" : "opacity-0",
                    "transition-opacity duration-200"
                  )}
                />
                {answer}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 