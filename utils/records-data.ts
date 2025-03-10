import { db } from "./db"; // adjust the import path to your setup
import { recordsTable } from "./models";
import { eq } from "drizzle-orm";
import { IRecordInput } from "./types";

// CREATE: Add a new record
export async function createRecord(data: IRecordInput) {
  const { image, name, bought_price, sold_price } = data;

  await db.insert(recordsTable).values({
    image,
    name,
    createdAt: new Date().toISOString(),
    bought_price,
    sold_price,
  });

  console.log("Record created!");
}

// READ: Get all records
export async function getAllRecords() {
  const allRecords = await db.select().from(recordsTable);
  console.log("All records:", allRecords);
  return allRecords;
}

// READ: Get a record by ID
export async function getRecordById(recordId: number) {
  const result = await db
    .select()
    .from(recordsTable)
    .where(eq(recordsTable.id, recordId));

  return result[0]; // Returns the single record or undefined
}

// UPDATE: Update sold price by record ID
export async function updateSoldPrice(recordId: number, newSoldPrice: number) {
  await db
    .update(recordsTable)
    .set({ sold_price: newSoldPrice })
    .where(eq(recordsTable.id, recordId));

  console.log(`Record ${recordId} updated with new sold price.`);
}

// UPDATE: Update name
export async function updateRecordName(recordId: number, newName: string) {
  await db
    .update(recordsTable)
    .set({ name: newName })
    .where(eq(recordsTable.id, recordId));

  console.log(`Record ${recordId} updated with new name: ${newName}`);
}

// UPDATE: Update image
export async function updateRecordImage(recordId: number, newImage: string) {
  await db
    .update(recordsTable)
    .set({ image: newImage })
    .where(eq(recordsTable.id, recordId));

  console.log(`Record ${recordId} updated with new image: ${newImage}`);
}

// UPDATE: Update bought price by record ID
export async function updateBoughtPrice(
  recordId: number,
  newBoughtPrice: number,
) {
  await db
    .update(recordsTable)
    .set({ bought_price: newBoughtPrice })
    .where(eq(recordsTable.id, recordId));

  console.log(`Record ${recordId} updated with new bought price.`);
}

// DELETE: Delete a record by ID
export async function deleteRecord(recordId: number) {
  await db.delete(recordsTable).where(eq(recordsTable.id, recordId));
  console.log(`Record ${recordId} deleted.`);

  // TODO: Remove the expenses that are related with this record
}
