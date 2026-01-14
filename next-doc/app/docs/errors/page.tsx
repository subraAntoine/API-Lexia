import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageNavigation } from "@/components/PageNavigation";
import { getNavigation } from "@/lib/navigation";

export default function ErrorsPage() {
    const nav = getNavigation("/docs/errors");

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Error Codes</h1>
                    <p className="text-slate-600">
                        The API uses standard HTTP status codes to indicate the success or failure of requests.
                    </p>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">HTTP Status Codes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className="w-16 justify-center border-emerald-200 bg-emerald-50 text-emerald-700">200</Badge>
                                <span className="text-sm text-slate-700">OK - Request successful</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="destructive" className="w-16 justify-center">400</Badge>
                                <span className="text-sm text-slate-700">Bad Request - Invalid request body or parameters</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="destructive" className="w-16 justify-center">401</Badge>
                                <span className="text-sm text-slate-700">Unauthorized - Invalid or missing API key</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="destructive" className="w-16 justify-center">403</Badge>
                                <span className="text-sm text-slate-700">Forbidden - API key doesn&apos;t have access to this resource</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="destructive" className="w-16 justify-center">404</Badge>
                                <span className="text-sm text-slate-700">Not Found - Resource not found</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="destructive" className="w-16 justify-center">422</Badge>
                                <span className="text-sm text-slate-700">Unprocessable Entity - Validation error</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="destructive" className="w-16 justify-center">429</Badge>
                                <span className="text-sm text-slate-700">Too Many Requests - Rate limit exceeded</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="destructive" className="w-16 justify-center">500</Badge>
                                <span className="text-sm text-slate-700">Internal Server Error - Something went wrong on our end</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="destructive" className="w-16 justify-center">503</Badge>
                                <span className="text-sm text-slate-700">Service Unavailable - Server is temporarily unavailable</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Error Response Format</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                            {`{
  "error": {
    "message": "Invalid value for 'model': model 'unknown' not found.",
    "type": "invalid_request_error",
    "param": "model",
    "code": "model_not_found"
  }
}`}
                        </pre>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Error Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">invalid_request_error</span>
                                <span className="text-sm text-slate-600">Invalid parameters or request format</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">authentication_error</span>
                                <span className="text-sm text-slate-600">Invalid or missing API key</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">rate_limit_error</span>
                                <span className="text-sm text-slate-600">Rate limit exceeded</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">server_error</span>
                                <span className="text-sm text-slate-600">Internal server error</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">api_error</span>
                                <span className="text-sm text-slate-600">General API error</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Common Error Codes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">invalid_api_key</span>
                                <span className="text-sm text-slate-600">The API key provided is invalid</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">model_not_found</span>
                                <span className="text-sm text-slate-600">The specified model does not exist</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">rate_limit_exceeded</span>
                                <span className="text-sm text-slate-600">Too many requests in a short period</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                                <span className="font-mono text-sm font-medium text-slate-900">context_length_exceeded</span>
                                <span className="text-sm text-slate-600">Input exceeds model&apos;s max context length</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <span className="font-mono text-sm font-medium text-slate-900">invalid_request</span>
                                <span className="text-sm text-slate-600">Malformed request body</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <PageNavigation prev={nav.prev} next={nav.next} />
        </div>
    );
}
