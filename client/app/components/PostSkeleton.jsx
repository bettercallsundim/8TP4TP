import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";

const PostSkeleton = memo(() => {
  return (
    <div className="flex flex-col max-w-[300px] min-h-[300px]  px-6 py-8">
      <div className="flex items-center gap-2 shrink-0	">
        <Skeleton className="w-[50px] h-[50px] rounded-full shrink-0	" />
        <div className=" w-full shrink-0	">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="ml-14">
        <Skeleton className="h-[250px] w-[250px] shrink-0	" />
      </div>
    </div>
  );
});

export default PostSkeleton;
