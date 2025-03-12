import { recordSchema } from "./records.validation"; // adjust the import path if needed
import { z } from "zod";

describe("recordSchema validation", () => {
  const validRecord = {
    image: "file:///path-to-image.jpg",
    name: "Elephant",
    bought_price: 5000,
    sold_price: 7000,
    createdAt: "2025-03-10T14:00:00Z",
  };

  it("should validate a correct record successfully", () => {
    const result = recordSchema.parse(validRecord);
    expect(result).toEqual(validRecord);
  });

  it("should fail if image is missing", () => {
    const data = { ...validRecord, image: "" };

    try {
      recordSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        expect(error.flatten().fieldErrors.image).toContain("Image is missing");
      }
    }
  });

  it("should fail if name is too short", () => {
    try {
      const data = { ...validRecord, name: "A" };
      recordSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        expect(error.flatten().fieldErrors.name).toContain(
          "Name should be at least 2 characters long.",
        );
      }
    }
  });

  it("should fail if name is too long", () => {
    try {
      const longName = "A".repeat(51);
      const data = { ...validRecord, name: longName };
      recordSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        expect(error.flatten().fieldErrors.name).toContain(
          "Name should not exceed 50 characters.",
        );
      }
    }
  });

  it("should fail if bought_price is negative", () => {
    try {
      const data = { ...validRecord, bought_price: -100 };
      recordSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        expect(error.flatten().fieldErrors.bought_price).toContain(
          "Bought price must be zero or greater.",
        );
      }
    }
  });

  it("should fail if bought_price is not an integer", () => {
    try {
      const data = { ...validRecord, bought_price: 123.45 };
      recordSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        expect(error.flatten().fieldErrors.bought_price).toContain(
          "Bought price must be an integer.",
        );
      }
    }
  });

  it("should pass if sold_price is null", () => {
    const data = { ...validRecord, sold_price: null };
    const result = recordSchema.parse(data);
    expect(result).toEqual(data);
  });

  it("should fail if sold_price is negative", () => {
    try {
      const data = { ...validRecord, sold_price: -50 };
      recordSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        expect(error.flatten().fieldErrors.sold_price).toContain(
          "Sold price must be zero or greater.",
        );
      }
    }
  });

  it("should fail if createdAt is not a valid ISO datetime", () => {
    try {
      const data = { ...validRecord, createdAt: "invalid-date" };
      recordSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        expect(error.flatten().fieldErrors.createdAt).toContain(
          "Created date must be a valid ISO datetime.",
        );
      }
    }
  });

  it("should fail if createdAt is omitted", () => {
    try {
      const { createdAt, ...data } = validRecord;
      recordSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        expect(error.flatten().fieldErrors.createdAt).toContain(
          "Date is required",
        );
      }
    }
  });
});
