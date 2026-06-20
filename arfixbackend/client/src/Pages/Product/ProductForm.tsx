import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { ProductImage } from "@/api/productApi";

// ─────────────────────────────────────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────────────────────────────────────
const productFormSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required.")
    .max(150, "Name cannot exceed 150 characters."),
  description: z
    .string()
    .min(1, "Description is required.")
    .max(5000, "Description cannot exceed 5000 characters."),
  review: z
    .number({ error: "Please select a rating." })
    .min(0, "Rating must be at least 0.")
    .max(5, "Rating cannot exceed 5."),
  images: z.custom<FileList>().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
interface ProductFormProps {
  title: string;
  submitLabel: string;
  initialName?: string;
  initialDescription?: string;
  initialReview?: number;
  initialImages?: ProductImage[];
  isSubmitting?: boolean;
  onSubmit: (payload: {
    name: string;
    description: string;
    review: number;
    images: File[];
  }) => void;
  onCancel?: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  title,
  submitLabel,
  initialName = "",
  initialDescription = "",
  initialReview = 4.5,
  initialImages = [],
  isSubmitting = false,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialName,
      description: initialDescription,
      review: initialReview,
    },
  });

  // Watch the file input to build previews reactively
  const watchedImages = watch("images");

  const previewImages = useMemo(() => {
    const newFiles = watchedImages ? Array.from(watchedImages) : [];
    return [
      ...initialImages.map((img) => img.url),
      ...newFiles.map((file) => URL.createObjectURL(file)),
    ];
  }, [watchedImages, initialImages]);

  const onValidSubmit = (values: ProductFormValues) => {
    onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
      review: values.review,
      images: values.images ? Array.from(values.images) : [],
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm font-medium text-muted-foreground">Products</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-2 text-sm text-sidebar-foreground/80">
          Use this form to {submitLabel.toLowerCase()} and upload product
          images.
        </p>
      </div>

      <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-6">
        {/* Name */}
        <Field>
          <FieldLabel>
            <span>Name</span>
            <Input
              {...register("name")}
              placeholder="Product name"
              aria-invalid={Boolean(errors.name)}
            />
          </FieldLabel>
          {errors.name ? (
            <p className="mt-1 text-xs text-destructive">
              {errors.name.message}
            </p>
          ) : (
            <FieldDescription>
              Enter a clear, descriptive product name.
            </FieldDescription>
          )}
        </Field>

        <Separator />

        {/* Description */}
        <Field>
          <FieldLabel>
            <span>Description</span>
            <textarea
              {...register("description")}
              rows={8}
              className="min-h-[160px] w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/40 aria-[invalid=true]:border-destructive"
              placeholder="Describe your product and its key features"
              aria-invalid={Boolean(errors.description)}
            />
          </FieldLabel>
          {errors.description ? (
            <p className="mt-1 text-xs text-destructive">
              {errors.description.message}
            </p>
          ) : (
            <FieldDescription>
              Describe the product, benefits, and any important details.
            </FieldDescription>
          )}
        </Field>

        <Separator />

        {/* Review / Rating */}
        <Field>
          <FieldLabel>
            <span>Rating</span>
            <Input
              type="number"
              min={0}
              max={5}
              step={0.5}
              placeholder="e.g. 4.5"
              aria-invalid={Boolean(errors.review)}
              {...register("review", { valueAsNumber: true })}
            />
          </FieldLabel>
          {errors.review ? (
            <p className="mt-1 text-xs text-destructive">
              {errors.review.message}
            </p>
          ) : (
            <FieldDescription>
              Rate the product from 0 (no rating) to 5 stars.
            </FieldDescription>
          )}
        </Field>

        <Separator />

        {/* Images */}
        <Field>
          <FieldLabel>
            <span>Images</span>
            <Input
              type="file"
              multiple
              accept="image/*"
              className="cursor-pointer"
              aria-invalid={Boolean(errors.images)}
              {...register("images")}
            />
          </FieldLabel>
          {errors.images ? (
            <p className="mt-1 text-xs text-destructive">
              {errors.images.message as string}
            </p>
          ) : (
            <FieldDescription>
              Upload one or more product images. New images are appended when
              editing.
            </FieldDescription>
          )}
        </Field>

        {/* Image Previews */}
        {previewImages.length > 0 && (
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-background p-4">
            {previewImages.map((src, index) => (
              <img
                key={`${src}-${index}`}
                src={src}
                alt={`Preview ${index + 1}`}
                className="h-24 w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
