interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
    return (
        <div
            className={`bg-gray-50 dark:bg-gray-700 rounded ${className}`}
            style={{ opacity: 0.5 }}
        />
    );
}
