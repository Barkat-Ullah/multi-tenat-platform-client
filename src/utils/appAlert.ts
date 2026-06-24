"use client";

import { toast } from "sonner";

type AlertIcon = "success" | "error" | "warning" | "info" | "question";

type AlertOptions = {
  icon?: AlertIcon;
  title?: string;
  text?: string;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  timer?: number;
  position?: string;
  confirmButtonColor?: string;
  showConfirmButton?: boolean;
};

type AlertResult = {
  isConfirmed: boolean;
};

const getMessage = (title?: string, text?: string) => {
  if (title && text) return `${title}: ${text}`;
  return title || text || "";
};

const showToast = (icon: AlertIcon | undefined, message: string) => {
  if (!message) return;

  if (icon === "success") {
    toast.success(message);
    return;
  }

  if (icon === "error") {
    toast.error(message);
    return;
  }

  if (icon === "warning") {
    toast.warning(message);
    return;
  }

  toast.info(message);
};

export const appAlert = {
  fire: async (
    titleOrOptions?: string | AlertOptions,
    text?: string,
    icon?: AlertIcon
  ): Promise<AlertResult> => {
    if (typeof titleOrOptions === "string") {
      showToast(icon, getMessage(titleOrOptions, text));
      return { isConfirmed: true };
    }

    const options = titleOrOptions || {};
    const message = getMessage(options.title, options.text);

    if (options.showCancelButton) {
      return {
        isConfirmed: window.confirm(message || options.confirmButtonText || "Are you sure?"),
      };
    }

    showToast(options.icon, message);
    return { isConfirmed: true };
  },
};
