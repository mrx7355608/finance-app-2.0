export type IRecordInput = {
  images: string[];
  name: string;
  bought_price: number;
  sold_price?: number | null | undefined;
};

export interface IRecordModel extends IRecordInput {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface IExpenseInput {
  name: string;
  amount: number;
  recordId: number;
}

export interface IExpense extends IExpenseInput {
  id: number;
  createdAt: string;
}
