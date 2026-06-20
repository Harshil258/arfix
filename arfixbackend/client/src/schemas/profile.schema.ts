import { z } from "zod";
import { passwordComplexity } from "@/schemas/user.schema";

export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  mobile: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^\+?[\d\s-]{7,20}$/.test(v),
      "Enter a valid mobile number, or leave blank",
    ),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordComplexity,
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "New passwords do not match",
        path: ["confirmNewPassword"],
      });
    }
  });

export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
