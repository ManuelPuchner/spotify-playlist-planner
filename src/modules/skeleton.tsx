// https://gpt-skeleton.vercel.app/generate

const Skeleton = ({ className }: { className: string }) => (
  <div aria-live="polite" aria-busy="true" className={className}>
    <span className="inline-flex w-full h-full animate-pulse select-none rounded-md bg-neutral-800 leading-none">
      ‌
    </span>
    <br />
  </div>
);

const SVGSkeleton = ({ className }: { className: string }) => (
  <svg className={className + " animate-pulse rounded bg-neutral-800"} />
);

export { Skeleton, SVGSkeleton };
