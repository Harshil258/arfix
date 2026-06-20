import React from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCouponSessionMutation } from "@/hooks/mutations/couponSession.mutations";
import { CouponSessionForm } from "@/components/forms/CouponSessionForm";
import type { CreateCouponSessionFormValues } from "@/schemas/couponSession.schema";
import { useAppSelector } from "@/store/hooks";
import { toast } from "react-toastify";

const CreateCouponSession: React.FC = () => {
  const navigate = useNavigate();
  const mutation = useCreateCouponSessionMutation();
  const currentRole = useAppSelector((s) => s.currentUser.user?.role);
  const canManage = currentRole === "admin" || currentRole === "staff";

  const handleSubmit = async (data: CreateCouponSessionFormValues) => {
    try {
      await mutation.mutateAsync({
        quantity: data.quantity,
        price: data.price,
      });
      toast.success("Coupon session created successfully.");
      navigate("/coupons");
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as { message?: unknown }).message)
          : "Unable to create coupon session.";
      toast.error(msg);
    }
  };

  if (!canManage) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground shadow-sm shadow-black/5 dark:shadow-white/5">
        You do not have permission to create coupon sessions.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {mutation.isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive shadow-sm shadow-red-500/10">
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Unable to create session. Please try again."}
        </div>
      ) : null}

      <CouponSessionForm
        title="Create coupon session"
        submitLabel="Generate coupons"
        isSubmitting={mutation.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/coupons")}
      />
    </div>
  );
};

export default CreateCouponSession;
