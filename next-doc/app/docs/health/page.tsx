import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageNavigation } from "@/components/PageNavigation";
import { getNavigation } from "@/lib/navigation";
import { API_URL } from "@/lib/config";
import { Check, AlertTriangle } from "lucide-react";

export default function HealthCheckPage() {
    const nav = getNavigation("/docs/health");

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Health Check</h1>
                        <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700">GET</Badge>
                    </div>
                    <p className="text-slate-600">
                        Check API health and dependent services status. This endpoint does not require authentication.
                    </p>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Endpoint</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <code className="text-sm font-mono text-slate-900">/health</code>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Authentication</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-600">
                            No authentication required. This endpoint is public to allow for external monitoring.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Example Request</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`curl -X GET ${API_URL}/health`}
                        </pre>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Response (Healthy)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`{
  "status": "healthy",
  "version": "1.0.0",
  "services": {
    "llm": "healthy",
    "stt": "healthy"
  }
}`}
                        </pre>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Response (Degraded)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`{
  "status": "degraded",
  "version": "1.0.0",
  "services": {
    "llm": "healthy",
    "stt": "unhealthy"
  }
}`}
                        </pre>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Response Fields</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">status</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">Overall API status</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">version</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">API version</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">services</span>
                                <span className="text-sm text-slate-500">object</span>
                                <span className="text-sm text-slate-600">Status of each dependent service</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Status Values</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 border-b border-slate-100 pb-2">
                                <Check className="h-4 w-4 text-green-600" />
                                <span className="font-mono text-sm font-medium text-slate-900">healthy</span>
                                <span className="text-sm text-slate-600">All services are operational</span>
                            </div>
                            <div className="flex items-center gap-4 border-b border-slate-100 pb-2">
                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                                <span className="font-mono text-sm font-medium text-slate-900">degraded</span>
                                <span className="text-sm text-slate-600">Some services are not healthy</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Service Status Values</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-green-600">healthy</span>
                                <span className="text-sm text-slate-600">Service is fully operational</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-amber-600">unhealthy</span>
                                <span className="text-sm text-slate-600">Service is not responding correctly</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <span className="font-mono text-sm font-medium text-red-600">unavailable</span>
                                <span className="text-sm text-slate-600">Service could not be reached</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Monitored Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">llm</span>
                                <span className="text-sm text-slate-600">Large Language Model service (vLLM)</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">stt</span>
                                <span className="text-sm text-slate-600">Speech-to-Text service (Whisper)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Use Cases</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm text-slate-600">
                            <p><strong className="text-slate-900">Uptime Monitoring:</strong> Configure external monitors (Pingdom, UptimeRobot, etc.) to check this endpoint.</p>
                            <p><strong className="text-slate-900">Load Balancer:</strong> Use as a health check target for load balancer routing.</p>
                            <p><strong className="text-slate-900">Kubernetes:</strong> Configure as liveness/readiness probe for container orchestration.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <PageNavigation prev={nav.prev} next={nav.next} />
        </div>
    );
}
