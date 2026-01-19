import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageNavigation } from "@/components/PageNavigation";
import { getNavigation } from "@/lib/navigation";
import { API_URL } from "@/lib/config";

export default function ChatCompletionsPage() {
    const nav = getNavigation("/docs/llm/chat-completions");

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Chat Completions</h1>
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
                                <span className="text-sm text-slate-600">Model identifier (e.g., &quot;general7Bv2&quot;)</span>
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
                                <span className="text-sm text-slate-600">Stop sequences (string or array)</span>
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
                                <span className="font-mono text-sm font-medium text-slate-900">tools</span>
                                <span className="text-sm text-slate-500">Optional</span>
                                <span className="text-sm text-slate-600">Available tools for function calling</span>
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
                                {`curl -X POST ${API_URL}/v1/chat/completions \\
  -H "Authorization: Bearer lx_abc123..." \\
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
            </div>

            <PageNavigation prev={nav.prev} next={nav.next} />
        </div>
    );
}
