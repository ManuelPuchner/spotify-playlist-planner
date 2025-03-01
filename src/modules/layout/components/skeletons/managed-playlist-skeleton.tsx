import PlaylistItemSidebarSkeleton from "./playlist-item-sidebar-skeleton";

export default function ManagedPlaylistSkeleton() {
  return (
    <ul className="flex flex-col gap-2">
      {Array.from({ length: 4 }).map((_, index) => {
        return <PlaylistItemSidebarSkeleton key={index} />;
      })}
    </ul>
  );
}
