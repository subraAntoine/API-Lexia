import Link from "next/link";

const footerLinks = {
    product: [
        { name: "API", href: "#" },
        { name: "Documentation", href: "#" },
        { name: "Use Cases", href: "#" },
    ],
    company: [
        { name: "Team", href: "#" },
        { name: "Research", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Blog", href: "#" },
    ],
    legal: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
    ],
};

export function Footer() {
    return (
        <footer className="mt-auto border-t border-border/40 bg-card/30">
            <div className="mx-auto max-w-6xl px-6 py-12">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                                <span className="text-sm font-bold text-white">L</span>
                            </div>
                            <span className="text-lg font-semibold">Lexia</span>
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Lexia develops speech technology designed to reconcile voice interactions with enterprise systems.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Lexia. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                        <Link href="#" className="transition-colors hover:text-foreground">
                            Terms of Service
                        </Link>
                        <Link href="#" className="transition-colors hover:text-foreground">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
