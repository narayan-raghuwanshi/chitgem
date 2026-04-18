"use client"

import { useEffect, useState, useRef } from "react"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { InputArea } from "@/components/chat/InputArea"
import { Message } from "@/types/message"
import { chat } from "@/actions/chat"
import { readStreamableValue } from "@ai-sdk/rsc"
import { useParams } from "next/navigation"

export default function ChatPage() {
    const { chatId } = useParams<{ chatId: string }>()
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isWaitingForResponse, setIsWaitingForResponse] = useState(false)
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const messagesRef = useRef<Message[]>([])
    const latestAssistantContentRef = useRef("")
    const animationFrameRef = useRef<number | null>(null)

    useEffect(() => {
        fetch(`/api/chats/${chatId}/messages`)
            .then((res) => res.json())
            .then((msgs: Message[]) => setMessages(msgs))
    }, [chatId])

    useEffect(() => {
        messagesRef.current = messages
        chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight)
    }, [messages])

    useEffect(() => {
        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [])

    const scheduleAssistantUpdate = (content: string) => {
        latestAssistantContentRef.current = content

        const flushUpdate = () => {
            animationFrameRef.current = null
            const latest = latestAssistantContentRef.current
            setMessages((prev) => {
                if (prev.length === 0) return prev
                const updated = [...prev]
                const lastIndex = updated.length - 1
                if (updated[lastIndex]?.role === "assistant") {
                    updated[lastIndex] = { ...updated[lastIndex], content: latest }
                }
                return updated
            })
        }

        if (typeof window === "undefined") {
            flushUpdate()
            return
        }

        if (animationFrameRef.current === null) {
            animationFrameRef.current = window.requestAnimationFrame(flushUpdate)
        }
    }

    const handleSend = async () => {
        if (!input.trim() || isWaitingForResponse) return
        setIsWaitingForResponse(true)

        const userMessage: Message = { role: "user", content: input.trim() }
        setInput("")
        setMessages((prev) => [...prev, userMessage])

        try {
            await fetch(`/api/chats/${chatId}/messages`, {
                method: "POST",
                body: JSON.stringify(userMessage),
                headers: { "Content-Type": "application/json" },
            })

            const history = [...messagesRef.current, userMessage]
            const { newMessage } = await chat(history)
            let textContent = ""
            const assistantMessage: Message = { role: "assistant", content: "" }
            setMessages((prev) => [...prev, assistantMessage])

            for await (const chunk of readStreamableValue(newMessage)) {
                textContent += chunk ?? ""
                scheduleAssistantUpdate(textContent)
            }
            scheduleAssistantUpdate(textContent)

            const savedAssistantMessage: Message = {
                role: "assistant",
                content: textContent,
            }

            if (textContent.trim() !== "") {
                await fetch(`/api/chats/${chatId}/messages`, {
                    method: "POST",
                    body: JSON.stringify(savedAssistantMessage),
                    headers: { "Content-Type": "application/json" },
                })
            }
        } finally {
            setIsWaitingForResponse(false)
        }
    }

    return (
        <>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto pt-20 pb-40">
                {messages.map((msg, i) => (
                    <ChatMessage key={i} message={msg} isLast={i === messages.length - 1} />
                ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
                    <InputArea
                        input={input}
                        setInput={setInput}
                        isWaitingForResponse={isWaitingForResponse}
                        textareaRef={textareaRef}
                        handleSend={handleSend}
                        handleKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleSend()
                            }
                        }}
                    />
                </div>
            </div>
        </>
    )
}
