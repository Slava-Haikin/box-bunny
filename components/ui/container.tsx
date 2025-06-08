import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("py-4 px-6 max-w-7xl mx-auto", className)}>
      {children}
    </div>
  );
}
