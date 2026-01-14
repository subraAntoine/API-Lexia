"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const sidebarSections = [
    {
        title: "Getting Started",
        items: [
            { title: "Introduction", href: "/docs" },
            { title: "Authentication", href: "/docs/authentication" },
            { title: "Rate Limits", href: "/docs/rate-limits" },
        ],
    },
    {
        title: "LLM",
        items: [
            { title: "List Models", href: "/docs/llm/models" },
            { title: "Get Model Info", href: "/docs/llm/model-info" },
            { title: "Chat Completions", href: "/docs/llm/chat-completions" },
            { title: "Streaming", href: "/docs/llm/streaming" },
            { title: "Function Calling", href: "/docs/llm/function-calling" },
            { title: "Completions (Legacy)", href: "/docs/llm/completions-legacy" },
        ],
    },
    {
        title: "Speech-to-Text",
        items: [
            { title: "Create Transcription", href: "/docs/stt/create-transcription" },
            { title: "Get Transcription", href: "/docs/stt/get-transcription" },
            { title: "Sync Transcription", href: "/docs/stt/sync-transcription" },
        ],
    },
    {
        title: "Diarization",
        items: [
            { title: "Create Diarization", href: "/docs/diarization/create-diarization" },
            { title: "Get Diarization", href: "/docs/diarization/get-diarization" },
            { title: "Sync Diarization", href: "/docs/diarization/sync-diarization" },
        ],
    },
    {
        title: "Jobs",
        items: [
            { title: "List Jobs", href: "/docs/jobs/list-jobs" },
            { title: "Get Job", href: "/docs/jobs/get-job" },
            { title: "Cancel Job", href: "/docs/jobs/cancel-job" },
        ],
    },
    {
        title: "Reference",
        items: [
            { title: "Health Check", href: "/docs/health" },
            { title: "Error Codes", href: "/docs/errors" },
        ],
    },
];

export function ApiSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed top-0 left-0 z-40 w-64 h-screen border-r border-slate-200 bg-white flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
                <Link href="/docs" className="flex items-center gap-2 mb-6">
                    <span className="text-xl font-bold tracking-tight text-slate-900">
                        Lexia API
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                        v1.0.0
                    </span>
                </Link>
                <nav className="space-y-6">
                    {sidebarSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                {section.title}
                            </h3>
                            <div className="space-y-1">
                                {section.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "block px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                            pathname === item.href
                                                ? "bg-indigo-50 text-indigo-700"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        )}
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
            <div className="flex-shrink-0 p-6 border-t border-slate-100 bg-white">
                <p className="text-xs text-slate-500">
                    © 2026 Lexia. All rights reserved.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                    contact@lexia.fr
                </p>
            </div>
        </aside>
    );
}
