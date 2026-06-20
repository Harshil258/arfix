import { axiosInstance } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface ProductImage {
  url: string;
  publicId: string;
}

export interface ProductOwner {
  _id: string;
  name: string;
  email?: string;
}

export interface ProductItem {
  _id: string;
  name: string;
  description: string;
  images: ProductImage[];
  averageRating: number;
  totalReviews: number;
  createdBy: ProductOwner;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ProductListResponse {
  products: ProductItem[];
  pagination: ProductPagination;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  minRating?: number;
}

export const getProducts = async (
  params: ProductListParams = {},
): Promise<ProductListResponse> => {
  const queryParams: Record<string, string | number> = {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
  };

  if (params.search) queryParams.search = params.search;
  if (params.sortBy) queryParams.sortBy = params.sortBy;
  if (params.order) queryParams.order = params.order;
  if (params.minRating !== undefined) queryParams.minRating = params.minRating;

  const response = await axiosInstance.get(API_ENDPOINTS.products.list, {
    params: queryParams,
  });

  return response.data.data as ProductListResponse;
};

export const getProduct = async (id: string) => {
  const response = await axiosInstance.get(API_ENDPOINTS.products.byId(id));
  return response.data.data as ProductItem;
};

export interface ProductCreatePayload {
  name: string;
  description: string;
  images: File[];
}

export const createProduct = async (payload: ProductCreatePayload) => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("description", payload.description);

  payload.images.forEach((image) => {
    formData.append("images", image);
  });

  const response = await axiosInstance.post(API_ENDPOINTS.products.list, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data as ProductItem;
};

export interface ProductUpdatePayload {
  name?: string;
  description?: string;
  images?: File[];
}

export const updateProduct = async (id: string, payload: ProductUpdatePayload) => {
  const formData = new FormData();

  if (payload.name !== undefined) {
    formData.append("name", payload.name);
  }

  if (payload.description !== undefined) {
    formData.append("description", payload.description);
  }

  payload.images?.forEach((image) => {
    formData.append("images", image);
  });

  const response = await axiosInstance.put(API_ENDPOINTS.products.byId(id), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data as ProductItem;
};

export const deleteProduct = async (id: string) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.products.byId(id));
  return response.data;
};
