import { Types } from "mongoose";

// ─── Product Image ────────────────────────────────────────────────────────────

export interface IProductImage {
  url: string; // Cloudinary secure URL
  publicId: string; // Cloudinary public_id (needed to delete)
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface IProduct {
  _id: Types.ObjectId;
  name: string;
  description: string;
  images: IProductImage[];
  review: number;
  averageRating: number; // auto-computed on every review change
  totalReviews: number;
  createdBy: Types.ObjectId; // ref → User
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface CreateProductInput {
  name: string;
  description: string;
  reviews?: number;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  images?: IProductImage[];
  isActive?: boolean;
}

export interface AddReviewInput {
  rating: number;
  comment: string;
}

// ─── Query ────────────────────────────────────────────────────────────────────

export interface ProductListQuery {
  page?: string;
  limit?: string;
  search?: string;
}
