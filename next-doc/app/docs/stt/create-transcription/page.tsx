import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageNavigation } from "@/components/PageNavigation";
import { getNavigation } from "@/lib/navigation";

export default function CreateTranscriptionPage() {
    const nav = getNavigation("/docs/stt/create-transcription");

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Transcription</h1>
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">POST</Badge>
                    </div>
                    <p className="text-slate-600">
                        Upload audio and create an async transcription job. Returns a job ID for polling the result.
                    </p>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Endpoint</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <code className="text-sm font-mono text-slate-900">/v1/transcriptions</code>
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
                                <span className="text-sm text-slate-500">File (optional)</span>
                                <span className="text-sm text-slate-600">Audio file to transcribe (wav, mp3, m4a, flac, ogg, webm)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">audio_url</span>
                                <span className="text-sm text-slate-500">String (optional)</span>
                                <span className="text-sm text-slate-600">URL to audio file (alternative to file upload)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">language_code</span>
                                <span className="text-sm text-slate-500">String</span>
                                <span className="text-sm text-slate-600">Language code: fr, en, de, es, it, pt, nl, auto. Default: fr</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">speaker_diarization</span>
                                <span className="text-sm text-slate-500">Boolean</span>
                                <span className="text-sm text-slate-600">Enable speaker detection. Default: false</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">word_timestamps</span>
                                <span className="text-sm text-slate-500">Boolean</span>
                                <span className="text-sm text-slate-600">Include word-level timestamps. Default: true</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">webhook_url</span>
                                <span className="text-sm text-slate-500">String (optional)</span>
                                <span className="text-sm text-slate-600">URL to call when transcription completes</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-indigo-200 bg-indigo-50/50 shadow-sm">
                    <CardContent className="pt-6">
                        <p className="text-sm text-indigo-700">
                            <strong>Note:</strong> Either <code className="bg-indigo-100 px-1 py-0.5 rounded text-xs font-mono">audio</code> file or <code className="bg-indigo-100 px-1 py-0.5 rounded text-xs font-mono">audio_url</code> must be provided.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Supported Languages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="text-sm"><code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">fr</code> French</div>
                            <div className="text-sm"><code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">en</code> English</div>
                            <div className="text-sm"><code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">de</code> German</div>
                            <div className="text-sm"><code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">es</code> Spanish</div>
                            <div className="text-sm"><code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">it</code> Italian</div>
                            <div className="text-sm"><code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">pt</code> Portuguese</div>
                            <div className="text-sm"><code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">nl</code> Dutch</div>
                            <div className="text-sm"><code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">auto</code> Auto-detect</div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Example Request</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                                {`curl -X POST https://api.lexia.pro/v1/transcriptions \\
  -H "Authorization: Bearer lx_abc123..." \\
  -F "audio=@recording.mp3" \\
  -F "language_code=fr" \\
  -F "speaker_diarization=true" \\
  -F "word_timestamps=true"`}
                            </pre>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Response (202 Accepted)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                                {`{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued",
  "created_at": "2026-01-14T10:00:00Z",
  "audio_url": null,
  "estimated_completion": null
}`}
                            </pre>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Supported Audio Formats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">WAV</Badge>
                            <Badge variant="outline">MP3</Badge>
                            <Badge variant="outline">M4A</Badge>
                            <Badge variant="outline">FLAC</Badge>
                            <Badge variant="outline">OGG</Badge>
                            <Badge variant="outline">WebM</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <PageNavigation prev={nav.prev} next={nav.next} />
        </div>
    );
}
