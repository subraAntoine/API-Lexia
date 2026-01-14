import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageNavigation } from "@/components/PageNavigation";
import { getNavigation } from "@/lib/navigation";

export default function GetTranscriptionPage() {
    const nav = getNavigation("/docs/stt/get-transcription");

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Get Transcription</h1>
                        <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700">GET</Badge>
                    </div>
                    <p className="text-slate-600">
                        Get the status and result of a transcription job. Poll this endpoint until status is &quot;completed&quot; or &quot;error&quot;.
                    </p>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Endpoint</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <code className="text-sm font-mono text-slate-900">/v1/transcriptions/{"{transcription_id}"}</code>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Path Parameters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            <span className="font-mono text-sm font-medium text-slate-900">transcription_id</span>
                            <span className="text-sm text-red-500 font-medium">Required</span>
                            <span className="text-sm text-slate-600">UUID of the transcription job</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Status Values</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">queued</span>
                                <span className="text-sm text-slate-600">Job is waiting to be processed</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">processing</span>
                                <span className="text-sm text-slate-600">Transcription is in progress</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">completed</span>
                                <span className="text-sm text-slate-600">Transcription finished successfully</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">error</span>
                                <span className="text-sm text-slate-600">An error occurred during processing</span>
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
                            {`curl -X GET https://api.lexia.pro/v1/transcriptions/550e8400-e29b-41d4-a716-446655440000 \\
  -H "Authorization: Bearer lx_abc123..."`}
                        </pre>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Response (Completed)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "created_at": "2026-01-14T10:00:00Z",
  "completed_at": "2026-01-14T10:01:30Z",
  "audio_url": null,
  "audio_duration": 125.5,
  "text": "Bonjour, bienvenue dans cette réunion...",
  "language_code": "fr",
  "language_confidence": 0.98,
  "segments": [
    {
      "id": 0,
      "text": "Bonjour, bienvenue dans cette réunion.",
      "start": 0.0,
      "end": 2.5,
      "confidence": 0.95,
      "speaker": "SPEAKER_00"
    }
  ],
  "words": [
    {
      "text": "Bonjour",
      "start": 0.0,
      "end": 0.5,
      "confidence": 0.98,
      "speaker": "SPEAKER_00"
    },
    {
      "text": "bienvenue",
      "start": 0.6,
      "end": 1.1,
      "confidence": 0.96,
      "speaker": "SPEAKER_00"
    }
  ],
  "speakers": ["SPEAKER_00", "SPEAKER_01"],
  "utterances": [
    {
      "speaker": "SPEAKER_00",
      "start": 0.0,
      "end": 2.5,
      "text": "Bonjour, bienvenue dans cette réunion.",
      "confidence": 0.95
    }
  ],
  "error": null,
  "metadata": null
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
                                <span className="font-mono text-sm font-medium text-slate-900">segments</span>
                                <span className="text-sm text-slate-500">array</span>
                                <span className="text-sm text-slate-600">Transcript broken into segments with timing</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">words</span>
                                <span className="text-sm text-slate-500">array</span>
                                <span className="text-sm text-slate-600">Word-level timestamps (if enabled)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">speakers</span>
                                <span className="text-sm text-slate-500">array</span>
                                <span className="text-sm text-slate-600">List of detected speaker IDs (if diarization enabled)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">utterances</span>
                                <span className="text-sm text-slate-500">array</span>
                                <span className="text-sm text-slate-600">Speaker-attributed speech segments</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">error</span>
                                <span className="text-sm text-slate-500">string | null</span>
                                <span className="text-sm text-slate-600">Error message if status is &quot;error&quot;</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Polling Example (JavaScript)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`async function waitForTranscription(id: string) {
  const maxAttempts = 60;
  const delayMs = 5000;

  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(
      \`https://api.lexia.pro/v1/transcriptions/\${id}\`,
      { headers: { 'Authorization': 'Bearer lx_abc123...' } }
    );
    const data = await response.json();

    if (data.status === 'completed') {
      return data;
    }
    if (data.status === 'error') {
      throw new Error(data.error);
    }

    await new Promise(r => setTimeout(r, delayMs));
  }
  throw new Error('Timeout waiting for transcription');
}`}
                        </pre>
                    </CardContent>
                </Card>
            </div>

            <PageNavigation prev={nav.prev} next={nav.next} />
        </div>
    );
}
