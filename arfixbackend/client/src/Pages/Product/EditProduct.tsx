import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductForm } from "./ProductForm";
import { useProductQuery } from "@/hooks/queries/product.queries";
import { useUpdateProductMutation } from "@/hooks/mutations/product.mutations";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";

const EditProduct: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const id = productId ?? "";

  const productQuery = useProductQuery(id, { enabled: Boolean(productId) });
  const mutation = useUpdateProductMutation();

  const product = productQuery.data;

  const handleSubmit = async (payload: {
    name: string;
    description: string;
    images: File[];
  }) => {
    await mutation.mutateAsync({ id, ...payload });
    navigate("/products");
  };

  if (!productId) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm shadow-black/5 dark:shadow-white/5">
        Invalid product selected for editing.
      </div>
    );
  }

  if (productQuery.isLoading) {
    return <ProductSkeleton />;
  }

  if (productQuery.error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive shadow-sm shadow-red-500/10">
        {productQuery.error instanceof Error
          ? productQuery.error.message
          : "Unable to load product details."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {mutation.error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive shadow-sm shadow-red-500/10">
          {mutation.error instanceof Error ? mutation.error.message : "Unable to update product. Please try again."}
        </div>
      ) : null}

      <ProductForm
        title="Edit Product"
        submitLabel="Update product"
        initialName={product?.name}
        initialDescription={product?.description}
        initialImages={product?.images}
        isSubmitting={mutation.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/products")}
      />
    </div>
  );
};

export default EditProduct;
