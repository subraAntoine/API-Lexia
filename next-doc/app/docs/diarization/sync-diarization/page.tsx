import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageNavigation } from "@/components/PageNavigation";
import { getNavigation } from "@/lib/navigation";
import { AlertTriangle } from "lucide-react";

export default function SyncDiarizationPage() {
    const nav = getNavigation("/docs/diarization/sync-diarization");

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Synchronous Diarization</h1>
                        <Badge variant="outline" className="border-violet-200 bg-violet-50 text-violet-700">POST</Badge>
                    </div>
                    <p className="text-slate-600">
                        Diarize audio synchronously and get speaker segments immediately. Best for short audio files where you need instant results.
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
                                    Create Diarization endpoint to avoid request timeouts. Sync requests do not persist results.
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
                        <code className="text-sm font-mono text-slate-900">POST /v1/diarization/sync</code>
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
                                <span className="text-sm text-slate-600">Audio file to diarize (wav, mp3, m4a, flac, ogg, webm)</span>
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
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">max_speakers_expected</span>
                                <span className="text-sm text-slate-500">integer</span>
                                <span className="text-sm text-slate-600">Maximum number of speakers (≤20)</span>
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
                            {`curl -X POST https://api.lexia.pro/v1/diarization/sync \\
  -H "Authorization: Bearer lx_abc123..." \\
  -F "audio=@short_meeting.mp3" \\
  -F "speakers_expected=2"`}
                        </pre>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Response</CardTitle>
                        <CardDescription>Returns the diarization result directly (no job ID polling needed)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "completed",
  "created_at": "2026-01-14T10:00:00Z",
  "completed_at": "2026-01-14T10:00:15Z",
  "audio_duration": 45000,
  "utterances": [
    {
      "speaker": "A",
      "start": 0,
      "end": 5200,
      "text": "Bonjour, comment ça va ?",
      "confidence": 0.95
    },
    {
      "speaker": "B",
      "start": 5500,
      "end": 10800,
      "text": "Très bien, merci !",
      "confidence": 0.92
    }
  ],
  "speakers": [
    {
      "id": "A",
      "label": null,
      "total_duration": 25300,
      "num_segments": 5,
      "percentage": 56.2,
      "avg_segment_duration": 5060
    },
    {
      "id": "B",
      "label": null,
      "total_duration": 18700,
      "num_segments": 4,
      "percentage": 41.6,
      "avg_segment_duration": 4675
    }
  ],
  "segments": [
    {
      "speaker": "A",
      "start": 0,
      "end": 5200,
      "confidence": 0.95
    },
    {
      "speaker": "B",
      "start": 5500,
      "end": 10800,
      "confidence": 0.92
    },
    {
      "speaker": "A",
      "start": 11000,
      "end": 18500,
      "confidence": 0.97
    }
  ],
  "overlaps": [],
  "stats": {
    "version": "1.0",
    "model": "pyannote/speaker-diarization-3.1",
    "audio_duration": 45000,
    "num_speakers": 2,
    "num_segments": 9,
    "num_overlaps": 0,
    "overlap_duration": 0,
    "processing_time": 12500
  },
  "rttm": null,
  "error": null
}`}
                        </pre>
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
                                        <td className="py-2 text-slate-600">Webhook support</td>
                                        <td className="py-2 text-slate-900">No</td>
                                        <td className="py-2 text-slate-900">Yes</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="py-2 text-slate-600">Audio URL input</td>
                                        <td className="py-2 text-slate-900">No (file only)</td>
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
                                <span className="text-sm text-slate-600">Diarization service error</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <PageNavigation prev={nav.prev} next={nav.next} />
        </div>
    );
}
