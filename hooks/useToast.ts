'use client';

import { showToast } from '@/lib/toast';
import { useEffect, useRef } from 'react';

/**
 * Custom hook to manage toasts with automatic cleanup
 * Prevents stuck toasts by tracking and dismissing them on unmount
 */
export function useToast() {
    const toastIds = useRef<Set<string>>(new Set());

    // Track toast IDs
    const trackToast = (id: string) => {
        toastIds.current.add(id);
    };

    // Cleanup all toasts on unmount
    useEffect(() => {
        return () => {
            // Dismiss all tracked toasts when component unmounts
            toastIds.current.forEach((id) => {
                showToast.dismiss(id);
            });
            toastIds.current.clear();
        };
    }, []);

    return {
        success: (msg: string) => {
            const id = showToast.success(msg);
            trackToast(id);
            return id;
        },
        error: (msg: string) => {
            const id = showToast.error(msg);
            trackToast(id);
            return id;
        },
        warning: (msg: string) => {
            const id = showToast.warning(msg);
            trackToast(id);
            return id;
        },
        info: (msg: string) => {
            const id = showToast.info(msg);
            trackToast(id);
            return id;
        },
        loading: (msg: string) => {
            const id = showToast.loading(msg);
            trackToast(id);
            return id;
        },
        promise: <T,>(
            promise: Promise<T>,
            messages: { pending: string; success: string; error: string }
        ) => {
            return showToast.promise(promise, messages);
        },
        dismiss: (id?: string) => {
            if (id) {
                toastIds.current.delete(id);
                showToast.dismiss(id);
            } else {
                toastIds.current.clear();
                showToast.dismissAll();
            }
        },
        dismissAll: () => {
            toastIds.current.clear();
            showToast.dismissAll();
        },
    };
}
