interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${className}`}
        />
    );
}

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

export function ChatMessagesSkeleton() {
    return (
        <div className="flex-1 p-4 space-y-4 overflow-hidden">
            {/* Received message */}
            <div className="flex gap-2 items-start">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="space-y-2 max-w-[70%]">
                    <Skeleton className="h-10 w-48 rounded-2xl" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>

            {/* Sent message */}
            <div className="flex gap-2 items-start justify-end">
                <div className="space-y-2 max-w-[70%]">
                    <Skeleton className="h-10 w-56 rounded-2xl" />
                    <Skeleton className="h-3 w-16 ml-auto" />
                </div>
            </div>

            {/* Received message */}
            <div className="flex gap-2 items-start">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="space-y-2 max-w-[70%]">
                    <Skeleton className="h-16 w-64 rounded-2xl" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>

            {/* Sent message */}
            <div className="flex gap-2 items-start justify-end">
                <div className="space-y-2 max-w-[70%]">
                    <Skeleton className="h-12 w-40 rounded-2xl" />
                    <Skeleton className="h-3 w-16 ml-auto" />
                </div>
            </div>

            {/* Received message */}
            <div className="flex gap-2 items-start">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="space-y-2 max-w-[70%]">
                    <Skeleton className="h-10 w-52 rounded-2xl" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
        </div>
    );
}

// export function ChatWindowHeaderSkeleton() {
//     return (
//         <div className="flex items-center justify-between px-4 py-3 border-b border-(--border-color)">
//             <div className="flex items-center gap-3">
//                 <Skeleton className="w-10 h-10 rounded-full" />
//                 <div className="space-y-2">
//                     <Skeleton className="h-4 w-32" />
//                     <Skeleton className="h-3 w-20" />
//                 </div>
//             </div>
//             <div className="flex items-center gap-2">
//                 <Skeleton className="w-8 h-8 rounded-full" />
//                 <Skeleton className="w-8 h-8 rounded-full" />
//                 <Skeleton className="w-8 h-8 rounded-full" />
//             </div>
//         </div>
//     );
// }
