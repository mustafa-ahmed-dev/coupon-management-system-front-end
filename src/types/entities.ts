// Base entity interface for common fields
interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// User roles enum matching your backend
export type UserRole = "admin" | "manager" | "user";

// Coupon status enum matching your backend
export type CouponStatus = "active" | "deactivated" | "expired" | "assigned";

// Coupon request status enum matching your backend
export type CouponRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "expired";

// User entity (matches your actual API response)
export interface User extends BaseEntity {
  name: string;
  username: string;
  email: string;
  role: UserRole;
  lastLogin?: Date | null;
  departmentId?: number | null;
  createdById?: number | null;
  updatedById?: number | null;
  deactivatedAt?: Date | null;
  deactivatedById?: number | null;

  // Relations (populated in findOne/findMany)
  department?: {
    id: number;
    name: string;
  } | null;
  createdBy?: {
    id: number;
    name: string;
    username: string;
  } | null;
  updatedBy?: {
    id: number;
    name: string;
    username: string;
  } | null;
  deactivatedBy?: {
    id: number;
    name: string;
    username: string;
  } | null;
}

// Department entity
export interface Department extends BaseEntity {
  name: string;
  description?: string;
  createdById: number;
  updatedById?: number | null;
  deactivatedAt?: Date | null;
  deactivatedById?: number | null;

  // Relations
  createdBy?: User;
  updatedBy?: User;
  users?: User[];
}

// Coupon Request Category entity (matches your actual API response)
export interface CouponRequestCategory extends BaseEntity {
  name: string;
  description?: string | null;
  isSelectable: boolean;
  autoApprovalLimit?: number | null;
  duplicateWindow: number;
  createdById: number;
  updatedById?: number | null;
  deactivatedAt?: Date | null;
  deactivatedById?: number | null;

  // Relations (populated when needed)
  createdBy?: User;
  updatedBy?: User;
  parents?: CouponRequestCategory[]; // Hierarchy support
  children?: CouponRequestCategory[];
  requests?: CouponRequest[];
}

// Coupon entity (matches your actual API response)
export interface Coupon extends BaseEntity {
  code: string;
  amount: number;
  status: CouponStatus;
  assignedAt?: Date | null;
  categoryId?: number | null;
  departmentId?: number | null;
  createdById: number;
  updatedById?: number | null;
  deactivatedById?: number | null;

  // Relations (populated in findOne/findMany)
  createdBy?: {
    id: number;
    name: string;
    username: string;
  } | null;
  updatedBy?: {
    id: number;
    name: string;
    username: string;
  } | null;
  deactivatedBy?: {
    id: number;
    name: string;
    username: string;
  } | null;
  category?: CouponRequestCategory | null;
  department?: Department | null;
  request?: CouponRequest;
}

// Coupon Request Information (nested object)
export interface CouponRequestInformation {
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  orderNumber?: string | null;
  orderDate: Date;
  orderTotalAmount: number;
  orderDeliveryDate?: Date | null;
  duplicateReason?: string | null;
}

// Coupon Request entity (matches your actual API response)
export interface CouponRequest extends BaseEntity {
  amount: number;
  description?: string | null;
  status: CouponRequestStatus;
  statusChangedById: number;
  statusChangeDate?: Date | null;
  statusChangeComment?: string | null;
  departmentId?: number | null;
  exceptedReason?: string | null;
  exceptedById?: number | null;
  categoryId: number;
  couponId?: number | null;
  createdById: number;
  updatedById?: number | null;

  // Relations (populated in findOne/findMany)
  category: {
    id: number;
    name: string;
  };
  coupon?: Coupon | null;
  department?: Department | null;
  createdBy: {
    id: number;
    name: string;
  };
  updatedBy?: User | null;
  statusChangedBy: {
    id: number;
    name: string;
  };
  exceptedBy?: User | null;
  couponRequestInformation: CouponRequestInformation;
}

// Audit Log types
export type UserAction =
  | "create"
  | "update"
  | "activate"
  | "deactivate"
  | "login"
  | "logout"
  | "resetPassword";

export type AuditLogType = "userAction" | "systemEvent";

export type EntityType =
  | "user"
  | "department"
  | "couponRequestCategory"
  | "couponRequest"
  | "coupon";

// JSONB field type for PostgreSQL
type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export interface AuditLog {
  id: string; // UUID
  requestId: string; // UUID
  method: string;
  action: UserAction;
  entity: EntityType;
  entityId: number;
  userId?: number;
  userRole?: UserRole;
  timestamp: Date;
  details?: string;
  ipAddress: string;
  userAgent?: string;
  device?: string;
  location?: string;
  type: AuditLogType;
  oldValue?: JsonValue; // JSONB - can be object, array, or primitive
  newValue: JsonValue; // JSONB - can be object, array, or primitive

  // Relations
  user?: User;
}
