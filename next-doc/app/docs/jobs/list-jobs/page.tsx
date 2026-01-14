import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageNavigation } from "@/components/PageNavigation";
import { getNavigation } from "@/lib/navigation";

export default function ListJobsPage() {
    const nav = getNavigation("/docs/jobs/list-jobs");

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">List Jobs</h1>
                        <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700">GET</Badge>
                    </div>
                    <p className="text-slate-600">
                        List all async jobs for the authenticated user. Jobs track long-running tasks like transcription and diarization.
                    </p>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Endpoint</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <code className="text-sm font-mono text-slate-900">/v1/jobs</code>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Query Parameters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">status</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">Filter by job status</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">job_type</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">Filter by job type</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">limit</span>
                                <span className="text-sm text-slate-500">integer</span>
                                <span className="text-sm text-slate-600">Max jobs to return (1-100, default: 50)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">offset</span>
                                <span className="text-sm text-slate-500">integer</span>
                                <span className="text-sm text-slate-600">Number of jobs to skip (default: 0)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Job Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">transcription</span>
                                <span className="text-sm text-slate-600">Audio-to-text conversion</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">diarization</span>
                                <span className="text-sm text-slate-600">Speaker identification (&quot;who spoke when&quot;)</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">transcription_with_diarization</span>
                                <span className="text-sm text-slate-600">Both transcription and diarization combined</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Job Statuses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">pending</span>
                                <span className="text-sm text-slate-600">Job created, waiting to be queued</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">queued</span>
                                <span className="text-sm text-slate-600">Job in queue, waiting for worker</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">processing</span>
                                <span className="text-sm text-slate-600">Job currently being processed</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">completed</span>
                                <span className="text-sm text-slate-600">Job finished successfully</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">failed</span>
                                <span className="text-sm text-slate-600">Job failed (check error field)</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">cancelled</span>
                                <span className="text-sm text-slate-600">Job was cancelled by user</span>
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
                            {`curl -X GET "https://api.lexia.pro/v1/jobs?status=completed&limit=10" \\
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
                            {`[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "type": "transcription",
    "status": "completed",
    "created_at": "2026-01-14T10:00:00Z",
    "started_at": "2026-01-14T10:00:05Z",
    "completed_at": "2026-01-14T10:01:30Z",
    "progress": null,
    "result_url": null,
    "result": {
      "text": "Hello world...",
      "audio_duration": 125.5
    },
    "error": null,
    "priority": "normal",
    "metadata": null,
    "webhook_url": null,
    "user_id": "user_123"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "type": "diarization",
    "status": "processing",
    "created_at": "2026-01-14T10:02:00Z",
    "started_at": "2026-01-14T10:02:10Z",
    "completed_at": null,
    "progress": {
      "percentage": 45,
      "message": "Detecting speakers..."
    },
    "result_url": null,
    "result": null,
    "error": null,
    "priority": "normal",
    "metadata": null,
    "webhook_url": "https://example.com/webhook",
    "user_id": "user_123"
  }
]`}
                        </pre>
                    </CardContent>
                </Card>
            </div>

            <PageNavigation prev={nav.prev} next={nav.next} />
        </div>
    );
}
