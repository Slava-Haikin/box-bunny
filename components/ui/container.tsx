import { cn } from "@/lib/utils";

export function Container ({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("p-4 max-w-7xl mx-auto", className)}>
            {children}
        </div>
    )
}