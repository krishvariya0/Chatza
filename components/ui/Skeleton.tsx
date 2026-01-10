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

export function ProfileSkeleton() {
    return (
        <div className="max-w-4xl mx-auto w-full animate-pulse">
            {/* Cover */}
            <div className="h-48 sm:h-64 bg-(--border-color) rounded-b-3xl" />

            <div className="px-4 sm:px-6 relative">
                {/* Avatar */}
                <div className="flex justify-center sm:justify-start -mt-16 sm:-mt-20 mb-6">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-(--border-color) border-4 border-(--bg-card)" />
                </div>

                {/* Card */}
                <div className="bg-(--bg-card) rounded-3xl border border-(--border-color) shadow-xl p-6 sm:p-8">
                    {/* Name */}
                    <div className="h-6 w-48 bg-(--border-color) rounded mb-2 mx-auto sm:mx-0" />
                    <div className="h-4 w-32 bg-(--border-color) rounded mb-4 mx-auto sm:mx-0" />

                    {/* Bio */}
                    <div className="space-y-2 mb-4">
                        <div className="h-4 w-full bg-(--border-color) rounded" />
                        <div className="h-4 w-4/5 bg-(--border-color) rounded" />
                    </div>

                    {/* Info row */}
                    <div className="flex gap-4 mb-6 justify-center sm:justify-start">
                        <div className="h-4 w-24 bg-(--border-color) rounded" />
                        <div className="h-4 w-24 bg-(--border-color) rounded" />
                        <div className="h-4 w-24 bg-(--border-color) rounded" />
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 justify-center sm:justify-start mb-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-6 w-20 bg-(--border-color) rounded" />
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6 mb-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-5 w-20 bg-(--border-color) rounded" />
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div
                                key={i}
                                className="aspect-square rounded-xl bg-(--border-color)"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function EditProfileSkeleton() {
    return (
        <div className="min-h-screen bg-(--bg-primary) flex animate-pulse">
            {/* Sidebar skeleton */}
            <div className="hidden lg:block w-64 border-r border-(--border-color) bg-(--bg-card)">
                <div className="p-6 space-y-4">
                    <div className="h-10 w-10 rounded-full bg-(--border-color)" />
                    <div className="h-4 w-32 bg-(--border-color) rounded" />
                    <div className="h-3 w-24 bg-(--border-color) rounded" />

                    <div className="mt-8 space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="h-4 w-full bg-(--border-color) rounded"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Back button */}
                    <div className="h-4 w-24 bg-(--border-color) rounded mb-6" />

                    {/* Card */}
                    <div className="bg-(--bg-card) rounded-3xl border border-(--border-color) shadow-xl p-6 sm:p-8">
                        {/* Header */}
                        <div className="mb-6 space-y-2">
                            <div className="h-7 w-48 bg-(--border-color) rounded" />
                            <div className="h-4 w-40 bg-(--border-color) rounded" />
                        </div>

                        {/* Profile picture */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-24 h-24 rounded-full bg-(--border-color)" />
                            <div className="h-9 w-32 bg-(--border-color) rounded-lg" />
                        </div>

                        {/* Inputs */}
                        <div className="space-y-6">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 w-24 bg-(--border-color) rounded" />
                                    <div className="h-11 w-full bg-(--border-color) rounded-xl" />
                                </div>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-6">
                            <div className="h-12 flex-1 bg-(--border-color) rounded-xl" />
                            <div className="h-12 w-28 bg-(--border-color) rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
