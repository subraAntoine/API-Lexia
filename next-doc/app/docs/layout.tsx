import { ApiSidebar } from "@/components/ApiSidebar";

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen width-full bg-white">
            <ApiSidebar />
            <main className="flex-1 ml-64">
                {children}
            </main>
        </div>
    );
}
