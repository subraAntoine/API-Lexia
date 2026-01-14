import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Mic, Users, Info, Check, Shield, AlertTriangle } from "lucide-react";

export function ApiContent() {
    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-6 space-y-12">
            {/* Introduction */}
            <section id="intro" className="space-y-6">
                <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900">
                        Lexia API
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Production-ready API for AI-powered audio processing and language models.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                                <Brain className="h-4 w-4 text-indigo-600" />
                                LLM
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600">Chat completion with streaming, tool/function calling, multi-model support</p>
                        </CardContent>
                    </Card>
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                                <Mic className="h-4 w-4 text-emerald-600" />
                                Speech-to-Text
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600">Async/sync transcription, word-level timestamps, multi-language</p>
                        </CardContent>
                    </Card>
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                                <Users className="h-4 w-4 text-purple-600" />
                                Diarization
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600">Automatic speaker detection, RTTM output format</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-indigo-200 bg-indigo-50/50 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-indigo-900">OpenAI/Mistral Compatible</p>
                                <p className="text-sm text-indigo-700">The LLM API is compatible with OpenAI/Mistral format for seamless integration with LiteLLM, LangChain and other tools.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Authentication */}
            <section id="auth" className="scroll-mt-10 space-y-6">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Authentication</h2>
                    <p className="text-slate-600">
                        All endpoints require API key authentication. Use the <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-slate-800">Authorization</code> header with Bearer format.
                    </p>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Format</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto">
                            <code className="text-sm font-mono">Authorization: Bearer lx_your_api_key</code>
                        </div>
                        <p className="text-sm text-slate-500">
                            API keys are prefixed with <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono text-slate-700">lx_</code> followed by a secure random string.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Example Request</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                            {`curl -X GET https://api.lexia.pro/v1/models \\
  -H "Authorization: Bearer lx_abc123def456..."
  -H "Content-Type: application/json"`}
                        </pre>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-emerald-200 bg-emerald-50/50 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-emerald-900">Bearer Token Support</p>
                                    <p className="text-sm text-emerald-700">Standard OAuth2 format</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <Shield className="h-5 w-5 text-amber-600 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-amber-900">Secure Storage</p>
                                    <p className="text-sm text-amber-700">Keys are securely hashed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Rate Limits */}
            <section id="rate-limits" className="scroll-mt-10 space-y-6">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Rate Limits</h2>
                    <p className="text-slate-600">
                        Rate limits are applied per API key. Check response headers to monitor your usage.
                    </p>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Response Headers</CardTitle>
                        <CardDescription>Monitor these headers to track your API usage</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">X-RateLimit-Limit</span>
                                <span className="text-sm text-slate-500">integer</span>
                                <span className="text-sm text-slate-600">Requests allowed per minute</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">X-RateLimit-Remaining</span>
                                <span className="text-sm text-slate-500">integer</span>
                                <span className="text-sm text-slate-600">Remaining requests in window</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">X-RateLimit-Reset</span>
                                <span className="text-sm text-slate-500">timestamp</span>
                                <span className="text-sm text-slate-600">Unix timestamp when limit resets</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Example Headers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                            {`HTTP/1.1 200 OK
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1705000060`}
                        </pre>
                    </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50/50 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-red-900">Error 429 - Rate Limit Exceeded</p>
                                <p className="text-sm text-red-700">If you exceed the limit, wait for the counter to reset or contact us to increase your limits.</p>
                                <pre className="bg-red-100 text-red-800 p-3 rounded-lg text-xs font-mono mt-2">
                                    {`{
  "error": {
    "message": "Rate limit exceeded",
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded"
  }
}`}
                                </pre>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* LLM Section */}
            <section id="llm" className="scroll-mt-10 space-y-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">LLM API</h2>
                    <p className="text-slate-600">
                        Endpoints for interacting with Large Language Models. Compatible with OpenAI/Mistral format for seamless integration with LiteLLM.
                    </p>
                </div>
            </section>

            {/* List Models */}
            <section id="models" className="scroll-mt-10 space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">List Models</h2>
                        <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700">GET</Badge>
                    </div>
                    <p className="text-slate-600">Returns the list of available LLM models for inference.</p>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Endpoint</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <code className="text-sm font-mono text-slate-900">/v1/models</code>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Example Request</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                                {`curl -X GET https://api.lexia.pro/v1/models \\
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
  "object": "list",
  "data": [
    {
      "id": "general7Bv2",
      "object": "model",
      "created": 1705000000,
      "owned_by": "lexia",
      "display_name": "General 7B v2",
      "context_length": 8192,
      "capabilities": ["chat"],
      "status": "available"
    }
  ]
}`}
                            </pre>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Get Model Info */}
            <section id="model-info" className="scroll-mt-10 space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Get Model Info</h2>
                        <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700">GET</Badge>
                    </div>
                    <p className="text-slate-600">Récupère les informations détaillées d&apos;un modèle spécifique.</p>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Endpoint</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <code className="text-sm font-mono text-slate-900">/v1/models/{"{model_id}"}</code>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Path Parameters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                            <span className="font-mono text-sm font-medium text-slate-900">model_id</span>
                            <span className="text-sm text-slate-500">Required</span>
                            <span className="text-sm text-slate-600">The model identifier (e.g., &quot;general7Bv2&quot;)</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Response</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`{
  "id": "general7Bv2",
  "object": "model",
  "created": 1705000000,
  "owned_by": "lexia",
  "display_name": "General 7B v2",
  "description": "General purpose 7B model",
  "context_length": 8192,
  "capabilities": ["chat", "completion"],
  "languages": ["en", "fr"],
  "status": "available"
}`}
                        </pre>
                    </CardContent>
                </Card>
            </section>

            {/* Chat Completions */}
            <section id="chat-completions" className="scroll-mt-10 space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Chat Completions</h2>
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">POST</Badge>
                    </div>
                    <p className="text-slate-600">
                        Generate a chat completion response based on conversation history. Supports streaming responses.
                    </p>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Endpoint</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <code className="text-sm font-mono text-slate-900">/v1/chat/completions</code>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Request Body</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">model</span>
                                <span className="text-sm text-red-500 font-medium">Required</span>
                                <span className="text-sm text-slate-600">Model identifier to use (e.g., &quot;general7Bv2&quot;)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">messages</span>
                                <span className="text-sm text-red-500 font-medium">Required</span>
                                <span className="text-sm text-slate-600">Array of messages in the conversation</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">temperature</span>
                                <span className="text-sm text-slate-500">Optional</span>
                                <span className="text-sm text-slate-600">Sampling temperature (0-2). Default: 0.7</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">top_p</span>
                                <span className="text-sm text-slate-500">Optional</span>
                                <span className="text-sm text-slate-600">Nucleus sampling probability (0-1). Default: 1.0</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">max_tokens</span>
                                <span className="text-sm text-slate-500">Optional</span>
                                <span className="text-sm text-slate-600">Maximum tokens to generate (1-32768)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">stream</span>
                                <span className="text-sm text-slate-500">Optional</span>
                                <span className="text-sm text-slate-600">Enable streaming responses. Default: false</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">stop</span>
                                <span className="text-sm text-slate-500">Optional</span>
                                <span className="text-sm text-slate-600">Stop sequences (string or array of strings)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">frequency_penalty</span>
                                <span className="text-sm text-slate-500">Optional</span>
                                <span className="text-sm text-slate-600">Frequency penalty (-2 to 2). Default: 0.0</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">presence_penalty</span>
                                <span className="text-sm text-slate-500">Optional</span>
                                <span className="text-sm text-slate-600">Presence penalty (-2 to 2). Default: 0.0</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">n</span>
                                <span className="text-sm text-slate-500">Optional</span>
                                <span className="text-sm text-slate-600">Number of completions to generate (1-10). Default: 1</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">seed</span>
                                <span className="text-sm text-slate-500">Optional</span>
                                <span className="text-sm text-slate-600">Random seed for reproducibility</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">tools</span>
                                <span className="text-sm text-slate-500">Optional</span>
                                <span className="text-sm text-slate-600">Available tools for function calling</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">tool_choice</span>
                                <span className="text-sm text-slate-500">Optional</span>
                                <span className="text-sm text-slate-600">Tool calling behavior: &quot;auto&quot;, &quot;none&quot;, or &quot;required&quot;</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">response_format</span>
                                <span className="text-sm text-slate-500">Optional</span>
                                <span className="text-sm text-slate-600">Response format: &quot;text&quot;, &quot;json_object&quot;, or &quot;json_schema&quot;</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Message Object</CardTitle>
                        <CardDescription>Structure of messages in the conversation</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">role</span>
                                <span className="text-sm text-red-500 font-medium">Required</span>
                                <span className="text-sm text-slate-600">&quot;system&quot;, &quot;user&quot;, &quot;assistant&quot;, or &quot;tool&quot;</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">content</span>
                                <span className="text-sm text-slate-500">Optional</span>
                                <span className="text-sm text-slate-600">Message content (null for tool calls)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">name</span>
                                <span className="text-sm text-slate-500">Optional</span>
                                <span className="text-sm text-slate-600">Sender name (for multi-user chats)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">tool_calls</span>
                                <span className="text-sm text-slate-500">Optional</span>
                                <span className="text-sm text-slate-600">Tool calls made by assistant</span>
                            </div>
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
                                {`curl -X POST https://api.lexia.pro/v1/chat/completions \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "general7Bv2",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Hello, how are you?"
      }
    ],
    "temperature": 0.7,
    "max_tokens": 1024
  }'`}
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
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1705000000,
  "model": "general7Bv2",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! I'm doing well..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 42,
    "total_tokens": 67
  }
}`}
                            </pre>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Streaming */}
            <section id="streaming" className="scroll-mt-10 space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Streaming Responses</h2>
                        <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">SSE</Badge>
                    </div>
                    <p className="text-slate-600">
                        Enable streaming to receive responses as Server-Sent Events (SSE) for real-time output.
                    </p>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Streaming Request</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`curl -X POST https://api.lexia.pro/v1/chat/completions \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "general7Bv2",
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": true
  }'`}
                        </pre>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Streaming Response Format</CardTitle>
                        <CardDescription>Each chunk is prefixed with &quot;data: &quot; and ends with &quot;[DONE]&quot;</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1705000000,"model":"general7Bv2","choices":[{"index":0,"delta":{"role":"assistant","content":""},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1705000000,"model":"general7Bv2","choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1705000000,"model":"general7Bv2","choices":[{"index":0,"delta":{"content":"!"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1705000000,"model":"general7Bv2","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]`}
                        </pre>
                    </CardContent>
                </Card>
            </section>

            {/* Function Calling */}
            <section id="function-calling" className="scroll-mt-10 space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Function Calling</h2>
                        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">Tools</Badge>
                    </div>
                    <p className="text-slate-600">
                        Define tools that the model can call to perform actions or retrieve information.
                    </p>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Tool Definition Structure</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">type</span>
                                <span className="text-sm text-red-500 font-medium">Required</span>
                                <span className="text-sm text-slate-600">Must be &quot;function&quot;</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">function.name</span>
                                <span className="text-sm text-red-500 font-medium">Required</span>
                                <span className="text-sm text-slate-600">Function name (1-64 chars)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">function.description</span>
                                <span className="text-sm text-slate-500">Optional</span>
                                <span className="text-sm text-slate-600">Description of what the function does</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">function.parameters</span>
                                <span className="text-sm text-slate-500">Optional</span>
                                <span className="text-sm text-slate-600">JSON Schema for function parameters</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Example with Tools</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`{
  "model": "general7Bv2",
  "messages": [
    {"role": "user", "content": "What's the weather in Paris?"}
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Get the current weather",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "City name"
            }
          },
          "required": ["location"]
        }
      }
    }
  ],
  "tool_choice": "auto"
}`}
                        </pre>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Tool Call Response</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`{
  "id": "chatcmpl-abc123",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": null,
        "tool_calls": [
          {
            "id": "call_abc123",
            "type": "function",
            "function": {
              "name": "get_weather",
              "arguments": "{\"location\":\"Paris\"}"
            }
          }
        ]
      },
      "finish_reason": "tool_calls"
    }
  ]
}`}
                        </pre>
                    </CardContent>
                </Card>
            </section>

            {/* Legacy Completions */}
            <section id="completions-legacy" className="scroll-mt-10 space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Completions (Legacy)</h2>
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">POST</Badge>
                        <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">Deprecated</Badge>
                    </div>
                    <p className="text-slate-600">
                        Legacy completion endpoint. Use <code className="bg-slate-100 px-1 py-0.5 rounded text-sm font-mono text-slate-800">/v1/chat/completions</code> instead.
                    </p>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Endpoint</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <code className="text-sm font-mono text-slate-900">/v1/completions</code>
                        <p className="text-sm text-orange-600 mt-2">⚠️ This endpoint is deprecated and may be removed in future versions.</p>
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
                        <Badge variant="destructive" className="w-16 justify-center">400</Badge>
                        <span className="text-sm text-slate-700">Bad Request - Invalid request body or parameters</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="destructive" className="w-16 justify-center">401</Badge>
                        <span className="text-sm text-slate-700">Unauthorized - Invalid API Key</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="destructive" className="w-16 justify-center">404</Badge>
                        <span className="text-sm text-slate-700">Not Found - Model not found</span>
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
