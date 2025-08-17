import { cn } from "@/lib/utils";

export function IconCircleWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-muted rounded-full p-2", className)}>{children}</div>
  );
}
