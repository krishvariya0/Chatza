import Link from "next/link";
import { IoReturnDownBack } from "react-icons/io5";

const HomeBackButton = () => {
    return (
        <Link
            href="/"
            aria-label="Back to home"
            className="
        inline-flex items-center gap-2
        rounded-lg border
        px-3 py-2
        text-sm font-medium
        transition
        bg-[var(--back-btn-bg)]
        text-[var(--back-btn-text)]
        border-[var(--back-btn-border)]
        hover:bg-[var(--back-btn-hover-bg)]
        focus:outline-none
        focus:ring-2
        focus:ring-[var(--btn-bg)]
        focus:ring-offset-2
        focus:ring-offset-[var(--card-bg)]
      "
        >
            <IoReturnDownBack className="text-base shrink-0" />
            <span>Back to Home</span>
        </Link>
    );
};

export default HomeBackButton;
