import { Skeleton, SVGSkeleton } from "@/modules/skeleton";

export default function ProfileCardSkeleton() {
  return (
    <div className="bottom">
      <div className="flex items-center gap-4">
        <SVGSkeleton className="rounded-full w-[50px] h-[50px]" />
        <h4>
          <Skeleton className="w-[112px] max-w-full" />
        </h4>
      </div>
    </div>
  );
}