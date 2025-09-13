import * as yup from "yup";
import type { UserRole, CouponStatus, CouponRequestStatus } from "./entities";

// ========================
// AUTHENTICATION FORMS
// ========================

export interface LoginFormData {
  email: string;
  password: string;
}

export const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
});

// ========================
// USER FORMS
// ========================

export interface CreateUserFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  departmentId?: number;
}

export interface UpdateUserFormData {
  name: string;
  email: string;
  role: UserRole;
  departmentId?: number;
}

export interface UpdateUserPasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const createUserSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
  role: yup
    .string()
    .required("Role is required")
    .oneOf(["admin", "manager", "user"], "Invalid role selected"),
  departmentId: yup
    .number()
    .optional()
    .positive("Department ID must be positive"),
});

export const updateUserSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  role: yup
    .string()
    .required("Role is required")
    .oneOf(["admin", "manager", "user"], "Invalid role selected"),
  departmentId: yup
    .number()
    .optional()
    .positive("Department ID must be positive"),
});

export const updatePasswordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
  confirmPassword: yup
    .string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

// ========================
// DEPARTMENT FORMS
// ========================

export interface CreateDepartmentFormData {
  name: string;
  description?: string;
}

export interface UpdateDepartmentFormData {
  name: string;
  description?: string;
}

export const departmentSchema = yup.object({
  name: yup
    .string()
    .required("Department name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  description: yup
    .string()
    .optional()
    .max(255, "Description must be less than 255 characters"),
});

// ========================
// CATEGORY FORMS
// ========================

export interface CreateCategoryFormData {
  name: string;
  description?: string;
  isAutoApproved: boolean;
  maxAmount?: number;
  parentId?: number;
}

export interface UpdateCategoryFormData {
  name: string;
  description?: string;
  isAutoApproved: boolean;
  maxAmount?: number;
  parentId?: number;
}

export const categorySchema = yup.object({
  name: yup
    .string()
    .required("Category name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  description: yup
    .string()
    .optional()
    .max(255, "Description must be less than 255 characters"),
  isAutoApproved: yup.boolean().required("Auto-approval setting is required"),
  maxAmount: yup
    .number()
    .optional()
    .positive("Maximum amount must be positive")
    .max(1000000, "Amount cannot exceed 1,000,000"),
  parentId: yup
    .number()
    .optional()
    .positive("Parent category ID must be positive"),
});

// ========================
// COUPON FORMS
// ========================

export interface CreateCouponFormData {
  code: string;
  amount: number;
  categoryId?: number;
  departmentId?: number;
  expiresAt?: Date;
}

export interface UpdateCouponFormData {
  code: string;
  amount: number;
  status: CouponStatus;
  categoryId?: number;
  departmentId?: number;
  expiresAt?: Date;
}

export interface BulkCouponUploadFormData {
  file: File;
  categoryId?: number;
  departmentId?: number;
}

export const createCouponSchema = yup.object({
  code: yup
    .string()
    .required("Coupon code is required")
    .min(3, "Code must be at least 3 characters")
    .max(20, "Code must be less than 20 characters")
    .matches(
      /^[A-Z0-9-_]+$/,
      "Code can only contain uppercase letters, numbers, hyphens, and underscores"
    ),
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be positive")
    .max(1000000, "Amount cannot exceed 1,000,000"),
  categoryId: yup.number().optional().positive("Category ID must be positive"),
  departmentId: yup
    .number()
    .optional()
    .positive("Department ID must be positive"),
  expiresAt: yup
    .date()
    .optional()
    .min(new Date(), "Expiration date must be in the future"),
});

export const updateCouponSchema = yup.object({
  code: yup
    .string()
    .required("Coupon code is required")
    .min(3, "Code must be at least 3 characters")
    .max(20, "Code must be less than 20 characters")
    .matches(
      /^[A-Z0-9-_]+$/,
      "Code can only contain uppercase letters, numbers, hyphens, and underscores"
    ),
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be positive")
    .max(1000000, "Amount cannot exceed 1,000,000"),
  status: yup
    .string()
    .required("Status is required")
    .oneOf(
      ["active", "inactive", "used", "expired"],
      "Invalid status selected"
    ),
  categoryId: yup.number().optional().positive("Category ID must be positive"),
  departmentId: yup
    .number()
    .optional()
    .positive("Department ID must be positive"),
  expiresAt: yup.date().optional(),
});

export const bulkUploadSchema = yup.object({
  file: yup
    .mixed<File>()
    .required("Please select a file")
    .test(
      "fileType",
      "Only Excel (.xlsx) and CSV (.csv) files are allowed",
      (value) => {
        if (!value) return false;
        const allowedTypes = [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
          "text/csv", // .csv
          "application/csv",
        ];
        return allowedTypes.includes(value.type);
      }
    )
    .test("fileSize", "File size must be less than 5MB", (value) => {
      if (!value) return false;
      return value.size <= 5 * 1024 * 1024; // 5MB
    }),
  categoryId: yup.number().optional().positive("Category ID must be positive"),
  departmentId: yup
    .number()
    .optional()
    .positive("Department ID must be positive"),
});

// ========================
// COUPON REQUEST FORMS
// ========================

export interface CreateCouponRequestFormData {
  amount: number;
  description?: string;
  categoryId: number;
  departmentId?: number;
  // Customer information
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderNumber?: string;
  orderTotalAmount: number;
  orderDate: Date;
  orderDeliveryDate?: Date;
  duplicateReason?: string;
}

export interface UpdateRequestStatusFormData {
  status: CouponRequestStatus;
  comment?: string;
}

export const createRequestSchema = yup.object({
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be positive")
    .max(1000000, "Amount cannot exceed 1,000,000"),
  description: yup
    .string()
    .optional()
    .max(512, "Description must be less than 512 characters"),
  categoryId: yup
    .number()
    .required("Category is required")
    .positive("Category ID must be positive"),
  departmentId: yup
    .number()
    .optional()
    .positive("Department ID must be positive"),
  // Customer information validation
  customerName: yup
    .string()
    .required("Customer name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  customerPhone: yup
    .string()
    .required("Customer phone is required")
    .matches(/^[+]?[\d\s\-\(\)]{10,15}$/, "Please enter a valid phone number")
    .max(15, "Phone number must be less than 15 characters"),
  customerEmail: yup
    .string()
    .optional()
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  orderNumber: yup
    .string()
    .optional()
    .max(20, "Order number must be less than 20 characters"),
  orderTotalAmount: yup
    .number()
    .required("Order total amount is required")
    .positive("Order amount must be positive")
    .max(10000000, "Order amount cannot exceed 10,000,000"),
  orderDate: yup
    .date()
    .required("Order date is required")
    .max(new Date(), "Order date cannot be in the future"),
  orderDeliveryDate: yup
    .date()
    .optional()
    .min(yup.ref("orderDate"), "Delivery date must be after order date"),
  duplicateReason: yup
    .string()
    .optional()
    .max(256, "Duplicate reason must be less than 256 characters"),
});

export const updateRequestStatusSchema = yup.object({
  status: yup
    .string()
    .required("Status is required")
    .oneOf(
      ["pending", "approved", "rejected", "cancelled", "expired"],
      "Invalid status selected"
    ),
  comment: yup
    .string()
    .optional()
    .max(512, "Comment must be less than 512 characters"),
});
