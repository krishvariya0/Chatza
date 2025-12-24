import { toast } from "react-toastify";

const base = (bg: string, text: string, border: string) => ({
  style: {
    background: bg,
    color: text,
    border: `1px solid ${border}`,
  },
});

export const showToast = {
  success: (msg: string) =>
    toast.success(msg, base(
      "var(--toast-success-bg)",
      "var(--toast-success-text)",
      "var(--toast-success-border)"
    )),

  error: (msg: string) =>
    toast.error(msg, base(
      "var(--toast-error-bg)",
      "var(--toast-error-text)",
      "var(--toast-error-border)"
    )),

  warning: (msg: string) =>
    toast.warning(msg, base(
      "var(--toast-warning-bg)",
      "var(--toast-warning-text)",
      "var(--toast-warning-border)"
    )),

  info: (msg: string) =>
    toast.info(msg, base(
      "var(--toast-info-bg)",
      "var(--toast-info-text)",
      "var(--toast-info-border)"
    )),
};
