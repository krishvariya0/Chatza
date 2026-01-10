'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
    return (
        <Toaster
            position="bottom-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                // Default options
                duration: 3000,
                style: {
                    background: '#363636',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    maxWidth: '500px',
                },

                // Success toast styling
                success: {
                    duration: 3000,
                    iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff',
                    },
                    style: {
                        background: '#dcfce7',
                        color: '#166534',
                        border: '1px solid #bbf7d0',
                    },
                },

                // Error toast styling
                error: {
                    duration: 4000,
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                    },
                    style: {
                        background: '#fee2e2',
                        color: '#991b1b',
                        border: '1px solid #fecaca',
                    },
                },

                // Loading toast styling
                loading: {
                    style: {
                        background: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #e5e7eb',
                    },
                },
            }}
        />
    );
}

