import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageNavigation } from "@/components/PageNavigation";
import { getNavigation } from "@/lib/navigation";

export default function GetDiarizationPage() {
    const nav = getNavigation("/docs/diarization/get-diarization");

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Get Diarization</h1>
                        <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700">GET</Badge>
                    </div>
                    <p className="text-slate-600">
                        Get the status and result of a diarization job. Poll this endpoint until status is &quot;completed&quot; or &quot;error&quot;.
                    </p>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Endpoint</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <code className="text-sm font-mono text-slate-900">GET /v1/diarization/{"{job_id}"}</code>
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
                            <span className="text-sm text-slate-600">UUID of the diarization job</span>
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
                                <span className="text-sm text-slate-600">Diarization is in progress</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">completed</span>
                                <span className="text-sm text-slate-600">Results are ready</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">error</span>
                                <span className="text-sm text-slate-600">Processing failed (check error field)</span>
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
                            {`curl -X GET https://api.lexia.pro/v1/diarization/550e8400-e29b-41d4-a716-446655440000 \\
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
  "completed_at": "2026-01-14T10:01:45Z",
  "audio_duration": 180500,
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
      "end": 12800,
      "text": "Très bien, merci. Et vous ?",
      "confidence": 0.92
    }
  ],
  "speakers": [
    {
      "id": "A",
      "label": null,
      "total_duration": 95300,
      "num_segments": 12,
      "percentage": 52.8,
      "avg_segment_duration": 7942
    },
    {
      "id": "B",
      "label": null,
      "total_duration": 75200,
      "num_segments": 10,
      "percentage": 41.7,
      "avg_segment_duration": 7520
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
      "end": 12800,
      "confidence": 0.92
    },
    {
      "speaker": "A",
      "start": 13000,
      "end": 20500,
      "confidence": 0.97
    }
  ],
  "overlaps": [
    {
      "speakers": ["A", "B"],
      "start": 45200,
      "end": 46100,
      "duration": 900
    }
  ],
  "stats": {
    "version": "1.0",
    "model": "pyannote/speaker-diarization-3.1",
    "audio_duration": 180500,
    "num_speakers": 2,
    "num_segments": 22,
    "num_overlaps": 1,
    "overlap_duration": 900,
    "processing_time": 45200
  },
  "rttm": null,
  "error": null
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
                                <span className="font-mono text-sm font-medium text-slate-900">audio_duration</span>
                                <span className="text-sm text-slate-500">integer</span>
                                <span className="text-sm text-slate-600">Audio duration in milliseconds</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">utterances</span>
                                <span className="text-sm text-slate-500">array</span>
                                <span className="text-sm text-slate-600">Speaker-attributed speech with transcript text</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">speakers</span>
                                <span className="text-sm text-slate-500">array</span>
                                <span className="text-sm text-slate-600">List of detected speakers with statistics</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">segments</span>
                                <span className="text-sm text-slate-500">array</span>
                                <span className="text-sm text-slate-600">Timeline of who spoke when (start/end in ms)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">overlaps</span>
                                <span className="text-sm text-slate-500">array</span>
                                <span className="text-sm text-slate-600">Segments where multiple speakers talk simultaneously</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">stats</span>
                                <span className="text-sm text-slate-500">object</span>
                                <span className="text-sm text-slate-600">Processing statistics and metadata</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">rttm</span>
                                <span className="text-sm text-slate-500">string | null</span>
                                <span className="text-sm text-slate-600">Rich Transcription Time Marked format output</span>
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
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Speaker Object</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">id</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">Speaker identifier (A, B, C, etc.)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">label</span>
                                <span className="text-sm text-slate-500">string | null</span>
                                <span className="text-sm text-slate-600">Custom label if provided</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">total_duration</span>
                                <span className="text-sm text-slate-500">integer</span>
                                <span className="text-sm text-slate-600">Total speaking time in milliseconds</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">num_segments</span>
                                <span className="text-sm text-slate-500">integer</span>
                                <span className="text-sm text-slate-600">Number of speech segments</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">percentage</span>
                                <span className="text-sm text-slate-500">float</span>
                                <span className="text-sm text-slate-600">Percentage of total speaking time</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">avg_segment_duration</span>
                                <span className="text-sm text-slate-500">integer</span>
                                <span className="text-sm text-slate-600">Average segment duration in milliseconds</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Utterance Object</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">speaker</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">Speaker identifier (A, B, C, etc.)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">start</span>
                                <span className="text-sm text-slate-500">integer</span>
                                <span className="text-sm text-slate-600">Start time in milliseconds</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">end</span>
                                <span className="text-sm text-slate-500">integer</span>
                                <span className="text-sm text-slate-600">End time in milliseconds</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">text</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">Transcribed text of the utterance</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">confidence</span>
                                <span className="text-sm text-slate-500">float</span>
                                <span className="text-sm text-slate-600">Confidence score (0-1)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Segment Object</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">speaker</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">Speaker identifier</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">start</span>
                                <span className="text-sm text-slate-500">integer</span>
                                <span className="text-sm text-slate-600">Start time in milliseconds</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">end</span>
                                <span className="text-sm text-slate-500">integer</span>
                                <span className="text-sm text-slate-600">End time in milliseconds</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">confidence</span>
                                <span className="text-sm text-slate-500">float</span>
                                <span className="text-sm text-slate-600">Confidence score (0-1)</span>
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
                                <span className="text-sm text-slate-600">Diarization job not found</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <PageNavigation prev={nav.prev} next={nav.next} />
        </div>
    );
}
