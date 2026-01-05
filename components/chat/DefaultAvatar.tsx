export default function DefaultAvatar({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="100" height="100" fill="#E5E7EB" rx="50" />
            <circle cx="50" cy="35" r="15" fill="#9CA3AF" />
            <path
                d="M50 55C30 55 25 70 25 75C25 80 25 100 50 100C75 100 75 80 75 75C75 70 70 55 50 55Z"
                fill="#9CA3AF"
            />
        </svg>
    );
}
