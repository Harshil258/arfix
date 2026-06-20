import React from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProductMutation } from "@/hooks/mutations/product.mutations";
import { ProductForm } from "./ProductForm";

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const mutation = useCreateProductMutation();

  const handleSubmit = async (payload: {
    name: string;
    description: string;
    images: File[];
  }) => {
    await mutation.mutateAsync(payload);
    navigate("/products");
  };

  return (
    <div className="space-y-6">
      {mutation.error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive shadow-sm shadow-red-500/10">
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Unable to save product. Please try again."}
        </div>
      ) : null}

      <ProductForm
        title="Add Product"
        submitLabel="Create product"
        isSubmitting={mutation.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/products")}
      />
    </div>
  );
};

export default AddProduct;
