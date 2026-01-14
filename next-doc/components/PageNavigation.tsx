import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PageNavigationProps {
    prev?: {
        title: string;
        href: string;
    };
    next?: {
        title: string;
        href: string;
    };
}

export function PageNavigation({ prev, next }: PageNavigationProps) {
    return (
        <div className="flex items-center justify-between mt-16 pt-8 border-t border-slate-200">
            {prev ? (
                <Link
                    href={prev.href}
                    className="group flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    <div className="flex flex-col items-start">
                        <span className="text-xs text-slate-400 uppercase tracking-wider">Previous</span>
                        <span>{prev.title}</span>
                    </div>
                </Link>
            ) : (
                <div />
            )}
            {next ? (
                <Link
                    href={next.href}
                    className="group flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors text-right"
                >
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-slate-400 uppercase tracking-wider">Next</span>
                        <span>{next.title}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </Link>
            ) : (
                <div />
            )}
        </div>
    );
}
