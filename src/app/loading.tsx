import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-8 w-72" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
