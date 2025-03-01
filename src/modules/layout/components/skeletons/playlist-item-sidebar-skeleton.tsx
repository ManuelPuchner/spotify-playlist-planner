import { Skeleton, SVGSkeleton } from "@/modules/skeleton";

export default function PlaylistItemSidebarSkeleton() {
  return (
    <li className="flex items-center justify-between">
      <a className="flex items-center gap-2">
        <SVGSkeleton className="rounded-md w-[50px] h-[50px]" />
        <Skeleton className="w-[176px] max-w-full" />
      </a>
      <div className="px-3 py-2">
        <SVGSkeleton className="size-6 w-4 h-4" />
      </div>
    </li>
  );
}