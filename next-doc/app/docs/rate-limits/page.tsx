import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageNavigation } from "@/components/PageNavigation";
import { getNavigation } from "@/lib/navigation";
import { AlertTriangle } from "lucide-react";

export default function RateLimitsPage() {
    const nav = getNavigation("/docs/rate-limits");

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Rate Limits</h1>
                    <p className="text-slate-600">
                        Rate limits are applied per API key. Check response headers to monitor your usage.
                    </p>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Response Headers</CardTitle>
                        <CardDescription>Monitor these headers to track your API usage</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">X-RateLimit-Limit</span>
                                <span className="text-sm text-slate-500">integer</span>
                                <span className="text-sm text-slate-600">Requests allowed per minute</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">X-RateLimit-Remaining</span>
                                <span className="text-sm text-slate-500">integer</span>
                                <span className="text-sm text-slate-600">Remaining requests in window</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">X-RateLimit-Reset</span>
                                <span className="text-sm text-slate-500">timestamp</span>
                                <span className="text-sm text-slate-600">Unix timestamp when limit resets</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Example Headers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                            {`HTTP/1.1 200 OK
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1705000060`}
                        </pre>
                    </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50/50 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-red-900">Error 429 - Rate Limit Exceeded</p>
                                <p className="text-sm text-red-700">If you exceed the limit, wait for the counter to reset or contact us to increase your limits.</p>
                                <pre className="bg-red-100 text-red-800 p-3 rounded-lg text-xs font-mono mt-2">
                                    {`{
  "error": {
    "message": "Rate limit exceeded",
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded"
  }
}`}
                                </pre>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <PageNavigation prev={nav.prev} next={nav.next} />
        </div>
    );
}
