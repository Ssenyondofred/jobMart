import * as React from "react"
import { cn } from "./utils"

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  const ref = React.useRef<HTMLTextAreaElement>(null)

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }

  React.useEffect(() => {
    if (ref.current) {
      // set an initial height (prevents tiny textarea)
      ref.current.style.height = "auto"
      ref.current.style.minHeight = "280px" // start taller
    }
  }, [])

  return (
    <textarea
      ref={ref}
      onInput={handleInput}
      data-slot="textarea"
      className={cn(
        "w-full resize-none overflow-hidden border border-white/20 rounded-xl bg-white/5 dark:bg-input text-base leading-relaxed p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/30",
        className
      )}
      {...props}
    />
  )
}
