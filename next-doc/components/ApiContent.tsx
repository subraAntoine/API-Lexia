import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ApiContent() {
    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-6 space-y-12">
            {/* Introduction */}
            <section id="intro" className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900">
                    API Documentation
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                    Welcome to the Lexia API documentation. Our API allows you to integrate powerful speech-to-text and LLM capabilities directly into your applications.
                </p>
            </section>

            {/* Authentication */}
            <section id="auth" className="scroll-mt-10 space-y-6">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Authentication</h2>
                    <p className="text-slate-600">
                        Authenticate your requests using the <code className="bg-slate-100 px-1 py-0.5 rounded text-sm font-mono text-slate-800">X-API-Key</code> header.
                    </p>
                </div>
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Example Request</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                            <code>curl -H "X-API-Key: YOUR_API_KEY" https://api.lexia.pro/v1/models</code>
                        </pre>
                    </CardContent>
                </Card>
            </section>

            {/* Models */}
            <section id="models" className="scroll-mt-10 space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">List Models</h2>
                        <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700">GET</Badge>
                    </div>
                    <p className="text-slate-600">Retrieve a list of available AI models.</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Endpoint</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <code className="text-sm font-mono text-slate-900">/v1/models</code>
                        </CardContent>
                    </Card>
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Response</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                                {`{
  "data": [
    {
      "id": "mistral-7b",
      "object": "model",
      "owned_by": "lexia"
    }
  ]
}`}
                            </pre>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Transcribe */}
            <section id="transcribe" className="scroll-mt-10 space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Transcribe Audio</h2>
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">POST</Badge>
                    </div>
                    <p className="text-slate-600">Convert audio files to text using Whisper models.</p>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Parameters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">file</span>
                                <span className="text-sm text-slate-500">Required</span>
                                <span className="text-sm text-slate-600">The audio file to transcribe.</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">model</span>
                                <span className="text-sm text-slate-500">Optional</span>
                                <span className="text-sm text-slate-600">ID of the model to use.</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Errors */}
            <section id="errors" className="scroll-mt-10 space-y-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Errors</h2>
                <p className="text-slate-600">
                    The API uses standard HTTP status codes to indicate the success or failure of requests.
                </p>
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <Badge variant="destructive" className="w-16 justify-center">401</Badge>
                        <span className="text-sm text-slate-700">Unauthorized - Invalid API Key</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="destructive" className="w-16 justify-center">429</Badge>
                        <span className="text-sm text-slate-700">Too Many Requests - Rate limit exceeded</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="destructive" className="w-16 justify-center">500</Badge>
                        <span className="text-sm text-slate-700">Internal Server Error - Something went wrong on our end</span>
                    </div>
                </div>
            </section>

        </div>
    );
}
