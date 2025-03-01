import PlaylistItemSidebarSkeleton from "./playlist-item-sidebar-skeleton";

export default function PlaylistListSkeleton() {
  // return 20 divs
  return (
    <div className="flex flex-auto flex-col pb-4">
      <input
        type="text"
        placeholder="Search"
        className="w-full px-2 py-1 rounded-lg border-none bg-neutral-800 mb-4"
      />
      <div
        className={`min-h-0 flex-1 flex overflow-y-auto
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-neutral-800
            [&::-webkit-scrollbar-thumb]:bg-neutral-600
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-thumb]:rounded-full`}
      >
        <ul
          className={` flex-1 h-0
         flex flex-col gap-2 bg-red-500
            `}
        >
          {Array.from({ length: 20 }).map((_, index) => {
            return <PlaylistItemSidebarSkeleton key={index} />;
          })}
        </ul>
      </div>
    </div>
  );
}
