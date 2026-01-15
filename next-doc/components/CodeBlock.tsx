"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  showCopy?: boolean;
}

/**
 * CodeBlock component that automatically replaces API_URL placeholder
 * with the configured environment variable
 */
export function CodeBlock({ code, language = "bash", showCopy = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  // Replace placeholder with actual API URL from environment
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const displayCode = code
    .replace(/\$\{API_URL\}/g, apiUrl)
    .replace(/https:\/\/api\.lexia\.pro/g, apiUrl)
    .replace(/https:\/\/api\.lexiapro\.fr/g, apiUrl)
    .replace(/https:\/\/your-api-url\.com/g, apiUrl);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      {showCopy && (
        <button
          onClick={handleCopy}
          className="absolute right-3 top-3 rounded-md bg-white/10 px-2 py-1 text-xs text-white/70 transition-colors hover:bg-white/20 hover:text-white"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      )}
      <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
        <code>{displayCode}</code>
      </pre>
    </div>
  );
}

/**
 * Inline code that replaces API URL placeholder
 */
export function ApiUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-slate-800">{apiUrl}</code>;
}
