// record.service.ts
import { eq } from "drizzle-orm";
import { recordsTable } from "../../utils/models";
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
    const { image, name, bought_price, sold_price } = data;

    const record = await db.insert(recordsTable).values({
      image,
      name,
      bought_price,
      sold_price,
      createdAt: new Date().toISOString(),
    });

    console.log("asambhav!");
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
  const editSoldPrice = async (recordId: number, newSoldPrice: number) => {
    await db
      .update(recordsTable)
      .set({ sold_price: newSoldPrice })
      .where(eq(recordsTable.id, recordId));

    console.log(`Record ${recordId} updated with new sold price.`);
  };

  /**
   * UPDATE: Update name by record ID
   */
  const editRecordName = async (recordId: number, newName: string) => {
    await db
      .update(recordsTable)
      .set({ name: newName })
      .where(eq(recordsTable.id, recordId));

    console.log(`Record ${recordId} updated with new name: ${newName}`);
  };

  /**
   * UPDATE: Update image by record ID
   */
  const editRecordImage = async (recordId: number, newImage: string) => {
    await db
      .update(recordsTable)
      .set({ image: newImage })
      .where(eq(recordsTable.id, recordId));

    console.log(`Record ${recordId} updated with new image: ${newImage}`);
  };

  /**
   * UPDATE: Update bought price by record ID
   */
  const editBoughtPrice = async (recordId: number, newBoughtPrice: number) => {
    await db
      .update(recordsTable)
      .set({ bought_price: newBoughtPrice })
      .where(eq(recordsTable.id, recordId));

    console.log(`Record ${recordId} updated with new bought price.`);
  };

  /**
   * DELETE: Delete a record by ID
   */
  const remove = async (recordId: number) => {
    await db.delete(recordsTable).where(eq(recordsTable.id, recordId));
    console.log(`Record ${recordId} deleted.`);

    // TODO: Remove the expenses that are related to this record (if needed)
  };

  return {
    checkRecordExists,
    insert,
    findAll,
    findById,
    editSoldPrice,
    editRecordName,
    editRecordImage,
    editBoughtPrice,
    remove,
  };
};

export type IRecordsRepo = ReturnType<typeof createRecordsRepo>;
