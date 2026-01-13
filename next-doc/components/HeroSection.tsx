import { Button } from "@/components/ui/button";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-32 pb-16">
            {/* Gradient background effects */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-6xl px-6 text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    <span className="block">API</span>
                    <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Documentation
                    </span>
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                    Build the future of voice-enabled applications with Lexia&apos;s powerful,
                    developer-first REST API
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700"
                    >
                        Get Started
                    </Button>
                    <Button size="lg" variant="outline">
                        View on GitHub
                    </Button>
                </div>
            </div>
        </section>
    );
}
