import { Skeleton } from "./Skeleton";

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
