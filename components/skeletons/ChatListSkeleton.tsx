import { Skeleton } from "./Skeleton";

export function ChatListSkeleton() {
    return (
        <div className="flex-1 overflow-hidden">
            {[...Array(8)].map((_, i) => (
                <div
                    key={i}
                    className="px-4 py-3 flex items-center gap-3 border-b border-(--border-color)/50"
                >
                    {/* Avatar skeleton */}
                    <Skeleton className="w-14 h-14 rounded-full shrink-0" />

                    {/* Content skeleton */}
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-12" />
                        </div>
                        <Skeleton className="h-3 w-48" />
                    </div>
                </div>
            ))}
        </div>
    );
}
