"use client"
import { FC, HTMLAttributes, useMemo } from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { Message } from "@/types/message"
import Image from "next/image"

interface ChatMessageProps {
    message: Message
    isLast?: boolean
}

import { CodeBlock } from "./CodeBlock"

export const ChatMessage: FC<ChatMessageProps> = ({ message, isLast }) => {
    const { role, content } = message
    const isAssistant = role === "assistant"

    const markdownContent = useMemo(() => content ?? "", [content])

    return (
        <div className={`flex mx-4 sm:mx-8 md:mx-64 ${isAssistant ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
            <div
                className={`max-w-2xl py-4 px-5 my-2 rounded-2xl flex flex-col gap-y-2 shadow-sm transition-all border ${isAssistant
                    ? "bg-white/50 backdrop-blur-sm border-secondary/40 text-foreground"
                    : "bg-primary text-primary-foreground border-transparent shadow-md"
                    }`}
            >
                {isAssistant && (
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                            <span className="text-[10px] font-bold text-secondary-foreground">
                                <Image src="/logo.png" alt="Logo" width={20} height={20} />
                            </span>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/80">Assistant</span>
                    </div>
                )}
                <div className={`flex-grow message-text leading-relaxed ${isAssistant ? "text-foreground/90" : "text-primary-foreground"}`}>
                    {markdownContent ? (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            className={`prose prose-sm sm:prose-base max-w-none ${isAssistant ? "prose-zinc" : "prose-invert"}`}
                            components={markdownComponents}
                        >
                            {markdownContent}
                        </ReactMarkdown>
                    ) : (
                        isAssistant &&
                        isLast && (
                            <div className="flex gap-1.5 items-center py-2">
                                <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

const markdownComponents: Components = {
    pre: ({ children }) => <>{children}</>,
    code: ({ node: _node, className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || "")
        return match ? (
            <CodeBlock
                language={match[1]}
                value={String(children).replace(/\n$/, "")}
            />
        ) : (
            <code
                {...props}
                className="px-1.5 py-0.5 rounded bg-black/5 text-[0.9em] font-mono"
            >
                {children}
            </code>
        )
    },
    ul: ({ node: _node, ...props }) => <ul {...props} className="list-disc ml-5 space-y-2 my-2" />,
    ol: ({ node: _node, ...props }) => <ol {...props} className="list-decimal ml-5 space-y-2 my-2" />,
    table: ({ node: _node, ...props }) => (
        <div className="overflow-x-auto my-4">
            <table {...props} className="min-w-full border border-black/10 text-sm rounded-lg overflow-hidden" />
        </div>
    ),
    th: ({ node: _node, ...props }) => (
        <th {...props} className="border-b border-black/10 px-4 py-2 bg-black/5 font-bold text-left" />
    ),
    td: ({ node: _node, ...props }) => (
        <td {...props} className="border-b border-black/5 px-4 py-2" />
    ),
}
