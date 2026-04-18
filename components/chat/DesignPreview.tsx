"use client"
import { FC, useState, useEffect, useRef } from "react"
import { Monitor, Smartphone, Tablet, Copy, Check, RefreshCw, X, Palette, ExternalLink } from "lucide-react"
import { createPortal } from "react-dom"

interface DesignPreviewProps {
    value: string
}

export const DesignPreview: FC<DesignPreviewProps> = ({ value }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Inline trigger button */}
            <button
                onClick={() => setIsOpen(true)}
                className="group my-4 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
            >
                <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <Palette size={16} />
                </span>
                <span className="flex flex-col items-start leading-tight">
                    <span className="text-white/70 text-[10px] font-semibold uppercase tracking-widest">AI Generated</span>
                    <span>View Design Preview</span>
                </span>
                <ExternalLink size={14} className="ml-2 opacity-60 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Modal Portal */}
            {isOpen && <PreviewModal value={value} onClose={() => setIsOpen(false)} />}
        </>
    )
}

const PreviewModal: FC<{ value: string; onClose: () => void }> = ({ value, onClose }) => {
    const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
    const [copied, setCopied] = useState(false)
    const [activeTab, setActiveTab] = useState<"preview" | "code">("preview")

    const getFullHtml = () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Design Preview</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/@tailwindcss/browser@4"><\/script>
  <style>
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
    h1, h2, h3, h4, h5, h6 { font-family: 'Outfit', sans-serif; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
  </style>
</head>
<body>
${value}
</body>
</html>`
    const iframeRef = useRef<HTMLIFrameElement>(null)

    const handleCopy = () => {
        navigator.clipboard.writeText(getFullHtml())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const containerWidth = {
        desktop: "100%",
        tablet: "768px",
        mobile: "390px",
    }

    const writeIframe = () => {
        if (!iframeRef.current) return
        const doc = iframeRef.current.contentDocument
        if (!doc) return
        doc.open()
        doc.write(getFullHtml())
        doc.close()
    }

    useEffect(() => {
        // Lock body scroll
        document.body.style.overflow = "hidden"
        return () => { document.body.style.overflow = "" }
    }, [])

    useEffect(() => {
        if (activeTab === "preview") {
            // Small delay to ensure iframe is in the DOM
            setTimeout(writeIframe, 50)
        }
    }, [activeTab, value])

    // Close on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [onClose])

    const modal = (
        <div
            className="fixed inset-0 z-[9999] flex animate-in fade-in duration-200"
            style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
        >
            {/* Backdrop close */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Modal */}
            <div className="relative z-10 w-full h-full flex flex-col overflow-hidden bg-white animate-in zoom-in-95 duration-300">

                {/* Header — Row 1: branding + close */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-white shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <Palette size={16} />
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-sm text-foreground leading-tight">Design Preview</p>
                            <p className="text-[11px] text-muted-foreground leading-tight">AI-generated mockup</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="shrink-0 p-2 rounded-xl border border-border bg-white text-muted-foreground hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Header — Row 2: tabs + controls */}
                <div className="flex items-center justify-between gap-2 px-4 py-2 border-b bg-white/80 shrink-0 flex-wrap">
                    {/* Tabs */}
                    <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-xl border border-border">
                        <button
                            onClick={() => setActiveTab("preview")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "preview" ? "bg-white shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Preview
                        </button>
                        <button
                            onClick={() => setActiveTab("code")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "code" ? "bg-white shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Code
                        </button>
                    </div>

                    {/* Right controls */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {activeTab === "preview" && (
                            <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-xl border border-border">
                                {(["desktop", "mobile"] as const).map((mode) => {
                                    const Icon = mode === "desktop" ? Monitor : Smartphone
                                    return (
                                        <button
                                            key={mode}
                                            onClick={() => setViewMode(mode)}
                                            className={`p-1.5 rounded-lg transition-all ${viewMode === mode ? "bg-primary text-white shadow" : "text-muted-foreground hover:bg-white"}`}
                                            title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} view`}
                                        >
                                            <Icon size={14} />
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-white text-xs font-bold hover:bg-muted transition-all shadow-sm active:scale-95"
                        >
                            {copied ? <><Check size={13} className="text-green-500" /><span className="hidden sm:inline">Copied!</span></> : <><Copy size={13} /><span className="hidden sm:inline">Copy</span></>}
                        </button>

                        {activeTab === "preview" && (
                            <button
                                onClick={writeIframe}
                                className="p-1.5 rounded-xl border border-border bg-white text-muted-foreground hover:bg-muted transition-all shadow-sm"
                                title="Refresh"
                            >
                                <RefreshCw size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-hidden bg-muted/10">
                    {activeTab === "preview" ? (
                        <div className="w-full h-full flex items-start justify-center overflow-auto">
                            <div
                                className="h-full bg-white overflow-hidden transition-all duration-500"
                                style={{ width: containerWidth[viewMode], minHeight: "100%", flexShrink: 0 }}
                            >
                                <iframe
                                    ref={iframeRef}
                                    className="w-full h-full border-0"
                                    title="Design Preview"
                                    onLoad={writeIframe}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full overflow-auto p-6">
                            <pre className="w-full h-full p-6 rounded-2xl bg-zinc-950 text-green-400 text-xs font-mono leading-relaxed whitespace-pre-wrap overflow-auto border border-zinc-800">
                                {getFullHtml()}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    return createPortal(modal, document.body)
}
