"use client"
import { FC } from "react"
import { Sparkles, Info, Lightbulb, CheckCircle2 } from "lucide-react"

interface DesignCardProps {
    value: string // Format: "Title | Description"
}

export const DesignCard: FC<DesignCardProps> = ({ value }) => {
    const [title, description] = value.split("|").map(s => s.trim())

    return (
        <div className="my-6 p-1 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-secondary/20 shadow-sm transition-all hover:shadow-md animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[14px] flex gap-4 items-start border border-white">
                <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0 shadow-inner">
                    <Sparkles size={24} />
                </div>
                <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-foreground text-base tracking-tight">{title || "Design Insight"}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    )
}
