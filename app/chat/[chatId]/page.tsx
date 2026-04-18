"use client"

import { Suspense, useEffect, useState, useRef } from "react"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { InputArea } from "@/components/chat/InputArea"
import { Message } from "@/types/message"
import { chat } from "@/actions/chat"
import { readStreamableValue } from "@ai-sdk/rsc"
import { useParams, useSearchParams, useRouter } from "next/navigation"

export default function ChatPage() {
    return (
        <Suspense fallback={<div className="flex-1 flex justify-center items-center text-foreground">Loading chat...</div>}>
            <ChatContent />
        </Suspense>
    )
}

function ChatContent() {
    const { chatId } = useParams<{ chatId: string }>()
    const searchParams = useSearchParams()
    const router = useRouter()
    const init = searchParams.get("init")
    const hasTriggeredRef = useRef(false)
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
            .then((msgs: Message[]) => {
                setMessages(msgs)

                if (init === "true" && msgs.length > 0 && msgs[msgs.length - 1].role === "user" && !hasTriggeredRef.current) {
                    hasTriggeredRef.current = true
                    router.replace(`/chat/${chatId}`)

                    // We let the setMessages flush first, then generate
                    setTimeout(() => {
                        generateAiResponse(msgs)
                    }, 0)
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const generateAiResponse = async (history: Message[]) => {
        setIsWaitingForResponse(true)
        try {
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
        } catch (err) {
            console.error("AI Generation Error:", err)
        } finally {
            setIsWaitingForResponse(false)
        }
    }

    const handleSend = async () => {
        if (!input.trim() || isWaitingForResponse) return

        // Optimistically add user message
        const userMessage: Message = { role: "user", content: input.trim() }
        setInput("")
        setMessages((prev) => [...prev, userMessage])

        setIsWaitingForResponse(true)

        try {
            // Save user message
            await fetch(`/api/chats/${chatId}/messages`, {
                method: "POST",
                body: JSON.stringify(userMessage),
                headers: { "Content-Type": "application/json" },
            })

            const history = [...messagesRef.current, userMessage]
            await generateAiResponse(history)
        } catch (err) {
            console.error("Failed to send message:", err)
            setIsWaitingForResponse(false)
        }
    }

    return (
        <>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto pt-20 pb-52">
                {messages.map((msg, i) => (
                    <ChatMessage key={i} message={msg} isLast={i === messages.length - 1} />
                ))}
            </div>

            {/* Blur Overlay for bottom scroll */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background via-background/95 to-transparent backdrop-blur-md pointer-events-none z-[1]" />

            <div className="absolute bottom-0 left-0 right-0 z-10 bg-linear-to-t from-background via-background/50 to-transparent pt-10">
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
