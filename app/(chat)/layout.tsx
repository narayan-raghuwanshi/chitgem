"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { ChevronDown } from "lucide-react"
import { HamburgerIcon } from "@/components/icons"
import { Modal } from "@/components/ui/Modal"

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    const [chats, setChats] = useState<{ _id: string; title: string }[]>([])
    const [isSidebarOpen, setSidebarOpen] = useState(true)
    const [renamingChatId, setRenamingChatId] = useState<string | null>(null)
    const [deletingChatId, setDeletingChatId] = useState<string | null>(null)
    const [newTitle, setNewTitle] = useState("")
    
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

    const triggerRename = (chatId: string) => {
        const chat = chats.find(c => c._id === chatId)
        if (chat) {
            setRenamingChatId(chatId)
            setNewTitle(chat.title)
        }
    }

    const handleRenameChat = async () => {
        if (!renamingChatId) return

        const trimmed = newTitle.trim()
        if (!trimmed) return

        const res = await fetch(`/api/chats/${renamingChatId}`, {
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
            prev.map((c) => (c._id === renamingChatId ? updatedChat : c))
        )
        setRenamingChatId(null)
    }

    const triggerDelete = (chatId: string) => {
        setDeletingChatId(chatId)
    }

    const handleDeleteChat = async () => {
        if (!deletingChatId) return

        const res = await fetch(`/api/chats/${deletingChatId}`, {
            method: "DELETE",
        })

        if (!res.ok) {
            console.error("Failed to delete chat")
            return
        }

        setChats((prev) => prev.filter((c) => c._id !== deletingChatId))
        if (activeChatId === deletingChatId) {
            router.push("/")
        }
        setDeletingChatId(null)
    }

    return (
        <div className="flex h-screen bg-background text-foreground font-sans">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
                chats={chats}
                activeChatId={activeChatId}
                setActiveChatId={(id) => router.push(`/chat/${id}`)}
                handleNewChat={handleNewChat}
                handleRenameChat={triggerRename}
                handleDeleteChat={triggerDelete}
            />

            <div className="flex-1 flex flex-col relative w-full overflow-hidden">
                <header className="absolute top-0 left-0 right-0 p-3 md:p-4 flex items-center gap-2 z-10 bg-background/80 backdrop-blur-md border-b border-sidebar-border md:border-none md:bg-transparent transition-all">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 hover:bg-sidebar-accent/50 rounded-lg md:hidden transition-colors"
                        aria-label="Open sidebar"
                    >
                        <HamburgerIcon className="text-sidebar-foreground" />
                    </button>
                    <div className="flex items-center gap-2 overflow-hidden">
                        <h1 className="text-lg md:text-xl flex gap-1 items-center font-bold truncate">
                            {activeChat?.title ?? "chitgem"} <ChevronDown size={18} className="text-muted-foreground" />
                        </h1>
                    </div>
                </header>

                {children}
            </div>

            {/* Rename Modal */}
            <Modal
                isOpen={!!renamingChatId}
                onClose={() => setRenamingChatId(null)}
                title="Rename Chat"
                footer={
                    <>
                        <button
                            onClick={() => setRenamingChatId(null)}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent/50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleRenameChat}
                            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors shadow-sm"
                        >
                            Save Changes
                        </button>
                    </>
                }
            >
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">New Title</label>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-sidebar/5 border border-sidebar-border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        placeholder="Enter chat title..."
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && handleRenameChat()}
                    />
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deletingChatId}
                onClose={() => setDeletingChatId(null)}
                title="Delete Chat"
                footer={
                    <>
                        <button
                            onClick={() => setDeletingChatId(null)}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent/50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteChat}
                            className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg transition-colors shadow-sm"
                        >
                            Delete Chat
                        </button>
                    </>
                }
            >
                <p className="text-base">
                    Are you sure you want to delete <span className="font-bold text-foreground underline decoration-destructive/30 decoration-2">&quot;{chats.find(c => c._id === deletingChatId)?.title}&quot;</span>? 
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                    This action cannot be undone and all messages will be permanently removed.
                </p>
            </Modal>
        </div>
    )
}
