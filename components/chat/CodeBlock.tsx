"use client"
import { FC, useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Check, Copy } from "lucide-react"

interface CodeBlockProps {
    language: string
    value: string
}

export const CodeBlock: FC<CodeBlockProps> = ({ language, value }) => {
    const [copied, setCopied] = useState(false)

    const onCopy = async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="relative group my-4 rounded-xl overflow-hidden border border-border bg-[#1e1e1e] shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#333333]">
                <span className="text-xs font-mono text-muted-foreground/80 lowercase">{language || "text"}</span>
                <button
                    onClick={onCopy}
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy code"
                >
                    {copied ? (
                        <>
                            <Check size={14} className="text-green-500" />
                            <span className="text-green-500">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={14} />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code */}
            <div className="text-xs">
                <SyntaxHighlighter
                    language={language || "text"}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: "1rem",
                        background: "transparent",
                        fontSize: "0.775rem",
                    }}
                    codeTagProps={{
                        className: "font-mono leading-relaxed",
                    }}
                    wrapLines={true}
                    wrapLongLines={true}
                >
                    {value}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}
