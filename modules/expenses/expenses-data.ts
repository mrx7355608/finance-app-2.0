import { IExpenseInput } from "../../utils/types";
import { SupabaseClient } from "@supabase/supabase-js";

// Factory function for Expenses CRUD operations
export const createExpensesRepo = (db: SupabaseClient) => {
  /**
   * Check if an expense exists by ID
   */
  const expenseExists = async (id: number) => {
    return await db.from("expenses").select().eq("id", id).single();
  };

  /**
   * Create an expense record
   */
  const insertExpense = async ({ name, amount, recordId }: IExpenseInput) => {
    const result = await db.from("expenses").insert({
      name,
      amount,
      recordId,
    }).select().single();

    return result;
  };

  /**
   * Get all expenses
   */
  const findAllExpenses = async () => {
    const result = await db.from("expenses").select();
    return result;
  };

  /**
   * Get a single expense by ID
   */
  const findExpenseById = async (id: number) => {
    return await db.from("expenses").select().eq("id", id).single();
  };

  /**
   * Get all expenses related to a specific recordId
   */
  const findExpensesByRecordId = async (recordId: number) => {
    return (await db.from("expenses").select().eq("recordId", recordId)).data;
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
      .from("expenses")
      .update({
        amount: newAmount,
        name: newName,
      })
      .eq("id", id).select().single()

    return result;
  };

  /**
   * Delete expense by ID
   */
  const removeExpense = async (id: number) => {
    const result = await db.from("expenses").delete().eq("id", id);
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
