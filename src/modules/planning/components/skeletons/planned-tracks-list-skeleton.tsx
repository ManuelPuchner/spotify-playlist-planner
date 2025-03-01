import { Skeleton, SVGSkeleton } from "@/modules/skeleton";

export default function PlannedTracksListSkeleton() {
  return (
    <div>
      <h3>
        <Skeleton className="w-[112px] h-8 mb-2 max-w-full" />
      </h3>
      <ul className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <li className="flex items-center gap-4" key={i}>
            <SVGSkeleton className="rounded-md w-[50px] h-[50px]" />
            <div>
              <p>
                <Skeleton className="w-[104px] max-w-full" />
              </p>
              <div className="flex">
                <a>
                  <span>
                    <Skeleton className="w-[40px] opacity-50 max-w-full" />
                  </span>
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
