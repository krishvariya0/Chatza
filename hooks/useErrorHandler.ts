import {
    AppError,
    safeApiCall,
    showErrorToast,
    showInfoToast,
    showLoadingToast,
    showSuccessToast,
    showWarningToast,
} from '@/lib/errorHandler';
import { useCallback } from 'react';

/**
 * Custom hook for error handling with toast notifications
 */
export function useErrorHandler() {
    const handleError = useCallback((error: unknown, customMessage?: string) => {
        showErrorToast(error, customMessage);
    }, []);

    const showSuccess = useCallback((message: string) => {
        showSuccessToast(message);
    }, []);

    const showInfo = useCallback((message: string) => {
        showInfoToast(message);
    }, []);

    const showWarning = useCallback((message: string) => {
        showWarningToast(message);
    }, []);

    const withLoadingToast = useCallback(
        <T,>(
            promise: Promise<T>,
            messages: {
                loading: string;
                success: string;
                error?: string;
            }
        ) => {
            return showLoadingToast(promise, messages);
        },
        []
    );

    const safeCall = useCallback(
        async <T,>(
            apiCall: () => Promise<T>,
            options?: {
                showErrorToast?: boolean;
                customErrorMessage?: string;
                onError?: (error: AppError) => void;
                onSuccess?: (data: T) => void;
            }
        ): Promise<T | null> => {
            return safeApiCall(apiCall, options);
        },
        []
    );

    return {
        handleError,
        showSuccess,
        showInfo,
        showWarning,
        withLoadingToast,
        safeCall,
    };
}

/**
 * Example usage in a component:
 * 
 * ```tsx
 * function MyComponent() {
 *   const { handleError, showSuccess, withLoadingToast, safeCall } = useErrorHandler();
 * 
 *   // Example 1: Simple error handling
 *   const handleSubmit = async () => {
 *     try {
 *       const response = await fetch('/api/submit');
 *       if (!response.ok) throw new Error('Failed to submit');
 *       showSuccess('Submitted successfully!');
 *     } catch (error) {
 *       handleError(error, 'Failed to submit form');
 *     }
 *   };
 * 
 *   // Example 2: With loading toast
 *   const handleDelete = async () => {
 *     await withLoadingToast(
 *       fetch('/api/delete').then(r => r.json()),
 *       {
 *         loading: 'Deleting...',
 *         success: 'Deleted successfully!',
 *         error: 'Failed to delete',
 *       }
 *     );
 *   };
 * 
 *   // Example 3: Safe API call
 *   const loadData = async () => {
 *     const data = await safeCall(
 *       () => fetch('/api/data').then(r => r.json()),
 *       {
 *         onSuccess: (data) => console.log('Loaded:', data),
 *         customErrorMessage: 'Failed to load data',
 *       }
 *     );
 *     return data;
 *   };
 * 
 *   return <div>...</div>;
 * }
 * ```
 */
