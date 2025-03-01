import { Skeleton, SVGSkeleton } from "@/modules/skeleton";

export default function PlanningPageSkeleton() {
  return (
    <div className="w-full flex flex-col justify-center gap-4 pt-12 px-12">
      <div className="flex gap-8">
        <div className="relative h-auto">
          <div>
            <SVGSkeleton className="rounded-lg flex-grow-0 transition-opacity w-[350px] h-[350px]" />
          </div>
        </div>
        <div className="py-12">
          <h1>
            <Skeleton className="w-[80px] max-w-full" />
          </h1>
          <h2>
            <Skeleton className="w-[152px] max-w-full" />
          </h2>
          <p></p>
        </div>
      </div>
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
    </div>
  );
}
