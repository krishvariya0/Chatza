
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
