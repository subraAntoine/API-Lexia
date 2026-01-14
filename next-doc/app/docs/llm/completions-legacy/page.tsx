import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageNavigation } from "@/components/PageNavigation";
import { getNavigation } from "@/lib/navigation";
import { AlertTriangle } from "lucide-react";

export default function CompletionsLegacyPage() {
    const nav = getNavigation("/docs/llm/completions-legacy");

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Completions (Legacy)</h1>
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">POST</Badge>
                        <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">Deprecated</Badge>
                    </div>
                    <p className="text-slate-600">
                        Legacy completion endpoint for backwards compatibility.
                    </p>
                </div>

                <Card className="border-orange-200 bg-orange-50/50 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-orange-900">Deprecated Endpoint</p>
                                <p className="text-sm text-orange-700">
                                    This endpoint is deprecated and may be removed in future versions. 
                                    Use <code className="bg-orange-100 px-1.5 py-0.5 rounded text-xs font-mono text-orange-800">/v1/chat/completions</code> instead.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Endpoint</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <code className="text-sm font-mono text-slate-900">/v1/completions</code>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Migration Guide</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-slate-600">
                            To migrate from the legacy completions endpoint to chat completions:
                        </p>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">Before (Legacy)</p>
                                <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                                    {`POST /v1/completions
{
  "model": "general7Bv2",
  "prompt": "Hello, how are you?"
}`}
                                </pre>
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">After (Chat)</p>
                                <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                                    {`POST /v1/chat/completions
{
  "model": "general7Bv2",
  "messages": [
    {"role": "user", "content": "Hello, how are you?"}
  ]
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
