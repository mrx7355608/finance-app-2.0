// record.service.ts
import { IRecordInput } from "../../utils/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const createRecordsRepo = (db: SupabaseClient) => {
  /**
   * Check if a record exists by ID
   */
  const checkRecordExists = async (recordId: number) => {
    if (!recordId) {
      throw new Error("Record ID is required.");
    }

    const record = await db
      .from("records")
      .select()
      .eq("id", recordId)
      .single();

    return record.data;
  };

  /**
   * CREATE: Add a new record
   */
  const insert = async (data: IRecordInput) => {
    const { images, name, bought_price, sold_price } = data;

    const record = await db.from("records").insert({
      images,
      name,
      bought_price,
      sold_price,
    });

    return record.data;
  };

  /**
   * READ: Get all records
   */
  const findAll = async () => {
    const allRecords = await db.from("records").select();
    console.log("All records:", allRecords);
    return allRecords.data;
  };

  /**
   * READ: Get a record by ID
   */
  const findById = async (recordId: number) => {
    const result = await db
      .from("records")
      .select()
      .eq("id", recordId)
      .single();

    return result.data;
  };

  /**
   * UPDATE: Update expense by record ID
   */
  const editRecord = async (recordId: number, newData: IRecordInput) => {
    const result = await db
      .from("records")
      .update(newData)
      .eq("id", recordId);

    return result.data;
  };

  /**
   * DELETE: Delete a record by ID
   */
  const remove = async (recordId: number) => {
    await db.from("records").delete().eq("id", recordId);
    console.log(`Record ${recordId} deleted.`);

    // Remove the expenses that are related to this record
    await db.from("expenses").delete().eq("recordId", recordId);
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
