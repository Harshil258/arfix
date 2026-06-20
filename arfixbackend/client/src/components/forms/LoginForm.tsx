import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ComponentProps } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";

import { toast } from "react-toastify";

import { loginSchema, type LoginFormValues } from "@/schemas/login.schema";
import { setUser } from "@/store/slices/currentUserSlice";
import { useLoginMutation, type LoginPortal } from "@/hooks/mutations/auth.mutations";
import type { AppUserRole } from "@/api/userApi";

type LoginFormProps = ComponentProps<"form"> & {
  portal?: LoginPortal;
};

export function LoginForm({ className, portal = "user", ...props }: LoginFormProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useLoginMutation(portal);

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data, {
      onSuccess: (res) => {
        const body = res as {
          data?: {
            user: { id: string; name: string; email: string; role: string };
            accessToken: string;
          };
        };
        const payload = body.data;
        if (!payload?.accessToken || !payload.user) {
          toast.error("Unexpected login response.");
          return;
        }

        localStorage.setItem("token", payload.accessToken);
        dispatch(
          setUser({
            token: payload.accessToken,
            user: {
              id: String(payload.user.id),
              name: payload.user.name,
              email: payload.user.email,
              role: payload.user.role as AppUserRole,
            },
          }),
        );

        toast.success("Login successful!");

        navigate("/");
      },
      onError: (error: unknown) => {
        const message =
          error && typeof error === "object" && "message" in error
            ? String((error as { message?: unknown }).message)
            : "Login failed. Please try again.";
        toast.error(message);
      },
    });
  };

  const heading = portal === "admin" ? "Staff sign in" : "Login to your account";
  const subheading =
    portal === "admin"
      ? "Administrator and staff accounts only. Customer accounts use the other sign-in page."
      : "Enter your email below to sign in with your customer account.";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{heading}</h1>
          <p className="text-sm text-muted-foreground">{subheading}</p>
        </div>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            type="email"
            placeholder="m@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input type="password" {...register("password")} />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button variant="outline" type="button">
            Login with GitHub
          </Button>

          <FieldDescription className="text-center">
            {portal === "admin" ? (
              <>
                Customer account?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Sign in here
                </Link>
              </>
            ) : (
              <>
                Staff or administrator?{" "}
                <Link to="/admin/login" className="underline underline-offset-4">
                  Use staff sign in
                </Link>
              </>
            )}
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
