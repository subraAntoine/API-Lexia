import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageNavigation } from "@/components/PageNavigation";
import { getNavigation } from "@/lib/navigation";
import { API_URL } from "@/lib/config";
import { Info } from "lucide-react";

export default function GetJobPage() {
    const nav = getNavigation("/docs/jobs/get-job");

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Get Job</h1>
                        <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700">GET</Badge>
                    </div>
                    <p className="text-slate-600">
                        Get details of a specific job by ID. Use this to poll job status or retrieve completed results.
                    </p>
                </div>

                <Card className="border-indigo-200 bg-indigo-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-indigo-800">Polling Pattern</p>
                                <p className="text-sm text-indigo-700">
                                    For async jobs, poll this endpoint every 2-5 seconds until <code className="bg-indigo-100 px-1 rounded">status</code> is
                                    <code className="bg-indigo-100 px-1 rounded">completed</code> or <code className="bg-indigo-100 px-1 rounded">failed</code>.
                                    Alternatively, use webhooks for completion notifications.
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
                            <span className="text-sm text-slate-600">UUID of the job</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Example Request</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`curl -X GET ${API_URL}/v1/jobs/550e8400-e29b-41d4-a716-446655440000 \\
  -H "Authorization: Bearer lx_abc123..."`}
                        </pre>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Response</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "transcription",
  "status": "completed",
  "created_at": "2026-01-14T10:00:00Z",
  "started_at": "2026-01-14T10:00:05Z",
  "completed_at": "2026-01-14T10:01:30Z",
  "progress": null,
  "result_url": null,
  "result": {
    "text": "Bonjour, bienvenue dans cette réunion...",
    "audio_duration": 125.5,
    "language_code": "fr",
    "segments": [...]
  },
  "error": null,
  "priority": "normal",
  "metadata": null,
  "webhook_url": null,
  "user_id": "user_123"
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
                                <span className="font-mono text-sm font-medium text-slate-900">id</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">Unique job ID (UUID)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">type</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">Job type (transcription, diarization, etc.)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">status</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">Current job status</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">progress</span>
                                <span className="text-sm text-slate-500">object | null</span>
                                <span className="text-sm text-slate-600">Progress info for running jobs</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">result</span>
                                <span className="text-sm text-slate-500">object | null</span>
                                <span className="text-sm text-slate-600">Output data when completed</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">error</span>
                                <span className="text-sm text-slate-500">object | null</span>
                                <span className="text-sm text-slate-600">Error details if failed</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Progress Object</CardTitle>
                        <CardDescription>Returned when job is processing</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">percentage</span>
                                <span className="text-sm text-slate-500">integer</span>
                                <span className="text-sm text-slate-600">Completion percentage (0-100)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">stage</span>
                                <span className="text-sm text-slate-500">string | null</span>
                                <span className="text-sm text-slate-600">Current processing stage</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">message</span>
                                <span className="text-sm text-slate-500">string | null</span>
                                <span className="text-sm text-slate-600">Progress message</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Error Object</CardTitle>
                        <CardDescription>Returned when job has failed</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">code</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">Error code</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">message</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">Human-readable error message</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">retryable</span>
                                <span className="text-sm text-slate-500">boolean</span>
                                <span className="text-sm text-slate-600">Whether the job can be retried</span>
                            </div>
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
                                <span className="text-sm text-slate-600">Invalid job ID format</span>
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
