import { Request } from 'express';

// Common API response types
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User related types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Food product types
export interface FoodProduct {
  id: string;
  name: string;
  barcode?: string;
  brand?: string;
  nutritionInfo?: NutritionInfo;
  ingredients?: string[];
  allergens?: string[];
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize: string;
}

// Request types
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

