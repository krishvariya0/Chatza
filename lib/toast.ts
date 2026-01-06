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

const isMobile = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
};

export const showToast = {
  success: (msg: string): Id => {
    if (isMobile()) return "mobile-suppressed";
    return toast.success(msg, { ...baseOptions });
  },

  error: (msg: string): Id => {
    if (isMobile()) return "mobile-suppressed";
    return toast.error(msg, { ...baseOptions });
  },

  warning: (msg: string): Id => {
    if (isMobile()) return "mobile-suppressed";
    return toast.warning(msg, { ...baseOptions });
  },

  info: (msg: string): Id => {
    if (isMobile()) return "mobile-suppressed";
    return toast.info(msg, { ...baseOptions });
  },

  // Custom toast with brand color
  brand: (msg: string): Id => {
    if (isMobile()) return "mobile-suppressed";
    return toast(msg, { ...baseOptions });
  },

  // Loading toast
  loading: (msg: string): Id => {
    if (isMobile()) return "mobile-suppressed";
    return toast.loading(msg, {
      position: "bottom-right",
      closeButton: false,
      autoClose: false,
    });
  },

  // Promise toast for async operations
  promise: <T,>(
    promise: Promise<T>,
    messages: { pending: string; success: string; error: string }
  ): Promise<T> => {
    if (isMobile()) return promise;
    return toast.promise(
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
    );
  },

  // Dismiss a specific toast
  dismiss: (toastId?: string | number) => {
    if (isMobile()) return;
    toast.dismiss(toastId);
  },

  // Dismiss all toasts
  dismissAll: () => {
    if (isMobile()) return;
    toast.dismiss();
  },
};