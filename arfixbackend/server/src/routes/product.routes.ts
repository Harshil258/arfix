import path from "path";
import fs from "fs";
import { Router } from "express";
import multer, { StorageEngine, FileFilterCallback } from "multer";
import { Request } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  removeProductImage,
  getMyProducts,
} from "@/controllers/product.controller";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import {
  createProductSchema,
  updateProductSchema,
} from "@/validators/product.validator";

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// Multer — Disk Storage
// Uploads land in  <project-root>/src/uploads/
// Directory is created automatically if it doesn't exist.
// ─────────────────────────────────────────────────────────────────────────────
const UPLOAD_DIR = path.resolve("src/uploads");

// Ensure the uploads directory exists at startup
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage: StorageEngine = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    // e.g.  1715000000000-482910234-my-photo.jpg
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, "-");
    cb(null, `${uniqueSuffix}-${baseName}${ext}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
  fileFilter,
});

// ─────────────────────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────────────────────

// ── Products ──────────────────────────────────────────────────────────────────

// POST   /api/v1/products          — create a product (with images)
router.post(
  "/",
  authenticate,
  upload.array("images", 10),
  createProductSchema,
  validate,
  createProduct,
);

// GET    /api/v1/products          — list all products (search / filter / sort)
router.get("/", getAllProducts);

// GET    /api/v1/products/me       — authenticated user's own products
// ⚠️  Must be declared BEFORE /:id so Express doesn't treat "me" as an id
router.get("/me", authenticate, getMyProducts);

// GET    /api/v1/products/:id      — single product
router.get("/:id", getProductById);

// PUT    /api/v1/products/:id      — update product (optional new images)
router.put(
  "/:id",
  authenticate,
  upload.array("images", 10),
  updateProductSchema,
  validate,
  updateProduct,
);

// DELETE /api/v1/products/:id      — soft-delete a product
router.delete("/:id", authenticate, deleteProduct);

// ── Images ────────────────────────────────────────────────────────────────────

// DELETE /api/v1/products/:id/images/:publicId  — remove one image from a product
router.delete("/:id/images/:publicId", authenticate, removeProductImage);

export default router;
