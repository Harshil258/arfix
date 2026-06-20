import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileUpdateSchema,
  type ProfileUpdateFormValues,
} from "@/schemas/profile.schema";

interface ProfileDetailsFormProps {
  defaultValues: ProfileUpdateFormValues;
  isSubmitting: boolean;
  onSubmit: (data: ProfileUpdateFormValues) => void | Promise<void>;
  className?: string;
}

export function ProfileDetailsForm({
  defaultValues,
  isSubmitting,
  onSubmit,
  className,
}: ProfileDetailsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues,
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
        <p className="text-sm font-medium text-muted-foreground">Account</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          Profile details
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your name, email, and mobile number. Mobile is optional.
        </p>
      </div>

      <FieldGroup className="max-w-xl space-y-5">
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input autoComplete="name" aria-invalid={Boolean(errors.name)} {...register("name")} />
          {errors.name ? (
            <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
          ) : null}
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
          ) : null}
        </Field>

        <Field>
          <FieldLabel>Mobile number</FieldLabel>
          <Input
            type="tel"
            autoComplete="tel"
            placeholder="Optional"
            aria-invalid={Boolean(errors.mobile)}
            {...register("mobile")}
          />
          {errors.mobile ? (
            <p className="mt-1 text-sm text-destructive">{errors.mobile.message}</p>
          ) : null}
        </Field>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save profile"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
