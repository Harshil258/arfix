import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Product from "@/models/Product.model";
import { sendSuccess } from "@/utils/response";
import { BadRequestError, NotFoundError } from "@/utils/AppError";
import {
  CreateProductInput,
  UpdateProductInput,
  ProductListQuery,
} from "@/types/Product";
import { AuthenticatedRequest } from "@/types/User";

const validateObjectId = (id: string, label = "ID"): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw BadRequestError(`Invalid ${label}.`);
  }
};

const findActiveProduct = async (id: string) => {
  const product = await Product.findOne({
    _id: id,
    isActive: true,
    isDeleted: false,
  });
  if (!product) throw NotFoundError("Product not found.");
  return product;
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. CREATE  —  POST /api/v1/products
// ─────────────────────────────────────────────────────────────────────────────
export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const createdBy = req.user?.id;
    if (!createdBy)
      throw BadRequestError("Authenticated user not found in request.");

    const { name, description, review } = req.body as Omit<
      CreateProductInput,
      "images"
    > & { review?: number };

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw BadRequestError("At least one image is required.");
    }

    const images = files.map((file) => ({
      url: `/uploads/${file.filename}`,
      publicId: file.filename,
    }));

    if (review !== undefined && (review < 0 || review > 5)) {
      throw BadRequestError("Review score must be between 0 and 5.");
    }

    const product = await Product.create({
      name,
      description,
      images,
      review: review ?? 4.5,
      createdBy,
    });

    sendSuccess(res, 201, "Product created successfully.", product);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. LIST  —  GET /api/v1/products
// ─────────────────────────────────────────────────────────────────────────────
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      page = "1",
      limit = "10",
      search,
      minRating,
      maxRating,
      sortBy = "createdAt",
      order = "desc",
    } = req.query as ProductListQuery & {
      minRating?: string;
      maxRating?: string;
      sortBy?: string;
      order?: "asc" | "desc";
    };

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, any> = { isActive: true, isDeleted: false };

    if (search) {
      filter.$text = { $search: search as string };
    }

    if (minRating || maxRating) {
      filter.averageRating = {};
      if (minRating)
        filter.averageRating.$gte = parseFloat(minRating as string);
      if (maxRating)
        filter.averageRating.$lte = parseFloat(maxRating as string);
    }

    const allowedSortFields = [
      "createdAt",
      "averageRating",
      "totalReviews",
      "name",
    ];
    const sortField = allowedSortFields.includes(sortBy as string)
      ? (sortBy as string)
      : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;
    const sortOption: Record<string, 1 | -1> = { [sortField]: sortOrder };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("createdBy", "name email")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter),
    ]);

    sendSuccess(res, 200, "Products retrieved successfully.", {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. READ ONE  —  GET /api/v1/products/:id
// ─────────────────────────────────────────────────────────────────────────────
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    validateObjectId(id, "product ID");

    const product = await Product.findOne({
      _id: id,
      isActive: true,
      isDeleted: false,
    }).populate("createdBy", "name email");

    if (!product) throw NotFoundError("Product not found.");

    sendSuccess(res, 200, "Product retrieved successfully.", product);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. UPDATE  —  PUT /api/v1/products/:id
// ─────────────────────────────────────────────────────────────────────────────
export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    validateObjectId(id, "product ID");

    const product = await findActiveProduct(id);

    if (product.createdBy.toString() !== userId) {
      throw BadRequestError("You can only update your own products.");
    }

    const { name, description, review } = req.body as UpdateProductInput & {
      review?: number;
    };

    if (review !== undefined) {
      if (review < 0 || review > 5)
        throw BadRequestError("Review score must be between 0 and 5.");
      product.review = review;
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;

    const files = req.files as Express.Multer.File[] | undefined;
    if (files && files.length > 0) {
      const newImages = files.map((file) => ({
        url: `/uploads/${file.filename}`,
        publicId: file.filename,
      }));
      product.images = [...product.images, ...newImages];
    }

    await product.save();

    sendSuccess(res, 200, "Product updated successfully.", product);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. REMOVE IMAGE  —  DELETE /api/v1/products/:id/images/:publicId
// ─────────────────────────────────────────────────────────────────────────────
export const removeProductImage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id, publicId } = req.params;
    const userId = req.user?.id;

    validateObjectId(id, "product ID");

    const product = await findActiveProduct(id);

    if (product.createdBy.toString() !== userId) {
      throw BadRequestError("You can only modify your own products.");
    }

    const originalLength = product.images.length;
    product.images = product.images.filter((img) => img.publicId !== publicId);

    if (product.images.length === originalLength) {
      throw NotFoundError("Image not found on this product.");
    }

    if (product.images.length === 0) {
      throw BadRequestError("A product must have at least one image.");
    }

    await product.save();

    sendSuccess(res, 200, "Image removed successfully.", product);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. SOFT DELETE  —  DELETE /api/v1/products/:id
// ─────────────────────────────────────────────────────────────────────────────
export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    validateObjectId(id, "product ID");

    const product = await findActiveProduct(id);

    if (product.createdBy.toString() !== userId) {
      throw BadRequestError("You can only delete your own products.");
    }

    product.isActive = false;
    product.isDeleted = true;
    await product.save();

    sendSuccess(res, 200, "Product deleted successfully.");
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. RATE PRODUCT  —  POST /api/v1/products/:id/rate
// ─────────────────────────────────────────────────────────────────────────────
export const rateProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { rating } = req.body as { rating: number };

    if (!userId)
      throw BadRequestError("Authenticated user not found in request.");

    validateObjectId(id, "product ID");

    if (rating === undefined || rating < 0 || rating > 5) {
      throw BadRequestError("Rating must be a number between 0 and 5.");
    }

    const product = await findActiveProduct(id);

    const newTotal = product.totalReviews + 1;
    const newAverage = parseFloat(
      (
        (product.averageRating * product.totalReviews + rating) /
        newTotal
      ).toFixed(2),
    );

    product.averageRating = newAverage;
    product.totalReviews = newTotal;

    await product.save();

    sendSuccess(res, 200, "Product rated successfully.", {
      averageRating: product.averageRating,
      totalReviews: product.totalReviews,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. MY PRODUCTS  —  GET /api/v1/products/me
// ─────────────────────────────────────────────────────────────────────────────
export const getMyProducts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId)
      throw BadRequestError("Authenticated user not found in request.");

    const { page = "1", limit = "10" } = req.query as ProductListQuery;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter = { createdBy: userId, isDeleted: false };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter),
    ]);

    sendSuccess(res, 200, "Your products retrieved successfully.", {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};
