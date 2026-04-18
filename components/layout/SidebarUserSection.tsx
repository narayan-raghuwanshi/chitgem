"use client"
import { SignedIn, UserButton } from "@clerk/nextjs"

export const SidebarUserSection = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => (
    <div className="p-2 border-t border-sidebar-border">
        <SignedIn>
            <div
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent/50 w-full text-left text-sm cursor-pointer transition-colors ${!isSidebarOpen ? "justify-center" : ""
                    }`}
            >
                <div className="flex-shrink-0">
                    <UserButton 
                        afterSignOutUrl="/sign-in" 
                        appearance={{
                            elements: {
                                userButtonAvatarBox: "w-8 h-8 rounded-lg"
                            }
                        }}
                    />
                </div>
                {isSidebarOpen && (
                    <>
                        <div className="flex-1 overflow-hidden">
                            <p className="font-semibold text-sidebar-foreground truncate">Narayan Raghuwanshi</p>
                            <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/50 font-bold">Free Plan</p>
                        </div>
                        <button className="ml-auto px-3 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-sm">
                            Upgrade
                        </button>
                    </>
                )}
            </div>
        </SignedIn>
    </div>
)
