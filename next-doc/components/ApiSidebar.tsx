import Link from "next/link";

const sidebarItems = [
    { title: "Introduction", href: "#intro" },
    { title: "Authentication", href: "#auth" },
    { title: "Models", href: "#models" },
    { title: "Transcribe", href: "#transcribe" },
    { title: "Errors", href: "#errors" },
];

export function ApiSidebar() {
    return (
        <aside className="fixed top-0 left-0 z-40 w-64 h-screen border-r border-slate-200 bg-white overflow-y-auto">
            <div className="p-6">
                <Link href="/" className="flex items-center gap-2 mb-8">
                    <span className="text-xl font-bold tracking-tight text-slate-900">
                        Lexia API
                    </span>
                </Link>
                <nav className="space-y-1">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block px-3 py-2 text-sm font-medium text-slate-600 rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="absolute bottom-0 w-full p-6 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                    © 2024 Lexia. All rights reserved.
                </p>
            </div>
        </aside>
    );
}
