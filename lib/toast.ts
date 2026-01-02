import { Id, toast, ToastOptions } from "react-toastify";

const baseOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 3000, // 3 seconds for all toasts
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  pauseOnFocusLoss: false,
  closeButton: true,
};

export const showToast = {
  success: (msg: string): Id =>
    toast.success(msg, {
      ...baseOptions,
    }),

  error: (msg: string): Id =>
    toast.error(msg, {
      ...baseOptions,
    }),

  warning: (msg: string): Id =>
    toast.warning(msg, {
      ...baseOptions,
    }),

  info: (msg: string): Id =>
    toast.info(msg, {
      ...baseOptions,
    }),

  // Custom toast with brand color
  brand: (msg: string): Id =>
    toast(msg, {
      ...baseOptions,
    }),

  // Loading toast
  loading: (msg: string): Id =>
    toast.loading(msg, {
      position: "bottom-right",
      closeButton: false,
      autoClose: false,
    }),

  // Promise toast for async operations
  promise: <T,>(
    promise: Promise<T>,
    messages: { pending: string; success: string; error: string }
  ): Promise<T> =>
    toast.promise(
      promise,
      {
        pending: messages.pending,
        success: {
          render: messages.success,
          autoClose: 3000,
        },
        error: {
          render: messages.error,
          autoClose: 3000,
        },
      },
      {
        position: "bottom-right",
      }
    ),

  // Dismiss a specific toast
  dismiss: (toastId?: string | number) => toast.dismiss(toastId),

  // Dismiss all toasts
  dismissAll: () => toast.dismiss(),
};