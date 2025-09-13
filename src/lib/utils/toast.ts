import toast from "react-hot-toast";

// Utility functions for consistent toast notifications throughout the app

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 4000,
      style: {
        background: "#f6ffed",
        border: "1px solid #b7eb8f",
        color: "#389e0d",
      },
    });
  },

  error: (message: string) => {
    toast.error(message, {
      duration: 5000,
      style: {
        background: "#fff2f0",
        border: "1px solid #ffccc7",
        color: "#cf1322",
      },
    });
  },

  warning: (message: string) => {
    toast(message, {
      icon: "⚠️",
      duration: 4000,
      style: {
        background: "#fffbe6",
        border: "1px solid #ffe58f",
        color: "#d48806",
      },
    });
  },

  info: (message: string) => {
    toast(message, {
      icon: "ℹ️",
      duration: 4000,
      style: {
        background: "#f0f9fe",
        border: "1px solid #91caff",
        color: "#0958d9",
      },
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        background: "#fafafa",
        border: "1px solid #d9d9d9",
        color: "#595959",
      },
    });
  },

  // Dismiss specific toast
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },

  // Dismiss all toasts
  dismissAll: () => {
    toast.dismiss();
  },
};

// Specific toast messages for common actions in coupon management
export const toastMessages = {
  auth: {
    loginSuccess: "Welcome! You have successfully logged in.",
    loginError: "Invalid credentials. Please try again.",
    logoutSuccess: "You have been logged out successfully.",
    sessionExpired: "Your session has expired. Please log in again.",
  },
  users: {
    createSuccess: "User created successfully.",
    updateSuccess: "User updated successfully.",
    deleteSuccess: "User deleted successfully.",
    activateSuccess: "User activated successfully.",
    deactivateSuccess: "User deactivated successfully.",
  },
  coupons: {
    createSuccess: "Coupon created successfully.",
    updateSuccess: "Coupon updated successfully.",
    bulkUploadSuccess: "Coupons uploaded successfully.",
    bulkUploadError: "Failed to upload coupons. Please check the file format.",
  },
  requests: {
    createSuccess: "Coupon request created successfully.",
    approveSuccess: "Coupon request approved successfully.",
    rejectSuccess: "Coupon request rejected.",
    statusUpdateSuccess: "Request status updated successfully.",
  },
  general: {
    saveSuccess: "Changes saved successfully.",
    deleteConfirm: "Are you sure you want to delete this item?",
    networkError: "Network error. Please check your connection and try again.",
    unexpectedError: "An unexpected error occurred. Please try again.",
  },
};
