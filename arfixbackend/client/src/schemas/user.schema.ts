import { z } from "zod";

export const roleSchema = z.enum(["user", "admin", "staff"]);

export const passwordComplexity = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number");

export const userCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: passwordComplexity,
  role: roleSchema,
});

export const userUpdateSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Invalid email address"),
    role: roleSchema,
    isActive: z.boolean(),
    password: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const pwd = data.password?.trim();
    if (!pwd) return;
    const result = passwordComplexity.safeParse(pwd);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        ctx.addIssue({ ...issue, path: ["password"] });
      });
    }
  });

export type UserCreateFormValues = z.infer<typeof userCreateSchema>;
export type UserUpdateFormValues = z.infer<typeof userUpdateSchema>;
