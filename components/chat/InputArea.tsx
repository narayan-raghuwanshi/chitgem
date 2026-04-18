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
        <div className="relative flex items-center bg-[#303030] rounded-full px-4 py-3 shadow-sm border border-transparent focus-within:border-gray-600">
            <button className="text-gray-400">
                <Plus />
            </button>
            <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message ChitGem..."
                className="flex-grow bg-transparent text-white placeholder-zinc-400 focus:outline-none resize-none max-h-48 mx-3"
                rows={1}
                disabled={isWaitingForResponse}
            />
            <button className="text-gray-400 hover:text-white mr-2 hidden md:inline-flex">
                <Mic />
            </button>
            <button
                onClick={handleSend}
                className={`p-2 rounded-full flex items-center justify-center ${input.trim() && !isWaitingForResponse
                    ? "bg-white text-black"
                    : "bg-transparent text-zinc-500 cursor-not-allowed"
                    }`}
                disabled={!input.trim() || isWaitingForResponse}
            >
                <SendIcon />
            </button>
        </div>
        <p className="text-xs text-zinc-400 text-center mt-2 px-4">
            ChitGem can make mistakes. Consider checking important information.
        </p>
    </div>
)
