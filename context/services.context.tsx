import { createExpensesRepo } from "@/modules/expenses/expenses-data";
import { createExpenseService } from "@/modules/expenses/expenses.services";
import { createRecordsRepo } from "@/modules/records/records-data";
import { createRecordsService } from "@/modules/records/records.services";
import { ReactNode, createContext, useContext } from "react";
import db from "@/utils/db";

const recordsRepo = createRecordsRepo(db);
const expenseRepo = createExpensesRepo(db);
const recordsService = createRecordsService(recordsRepo);
const expenseService = createExpenseService(expenseRepo);

const ServicesContext = createContext({
  recordsService,
  expenseService,
});

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error(
      "useServices() hook cannot be used outside the ServicesContext",
    );
  }

  return context;
};

export default function ServicesProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ServicesContext.Provider
      value={{
        recordsService,
        expenseService,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
}
