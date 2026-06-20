import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCouponSessionSchema,
  type CreateCouponSessionFormValues,
} from "@/schemas/couponSession.schema";

interface CouponSessionFormProps {
  title: string;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (data: CreateCouponSessionFormValues) => void | Promise<void>;
  onCancel: () => void;
  className?: string;
}

export function CouponSessionForm({
  title,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
  className,
}: CouponSessionFormProps) {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCouponSessionFormValues>({
    resolver: zodResolver(createCouponSessionSchema) as Resolver<CreateCouponSessionFormValues>,
    defaultValues: {
      quantity: 10,
      price: 0,
    },
  });



  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5",
        className,
      )}
    >
      <div className="mb-6">
        <p className="text-sm font-medium text-muted-foreground">Coupons</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Generates unique coupon codes and a printable PDF with QR codes for this batch.
        </p>
      </div>

      <FieldGroup className="max-w-md space-y-5">
        <Field>
          <FieldLabel>Quantity (1–500)</FieldLabel>
          <Input type="number" min={1} max={500} step={1} {...register("quantity")} />
          {errors.quantity ? (
            <p className="mt-1 text-sm text-destructive">{errors.quantity.message}</p>
          ) : null}
        </Field>

        <Field>
          <FieldLabel>Price per coupon (USD)</FieldLabel>
          <Input type="number" min={0} step="0.01" {...register("price")} />
          {errors.price ? (
            <p className="mt-1 text-sm text-destructive">{errors.price.message}</p>
          ) : null}
        </Field>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating…" : submitLabel}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
