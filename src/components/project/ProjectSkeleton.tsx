// Shared loading shell for project pages, shown while the URL-specific content streams in.
export function ProjectSkeleton() {
  const bar = "animate-pulse rounded-lg bg-panel-2";
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-14" aria-busy="true">
      <div className={`${bar} h-4 w-20`} />
      <div className={`${bar} h-5 w-32`} />
      <div className={`${bar} h-12 w-2/3`} />
      <div className={`${bar} h-5 w-1/2`} />
      <div className="toon mt-6 aspect-video w-full animate-pulse rounded-2xl bg-panel" />
    </div>
  );
}
