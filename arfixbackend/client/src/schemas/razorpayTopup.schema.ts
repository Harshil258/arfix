import { z } from "zod";

export const razorpayTopupSchema = z.object({
  amount: z.coerce
    .number()
    .min(1, "Minimum amount is ₹1")
    .max(500000, "Maximum amount is ₹5,00,000"),
  note: z.string().max(200, "Note cannot exceed 200 characters").optional(),
});

export type RazorpayTopupFormValues = z.infer<typeof razorpayTopupSchema>;
