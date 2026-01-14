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
                                    This endpoint is designed for audio files under 5 minutes. For longer files, use the asynchronous 
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
                        <code className="text-sm font-mono text-slate-900">/v1/transcriptions/sync</code>
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
                                <span className="text-sm text-slate-600">Audio file to transcribe (required if no audio_url)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">audio_url</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">URL of the audio file (required if no audio)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">language_code</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">Language code (default: auto)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">speaker_diarization</span>
                                <span className="text-sm text-slate-500">boolean</span>
                                <span className="text-sm text-slate-600">Enable speaker identification (default: false)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">word_timestamps</span>
                                <span className="text-sm text-slate-500">boolean</span>
                                <span className="text-sm text-slate-600">Include word-level timestamps (default: false)</span>
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
                            {`curl -X POST https://api.lexia.pro/v1/transcriptions/sync \\
  -H "Authorization: Bearer lx_abc123..." \\
  -F "audio=@short_audio.mp3" \\
  -F "language_code=en"`}
                        </pre>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Response</CardTitle>
                        <CardDescription>Returns the transcription result directly (no job ID)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`{
  "text": "Hello and welcome to the meeting. Today we'll discuss...",
  "audio_duration": 45.2,
  "language_code": "en",
  "language_confidence": 0.99,
  "segments": [
    {
      "id": 0,
      "text": "Hello and welcome to the meeting.",
      "start": 0.0,
      "end": 1.8,
      "confidence": 0.97,
      "speaker": null
    },
    {
      "id": 1,
      "text": "Today we'll discuss the quarterly results.",
      "start": 2.0,
      "end": 4.5,
      "confidence": 0.95,
      "speaker": null
    }
  ],
  "words": null,
  "speakers": null,
  "utterances": null
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
                                <span className="text-sm text-slate-500">float</span>
                                <span className="text-sm text-slate-600">Audio duration in seconds</span>
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
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">segments</span>
                                <span className="text-sm text-slate-500">array</span>
                                <span className="text-sm text-slate-600">Transcript segments with timing</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">words</span>
                                <span className="text-sm text-slate-500">array | null</span>
                                <span className="text-sm text-slate-600">Word-level timestamps (if enabled)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">speakers</span>
                                <span className="text-sm text-slate-500">array | null</span>
                                <span className="text-sm text-slate-600">Speaker IDs (if diarization enabled)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">utterances</span>
                                <span className="text-sm text-slate-500">array | null</span>
                                <span className="text-sm text-slate-600">Speaker-attributed segments (if diarization enabled)</span>
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
            </div>

            <PageNavigation prev={nav.prev} next={nav.next} />
        </div>
    );
}
