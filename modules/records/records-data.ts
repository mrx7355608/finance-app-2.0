// record.service.ts
import { eq } from "drizzle-orm";
import { expensesTable, recordsTable } from "../../utils/models";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { IRecordInput } from "../../utils/types";

export const createRecordsRepo = (db: ExpoSQLiteDatabase) => {
  /**
   * Check if a record exists by ID
   */
  const checkRecordExists = async (recordId: number) => {
    if (!recordId) {
      throw new Error("Record ID is required.");
    }

    const record = await db
      .select({ id: recordsTable.id })
      .from(recordsTable)
      .where(eq(recordsTable.id, recordId))
      .limit(1);

    return record[0];
  };

  /**
   * CREATE: Add a new record
   */
  const insert = async (data: IRecordInput) => {
    const { images, name, bought_price, sold_price } = data;

    const record = await db.insert(recordsTable).values({
      images,
      name,
      bought_price,
      sold_price,
      createdAt: new Date().toISOString(),
    });

    return record;
  };

  /**
   * READ: Get all records
   */
  const findAll = async () => {
    const allRecords = await db.select().from(recordsTable);
    console.log("All records:", allRecords);
    return allRecords;
  };

  /**
   * READ: Get a record by ID
   */
  const findById = async (recordId: number) => {
    const result = await db
      .select()
      .from(recordsTable)
      .where(eq(recordsTable.id, recordId));

    return result[0]; // Returns the single record or undefined
  };

  /**
   * UPDATE: Update sold price by record ID
   */
  const editRecord = async (recordId: number, newData: IRecordInput) => {
    const result = await db
      .update(recordsTable)
      .set({ ...newData })
      .where(eq(recordsTable.id, recordId))
      .returning();

    return result[0];
  };

  /**
   * DELETE: Delete a record by ID
   */
  const remove = async (recordId: number) => {
    await db.delete(recordsTable).where(eq(recordsTable.id, recordId));
    console.log(`Record ${recordId} deleted.`);

    // Remove the expenses that are related to this record
    await db.delete(expensesTable).where(eq(expensesTable.recordId, recordId));
    console.log(`Deleted all expenses associated with ${recordId}.`);
  };

  return {
    checkRecordExists,
    insert,
    findAll,
    findById,
    editRecord,
    remove,
  };
};

export type IRecordsRepo = ReturnType<typeof createRecordsRepo>;
