"use client"
import { FC, RefObject } from "react"
import { Mic, Plus } from "lucide-react"
import { SendIcon } from "@/components/icons"

interface Props {
    input: string
    setInput: (v: string) => void
    isWaitingForResponse: boolean
    textareaRef: RefObject<HTMLTextAreaElement | null>
    handleSend: () => void
    handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

export const InputArea: FC<Props> = ({
    input,
    setInput,
    isWaitingForResponse,
    textareaRef,
    handleSend,
    handleKeyDown,
}) => (
    <div className="w-full max-w-3xl">
        <div className="relative flex items-center bg-card rounded-2xl px-4 py-3 shadow-md border border-border focus-within:border-primary/50 transition-all">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Plus size={20} />
            </button>
            <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message ChitGem..."
                className="flex-grow bg-transparent text-foreground placeholder-muted-foreground focus:outline-none resize-none max-h-48 mx-3 text-sm"
                rows={1}
                disabled={isWaitingForResponse}
            />
            <button className="text-muted-foreground hover:text-foreground mr-2 hidden md:inline-flex transition-colors">
                <Mic size={20} />
            </button>
            <button
                onClick={handleSend}
                className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${input.trim() && !isWaitingForResponse
                    ? "bg-primary text-primary-foreground shadow-sm hover:opacity-90 active:scale-95"
                    : "bg-transparent text-muted-foreground cursor-not-allowed opacity-50"
                    }`}
                disabled={!input.trim() || isWaitingForResponse}
            >
                <SendIcon className="w-5 h-5" />
            </button>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 text-center mt-3 px-4 font-bold">
            ChitGem can make mistakes. Consider checking important information.
        </p>
    </div>
)
