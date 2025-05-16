import { recordSchema } from "./records.validation";
import { IRecordInput } from "../../utils/types";
import { IRecordsRepo } from "./records-data";
import { uploadImagesToCloudinary } from "../cloudinary/cloudinary.services";

export const createRecordsService = (recordsRepo: IRecordsRepo) => {
  const { insert, findAll, findById, editRecord, remove } = recordsRepo;

  /**
   * Create a new record
   */
  const createRecord = async (input: IRecordInput) => {
    const validated = recordSchema.parse(input);

    const uploadedLinks = await uploadImagesToCloudinary(input.images);
    console.log("Images upload");

    const result = await insert({
      images: uploadedLinks,
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
  const updateRecord = async (recordId: number, newData: IRecordInput) => {
    const validated = recordSchema.parse(newData);

    const existing = await findById(recordId);
    if (!existing) {
      throw new Error(`Record with ID ${recordId} not found.`);
    }

    const result = await editRecord(recordId, validated as IRecordInput);
    return result;
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

    if (!existing.images || existing.images.length < 1) {
      console.log("Images missing!");
    }

    return { message: `Record ${recordId} has been deleted.` };
  };

  return {
    createRecord,
    getAllRecords,
    getRecordById,
    updateRecord,
    deleteRecord,
  };
};

export type IRecordsService = ReturnType<typeof createRecordsService>;
