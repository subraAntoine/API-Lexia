import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageNavigation } from "@/components/PageNavigation";
import { getNavigation } from "@/lib/navigation";
import { API_URL } from "@/lib/config";
import { AlertTriangle } from "lucide-react";

export default function CancelJobPage() {
    const nav = getNavigation("/docs/jobs/cancel-job");

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Cancel Job</h1>
                        <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">DELETE</Badge>
                    </div>
                    <p className="text-slate-600">
                        Cancel a pending or queued job. Jobs that are already processing cannot be cancelled.
                    </p>
                </div>

                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-amber-800">Cancellation is irreversible</p>
                                <p className="text-sm text-amber-700">
                                    Once a job is cancelled, it cannot be resumed or restarted. You will need to create a new job.
                                    Jobs that are already <code className="bg-amber-100 px-1 rounded">processing</code> cannot be cancelled via API.
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
                        <code className="text-sm font-mono text-slate-900">/v1/jobs/{"{job_id}"}</code>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Path Parameters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            <span className="font-mono text-sm font-medium text-slate-900">job_id</span>
                            <span className="text-sm text-red-500 font-medium">Required</span>
                            <span className="text-sm text-slate-600">UUID of the job to cancel</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Cancellation Rules</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-green-600">pending</span>
                                <span className="text-sm text-slate-600">✓ Can be cancelled</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-green-600">queued</span>
                                <span className="text-sm text-slate-600">✓ Can be cancelled</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-red-600">processing</span>
                                <span className="text-sm text-slate-600">✗ Cannot be cancelled</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-red-600">completed</span>
                                <span className="text-sm text-slate-600">✗ Cannot be cancelled</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-red-600">failed</span>
                                <span className="text-sm text-slate-600">✗ Cannot be cancelled</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <span className="font-mono text-sm font-medium text-red-600">cancelled</span>
                                <span className="text-sm text-slate-600">✗ Already cancelled</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Example Request</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`curl -X DELETE ${API_URL}/v1/jobs/550e8400-e29b-41d4-a716-446655440000 \\
  -H "Authorization: Bearer lx_abc123..."`}
                        </pre>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Response</CardTitle>
                        <CardDescription>Returns 204 No Content on success</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`HTTP/1.1 204 No Content`}
                        </pre>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">What Happens</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm text-slate-600">
                            <p>1. The Celery task is revoked (if queued)</p>
                            <p>2. Job status is set to <code className="bg-slate-100 px-1 rounded">cancelled</code></p>
                            <p>3. No webhook is sent for cancelled jobs</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Error Responses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">400</span>
                                <span className="text-sm text-slate-600">Invalid job ID format or job cannot be cancelled</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">404</span>
                                <span className="text-sm text-slate-600">Job not found</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <PageNavigation prev={nav.prev} next={nav.next} />
        </div>
    );
}
