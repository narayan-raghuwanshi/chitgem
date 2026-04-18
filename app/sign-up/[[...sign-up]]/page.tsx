import { SignUp } from '@clerk/nextjs'
import { Paintbrush } from 'lucide-react'

export default function Page() {
    return (
        <section className='min-h-screen flex flex-col md:flex-row bg-background overflow-y-auto'>
            {/* Hero Section */}
            <div className='hidden md:flex flex-1 flex-col justify-center px-6 py-8 md:px-16 lg:px-24 bg-sidebar/30 relative overflow-hidden'>
                {/* Decorative element */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl"></div>

                <div className='relative z-10'>
                    <div className='flex items-center gap-3 mb-6 md:mb-8 animate-in fade-in slide-in-from-left-4 duration-700'>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                            <Paintbrush size={24} className="text-primary-foreground leading-none" />
                        </div>
                        <h1 className='text-3xl md:text-4xl font-bold tracking-tight text-foreground'>Stroke</h1>
                    </div>

                    <h2 className='text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 md:mb-6 leading-tight animate-in fade-in slide-in-from-left-4 duration-700 delay-100'>
                        A New <span className='text-primary decoration-primary/20 decoration-8 underline-offset-8'>Vision</span> Awaits.
                    </h2>

                    <p className='text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-lg leading-relaxed animate-in fade-in slide-in-from-left-4 duration-700 delay-200'>
                        Secure your spot in the elite design circle on <span className="font-bold text-primary italic">stroke.slashme.io</span>. Experience aesthetic guidance that defines the future.
                    </p>

                    <div className='space-y-4 md:space-y-6 animate-in fade-in slide-in-from-left-4 duration-700 delay-300'>
                        {[
                            { title: "Refined Intelligence", desc: "Sophisticated AI that understands aesthetic nuance and balance." },
                            { title: "Professional Tools", desc: "Unlock features designed for high-performance visual workflows." },
                            { title: "Curated Excellence", desc: "Your designs are precious; we provide the stroke of genius they deserve." }
                        ].map((item, i) => (
                            <div key={i} className='flex gap-3 md:gap-4 items-start group'>
                                <div className='mt-1 w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors duration-300'></div>
                                <div>
                                    <h3 className='font-bold text-foreground text-sm md:text-base'>{item.title}</h3>
                                    <p className='text-xs md:text-sm text-muted-foreground/80'>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Auth Section */}
            <div className='flex-grow md:flex-1 flex flex-col justify-center items-center p-6 md:p-8 bg-background'>
                <div className='w-full max-w-md animate-in fade-in zoom-in duration-700 flex justify-center items-center'>
                    <SignUp
                        appearance={{
                            elements: {
                                formButtonPrimary: 'bg-primary hover:bg-primary/90 text-sm font-bold capitalize transition-all duration-300 shadow-md',
                                card: 'bg-white shadow-2xl border border-sidebar-border rounded-2xl overflow-hidden',
                                headerTitle: 'text-2xl font-bold text-foreground',
                                headerSubtitle: 'text-muted-foreground font-medium',
                                socialButtonsBlockButton: 'border-sidebar-border hover:bg-sidebar/20 transition-all duration-200',
                                socialButtonsBlockButtonText: 'text-foreground font-semibold',
                                formFieldLabel: 'text-xs font-bold uppercase tracking-wider text-muted-foreground',
                                formFieldInput: 'bg-sidebar/5 border-sidebar-border rounded-xl focus:ring-2 focus:ring-primary/20 transition-all',
                                footerActionLink: 'text-primary hover:text-primary/80 font-bold',
                            },
                        }}
                    />
                </div>
            </div>
        </section>
    )
}
