import { FeatureCard } from "./FeatureCard";

const features = [
    {
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        title: "REST API",
        description: "Standard REST endpoints with predictable, resource-oriented URLs.",
        features: ["JSON responses", "HTTP/2 support", "Request batching", "Pagination"],
    },
    {
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        title: "Real-time Streaming",
        description: "WebSocket-based streaming for ultra-low latency transcription.",
        features: ["Sub-100ms latency", "Bi-directional", "Auto-reconnect", "Multi-stream"],
    },
    {
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
        ),
        title: "API Keys",
        description: "Granular access control with scoped API keys.",
        features: ["Scoped permissions", "Rate limiting", "Usage analytics", "Key rotation"],
    },
    {
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        title: "Enterprise Security",
        description: "Bank-level encryption, SOC 2 Type II certified.",
        features: ["End-to-end encryption", "SOC 2 certified", "GDPR compliant", "Audit logs"],
    },
    {
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        title: "High Availability",
        description: "99.9% uptime SLA with automatic failover.",
        features: ["99.9% SLA", "Multi-region", "Auto-scaling", "Edge CDN"],
    },
    {
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        title: "Analytics & Monitoring",
        description: "Real-time dashboards and usage metrics.",
        features: ["Usage metrics", "Error tracking", "Cost analysis", "Alerting"],
    },
];

export function FeaturesGrid() {
    return (
        <section className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold">Everything You Need</h2>
                <p className="mt-3 text-muted-foreground">
                    A complete API platform designed for developers, by developers.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                ))}
            </div>
        </section>
    );
}
