import { toast, ToastOptions } from "react-toastify";

const baseOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showToast = {
  success: (msg: string) =>
    toast.success(msg, {
      ...baseOptions,
      style: {
        color: "var(--text-primary)",
      },
    }),

  error: (msg: string) =>
    toast.error(msg, {
      ...baseOptions,
      style: {
        color: "var(--text-primary)",
      },
    }),

  warning: (msg: string) =>
    toast.warning(msg, {
      ...baseOptions,
      style: {
        color: "var(--text-primary)",
      },
    }),

  info: (msg: string) =>
    toast.info(msg, {
      ...baseOptions,
      style: {
        color: "var(--text-primary)",
      },
    }),

  // Custom toast with brand color
  brand: (msg: string) =>
    toast(msg, {
      ...baseOptions,
      style: {
        color: "var(--text-primary)",
      },
    }),

  // Loading toast
  loading: (msg: string) =>
    toast.loading(msg, {
      position: "bottom-right",
      style: {
        color: "var(--text-primary)",
      },
    }),

  // Promise toast for async operations
  promise: <T,>(
    promise: Promise<T>,
    messages: { pending: string; success: string; error: string }
  ) =>
    toast.promise(promise, messages, {
      position: "bottom-right",
      style: {
        color: "var(--text-primary)",
      },
    }),

  // Dismiss a specific toast
  dismiss: (toastId?: string | number) => toast.dismiss(toastId),

  // Dismiss all toasts
  dismissAll: () => toast.dismiss(),
};