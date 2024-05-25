import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";

const PostSkeleton = memo(() => {
  return (
    <div className="max-w-[300px] min-h-[300px] rounded-lg px-6 py-8 bg-bng text-text mb-8 boxshadow flex flex-col relative ">
      <div className="flex items-center gap-2">
        <Skeleton className="h-[50px] w-[50px] rounded-full shrink-0" />
        <div className="w-full">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div>
        <Skeleton className="h-[200px] w-full" />
      </div>
    </div>
  );
});

export default PostSkeleton;
