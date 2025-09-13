// Import statements for entity types
import type {
  User,
  CouponRequest,
  CouponRequestCategory,
  UserRole,
  CouponStatus,
  CouponRequestStatus,
} from "./entities";

// Generic API response wrapper
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

// Error response structure
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  details?: any;
}

// Pagination metadata (matches your actual API response)
export interface PaginationMeta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}

// Paginated response structure
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Authentication response
export interface AuthResponse {
  user: User;
  token: string;
}

// Login request
export interface LoginRequest {
  email: string;
  password: string;
}

// Common filter interface for list endpoints
export interface BaseFilters {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// User filters (matches your backend FilterUserDto)
export interface UserFilters extends BaseFilters {
  name?: string;
  email?: string;
  username?: string;
  role?: UserRole;
  departmentId?: number;
  isActive?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  createdById?: number;
}

// Department filters
export interface DepartmentFilters extends BaseFilters {
  name?: string;
  description?: string;
  createdById?: number;
  isActive?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}

// Coupon Request Category filters
export interface CategoryFilters extends BaseFilters {
  name?: string;
  description?: string;
  isSelectable?: boolean;
  autoApprovalLimit?: number;
  duplicateWindow?: number;
  parentId?: number;
  isActive?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  createdById?: number;
}

// Coupon filters (matches your backend FilterCouponDto)
export interface CouponFilters extends BaseFilters {
  amount?: number;
  status?: CouponStatus;
  code?: string;
  categoryId?: number;
  departmentId?: number;
  createdById?: number;
  assignedDateBefore?: Date;
  assignedDateAfter?: Date;
  createdDateBefore?: Date;
  createdDateAfter?: Date;
}

// Coupon Request filters (matches your backend FilterCouponRequestDto)
export interface CouponRequestFilters extends BaseFilters {
  id?: number;
  minAmount?: number;
  maxAmount?: number;
  description?: string;
  statuses?: CouponRequestStatus[];
  createdAfter?: Date;
  createdBefore?: Date;
  categoryId?: number;
  createdById?: number;
  couponId?: number;
  departmentId?: number;
  statusChangedById?: number;
  exceptedById?: number;

  // Customer information filters
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  orderNumber?: string;
  minOrderAmount?: number;
  maxOrderAmount?: number;
  orderDateAfter?: Date;
  orderDateBefore?: Date;
  deliveryDateAfter?: Date;
  deliveryDateBefore?: Date;
  duplicateReason?: string;

  // Status-specific filters
  statusChangeComment?: string;
  statusChangeDateAfter?: Date;
  statusChangeDateBefore?: Date;
  exceptedReason?: string;

  // Special flags
  couponStatus?: "has-coupon" | "no-coupon";
  couponCode?: string;
  categoryName?: string;
  duplicateStatus?: "duplicate" | "original";
}

// Create/Update DTOs
export interface CreateUserRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  departmentId?: number;
}

export interface UpdateUserRequest {
  name?: string;
  username?: string;
  email?: string;
  role?: UserRole;
  departmentId?: number;
}

export interface UpdateUserPasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
}

export interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  isSelectable: boolean;
  autoApprovalLimit?: number;
  duplicateWindow: number;
  parentId?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  isSelectable?: boolean;
  autoApprovalLimit?: number;
  duplicateWindow?: number;
  parentId?: number;
}

export interface CreateCouponRequest {
  code: string;
  amount: number;
  categoryId?: number;
  departmentId?: number;
}

export interface UpdateCouponRequest {
  code?: string;
  amount?: number;
  status?: CouponStatus;
  categoryId?: number;
  departmentId?: number;
}

export interface CreateCouponRequestRequest {
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

export interface UpdateCouponRequestStatusRequest {
  status: CouponRequestStatus;
  statusChangeComment?: string;
  exceptedReason?: string;
}

// Bulk upload types
export interface BulkUploadResponse {
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    row: number;
    message: string;
    data?: any;
  }>;
}

export interface BulkCouponUploadRequest {
  file: File;
  categoryId?: number;
  departmentId?: number;
}

// Count/Statistics responses
export interface CountResponse {
  [key: string]: number;
}

// User count by role
export interface UserCountByRole {
  admin: number;
  manager: number;
  user: number;
}

// Coupon count by status
export interface CouponCountByStatus {
  active: number;
  inactive: number;
  used: number;
  expired: number;
}

// Request count by status
export interface RequestCountByStatus {
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
  expired: number;
}

// Duplicate check response
export interface DuplicateCheckResponse {
  isDuplicate: boolean;
  lastRequest?: CouponRequest;
}

// User activation/deactivation response
export interface UserStatusResponse {
  message: string;
  user: User;
}

// Category activation/deactivation response
export interface CategoryStatusResponse {
  message: string;
  category: CouponRequestCategory;
}
