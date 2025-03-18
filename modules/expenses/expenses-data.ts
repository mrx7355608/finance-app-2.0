import { expensesTable } from "../../utils/models"; // your schema
import { eq } from "drizzle-orm";
import { IExpenseInput } from "../../utils/types";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";

// Factory function for Expenses CRUD operations
export const createExpensesRepo = (db: ExpoSQLiteDatabase) => {
  /**
   * Check if an expense exists by ID
   */
  const expenseExists = async (id: number) => {
    const expense = await db
      .select({ id: expensesTable.id })
      .from(expensesTable)
      .where(eq(expensesTable.id, id))
      .limit(1);

    return expense[0];
  };

  /**
   * Create an expense record
   */
  const insertExpense = async ({ name, amount, recordId }: IExpenseInput) => {
    const result = await db
      .insert(expensesTable)
      .values({
        name,
        amount,
        recordId,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return result[0];
  };

  /**
   * Get all expenses
   */
  const findAllExpenses = async () => {
    const result = await db.select().from(expensesTable);
    return result;
  };

  /**
   * Get a single expense by ID
   */
  const findExpenseById = async (id: number) => {
    const result = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.id, id))
      .limit(1);

    return result[0] || null;
  };

  /**
   * Get all expenses related to a specific recordId
   */
  const findExpensesByRecordId = async (recordId: number) => {
    const result = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.recordId, recordId));

    return result;
  };

  /**
   * Update expense by ID
   */
  const editExpense = async (
    id: number,
    newAmount: number,
    newName: string,
  ) => {
    const result = await db
      .update(expensesTable)
      .set({ amount: newAmount, name: newName })
      .where(eq(expensesTable.id, id))
      .returning();

    return result[0];
  };

  /**
   * Delete expense by ID
   */
  const removeExpense = async (id: number) => {
    const result = await db
      .delete(expensesTable)
      .where(eq(expensesTable.id, id));

    return result;
  };

  return {
    expenseExists,
    insertExpense,
    findAllExpenses,
    findExpenseById,
    findExpensesByRecordId,
    editExpense,
    removeExpense,
  };
};

export type IExpenseRepo = ReturnType<typeof createExpensesRepo>;
