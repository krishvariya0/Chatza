import toast from 'react-hot-toast';

/**
 * Error types for better error categorization
 */
export enum ErrorType {
    NETWORK = 'NETWORK',
    VALIDATION = 'VALIDATION',
    AUTHENTICATION = 'AUTHENTICATION',
    AUTHORIZATION = 'AUTHORIZATION',
    NOT_FOUND = 'NOT_FOUND',
    SERVER = 'SERVER',
    UNKNOWN = 'UNKNOWN',
}

/**
 * Custom Error class with additional metadata
 */
export class AppError extends Error {
    type: ErrorType;
    statusCode?: number;
    details?: unknown;

    constructor(
        message: string,
        type: ErrorType = ErrorType.UNKNOWN,
        statusCode?: number,
        details?: unknown
    ) {
        super(message);
        this.name = 'AppError';
        this.type = type;
        this.statusCode = statusCode;
        this.details = details;
    }
}

/**
 * Parse error and determine error type
 */
export function parseError(error: unknown): AppError {
    // Already an AppError
    if (error instanceof AppError) {
        return error;
    }

    // Network/Fetch errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
        return new AppError(
            'Network error. Please check your internet connection.',
            ErrorType.NETWORK
        );
    }

    // Standard Error
    if (error instanceof Error) {
        return new AppError(error.message, ErrorType.UNKNOWN);
    }

    // API Response errors
    if (typeof error === 'object' && error !== null) {
        const err = error as Record<string, unknown>;

        const message = (err.message || err.error || 'An unexpected error occurred') as string;
        const statusCode = err.statusCode as number | undefined;

        let type = ErrorType.UNKNOWN;

        if (statusCode) {
            if (statusCode === 401) type = ErrorType.AUTHENTICATION;
            else if (statusCode === 403) type = ErrorType.AUTHORIZATION;
            else if (statusCode === 404) type = ErrorType.NOT_FOUND;
            else if (statusCode === 400 || statusCode === 422) type = ErrorType.VALIDATION;
            else if (statusCode >= 500) type = ErrorType.SERVER;
        }

        return new AppError(message, type, statusCode, err.details);
    }

    // Fallback
    return new AppError('An unexpected error occurred', ErrorType.UNKNOWN);
}

/**
 * User-friendly error messages based on error type
 */
export function getUserFriendlyMessage(error: AppError): string {
    switch (error.type) {
        case ErrorType.NETWORK:
            return 'Unable to connect. Please check your internet connection and try again.';

        case ErrorType.AUTHENTICATION:
            return 'Your session has expired. Please log in again.';

        case ErrorType.AUTHORIZATION:
            return 'You don\'t have permission to perform this action.';

        case ErrorType.NOT_FOUND:
            return 'The requested resource was not found.';

        case ErrorType.VALIDATION:
            return error.message || 'Please check your input and try again.';

        case ErrorType.SERVER:
            return 'Server error. Please try again later.';

        case ErrorType.UNKNOWN:
        default:
            return error.message || 'Something went wrong. Please try again.';
    }
}

/**
 * Show error toast with appropriate styling
 */
export function showErrorToast(error: unknown, customMessage?: string): void {
    const appError = parseError(error);
    const message = customMessage || getUserFriendlyMessage(appError);

    toast.error(message, {
        duration: 4000,
        position: 'bottom-right',
        icon: '❌',
        style: {
            background: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #fecaca',
        },
    });

    // Log to console for debugging
    console.error('[Error Handler]:', appError);
}

/**
 * Show success toast
 */
export function showSuccessToast(message: string): void {
    toast.success(message, {
        duration: 3000,
        position: 'bottom-right',
        icon: '✅',
        style: {
            background: '#dcfce7',
            color: '#166534',
            border: '1px solid #bbf7d0',
        },
    });
}

/**
 * Show info toast
 */
export function showInfoToast(message: string): void {
    toast(message, {
        duration: 3000,
        position: 'bottom-right',
        icon: 'ℹ️',
        style: {
            background: '#dbeafe',
            color: '#1e40af',
            border: '1px solid #bfdbfe',
        },
    });
}

/**
 * Show warning toast
 */
export function showWarningToast(message: string): void {
    toast(message, {
        duration: 3500,
        position: 'bottom-right',
        icon: '⚠️',
        style: {
            background: '#fef3c7',
            color: '#92400e',
            border: '1px solid #fde68a',
        },
    });
}

/**
 * Show loading toast with promise
 */
export function showLoadingToast<T>(
    promise: Promise<T>,
    messages: {
        loading: string;
        success: string;
        error?: string;
    }
): Promise<T> {
    return toast.promise(
        promise,
        {
            loading: messages.loading,
            success: messages.success,
            error: (err) => {
                const appError = parseError(err);
                return messages.error || getUserFriendlyMessage(appError);
            },
        },
        {
            style: {
                minWidth: '250px',
            },
            success: {
                duration: 3000,
                icon: '✅',
            },
            error: {
                duration: 4000,
                icon: '❌',
            },
        }
    );
}

/**
 * Handle API errors consistently
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let errorData;

        try {
            errorData = await response.json();
        } catch {
            errorData = { message: response.statusText };
        }

        throw new AppError(
            errorData.message || errorData.error || 'Request failed',
            ErrorType.UNKNOWN,
            response.status,
            errorData
        );
    }

    return response.json();
}

/**
 * Wrapper for API calls with automatic error handling
 */
export async function safeApiCall<T>(
    apiCall: () => Promise<T>,
    options?: {
        showErrorToast?: boolean;
        customErrorMessage?: string;
        onError?: (error: AppError) => void;
        onSuccess?: (data: T) => void;
    }
): Promise<T | null> {
    try {
        const result = await apiCall();
        options?.onSuccess?.(result);
        return result;
    } catch (error) {
        const appError = parseError(error);

        if (options?.showErrorToast !== false) {
            showErrorToast(appError, options?.customErrorMessage);
        }

        options?.onError?.(appError);

        return null;
    }
}
