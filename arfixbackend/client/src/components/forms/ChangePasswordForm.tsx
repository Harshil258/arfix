import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/schemas/profile.schema";

interface ChangePasswordFormProps {
  isSubmitting: boolean;
  onSubmit: (data: ChangePasswordFormValues) => void | Promise<void>;
  className?: string;
}

export function ChangePasswordForm({
  isSubmitting,
  onSubmit,
  className,
}: ChangePasswordFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const wrappedSubmit = handleSubmit(async (data) => {
    await onSubmit(data);
    reset({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  });

  return (
    <form
      onSubmit={wrappedSubmit}
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5",
        className,
      )}
    >
      <div className="mb-6">
        <p className="text-sm font-medium text-muted-foreground">Security</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          Change password
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Use a strong password you do not reuse on other sites.
        </p>
      </div>

      <FieldGroup className="max-w-xl space-y-5">
        <Field>
          <FieldLabel>Current password</FieldLabel>
          <Input
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.currentPassword)}
            {...register("currentPassword")}
          />
          {errors.currentPassword ? (
            <p className="mt-1 text-sm text-destructive">{errors.currentPassword.message}</p>
          ) : null}
        </Field>

        <Field>
          <FieldLabel>New password</FieldLabel>
          <Input
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.newPassword)}
            {...register("newPassword")}
          />
          {errors.newPassword ? (
            <p className="mt-1 text-sm text-destructive">{errors.newPassword.message}</p>
          ) : null}
        </Field>

        <Field>
          <FieldLabel>Confirm new password</FieldLabel>
          <Input
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmNewPassword)}
            {...register("confirmNewPassword")}
          />
          {errors.confirmNewPassword ? (
            <p className="mt-1 text-sm text-destructive">{errors.confirmNewPassword.message}</p>
          ) : null}
        </Field>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating…" : "Update password"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
