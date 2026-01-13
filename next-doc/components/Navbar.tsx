"use client";

import Link from "next/link";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                        <span className="text-sm font-bold text-white">L</span>
                    </div>
                    <span className="text-lg font-semibold">Lexia</span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link
                        href="#docs"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Documentation
                    </Link>
                    <Link
                        href="#api"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        API Reference
                    </Link>
                    <Link
                        href="https://github.com"
                        target="_blank"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        GitHub
                    </Link>
                </div>
            </div>
        </nav>
    );
}
