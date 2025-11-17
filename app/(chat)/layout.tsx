"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { ChevronDown } from "lucide-react"

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    const [chats, setChats] = useState<{ _id: string; title: string }[]>([])
    const [isSidebarOpen, setSidebarOpen] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        fetch("/api/chats")
            .then((res) => res.json())
            .then((data) => setChats(data))
    }, [pathname])

    const createChat = async (title?: string) => {
        const res = await fetch("/api/chats", {
            method: "POST",
            body: JSON.stringify({ title: title ?? `New Chat ${chats.length + 1}` }),
            headers: { "Content-Type": "application/json" },
        })
        const newChat = await res.json()
        setChats((prev) => [newChat, ...prev])
        return newChat
    }

    const handleNewChat = async () => {
        const newChat = await createChat()
        router.push(`/chat/${newChat._id}`)
    }

    const activeChatId = pathname.startsWith("/chat/")
        ? pathname.split("/chat/")[1]
        : undefined

    const activeChat = useMemo(
        () => chats.find((chat) => chat._id === activeChatId),
        [chats, activeChatId]
    )

    const handleRenameChat = async (chatId: string) => {
        const chat = chats.find((c) => c._id === chatId)
        if (!chat) return

        const nextTitle = window.prompt("Rename chat", chat.title)
        if (!nextTitle) return

        const trimmed = nextTitle.trim()
        if (!trimmed || trimmed === chat.title) return

        const res = await fetch(`/api/chats/${chatId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: trimmed }),
        })

        if (!res.ok) {
            console.error("Failed to rename chat")
            return
        }

        const updatedChat = await res.json()
        setChats((prev) =>
            prev.map((c) => (c._id === chatId ? updatedChat : c))
        )
    }

    const handleDeleteChat = async (chatId: string) => {
        const chat = chats.find((c) => c._id === chatId)
        if (!chat) return

        const confirmed = window.confirm(
            `Delete "${chat.title}"? This action cannot be undone.`
        )
        if (!confirmed) return

        const res = await fetch(`/api/chats/${chatId}`, {
            method: "DELETE",
        })

        if (!res.ok) {
            console.error("Failed to delete chat")
            return
        }

        setChats((prev) => prev.filter((c) => c._id !== chatId))
        router.push("/")
    }

    return (
        <div className="flex h-screen bg-[#212121] text-white font-sans">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
                chats={chats}
                activeChatId={activeChatId}
                setActiveChatId={(id) => router.push(`/chat/${id}`)}
                handleNewChat={handleNewChat}
                handleRenameChat={handleRenameChat}
                handleDeleteChat={handleDeleteChat}
            />

            <div className="flex-1 flex flex-col relative">
                <header className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl flex gap-1 items-center">
                            {activeChat?.title ?? "Chatter"} <ChevronDown size={20} />
                        </h1>
                    </div>
                    <div className="w-8"></div>
                </header>

                {children}
            </div>
        </div>
    )
}
