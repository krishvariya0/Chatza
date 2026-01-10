/**
 * Fetch wrapper with automatic error handling
 * Use this to replace standard fetch calls throughout your application
 */

import { handleApiResponse } from './errorHandler';

export interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

/**
 * Enhanced fetch with automatic error parsing and JSON response handling
 */
export async function apiFetch<T = unknown>(
    url: string,
    options?: FetchOptions
): Promise<T> {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...options?.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers: defaultHeaders,
    });

    return handleApiResponse<T>(response);
}

/**
 * Convenience methods for different HTTP methods
 */
export const api = {
    get: <T = unknown>(url: string, options?: FetchOptions) =>
        apiFetch<T>(url, { ...options, method: 'GET' }),

    post: <T = unknown>(url: string, body?: unknown, options?: FetchOptions) =>
        apiFetch<T>(url, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        }),

    put: <T = unknown>(url: string, body?: unknown, options?: FetchOptions) =>
        apiFetch<T>(url, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        }),

    patch: <T = unknown>(url: string, body?: unknown, options?: FetchOptions) =>
        apiFetch<T>(url, {
            ...options,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        }),

    delete: <T = unknown>(url: string, options?: FetchOptions) =>
        apiFetch<T>(url, { ...options, method: 'DELETE' }),
};

/**
 * Example usage:
 * 
 * Instead of:
 * ```tsx
 * const response = await fetch('/api/users', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify(userData),
 * });
 * const data = await response.json();
 * ```
 * 
 * Use:
 * ```tsx
 * import { api } from '@/lib/apiFetch';
 * import { useErrorHandler } from '@/hooks/useErrorHandler';
 * 
 * function MyComponent() {
 *   const { showSuccess, handleError } = useErrorHandler();
 * 
 *   const createUser = async () => {
 *     try {
 *       const data = await api.post('/api/users', userData);
 *       showSuccess('User created successfully!');
 *       return data;
 *     } catch (error) {
 *       handleError(error);
 *     }
 *   };
 * 
 *   // Or with loading toast:
 *   const createUserWithLoading = async () => {
 *     await withLoadingToast(
 *       api.post('/api/users', userData),
 *       {
 *         loading: 'Creating user...',
 *         success: 'User created!',
 *         error: 'Failed to create user',
 *       }
 *     );
 *   };
 * }
 * ```
 */
