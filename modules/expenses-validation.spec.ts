import { expenseInputSchema } from "./expenses.validation"; // Adjust path if needed

describe("createExpenseSchema validation", () => {
  it("should pass with valid data", () => {
    const validData = {
      name: "Feed the dog",
      amount: 50,
      recordId: 1,
    };

    const result = expenseInputSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it("should fail when name is missing", () => {
    const invalidData = {
      amount: 50,
      recordId: 1,
    };

    const result = expenseInputSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe("Expense name is required.");
      expect(result.error.errors[0].path).toContain("name");
    }
  });

  it("should fail when name is empty", () => {
    const invalidData = {
      name: "",
      amount: 50,
      recordId: 1,
    };

    const result = expenseInputSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe(
        "Expense name cannot be empty.",
      );
    }
  });

  it("should fail when amount is missing", () => {
    const invalidData = {
      name: "Buy seeds",
      recordId: 1,
    };

    const result = expenseInputSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe(
        "Expense amount is required.",
      );
    }
  });

  it("should fail when amount is zero or negative", () => {
    const invalidData = {
      name: "Buy seeds",
      amount: 0,
      recordId: 1,
    };

    const result = expenseInputSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe(
        "Expense amount must be greater than 0.",
      );
    }
  });

  it("should fail when amount is not a number", () => {
    const invalidData = {
      name: "Buy seeds",
      amount: "fifty",
      recordId: 1,
    };

    const result = expenseInputSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe(
        "Expense amount must be a number.",
      );
    }
  });

  it("should fail when recordId is missing", () => {
    const invalidData = {
      name: "Buy seeds",
      amount: 50,
    };

    const result = expenseInputSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe("Record ID is required.");
    }
  });

  it("should fail when recordId is negative", () => {
    const invalidData = {
      name: "Buy seeds",
      amount: 50,
      recordId: -5,
    };

    const result = expenseInputSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe(
        "Record ID must be greater than 0.",
      );
    }
  });

  it("should fail when recordId is not an integer", () => {
    const invalidData = {
      name: "Buy seeds",
      amount: 50,
      recordId: 1.5,
    };

    const result = expenseInputSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe(
        "Record ID must be an integer.",
      );
    }
  });
});
