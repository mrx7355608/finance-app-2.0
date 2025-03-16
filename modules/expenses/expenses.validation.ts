import { z } from "zod";

export const expenseInputSchema = z.object({
  name: z
    .string({
      required_error: "Expense name is required.",
      invalid_type_error: "Expense name must be a string.",
    })
    .min(1, { message: "Expense name cannot be empty." }),

  amount: z
    .number({
      required_error: "Expense amount is required.",
      invalid_type_error: "Expense amount must be a number.",
    })
    .positive({ message: "Expense amount must be greater than 0." }),

  recordId: z
    .number({
      required_error: "Record ID is required.",
      invalid_type_error: "Record ID must be a number.",
    })
    .int({ message: "Record ID must be an integer." })
    .positive({ message: "Record ID must be greater than 0." }),
});
