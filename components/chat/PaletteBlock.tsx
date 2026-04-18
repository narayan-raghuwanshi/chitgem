"use client"
import { FC, useState } from "react"
import { Copy, Check } from "lucide-react"

interface PaletteColor {
    name: string
    hex: string
}

interface PaletteBlockProps {
    value: string // Format expected: "Name: #HEX, Name: #HEX"
}

export const PaletteBlock: FC<PaletteBlockProps> = ({ value }) => {
    const colors: PaletteColor[] = value.split(",").map(part => {
        const [name, hex] = part.split(":").map(s => s.trim())
        return { name: name || "Color", hex: hex || "#000000" }
    })

    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

    const copyToClipboard = async (hex: string, index: number) => {
        await navigator.clipboard.writeText(hex)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    return (
        <div className="my-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-in fade-in zoom-in duration-700">
            {colors.map((color, idx) => (
                <div 
                    key={idx} 
                    className="group relative flex flex-col bg-white rounded-2xl border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                    {/* Swatch */}
                    <button 
                        onClick={() => copyToClipboard(color.hex, idx)}
                        className="h-24 md:h-28 w-full rounded-t-2xl relative overflow-hidden focus:outline-none"
                        style={{ backgroundColor: color.hex }}
                        title={`Copy ${color.hex}`}
                    >
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
                            {copiedIndex === idx ? (
                                <Check className="text-white w-6 h-6 animate-in zoom-in" />
                            ) : (
                                <Copy className="text-white w-5 h-5" />
                            )}
                        </div>
                    </button>
                    
                    {/* Info */}
                    <div className="p-3 bg-white rounded-b-2xl">
                        <p className="text-[10px] sm:text-xs font-bold text-foreground truncate mb-1">{color.name}</p>
                        <button 
                            onClick={() => copyToClipboard(color.hex, idx)}
                            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[10px] font-mono border transition-all ${
                                copiedIndex === idx 
                                ? "bg-green-50 border-green-200 text-green-700" 
                                : "bg-sidebar/5 border-transparent hover:border-primary/20 text-muted-foreground hover:text-primary"
                            }`}
                        >
                            <span className="uppercase">{color.hex}</span>
                            {copiedIndex === idx ? <Check size={10} /> : <Copy size={10} />}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
