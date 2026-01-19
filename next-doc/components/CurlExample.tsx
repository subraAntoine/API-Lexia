"use client";

import { API_URL } from "@/lib/config";

interface CurlExampleProps {
    method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
    endpoint: string;
    headers?: Record<string, string>;
    body?: string;
    formData?: boolean;
    formFields?: Record<string, string>;
    className?: string;
}

/**
 * Component to display curl command examples with dynamic API URL
 * Uses the NEXT_PUBLIC_API_URL environment variable
 */
export function CurlExample({
    method,
    endpoint,
    headers = {},
    body,
    formData,
    formFields,
    className = "",
}: CurlExampleProps) {
    const lines: string[] = [];

    lines.push(`curl -X ${method} ${API_URL}${endpoint}`);
    lines.push(`  -H "Authorization: Bearer lx_your_api_key"`);

    // Add custom headers
    Object.entries(headers).forEach(([key, value]) => {
        lines.push(`  -H "${key}: ${value}"`);
    });

    // Add body if present
    if (body) {
        lines.push(`  -H "Content-Type: application/json"`);
        lines.push(`  -d '${body}'`);
    }

    // Add form data if present
    if (formData && formFields) {
        Object.entries(formFields).forEach(([key, value]) => {
            lines.push(`  -F "${key}=${value}"`);
        });
    }

    const curlCommand = lines.join(" \\\n");

    return (
        <pre className={`bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm font-mono ${className}`}>
            {curlCommand}
        </pre>
    );
}

/**
 * Simple curl string generator for inline use
 */
export function useCurlString(
    method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH",
    endpoint: string,
    options?: {
        body?: string;
        headers?: Record<string, string>;
        formFields?: Record<string, string>;
        queryParams?: Record<string, string>;
    }
): string {
    let url = `${API_URL}${endpoint}`;

    if (options?.queryParams) {
        const params = Object.entries(options.queryParams)
            .map(([k, v]) => `${k}=${v}`)
            .join("&");
        url = `"${url}?${params}"`;
    }

    const lines: string[] = [];
    lines.push(`curl -X ${method} ${url}`);
    lines.push(`  -H "Authorization: Bearer lx_your_api_key"`);

    if (options?.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
            lines.push(`  -H "${key}: ${value}"`);
        });
    }

    if (options?.body) {
        lines.push(`  -H "Content-Type: application/json"`);
        lines.push(`  -d '${options.body}'`);
    }

    if (options?.formFields) {
        Object.entries(options.formFields).forEach(([key, value]) => {
            lines.push(`  -F "${key}=${value}"`);
        });
    }

    return lines.join(" \\\n");
}
