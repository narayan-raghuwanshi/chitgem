"use client"
import { FC } from "react"
import Image from "next/image"
import { HamburgerIcon, EditIcon } from "@/components/icons"
import { Search, Archive, PencilLine, Trash2, MessageCircleIcon, MoreVertical } from "lucide-react"
import { SidebarUserSection } from "./SidebarUserSection"
import { useState, useRef, useEffect } from "react"

interface Chat {
    _id: string
    title: string
}

interface Props {
    isSidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
    chats?: Chat[]
    activeChatId?: string
    setActiveChatId?: (id: string) => void
    handleNewChat?: () => void
    handleRenameChat?: (id: string) => void
    handleDeleteChat?: (id: string) => void
}

export const Sidebar: FC<Props> = ({
    isSidebarOpen,
    setSidebarOpen,
    chats = [],
    activeChatId,
    setActiveChatId,
    handleNewChat,
    handleRenameChat,
    handleDeleteChat
}) => {
    const navItems = [
        { icon: <EditIcon className="w-5 h-5" />, text: "New chat", onClick: handleNewChat },
        { icon: <Search size={20} />, text: "Search chats" },
        { icon: <Archive size={20} />, text: "Library" }
    ]

    const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpenId(null)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <>
            {/* Mobile backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 md:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div
                className={`
                    fixed inset-y-0 left-0 z-50 
                    md:relative md:translate-x-0
                    bg-sidebar text-sidebar-foreground 
                    flex flex-col flex-shrink-0 
                    transition-all duration-300 border-r border-sidebar-border
                    ${isSidebarOpen
                        ? "w-64 translate-x-0"
                        : "w-64 -translate-x-full md:translate-x-0 md:w-16"
                    }
                `}
            >
                {/* Header */}
                <div className={`p-2 h-[72px] flex items-center ${isSidebarOpen ? "justify-between" : "justify-center"}`}>
                    {(isSidebarOpen || !isSidebarOpen) && (
                        <div className={`flex items-center gap-2 ${!isSidebarOpen && "hidden md:flex"}`}>
                            {isSidebarOpen && <Image src="/logo.png" alt="Logo" width={32} height={32} className="contrast-125" />}
                            {isSidebarOpen && <span className="font-bold tracking-tight">chitgem</span>}
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className={`p-2 hover:bg-sidebar-accent/50 rounded-lg transition-colors ${!isSidebarOpen ? "hidden md:block" : ""}`}
                    >
                        <HamburgerIcon className="text-sidebar-foreground" />
                    </button>
                </div>

                {/* Nav items */}
                <div className="flex-grow overflow-y-auto custom-scrollbar">
                    <nav className="flex flex-col space-y-1">
                        {navItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={item.onClick}
                                className={`flex items-center gap-3 p-2.5 hover:bg-sidebar-accent/50 text-sm font-medium w-full text-left transition-colors ${!isSidebarOpen ? "md:justify-center" : ""}`}
                            >
                                <span className="text-sidebar-foreground/80">{item.icon}</span>
                                {(isSidebarOpen || (index === 0 && !isSidebarOpen)) && (
                                    <span className={!isSidebarOpen ? "md:hidden" : ""}>{item.text}</span>
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Chats list */}
                    {isSidebarOpen && (
                        <div className="mt-8">
                            <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/50 font-bold px-3 mb-2">
                                Recent Chats
                            </p>
                            <div className="flex flex-col space-y-0.5">
                                {chats.map((chat) => (
                                    <div
                                        key={chat._id}
                                        className={`group relative flex items-center gap-2 p-2 text-sm transition-all ${activeChatId === chat._id ? "bg-sidebar-accent text-slate shadow-xs" : "hover:bg-sidebar-accent/30 text-sidebar-foreground/90 hover:text-sidebar-foreground"}`}
                                    >
                                        <button
                                            onClick={() => setActiveChatId?.(chat._id)}
                                            className="flex-1 flex items-center gap-1.5 text-left truncate font-medium"
                                        >
                                            <MessageCircleIcon className="w-4 h-4 text-sidebar-foreground/80" />
                                            {chat.title}
                                        </button>

                                        {/* More Actions Menu */}
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setMenuOpenId(menuOpenId === chat._id ? null : chat._id)
                                                }}
                                                className={`p-1 rounded-md hover:bg-sidebar-accent/50 transition-colors ${menuOpenId === chat._id ? "bg-sidebar-accent/50" : ""}`}
                                            >
                                                <MoreVertical size={14} />
                                            </button>

                                            {menuOpenId === chat._id && (
                                                <div
                                                    ref={menuRef}
                                                    className="absolute right-0 top-full mt-1 w-32 bg-white border border-sidebar-border rounded-lg shadow-xl z-[60] animate-in fade-in zoom-in-95 duration-150"
                                                >
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleRenameChat?.(chat._id)
                                                            setMenuOpenId(null)
                                                        }}
                                                        className="flex items-center gap-2 w-full px-3 py-2 text-xs text-foreground hover:bg-sidebar-accent/30 transition-colors"
                                                    >
                                                        <PencilLine size={12} /> Rename
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleDeleteChat?.(chat._id)
                                                            setMenuOpenId(null)
                                                        }}
                                                        className="flex items-center gap-2 w-full px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                                                    >
                                                        <Trash2 size={12} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <SidebarUserSection isSidebarOpen={isSidebarOpen} />

                <style>{`
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--sidebar-border); border-radius: 10px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--sidebar-accent); }
                `}</style>
            </div>
        </>
    )
}
