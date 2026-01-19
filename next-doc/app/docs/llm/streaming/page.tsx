import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageNavigation } from "@/components/PageNavigation";
import { getNavigation } from "@/lib/navigation";
import { API_URL } from "@/lib/config";

export default function StreamingPage() {
    const nav = getNavigation("/docs/llm/streaming");

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Streaming Responses</h1>
                        <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">SSE</Badge>
                    </div>
                    <p className="text-slate-600">
                        Enable streaming to receive responses as Server-Sent Events (SSE) for real-time output.
                    </p>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">How to Enable</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-600 mb-4">
                            Set <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-slate-800">stream: true</code> in your request body to receive streaming responses.
                        </p>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`curl -X POST ${API_URL}/v1/chat/completions \\
  -H "Authorization: Bearer lx_abc123..." \\
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
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Response Format</CardTitle>
                        <CardDescription>Each chunk is prefixed with &quot;data: &quot; and the stream ends with &quot;[DONE]&quot;</CardDescription>
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

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Chunk Object</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">id</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">Unique completion ID (same for all chunks)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">object</span>
                                <span className="text-sm text-slate-500">string</span>
                                <span className="text-sm text-slate-600">Always &quot;chat.completion.chunk&quot;</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">delta</span>
                                <span className="text-sm text-slate-500">object</span>
                                <span className="text-sm text-slate-600">Incremental content (role, content, tool_calls)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">finish_reason</span>
                                <span className="text-sm text-slate-500">string | null</span>
                                <span className="text-sm text-slate-600">&quot;stop&quot;, &quot;length&quot;, &quot;tool_calls&quot; or null</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">JavaScript Example</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`const response = await fetch('${API_URL}/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer lx_abc123...',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'general7Bv2',
    messages: [{ role: 'user', content: 'Hello!' }],
    stream: true,
  }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\\n').filter(line => line.startsWith('data: '));
  
  for (const line of lines) {
    const data = line.slice(6);
    if (data === '[DONE]') break;
    
    const parsed = JSON.parse(data);
    const content = parsed.choices[0]?.delta?.content || '';
    process.stdout.write(content);
  }
}`}
                        </pre>
                    </CardContent>
                </Card>
            </div>

            <PageNavigation prev={nav.prev} next={nav.next} />
        </div>
    );
}
