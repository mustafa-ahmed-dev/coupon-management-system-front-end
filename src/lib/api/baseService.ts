import { apiClient } from "./client";
import type { PaginatedResponse, BaseFilters } from "@/types/api";

// Base service class with common CRUD operations
export abstract class BaseApiService<
  T,
  TFilters extends BaseFilters = BaseFilters
> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  // Get paginated list
  async findMany(filters?: TFilters): Promise<PaginatedResponse<T>> {
    const response = await apiClient.get<PaginatedResponse<T>>(this.endpoint, {
      params: filters,
    });
    return response.data;
  }

  // Get single item by ID
  async findOne(id: number): Promise<T> {
    const response = await apiClient.get<T>(`${this.endpoint}/${id}`);
    return response.data;
  }

  // Create new item
  async create<TCreate = Partial<T>>(data: TCreate): Promise<T> {
    const response = await apiClient.post<T>(this.endpoint, data);
    return response.data;
  }

  // Update existing item
  async update<TUpdate = Partial<T>>(id: number, data: TUpdate): Promise<T> {
    const response = await apiClient.patch<T>(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  // Delete item
  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }

  // Get count/statistics
  async count(): Promise<Record<string, number>> {
    const response = await apiClient.get<Record<string, number>>(
      `${this.endpoint}/count`
    );
    return response.data;
  }
}
