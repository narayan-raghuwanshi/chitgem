"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { InputArea } from "@/components/chat/InputArea"
import { Message } from "@/types/message"

export default function HomePage() {
  const [input, setInput] = useState("")
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const router = useRouter()

  const handleSend = async () => {
    if (!input.trim() || isWaitingForResponse) return
    setIsWaitingForResponse(true)

    try {
      // 1. Create a new chat
      const res = await fetch("/api/chats", {
        method: "POST",
        body: JSON.stringify({ title: input.trim().slice(0, 30) || "New Chat" }),
        headers: { "Content-Type": "application/json" },
      })
      const newChat = await res.json()
      const chatId = newChat._id

      // 2. Save first user message
      const userMessage: Message = { role: "user", content: input.trim() }
      await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        body: JSON.stringify(userMessage),
        headers: { "Content-Type": "application/json" },
      })

      // 3. Redirect to new chat page with init param
      router.push(`/chat/${chatId}?init=true`)
    } catch (err) {
      console.error("Failed to create chat:", err)
      setIsWaitingForResponse(false)
    } finally {
      setInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
      <h2 className="text-3xl text-foreground font-semibold mb-8">What&apos;s on your mind today?</h2>
      <InputArea
        input={input}
        setInput={setInput}
        isWaitingForResponse={isWaitingForResponse}
        textareaRef={textareaRef}
        handleSend={handleSend}
        handleKeyDown={handleKeyDown}
      />
    </div>
  )
}
