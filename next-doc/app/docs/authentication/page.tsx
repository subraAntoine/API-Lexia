import { Card, CardContent } from "@/components/ui/card";
import { PageNavigation } from "@/components/PageNavigation";
import { getNavigation } from "@/lib/navigation";
import { Check, Shield } from "lucide-react";

export default function AuthenticationPage() {
    const nav = getNavigation("/docs/authentication");

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Authentication</h1>
                    <p className="text-slate-600">
                        All endpoints require API key authentication. Use the <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-slate-800">Authorization</code> header with Bearer format.
                    </p>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="pt-6 space-y-4">
                        <h3 className="text-sm font-medium uppercase tracking-wider text-slate-500">Format</h3>
                        <div className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto">
                            <code className="text-sm font-mono">Authorization: Bearer lx_your_api_key</code>
                        </div>
                        <p className="text-sm text-slate-500">
                            API keys are prefixed with <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono text-slate-700">lx_</code> followed by a secure random string.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="pt-6 space-y-4">
                        <h3 className="text-sm font-medium uppercase tracking-wider text-slate-500">Example Request</h3>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                            {`curl -X GET https://api.lexia.pro/v1/models \\
  -H "Authorization: Bearer lx_abc123def456..." \\
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
            </div>

            <PageNavigation prev={nav.prev} next={nav.next} />
        </div>
    );
}
