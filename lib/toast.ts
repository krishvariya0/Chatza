import { Id, toast, ToastOptions } from "react-toastify";

const baseOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  pauseOnFocusLoss: false, // Prevent pause when window loses focus
  closeButton: true,
  theme: "colored", // Use colored theme for better visibility
};

export const showToast = {
  success: (msg: string): Id =>
    toast.success(msg, {
      ...baseOptions,
      autoClose: 3000, // Shorter duration for success
      className: "toast-success",
    }),

  error: (msg: string): Id =>
    toast.error(msg, {
      ...baseOptions,
      autoClose: 5000, // Longer duration for errors
      className: "toast-error",
    }),

  warning: (msg: string): Id =>
    toast.warning(msg, {
      ...baseOptions,
      autoClose: 4000,
      className: "toast-warning",
    }),

  info: (msg: string): Id =>
    toast.info(msg, {
      ...baseOptions,
      autoClose: 4000,
      className: "toast-info",
    }),

  // Custom toast with brand color
  brand: (msg: string): Id =>
    toast(msg, {
      ...baseOptions,
      autoClose: 3000,
      className: "toast-brand",
    }),

  // Loading toast
  loading: (msg: string): Id =>
    toast.loading(msg, {
      position: "bottom-right",
      closeButton: false,
      autoClose: false,
      className: "toast-loading",
    }),

  // Promise toast for async operations
  promise: <T,>(
    promise: Promise<T>,
    messages: { pending: string; success: string; error: string }
  ): Promise<T> =>
    toast.promise(
      promise,
      {
        pending: {
          render: messages.pending,
          className: "toast-loading",
        },
        success: {
          render: messages.success,
          className: "toast-success",
          autoClose: 3000,
        },
        error: {
          render: messages.error,
          className: "toast-error",
          autoClose: 5000,
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