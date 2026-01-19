import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageNavigation } from "@/components/PageNavigation";
import { getNavigation } from "@/lib/navigation";
import { API_URL } from "@/lib/config";
import { Info } from "lucide-react";

export default function CreateDiarizationPage() {
    const nav = getNavigation("/docs/diarization/create-diarization");

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Diarization</h1>
                        <Badge variant="outline" className="border-violet-200 bg-violet-50 text-violet-700">POST</Badge>
                    </div>
                    <p className="text-slate-600">
                        Create an asynchronous speaker diarization job. Diarization identifies &quot;who spoke when&quot; in an audio file without transcribing the content.
                    </p>
                </div>

                <Card className="border-indigo-200 bg-indigo-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-indigo-800">What is Speaker Diarization?</p>
                                <p className="text-sm text-indigo-700">
                                    Speaker diarization segments audio by speaker identity. It answers &quot;who spoke when&quot; but does not
                                    transcribe the words. Use this when you need speaker timelines without the text content.
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
                        <code className="text-sm font-mono text-slate-900">POST /v1/diarization</code>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Request Body (multipart/form-data)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">audio</span>
                                <span className="text-sm text-slate-500">file</span>
                                <span className="text-sm text-slate-600">Audio file to diarize (required if no audio_url)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">audio_url</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">URL of the audio file (required if no audio)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">speakers_expected</span>
                                <span className="text-sm text-slate-500">integer</span>
                                <span className="text-sm text-slate-600">Exact number of speakers if known (1-20)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">min_speakers_expected</span>
                                <span className="text-sm text-slate-500">integer</span>
                                <span className="text-sm text-slate-600">Minimum number of speakers (≥1)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">max_speakers_expected</span>
                                <span className="text-sm text-slate-500">integer</span>
                                <span className="text-sm text-slate-600">Maximum number of speakers (≤20)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">webhook_url</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">URL to call when processing completes</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Supported Audio Formats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {["wav", "mp3", "m4a", "flac", "ogg", "webm"].map((format) => (
                                <Badge key={format} variant="secondary" className="font-mono text-xs">
                                    .{format}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Speaker Detection Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm text-slate-600">
                            <p>
                                <strong className="text-slate-900">Known speaker count:</strong> Set <code className="bg-slate-100 px-1 rounded">speakers_expected</code> for best accuracy.
                            </p>
                            <p>
                                <strong className="text-slate-900">Unknown but bounded:</strong> Use <code className="bg-slate-100 px-1 rounded">min_speakers_expected</code> and <code className="bg-slate-100 px-1 rounded">max_speakers_expected</code> to constrain detection.
                            </p>
                            <p>
                                <strong className="text-slate-900">Fully automatic:</strong> Leave all speaker params empty for automatic detection.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Example Request</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`curl -X POST ${API_URL}/v1/diarization \\
  -H "Authorization: Bearer lx_abc123..." \\
  -F "audio=@meeting.mp3" \\
  -F "min_speakers_expected=2" \\
  -F "max_speakers_expected=5"`}
                        </pre>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Response (202 Accepted)</CardTitle>
                        <CardDescription>Returns a job ID for polling</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued",
  "created_at": "2026-01-14T10:00:00Z",
  "completed_at": null,
  "audio_duration": null,
  "utterances": null,
  "speakers": null,
  "segments": null,
  "overlaps": null,
  "stats": null,
  "rttm": null,
  "error": null
}`}
                        </pre>
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
                                <span className="text-sm text-slate-600">Invalid audio format or missing input</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">413</span>
                                <span className="text-sm text-slate-600">File too large</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">422</span>
                                <span className="text-sm text-slate-600">Validation error</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <PageNavigation prev={nav.prev} next={nav.next} />
        </div>
    );
}
