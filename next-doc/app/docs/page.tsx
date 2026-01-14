import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageNavigation } from "@/components/PageNavigation";
import { getNavigation } from "@/lib/navigation";
import { Brain, Mic, Users, Info } from "lucide-react";
import Link from "next/link";

export default function IntroductionPage() {
    const nav = getNavigation("/docs");

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-6">
            <div className="space-y-6">
                <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900">
                        Lexia API
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Production-ready API for AI-powered audio processing and language models.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Link href="/docs/llm/models">
                        <Card className="border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer">
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
                    </Link>
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

                <div className="mt-8">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-4">Quick Start</h2>
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Make your first request</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                                {`curl -X POST https://api.lexia.pro/v1/chat/completions \\
  -H "Authorization: Bearer lx_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "general7Bv2",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`}
                            </pre>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <PageNavigation prev={nav.prev} next={nav.next} />
        </div>
    );
}
