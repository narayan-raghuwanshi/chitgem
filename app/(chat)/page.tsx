"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { InputArea } from "@/components/chat/InputArea"
import { Message } from "@/types/message"
import { chat } from "@/actions/chat"
import { readStreamableValue } from "@ai-sdk/rsc"

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
        body: JSON.stringify({ title: `New Chat` }),
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

      // 3. Call AI with first message
      const { newMessage } = await chat([userMessage])
      let textContent = ""
      const assistantMessage: Message = { role: "assistant", content: "" }

      for await (const chunk of readStreamableValue(newMessage)) {
        textContent += chunk ?? ""
        assistantMessage.content = textContent
      }

      if (textContent.trim() !== "") {
        // 4. Save assistant message
        await fetch(`/api/chats/${chatId}/messages`, {
          method: "POST",
          body: JSON.stringify(assistantMessage),
          headers: { "Content-Type": "application/json" },
        })
      }

      // 5. Redirect to new chat page
      router.push(`/chat/${chatId}`)
    } catch (err) {
      console.error("Failed to create chat:", err)
    } finally {
      setIsWaitingForResponse(false)
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
      <h2 className="text-3xl text-white mb-8">What&apos;s on your mind today?</h2>
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
