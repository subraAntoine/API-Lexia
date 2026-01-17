import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageNavigation } from "@/components/PageNavigation";
import { getNavigation } from "@/lib/navigation";
import { AlertTriangle } from "lucide-react";

export default function SyncTranscriptionPage() {
    const nav = getNavigation("/docs/stt/sync-transcription");

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Synchronous Transcription</h1>
                        <Badge variant="outline" className="border-violet-200 bg-violet-50 text-violet-700">POST</Badge>
                    </div>
                    <p className="text-slate-600">
                        Transcribe audio synchronously and get the result immediately. Best for short audio files where you need instant results.
                    </p>
                </div>

                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-amber-800">Use for short audio only</p>
                                <p className="text-sm text-amber-700">
                                    This endpoint is designed for audio files under 5 minutes and 50MB. For longer files, use the asynchronous 
                                    Create Transcription endpoint to avoid request timeouts. Sync requests do not persist results.
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
                        <code className="text-sm font-mono text-slate-900">POST /v1/transcriptions/sync</code>
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
                                <span className="text-sm text-red-500 font-medium">Required</span>
                                <span className="text-sm text-slate-600">Audio file to transcribe (wav, mp3, m4a, flac, ogg, webm)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">language_code</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">Language code (default: fr)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">punctuate</span>
                                <span className="text-sm text-slate-500">boolean</span>
                                <span className="text-sm text-slate-600">Enable automatic punctuation (default: true)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">format_text</span>
                                <span className="text-sm text-slate-500">boolean</span>
                                <span className="text-sm text-slate-600">Enable text formatting (default: true)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-indigo-200 bg-indigo-50/50 shadow-sm">
                    <CardContent className="pt-6">
                        <p className="text-sm text-indigo-700">
                            <strong>Note:</strong> Sync transcription does not support speaker diarization. Word timestamps are always enabled and returned in milliseconds.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Example Request</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`curl -X POST https://api.lexia.pro/v1/transcriptions/sync \\
  -H "Authorization: Bearer lx_abc123..." \\
  -F "audio=@short_audio.mp3" \\
  -F "language_code=fr"`}
                        </pre>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Response</CardTitle>
                        <CardDescription>Returns the transcription result directly (no job ID polling needed)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "completed",
  "created_at": "2026-01-14T10:00:00Z",
  "completed_at": "2026-01-14T10:00:08Z",
  "audio_duration": 45200,
  "text": "Bonjour et bienvenue. Aujourd'hui nous allons discuter...",
  "confidence": 0.96,
  "language_code": "fr",
  "language_detection": false,
  "language_confidence": 0.99,
  "punctuate": true,
  "format_text": true,
  "speaker_labels": false,
  "words": [
    {
      "text": "Bonjour",
      "start": 0,
      "end": 500,
      "confidence": 0.97,
      "speaker": null
    },
    {
      "text": "et",
      "start": 550,
      "end": 700,
      "confidence": 0.98,
      "speaker": null
    },
    {
      "text": "bienvenue",
      "start": 750,
      "end": 1200,
      "confidence": 0.95,
      "speaker": null
    }
  ]
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
                                <span className="font-mono text-sm font-medium text-slate-900">text</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">Full transcript text</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">audio_duration</span>
                                <span className="text-sm text-slate-500">integer</span>
                                <span className="text-sm text-slate-600">Audio duration in milliseconds</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">confidence</span>
                                <span className="text-sm text-slate-500">float</span>
                                <span className="text-sm text-slate-600">Overall transcript confidence (0-1)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">language_code</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">Detected or specified language</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">language_confidence</span>
                                <span className="text-sm text-slate-500">float</span>
                                <span className="text-sm text-slate-600">Language detection confidence (0-1)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">words</span>
                                <span className="text-sm text-slate-500">array</span>
                                <span className="text-sm text-slate-600">Word-level timestamps in milliseconds</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Comparison: Sync vs Async</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-2 font-medium text-slate-900">Feature</th>
                                        <th className="text-left py-2 font-medium text-slate-900">Sync</th>
                                        <th className="text-left py-2 font-medium text-slate-900">Async</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-slate-100">
                                        <td className="py-2 text-slate-600">Best for</td>
                                        <td className="py-2 text-slate-900">&lt; 5 min audio</td>
                                        <td className="py-2 text-slate-900">Any length</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="py-2 text-slate-600">Max file size</td>
                                        <td className="py-2 text-slate-900">50 MB</td>
                                        <td className="py-2 text-slate-900">Configurable</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="py-2 text-slate-600">Response type</td>
                                        <td className="py-2 text-slate-900">Direct result</td>
                                        <td className="py-2 text-slate-900">Job ID (poll for result)</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="py-2 text-slate-600">Result storage</td>
                                        <td className="py-2 text-slate-900">Not persisted</td>
                                        <td className="py-2 text-slate-900">Stored for 24h</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="py-2 text-slate-600">Speaker diarization</td>
                                        <td className="py-2 text-slate-900">No</td>
                                        <td className="py-2 text-slate-900">Yes</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="py-2 text-slate-600">Webhook support</td>
                                        <td className="py-2 text-slate-900">No</td>
                                        <td className="py-2 text-slate-900">Yes</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-slate-600">Timeout risk</td>
                                        <td className="py-2 text-slate-900">Higher</td>
                                        <td className="py-2 text-slate-900">None</td>
                                    </tr>
                                </tbody>
                            </table>
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
                                <span className="text-sm text-slate-600">Invalid audio format</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">413</span>
                                <span className="text-sm text-slate-600">File too large (max 50MB)</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">422</span>
                                <span className="text-sm text-slate-600">Validation error</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">500</span>
                                <span className="text-sm text-slate-600">Transcription service error</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <PageNavigation prev={nav.prev} next={nav.next} />
        </div>
    );
}
