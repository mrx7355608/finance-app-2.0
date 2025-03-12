import { db } from "../utils/db"; // adjust the import as needed
import { recordsTable } from "@/utils/models";
import { eq } from "drizzle-orm";
import { recordSchema } from "@/modules/records.validation"; // the Zod schema file
import { z } from "zod";

// Create a new record
export async function createRecord(input: unknown) {
  const validated = recordSchema.parse(input);

  const result = await db.insert(recordsTable).values({
    image: validated.image,
    name: validated.name,
    bought_price: validated.bought_price,
    sold_price: validated.sold_price ?? null,
    createdAt: new Date().toISOString(),
  });

  return {
    message: "Record successfully created!",
    data: result,
  };
}

// Get all records
export async function getAllRecords() {
  const allRecords = await db.select().from(recordsTable);

  return {
    message: `Fetched ${allRecords.length} record(s).`,
    data: allRecords,
  };
}

// Get a single record by ID
export async function getRecordById(recordId: number) {
  const record = await db
    .select()
    .from(recordsTable)
    .where(eq(recordsTable.id, recordId));

  if (!record.length) {
    throw new Error(`Record with ID ${recordId} not found.`);
  }

  return {
    message: "Record found.",
    data: record[0],
  };
}

// Update the record's soldPrice
export async function updateSoldPrice(recordId: number, newSoldPrice: number) {
  // Check if record exists
  const existing = await db
    .select()
    .from(recordsTable)
    .where(eq(recordsTable.id, recordId));
  if (!existing.length) {
    throw new Error(`Record with ID ${recordId} not found.`);
  }

  // Validate soldPrice value
  if (!Number.isInteger(newSoldPrice) || newSoldPrice < 0) {
    throw new Error("Sold price must be a non-negative integer.");
  }

  await db
    .update(recordsTable)
    .set({ sold_price: newSoldPrice })
    .where(eq(recordsTable.id, recordId));

  return { message: `Sold price updated for record ${recordId}.` };
}

// Update the record's boughtPrice
export async function updateBoughtPrice(
  recordId: number,
  newBoughtPrice: number,
) {
  const existing = await db
    .select()
    .from(recordsTable)
    .where(eq(recordsTable.id, recordId));
  if (!existing.length) {
    throw new Error(`Record with ID ${recordId} not found.`);
  }

  if (!Number.isInteger(newBoughtPrice) || newBoughtPrice < 0) {
    throw new Error("Bought price must be a non-negative integer.");
  }

  await db
    .update(recordsTable)
    .set({ bought_price: newBoughtPrice })
    .where(eq(recordsTable.id, recordId));

  return { message: `Bought price updated for record ${recordId}.` };
}

// Update the record's name
export async function updateRecordName(recordId: number, newName: string) {
  const existing = await db
    .select()
    .from(recordsTable)
    .where(eq(recordsTable.id, recordId));
  if (!existing.length) {
    throw new Error(`Record with ID ${recordId} not found.`);
  }

  const nameSchema = z
    .string()
    .min(2, "Name should be at least 2 characters long.");

  try {
    nameSchema.parse(newName);
  } catch (error) {
    throw new Error("Invalid name. It should be at least 2 characters.");
  }

  await db
    .update(recordsTable)
    .set({ name: newName })
    .where(eq(recordsTable.id, recordId));

  return { message: `Name updated for record ${recordId}.` };
}

// Update the record's image
export async function updateRecordImage(recordId: number, newImage: string) {
  const existing = await db
    .select()
    .from(recordsTable)
    .where(eq(recordsTable.id, recordId));
  if (!existing.length) {
    throw new Error(`Record with ID ${recordId} not found.`);
  }

  const imageSchema = z.string().min(1, "Image path cannot be empty.");

  try {
    imageSchema.parse(newImage);
  } catch (error) {
    throw new Error("Invalid image path. It cannot be empty.");
  }

  await db
    .update(recordsTable)
    .set({ image: newImage })
    .where(eq(recordsTable.id, recordId));

  return { message: `Image updated for record ${recordId}.` };
}

// Delete a record
export async function deleteRecord(recordId: number) {
  const existing = await db
    .select()
    .from(recordsTable)
    .where(eq(recordsTable.id, recordId));
  if (!existing.length) {
    throw new Error(`Record with ID ${recordId} not found.`);
  }

  await db.delete(recordsTable).where(eq(recordsTable.id, recordId));

  return { message: `Record ${recordId} has been deleted.` };
}
