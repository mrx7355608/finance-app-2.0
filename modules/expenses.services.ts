import { db } from "@/utils/db";
import { expensesTable, recordsTable } from "@/utils/models";
import { eq } from "drizzle-orm";
import { IExpenseInput } from "@/utils/types";

/**
 * Helper: Check if an expense exists by ID
 */
export async function checkExpenseExists(id: number) {
  const result = await db
    .select({ id: expensesTable.id })
    .from(expensesTable)
    .where(eq(expensesTable.id, id))
    .limit(1);

  return result.length > 0;
}

/**
 * Helper: Check if a record exists by ID
 */
export async function checkRecordExists(recordId: number) {
  const result = await db
    .select()
    .from(recordsTable)
    .where(eq(recordsTable.id, recordId));
  return result[0] ? true : false;
}

/**
 * Create a new expense
 */
export async function createExpense(input: IExpenseInput) {
  const { name, amount, recordId } = input;

  if (!name || name.trim() === "") {
    throw new Error("Expense name is required.");
  }

  if (amount <= 0) {
    throw new Error("Expense amount must be greater than 0.");
  }

  // Check if record exists
  const recordExists = await checkRecordExists(recordId);
  if (!recordExists) {
    throw new Error(`Record with ID ${recordId} does not exist.`);
  }

  const result = await db.insert(expensesTable).values({
    name,
    amount,
    recordId,
    createdAt: new Date().toISOString(),
  });

  return result;
}

/**
 * Get expenses by record ID
 */
export async function getExpensesByRecordId(recordId: number) {
  if (!recordId) {
    throw new Error("Record ID is required.");
  }

  const recordExists = await checkRecordExists(recordId);
  if (!recordExists) {
    throw new Error(`Record with ID ${recordId} does not exist.`);
  }

  const result = await db
    .select()
    .from(expensesTable)
    .where(eq(expensesTable.recordId, recordId));

  return result;
}

/**
 * Update expense name
 */
export async function updateExpenseName(id: number, newName: string) {
  if (!newName || newName.trim() === "") {
    throw new Error("New name cannot be empty.");
  }

  const exists = await checkExpenseExists(id);
  if (!exists) {
    throw new Error(`Expense with ID ${id} does not exist.`);
  }

  await db
    .update(expensesTable)
    .set({ name: newName })
    .where(eq(expensesTable.id, id));

  return { message: "Expense name updated successfully" };
}

/**
 * Update expense amount
 */
export async function updateExpenseAmount(id: number, newAmount: number) {
  if (newAmount <= 0) {
    throw new Error("Amount must be greater than 0.");
  }

  const exists = await checkExpenseExists(id);
  if (!exists) {
    throw new Error(`Expense with ID ${id} does not exist.`);
  }

  await db
    .update(expensesTable)
    .set({ amount: newAmount })
    .where(eq(expensesTable.id, id));

  return { message: "Expense amount updated successfully" };
}

/**
 * Delete an expense
 */
export async function deleteExpense(id: number) {
  const exists = await checkExpenseExists(id);
  if (!exists) {
    throw new Error(`Expense with ID ${id} does not exist.`);
  }

  await db.delete(expensesTable).where(eq(expensesTable.id, id));

  return { message: "Expense deleted successfully" };
}
