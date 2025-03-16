import {
  IExpenseService,
  createExpenseService,
} from "@/modules/expenses.services";

// Create mock functions for all the repo methods the service depends on
const mockExpensesRepo = {
  expenseExists: jest.fn(),
  insertExpense: jest.fn(),
  findAllExpenses: jest.fn(),
  findExpenseById: jest.fn(),
  findExpensesByRecordId: jest.fn(),
  editExpenseName: jest.fn(),
  editExpenseAmount: jest.fn(),
  removeExpense: jest.fn(),
};

describe("Expense Service", () => {
  let service: IExpenseService;

  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
    service = createExpenseService(mockExpensesRepo);
  });

  describe("createExpense", () => {
    it("should create an expense successfully", async () => {
      const mockExpenseInput = { name: "Coffee", amount: 5, recordId: 1 };
      mockExpensesRepo.insertExpense.mockResolvedValueOnce({
        id: 1,
        ...mockExpenseInput,
      });

      const result = await service.createExpense(mockExpenseInput);

      expect(mockExpensesRepo.insertExpense).toHaveBeenCalledWith(
        mockExpenseInput,
      );
      expect(result).toEqual({ id: 1, ...mockExpenseInput });
    });

    it("should throw an error if amount is <= 0", async () => {
      const invalidExpenseInput = { name: "Coffee", amount: 0, recordId: 1 };

      await expect(service.createExpense(invalidExpenseInput)).rejects.toThrow(
        "Expense amount must be greater than zero.",
      );

      expect(mockExpensesRepo.insertExpense).not.toHaveBeenCalled();
    });
  });

  describe("getExpenseById", () => {
    it("should return an expense when found", async () => {
      const mockExpense = { id: 1, name: "Dinner", amount: 20, recordId: 1 };
      mockExpensesRepo.findExpenseById.mockResolvedValueOnce(mockExpense);

      const result = await service.getExpenseById(1);

      expect(mockExpensesRepo.findExpenseById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockExpense);
    });

    it("should throw an error when expense is not found", async () => {
      mockExpensesRepo.findExpenseById.mockResolvedValueOnce(null);

      await expect(service.getExpenseById(99)).rejects.toThrow(
        "Expense with ID 99 not found.",
      );

      expect(mockExpensesRepo.findExpenseById).toHaveBeenCalledWith(99);
    });
  });

  describe("updateExpenseName", () => {
    it("should update expense name when expense exists", async () => {
      mockExpensesRepo.expenseExists.mockResolvedValueOnce(true);
      mockExpensesRepo.editExpenseName.mockResolvedValueOnce({ success: true });

      const result = await service.updateExpenseName(1, "Updated Name");

      expect(mockExpensesRepo.expenseExists).toHaveBeenCalledWith(1);
      expect(mockExpensesRepo.editExpenseName).toHaveBeenCalledWith(
        1,
        "Updated Name",
      );
      expect(result).toEqual({ success: true });
    });

    it("should throw an error when expense does not exist", async () => {
      mockExpensesRepo.expenseExists.mockResolvedValueOnce(false);

      await expect(
        service.updateExpenseName(99, "Updated Name"),
      ).rejects.toThrow("Cannot update. Expense with ID 99 does not exist.");

      expect(mockExpensesRepo.editExpenseName).not.toHaveBeenCalled();
    });
  });

  describe("updateExpenseAmount", () => {
    it("should update expense amount when valid and expense exists", async () => {
      mockExpensesRepo.expenseExists.mockResolvedValueOnce(true);
      mockExpensesRepo.editExpenseAmount.mockResolvedValueOnce({
        success: true,
      });

      const result = await service.updateExpenseAmount(1, 50);

      expect(mockExpensesRepo.expenseExists).toHaveBeenCalledWith(1);
      expect(mockExpensesRepo.editExpenseAmount).toHaveBeenCalledWith(1, 50);
      expect(result).toEqual({ success: true });
    });

    it("should throw an error if new amount <= 0", async () => {
      await expect(service.updateExpenseAmount(1, 0)).rejects.toThrow(
        "Expense amount must be greater than zero.",
      );

      expect(mockExpensesRepo.expenseExists).not.toHaveBeenCalled();
      expect(mockExpensesRepo.editExpenseAmount).not.toHaveBeenCalled();
    });

    it("should throw an error if expense does not exist", async () => {
      mockExpensesRepo.expenseExists.mockResolvedValueOnce(false);

      await expect(service.updateExpenseAmount(99, 100)).rejects.toThrow(
        "Cannot update. Expense with ID 99 does not exist.",
      );

      expect(mockExpensesRepo.editExpenseAmount).not.toHaveBeenCalled();
    });
  });

  describe("deleteExpense", () => {
    it("should delete expense if it exists", async () => {
      mockExpensesRepo.expenseExists.mockResolvedValueOnce(true);
      mockExpensesRepo.removeExpense.mockResolvedValueOnce({ success: true });

      const result = await service.deleteExpense(1);

      expect(mockExpensesRepo.expenseExists).toHaveBeenCalledWith(1);
      expect(mockExpensesRepo.removeExpense).toHaveBeenCalledWith(1);
      expect(result).toEqual({ success: true });
    });

    it("should throw an error if expense does not exist", async () => {
      mockExpensesRepo.expenseExists.mockResolvedValueOnce(false);

      await expect(service.deleteExpense(99)).rejects.toThrow(
        "Cannot delete. Expense with ID 99 does not exist.",
      );

      expect(mockExpensesRepo.removeExpense).not.toHaveBeenCalled();
    });
  });
});
