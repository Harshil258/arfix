import { z } from "zod";

export const createCouponSessionSchema = z.object({
  quantity: z.coerce.number().min(1, "Quantity is required."),
  price: z.coerce.number().min(0, "Price is required.")
});

export type CreateCouponSessionFormValues = z.infer<typeof createCouponSessionSchema>;

