import { IRecordsService, createRecordsService } from "./records.services";
import { z } from "zod";

const mockRepo = {
  insert: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  editSoldPrice: jest.fn(),
  editBoughtPrice: jest.fn(),
  editRecordName: jest.fn(),
  editRecordImage: jest.fn(),
  remove: jest.fn(),
};

describe("Records Service", () => {
  let service: IRecordsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = createRecordsService(mockRepo as any);
  });
  describe("createRecord", () => {
    it("should create a record with valid input", async () => {
      const input = {
        image: "image/path.png",
        name: "Test Record",
        bought_price: 100,
        sold_price: 200,
      };

      mockRepo.insert.mockResolvedValueOnce({ id: 1, ...input });

      const result = await service.createRecord(input);

      expect(mockRepo.insert).toHaveBeenCalledWith({
        image: input.image,
        name: input.name,
        bought_price: input.bought_price,
        sold_price: input.sold_price,
      });

      expect(result).toEqual({
        message: "Record successfully created!",
        data: { id: 1, ...input },
      });
    });

    it("should throw validation error if input is invalid", async () => {
      const input = {
        image: "",
        name: "A",
        bought_price: -1,
        sold_price: -1,
      };

      await expect(service.createRecord(input as any)).rejects.toThrow(
        z.ZodError,
      );
    });
  });

  describe("getAllRecords", () => {
    it("should return all records", async () => {
      const records = [{ id: 1 }, { id: 2 }];
      mockRepo.findAll.mockResolvedValueOnce(records);

      const result = await service.getAllRecords();

      expect(mockRepo.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        message: `Fetched ${records.length} record(s).`,
        data: records,
      });
    });
  });

  describe("getRecordById", () => {
    it("should return the record when found", async () => {
      const record = { id: 1 };
      mockRepo.findById.mockResolvedValueOnce(record);

      const result = await service.getRecordById(1);

      expect(mockRepo.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        message: "Record found.",
        data: record,
      });
    });

    it("should throw an error when record not found", async () => {
      mockRepo.findById.mockResolvedValueOnce(undefined);

      await expect(service.getRecordById(999)).rejects.toThrow(
        "Record with ID 999 not found.",
      );
    });
  });

  describe("updateSoldPrice", () => {
    it("should update sold price if record exists and price is valid", async () => {
      mockRepo.findById.mockResolvedValueOnce({ id: 1 });

      const result = await service.updateSoldPrice(1, 500);

      expect(mockRepo.editSoldPrice).toHaveBeenCalledWith(1, 500);
      expect(result).toEqual({
        message: "Sold price updated for record 1.",
      });
    });

    it("should throw if record does not exist", async () => {
      mockRepo.findById.mockResolvedValueOnce(undefined);

      await expect(service.updateSoldPrice(999, 500)).rejects.toThrow(
        "Record with ID 999 not found.",
      );
    });

    it("should throw if new sold price is invalid", async () => {
      mockRepo.findById.mockResolvedValueOnce({ id: 1 });

      await expect(service.updateSoldPrice(1, -50)).rejects.toThrow(
        "Sold price must be a non-negative integer.",
      );
    });
  });

  describe("updateBoughtPrice", () => {
    it("should update bought price if record exists and price is valid", async () => {
      mockRepo.findById.mockResolvedValueOnce({ id: 1 });

      const result = await service.updateBoughtPrice(1, 300);

      expect(mockRepo.editBoughtPrice).toHaveBeenCalledWith(1, 300);
      expect(result).toEqual({
        message: "Bought price updated for record 1.",
      });
    });

    it("should throw if record does not exist", async () => {
      mockRepo.findById.mockResolvedValueOnce(undefined);

      await expect(service.updateBoughtPrice(999, 300)).rejects.toThrow(
        "Record with ID 999 not found.",
      );
    });

    it("should throw if new bought price is invalid", async () => {
      mockRepo.findById.mockResolvedValueOnce({ id: 1 });

      await expect(service.updateBoughtPrice(1, -10)).rejects.toThrow(
        "Bought price must be a non-negative integer.",
      );
    });
  });

  describe("updateRecordName", () => {
    it("should update record name if valid", async () => {
      mockRepo.findById.mockResolvedValueOnce({ id: 1 });

      const result = await service.updateRecordName(1, "New Name");

      expect(mockRepo.editRecordName).toHaveBeenCalledWith(1, "New Name");
      expect(result).toEqual({
        message: "Name updated for record 1.",
      });
    });

    it("should throw if record not found", async () => {
      mockRepo.findById.mockResolvedValueOnce(undefined);

      await expect(service.updateRecordName(999, "Test")).rejects.toThrow(
        "Record with ID 999 not found.",
      );
    });

    it("should throw if new name is invalid", async () => {
      mockRepo.findById.mockResolvedValueOnce({ id: 1 });

      await expect(service.updateRecordName(1, "A")).rejects.toThrow(
        "Invalid name. It should be at least 2 characters.",
      );
    });
  });

  describe("updateRecordImage", () => {
    it("should update record image if valid", async () => {
      mockRepo.findById.mockResolvedValueOnce({ id: 1 });

      const result = await service.updateRecordImage(1, "new/image/path.png");

      expect(mockRepo.editRecordImage).toHaveBeenCalledWith(
        1,
        "new/image/path.png",
      );
      expect(result).toEqual({
        message: "Image updated for record 1.",
      });
    });

    it("should throw if record not found", async () => {
      mockRepo.findById.mockResolvedValueOnce(undefined);

      await expect(
        service.updateRecordImage(999, "image/path.png"),
      ).rejects.toThrow("Record with ID 999 not found.");
    });

    it("should throw if image path is invalid", async () => {
      mockRepo.findById.mockResolvedValueOnce({ id: 1 });

      await expect(service.updateRecordImage(1, "")).rejects.toThrow(
        "Invalid image path. It cannot be empty.",
      );
    });
  });

  describe("deleteRecord", () => {
    it("should delete record if it exists", async () => {
      mockRepo.findById.mockResolvedValueOnce({ id: 1 });

      const result = await service.deleteRecord(1);

      expect(mockRepo.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        message: "Record 1 has been deleted.",
      });
    });

    it("should throw if record not found", async () => {
      mockRepo.findById.mockResolvedValueOnce(undefined);

      await expect(service.deleteRecord(999)).rejects.toThrow(
        "Record with ID 999 not found.",
      );
    });
  });
});
