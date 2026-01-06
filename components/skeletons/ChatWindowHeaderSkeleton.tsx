import { Skeleton } from "./Skeleton";

export function ChatWindowHeaderSkeleton() {
    return (
        <div className="flex items-center justify-between px-4 py-3 border-b border-(--border-color) bg-(--bg-card)">
            <div className="flex items-center gap-3">
                {/* Back button placeholder (mobile) */}
                <Skeleton className="w-8 h-8 rounded-full md:hidden" />

                {/* Avatar */}
                <Skeleton className="w-10 h-10 rounded-full" />

                {/* User info */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full hidden sm:block" />
                <Skeleton className="w-8 h-8 rounded-full hidden sm:block" />
                <Skeleton className="w-8 h-8 rounded-full" />
            </div>
        </div>
    );
}
