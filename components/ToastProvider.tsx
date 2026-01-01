'use client';

import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function ToastProvider() {
    // Clear any stuck toasts on mount
    useEffect(() => {
        toast.dismiss();

        // Clear stuck toasts on visibility change (when user returns to tab)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // Clear any toasts that might be stuck
                const stuckToasts = document.querySelectorAll('.Toastify__toast');
                if (stuckToasts.length > 5) {
                    toast.dismiss();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <ToastContainer
            position="bottom-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick={true}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={true}
            pauseOnHover={true}
            theme="colored"
            limit={3}
            stacked={false}
            containerId="main-toast-container"
        />
    );
}
