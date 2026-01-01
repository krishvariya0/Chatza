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
