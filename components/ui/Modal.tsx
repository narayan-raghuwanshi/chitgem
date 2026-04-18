"use client"
import { FC, ReactNode, useEffect } from "react"
import { X } from "lucide-react"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
    footer?: ReactNode
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
    // Close on ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        if (isOpen) window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-200">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-background/60 backdrop-blur-sm" 
                onClick={onClose}
            />
            
            {/* Modal Body */}
            <div className="relative bg-white border border-sidebar-border w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-sidebar-border flex items-center justify-between bg-sidebar/10">
                    <h3 className="font-bold text-foreground">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-sidebar-accent/50 rounded-lg transition-colors text-muted-foreground"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6 text-foreground/80 leading-relaxed">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 py-4 bg-sidebar/5 border-t border-sidebar-border flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}
