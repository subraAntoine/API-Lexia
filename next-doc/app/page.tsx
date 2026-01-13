import { ApiSidebar } from "@/components/ApiSidebar";
import { ApiContent } from "@/components/ApiContent";

export default function Home() {
  return (
    <div className="flex min-h-screen width-full bg-white">
      <ApiSidebar />
      <main className="flex-1 ml-64">
        <ApiContent />
      </main>
    </div>
  );
}
