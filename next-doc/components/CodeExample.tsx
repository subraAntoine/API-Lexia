"use client";

import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import config from "@/lib/config";

const getRequestCode = (apiUrl: string) => `curl ${apiUrl}/v1/transcriptions/sync \\
  -X POST \\
  -H "Authorization: Bearer lx_your_api_key" \\
  -H "Content-Type: multipart/form-data" \\
  -F "audio=@audio.wav" \\
  -F "language_code=fr"`;

const responseCode = `{
  "text": "Bonjour, ceci est un exemple...",
  "language": "fr",
  "duration": 12.5,
  "segments": [...],
  "words": [...],
  "processing_time": 2.3
}`;

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute right-3 top-3 rounded-md bg-white/10 px-2 py-1 text-xs text-white/70 transition-colors hover:bg-white/20 hover:text-white"
        >
            {copied ? "Copied!" : "Copy"}
        </button>
    );
}

export function CodeExample() {
    const requestCode = getRequestCode(config.apiUrl);
    
    return (
        <section className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-semibold">Get Started in Seconds</h2>
                <p className="mt-2 text-muted-foreground">
                    Integrate speech recognition into your application with just a few lines of code.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Request */}
                <div className="overflow-hidden rounded-xl border border-border/50 bg-zinc-950">
                    <div className="flex items-center justify-between border-b border-border/50 bg-zinc-900/50 px-4 py-3">
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                                POST
                            </Badge>
                            <code className="text-sm text-muted-foreground">/v1/transcribe</code>
                        </div>
                    </div>
                    <div className="relative">
                        <CopyButton text={requestCode} />
                        <pre className="overflow-x-auto p-4">
                            <code className="text-sm text-zinc-300">{requestCode}</code>
                        </pre>
                    </div>
                </div>

                {/* Response */}
                <div className="overflow-hidden rounded-xl border border-border/50 bg-zinc-950">
                    <div className="flex items-center justify-between border-b border-border/50 bg-zinc-900/50 px-4 py-3">
                        <span className="text-sm font-medium text-muted-foreground">Response</span>
                    </div>
                    <div className="relative">
                        <CopyButton text={responseCode} />
                        <pre className="overflow-x-auto p-4">
                            <code className="text-sm text-zinc-300">{responseCode}</code>
                        </pre>
                    </div>
                </div>
            </div>
        </section>
    );
}
