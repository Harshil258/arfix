import { body, param, query } from "express-validator";

// ─── 1. Create Product ────────────────────────────────────────────────────────
export const createProductSchema = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ max: 150 })
    .withMessage("Name cannot exceed 150 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 5000 })
    .withMessage("Description cannot exceed 5000 characters"),

  // Images are handled by multer, not in body validation

  body("reviews")
    .optional()
    .isArray()
    .withMessage("Reviews must be an array")
    .custom((reviews: any[]) => {
      const allValid = reviews.every(
        (review) =>
          typeof review === "object" &&
          typeof review.rating === "number" &&
          review.rating >= 1 &&
          review.rating <= 5 &&
          typeof review.comment === "string" &&
          review.comment.trim().length > 0 &&
          review.comment.length <= 1000,
      );
      if (!allValid) throw new Error("Invalid review format");
      return true;
    }),
];

// ─── 2. Update Product ────────────────────────────────────────────────────────
export const updateProductSchema = [
  param("id").isMongoId().withMessage("Invalid product ID in URL"),

  body("name")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Name cannot exceed 150 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Description cannot exceed 5000 characters"),

  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array")
    .custom((images: any[]) => {
      const allValid = images.every(
        (img) => typeof img === "object" && img.url && img.publicId,
      );
      if (!allValid) throw new Error("Each image must have url and publicId");
      return true;
    }),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

// ─── 3. Add Review ────────────────────────────────────────────────────────────
export const addReviewSchema = [
  param("id").isMongoId().withMessage("Invalid product ID in URL"),

  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Comment is required")
    .isLength({ max: 1000 })
    .withMessage("Comment cannot exceed 1000 characters"),
];

// ─── 4. Get All Products ──────────────────────────────────────────────────────
export const getAllProductsSchema = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("search").optional().isString().withMessage("Search must be a string"),
];
