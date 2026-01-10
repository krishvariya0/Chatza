import toast from 'react-hot-toast';

/**
 * Toast utility for showing notifications with react-hot-toast
 * Works on ALL devices including mobile
 */

const baseOptions = {
  duration: 3000,
  position: 'bottom-right' as const,
  style: {
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    maxWidth: '500px',
  },
};

export const showToast = {
  success: (msg: string): string => {
    return toast.success(msg, {
      ...baseOptions,
      icon: '✅',
      style: {
        ...baseOptions.style,
        background: '#dcfce7',
        color: '#166534',
        border: '1px solid #bbf7d0',
      },
    });
  },

  error: (msg: string): string => {
    return toast.error(msg, {
      ...baseOptions,
      duration: 4000,
      icon: '❌',
      style: {
        ...baseOptions.style,
        background: '#fee2e2',
        color: '#991b1b',
        border: '1px solid #fecaca',
      },
    });
  },

  warning: (msg: string): string => {
    return toast(msg, {
      ...baseOptions,
      duration: 3500,
      icon: '⚠️',
      style: {
        ...baseOptions.style,
        background: '#fef3c7',
        color: '#92400e',
        border: '1px solid #fde68a',
      },
    });
  },

  info: (msg: string): string => {
    return toast(msg, {
      ...baseOptions,
      icon: 'ℹ️',
      style: {
        ...baseOptions.style,
        background: '#dbeafe',
        color: '#1e40af',
        border: '1px solid #bfdbfe',
      },
    });
  },

  // Custom toast with brand color
  brand: (msg: string): string => {
    return toast(msg, {
      ...baseOptions,
      icon: '🔥',
      style: {
        ...baseOptions.style,
        background: '#fee2e2',
        color: '#dc2626',
        border: '1px solid #fecaca',
      },
    });
  },

  // Loading toast
  loading: (msg: string): string => {
    return toast.loading(msg, {
      position: 'bottom-right',
      style: {
        ...baseOptions.style,
        background: '#f3f4f6',
        color: '#374151',
        border: '1px solid #e5e7eb',
      },
    });
  },

  // Promise toast for async operations
  promise: <T,>(
    promise: Promise<T>,
    messages: { pending: string; success: string; error: string }
  ): Promise<T> => {
    return toast.promise(
      promise,
      {
        loading: messages.pending,
        success: messages.success,
        error: messages.error,
      },
      {
        position: 'bottom-right',
        style: {
          minWidth: '250px',
        },
        success: {
          duration: 3000,
          icon: '✅',
          style: {
            background: '#dcfce7',
            color: '#166534',
            border: '1px solid #bbf7d0',
          },
        },
        error: {
          duration: 4000,
          icon: '❌',
          style: {
            background: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #fecaca',
          },
        },
      }
    );
  },

  // Dismiss a specific toast
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },

  // Dismiss all toasts
  dismissAll: () => {
    toast.dismiss();
  },
};
