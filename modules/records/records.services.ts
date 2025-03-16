import { recordSchema } from "./records.validation";
import { z } from "zod";
import { IRecordInput } from "../../utils/types";
import { IRecordsRepo } from "./records-data";

export const createRecordsService = (recordsRepo: IRecordsRepo) => {
  const {
    insert,
    findAll,
    findById,
    editSoldPrice,
    editBoughtPrice,
    editRecordName,
    editRecordImage,
    remove,
  } = recordsRepo;

  /**
   * Create a new record
   */
  const createRecord = async (input: IRecordInput) => {
    const validated = recordSchema.parse(input);

    const result = await insert({
      image: validated.image,
      name: validated.name,
      bought_price: validated.bought_price,
      sold_price: validated.sold_price ?? undefined,
    });

    return {
      message: "Record successfully created!",
      data: result,
    };
  };

  /**
   * Get all records
   */
  const getAllRecords = async () => {
    const allRecords = await findAll();
    return {
      message: `Fetched ${allRecords.length} record(s).`,
      data: allRecords,
    };
  };

  /**
   * Get a single record by ID
   */
  const getRecordById = async (recordId: number) => {
    const record = await findById(recordId);

    if (!record) {
      throw new Error(`Record with ID ${recordId} not found.`);
    }

    return {
      message: "Record found.",
      data: record,
    };
  };

  /**
   * Update the record's soldPrice
   */
  const updateSoldPrice = async (recordId: number, newSoldPrice: number) => {
    const existing = await findById(recordId);
    if (!existing) {
      throw new Error(`Record with ID ${recordId} not found.`);
    }

    if (!Number.isInteger(newSoldPrice) || newSoldPrice < 0) {
      throw new Error("Sold price must be a non-negative integer.");
    }

    await editSoldPrice(recordId, newSoldPrice);

    return { message: `Sold price updated for record ${recordId}.` };
  };

  /**
   * Update the record's boughtPrice
   */
  const updateBoughtPrice = async (
    recordId: number,
    newBoughtPrice: number,
  ) => {
    const existing = await findById(recordId);
    if (!existing) {
      throw new Error(`Record with ID ${recordId} not found.`);
    }

    if (!Number.isInteger(newBoughtPrice) || newBoughtPrice < 0) {
      throw new Error("Bought price must be a non-negative integer.");
    }

    await editBoughtPrice(recordId, newBoughtPrice);

    return { message: `Bought price updated for record ${recordId}.` };
  };

  /**
   * Update the record's name
   */
  const updateRecordName = async (recordId: number, newName: string) => {
    const existing = await findById(recordId);
    if (!existing) {
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

    await editRecordName(recordId, newName);

    return { message: `Name updated for record ${recordId}.` };
  };

  /**
   * Update the record's image
   */
  const updateRecordImage = async (recordId: number, newImage: string) => {
    const existing = await findById(recordId);
    if (!existing) {
      throw new Error(`Record with ID ${recordId} not found.`);
    }

    const imageSchema = z.string().min(1, "Image path cannot be empty.");

    try {
      imageSchema.parse(newImage);
    } catch (error) {
      throw new Error("Invalid image path. It cannot be empty.");
    }

    await editRecordImage(recordId, newImage);
    return { message: `Image updated for record ${recordId}.` };
  };

  /**
   * Delete a record
   */
  const deleteRecord = async (recordId: number) => {
    const existing = await findById(recordId);
    if (!existing) {
      throw new Error(`Record with ID ${recordId} not found.`);
    }

    await remove(recordId);

    return { message: `Record ${recordId} has been deleted.` };
  };

  return {
    createRecord,
    getAllRecords,
    getRecordById,
    updateSoldPrice,
    updateBoughtPrice,
    updateRecordName,
    updateRecordImage,
    deleteRecord,
  };
};

export type IRecordsService = ReturnType<typeof createRecordsService>;
