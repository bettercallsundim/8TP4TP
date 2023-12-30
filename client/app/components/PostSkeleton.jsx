import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";

const PostSkeleton = memo(() => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 shrink-0	">
        <Skeleton className="h-12 w-12 rounded-full shrink-0	" />
        <div className="space-y-2 w-full shrink-0	">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="ml-14">
        <Skeleton className="h-[250px] w-full shrink-0	" />
      </div>
    </div>
  );
});

export default PostSkeleton;
