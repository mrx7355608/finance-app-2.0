import { z } from "zod";

// ✅ Validation schema for creating or updating a record
export const recordSchema = z.object({
  image: z
    .string({
      required_error: "Image is missing",
      invalid_type_error: "Invalid image",
    })
    .min(1, { message: "Image is missing" }),

  name: z
    .string({
      required_error: "Animal name is required.",
      invalid_type_error: "Name must be a string.",
    })
    .min(2, { message: "Name should be at least 2 characters long." })
    .max(50, { message: "Name should not exceed 50 characters." }),

  bought_price: z
    .number({
      required_error: "Bought price is required.",
      invalid_type_error: "Bought price must be a number.",
    })
    .int({ message: "Bought price must be an integer." })
    .nonnegative({ message: "Bought price must be zero or greater." }),

  sold_price: z
    .number({
      invalid_type_error: "Sold price must be a number.",
    })
    .int({ message: "Sold price must be an integer." })
    .nonnegative({ message: "Sold price must be zero or greater." })
    .nullable()
    .optional(),

  createdAt: z
    .string({
      invalid_type_error: "Created date must be a string.",
      required_error: "Date is required",
    })
    .datetime({ message: "Created date must be a valid ISO datetime." }),
});

// ✅ Type inferred from the schema (optional)
export type RecordValidationInput = z.infer<typeof recordSchema>;
