import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userCreateSchema,
  userUpdateSchema,
  type UserCreateFormValues,
  type UserUpdateFormValues,
} from "@/schemas/user.schema";
import type { AppUserRole, UserListItem } from "@/api/userApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ── Discriminated prop types so each mode gets its own onSubmit signature ──────
type CreateModeProps = {
  mode: "create";
  onSubmit: (data: UserCreateFormValues) => void | Promise<void>;
  initialUser?: never;
};

type EditModeProps = {
  mode: "edit";
  onSubmit: (data: UserUpdateFormValues) => void | Promise<void>;
  initialUser?: UserListItem;
};

type UserFormProps = (CreateModeProps | EditModeProps) & {
  title: string;
  submitLabel: string;
  isSubmitting: boolean;
  allowAdminRole: boolean;
  onCancel: () => void;
  className?: string;
};

const roleOptions = (allowAdmin: boolean): { value: AppUserRole; label: string }[] => {
  const base: { value: AppUserRole; label: string }[] = [
    { value: "user", label: "User" },
    { value: "staff", label: "Staff" },
  ];
  if (allowAdmin) {
    return [...base, { value: "admin", label: "Admin" }];
  }
  return base;
};

export const UserForm: React.FC<UserFormProps> = ({
  mode,
  title,
  submitLabel,
  isSubmitting,
  allowAdminRole,
  initialUser,
  onSubmit,
  onCancel,
  className,
}) => {
  const schema = mode === "create" ? userCreateSchema : userUpdateSchema;

  const form = useForm<UserCreateFormValues | UserUpdateFormValues>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "create"
        ? {
          name: "",
          email: "",
          password: "",
          role: "user",
        }
        : {
          name: initialUser?.name ?? "",
          email: initialUser?.email ?? "",
          role: initialUser?.role ?? "user",
          isActive: initialUser?.isActive ?? true,
          password: "",
        },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const options = roleOptions(allowAdminRole);

  return (
    <form
      onSubmit={handleSubmit(onSubmit as (data: UserCreateFormValues | UserUpdateFormValues) => void | Promise<void>)}
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5",
        className,
      )}
    >
      <div className="mb-6">
        <p className="text-sm font-medium text-muted-foreground">Users</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      </div>

      <FieldGroup className="max-w-xl space-y-5">
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input autoComplete="name" aria-invalid={Boolean(errors.name)} {...register("name")} />
          {errors.name && (
            <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} {...register("email")} />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Role</FieldLabel>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-invalid={Boolean(errors.role)}>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && (
            <p className="mt-1 text-sm text-destructive">{errors.role.message}</p>
          )}
        </Field>

        {mode === "edit" && (
          <Field className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <input
                    id="isActive"
                    type="checkbox"
                    className="h-4 w-4 rounded border-input"
                    checked={field.value as boolean}
                    onChange={(e) => field.onChange(e.target.checked)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                )}
              />
              <FieldLabel htmlFor="isActive" className="mb-0 font-normal">
                Account active
              </FieldLabel>
            </div>
            {"isActive" in errors && errors.isActive ? (
              <p className="text-sm text-destructive">{(errors.isActive as { message?: string }).message}</p>
            ) : null}
          </Field>
        )}

        <Field>
          <FieldLabel>{mode === "create" ? "Password" : "New password (optional)"}</FieldLabel>
          <Input
            type="password"
            aria-invalid={Boolean(errors.password)}
            autoComplete="new-password"
            placeholder={mode === "edit" ? "Leave blank to keep current password" : ""}
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
          )}
        </Field>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : submitLabel}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};