import { IExpenseRepo } from "./expenses-data";
import { IExpenseInput } from "@/utils/types";
import { expenseInputSchema } from "./expenses.validation";

export const createExpenseService = (expensesRepo: IExpenseRepo) => {
  /**
   * Create a new expense
   * Includes additional business logic if needed
   */
  const createExpense = async (expenseInput: IExpenseInput) => {
    const validated = expenseInputSchema.parse(expenseInput);
    const result = await expensesRepo.insertExpense(validated);
    return result.data;
  };

  /**
   * Get all expenses
   */
  const getAllExpenses = async () => {
    return (await expensesRepo.findAllExpenses()).data;
  };

  /**
   * Get a single expense by its ID
   */
  const getExpenseById = async (id: number) => {
    const expense = await expensesRepo.findExpenseById(id);
    if (!expense) {
      throw new Error(`Expense with ID ${id} not found.`);
    }

    return expense;
  };

  /**
   * Get all expenses by recordId
   */
  const getExpensesByRecordId = async (recordId: number) => {
    const expenses = await expensesRepo.findExpensesByRecordId(recordId);
    return expenses;
  };

  /**
   * Update an expense name
   */
  const updateExpense = async (
    id: number,
    newName: string,
    newAmount: number,
  ) => {
    const exists = await expensesRepo.expenseExists(id);
    if (!exists) {
      throw new Error(`Cannot update. Expense with ID ${id} does not exist.`);
    }
    if (newAmount <= 0) {
      throw new Error("Expense amount must be greater than zero.");
    }

    const result = await expensesRepo.editExpense(id, newAmount, newName);
    return result.data;
  };

  /**
   * Delete an expense by ID
   */
  const deleteExpense = async (id: number) => {
    const exists = await expensesRepo.expenseExists(id);
    if (!exists) {
      throw new Error(`Cannot delete. Expense with ID ${id} does not exist.`);
    }

    return expensesRepo.removeExpense(id);
  };

  return {
    createExpense,
    getAllExpenses,
    getExpenseById,
    getExpensesByRecordId,
    updateExpense,
    deleteExpense,
  };
};

export type IExpenseService = ReturnType<typeof createExpenseService>;
