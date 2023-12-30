import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-400 mb-4", className)}
      {...props}
    />
  );
}

export { Skeleton };
